from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

try:
    from ..database import get_db
    from ..models import Book, Rack, Staff, Student, BorrowingTransaction
    from ..schemas import (
        BookOut,
        BookCreate,
        BookUpdate,
        BookAvailabilityUpdate,
        BookLocationUpdate,
        BookSearchResponse,
        BookStatsResponse,
        RacksListResponse,
        RackOut
    )
    from ..auth import get_current_staff
except ImportError:
    from database import get_db
    from models import Book, Rack, Staff, Student, BorrowingTransaction
    from schemas import (
        BookOut,
        BookCreate,
        BookUpdate,
        BookAvailabilityUpdate,
        BookLocationUpdate,
        BookSearchResponse,
        BookStatsResponse,
        RacksListResponse,
        RackOut
    )
    from auth import get_current_staff

router = APIRouter(prefix="/api/books", tags=["Books & Catalog"])

@router.get("/search", response_model=BookSearchResponse)
def search_books(
    q: Optional[str] = None,
    title: Optional[str] = None,
    author: Optional[str] = None,
    subject: Optional[str] = None,
    department: Optional[str] = None,
    category: Optional[str] = None,
    floor: Optional[str] = None,
    rack_number: Optional[str] = None,
    availability: Optional[str] = None,
    limit: int = 500,
    db: Session = Depends(get_db)
):
    query = db.query(Book)

    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Book.title.ilike(term),
                Book.author.ilike(term),
                Book.subject.ilike(term),
                Book.department.ilike(term),
                Book.category.ilike(term),
                Book.rack_number.ilike(term),
                Book.rack_name.ilike(term)
            )
        )

    if title and title.strip():
        query = query.filter(Book.title.ilike(f"%{title.strip()}%"))

    if author and author.strip():
        query = query.filter(Book.author.ilike(f"%{author.strip()}%"))

    if subject and subject.strip():
        term = f"%{subject.strip()}%"
        query = query.filter(or_(Book.subject.ilike(term), Book.rack_name.ilike(term)))

    if department and department.strip() and department != "All":
        query = query.filter(Book.department.ilike(f"%{department.strip()}%"))

    if category and category.strip() and category != "All":
        query = query.filter(
            or_(
                Book.category.ilike(f"%{category.strip()}%"),
                Book.rack_name.ilike(f"%{category.strip()}%")
            )
        )

    if floor and floor.strip() and floor != "All":
        query = query.filter(Book.floor == floor.strip())

    if rack_number and rack_number.strip() and rack_number != "All":
        query = query.filter(Book.rack_number == rack_number.strip())

    if availability and availability.strip() and availability != "All":
        if availability.lower() == "available":
            query = query.filter(
                or_(
                    Book.availability_status == "Available",
                    Book.availability_status == "Limited Copies Available",
                    Book.available_copies > 0
                )
            )
        else:
            query = query.filter(
                or_(
                    Book.availability_status == "Not Available",
                    Book.available_copies == 0
                )
            )

    books = query.order_by(Book.floor.asc(), Book.rack_number.asc(), Book.title.asc()).limit(limit).all()
    return BookSearchResponse(count=len(books), books=books)

@router.get("/stats", response_model=BookStatsResponse)
def get_stats(db: Session = Depends(get_db)):
    total_books = db.query(Book).count()
    available_books = db.query(Book).filter(
        or_(
            Book.availability_status == "Available",
            Book.availability_status == "Limited Copies Available",
            Book.available_copies > 0
        )
    ).count()
    unavailable_books = db.query(Book).filter(
        and_(
            Book.availability_status == "Not Available",
            or_(Book.available_copies == 0, Book.available_copies == None)
        )
    ).count()
    total_racks = db.query(Rack).count()
    gf_books = db.query(Book).filter(Book.floor == "Ground Floor").count()
    ff_books = db.query(Book).filter(Book.floor == "First Floor").count()

    # Dynamic metrics from Transactions & Students
    total_students = db.query(Student).count()
    active_loans = db.query(BorrowingTransaction).filter(
        BorrowingTransaction.status.in_(["BORROWED", "RETURN_REQUESTED", "OVERDUE"])
    ).count()
    pending_returns = db.query(BorrowingTransaction).filter(
        BorrowingTransaction.status == "RETURN_REQUESTED"
    ).count()

    now = datetime.utcnow()
    overdue_loans = db.query(BorrowingTransaction).filter(
        BorrowingTransaction.status.in_(["BORROWED", "RETURN_REQUESTED"]),
        BorrowingTransaction.due_date < now
    ).count()

    total_borrowed = db.query(func.coalesce(func.sum(Book.borrowed_copies), 0)).scalar() or active_loans

    return BookStatsResponse(
        totalBooks=total_books,
        availableBooks=available_books,
        unavailableBooks=unavailable_books,
        totalRacks=total_racks,
        groundFloorBooks=gf_books,
        firstFloorBooks=ff_books,
        totalBorrowed=int(total_borrowed),
        totalStudents=total_students,
        activeLoans=active_loans,
        pendingReturns=pending_returns,
        overdueLoans=overdue_loans
    )

@router.get("/racks", response_model=RacksListResponse)
def get_racks(db: Session = Depends(get_db)):
    results = (
        db.query(
            Rack,
            func.count(Book.id).label("book_count")
        )
        .outerjoin(
            Book,
            (Rack.floor == Book.floor) & (Rack.rack_number == Book.rack_number)
        )
        .group_by(Rack.id)
        .order_by(Rack.floor.asc(), Rack.id.asc())
        .all()
    )

    racks_out = []
    for rack, count in results:
        racks_out.append(
            RackOut(
                id=rack.id,
                floor=rack.floor,
                rack_number=rack.rack_number,
                rack_name=rack.rack_name,
                category=rack.category,
                subject=rack.subject,
                book_count=count
            )
        )

    return RacksListResponse(racks=racks_out)

@router.get("/", response_model=BookSearchResponse)
def get_all_books(
    department: Optional[str] = None,
    floor: Optional[str] = None,
    availability: Optional[str] = None,
    limit: int = 500,
    db: Session = Depends(get_db)
):
    query = db.query(Book)
    if department and department != "All":
        query = query.filter(Book.department == department)
    if floor and floor != "All":
        query = query.filter(Book.floor == floor)
    if availability and availability != "All":
        query = query.filter(Book.availability_status == availability)

    books = query.order_by(Book.id.asc()).limit(limit).all()
    return BookSearchResponse(count=len(books), books=books)

@router.get("/{book_id}", response_model=BookOut)
def get_book_by_id(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    return book

@router.post("/", response_model=BookOut, status_code=status.HTTP_201_CREATED)
def create_book(
    book_in: BookCreate,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    # Auto-generate book_id if not supplied
    if not book_in.book_id:
        count = db.query(Book).count() + 1
        prefix = "SVEC-1F" if "First" in book_in.floor else "SVEC-GF"
        book_in.book_id = f"{prefix}-{count:04d}"

    data = book_in.model_dump()
    # Default copies if not set
    if data.get("total_copies") is None:
        data["total_copies"] = 2
    if data.get("available_copies") is None:
        data["available_copies"] = data["total_copies"]
    if data.get("borrowed_copies") is None:
        data["borrowed_copies"] = 0

    book = Book(**data)
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@router.put("/{book_id}", response_model=BookOut)
def update_book(
    book_id: int,
    book_in: BookUpdate,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")

    update_data = book_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(book, field, value)

    # Automatically synchronize availability_status based on available_copies
    if "available_copies" in update_data:
        avail = book.available_copies or 0
        if avail == 0:
            book.availability_status = "Not Available"
        elif avail == 1:
            book.availability_status = "Limited Copies Available"
        else:
            book.availability_status = "Available"

    db.commit()
    db.refresh(book)
    return book

@router.patch("/{book_id}/availability", response_model=BookOut)
def update_availability(
    book_id: int,
    avail_in: BookAvailabilityUpdate,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")

    book.availability_status = avail_in.availability_status
    if avail_in.availability_status == "Not Available":
        book.available_copies = 0
    elif avail_in.availability_status == "Available" and (book.available_copies or 0) == 0:
        book.available_copies = book.total_copies or 1

    db.commit()
    db.refresh(book)
    return book

@router.patch("/{book_id}/location", response_model=BookOut)
def update_location(
    book_id: int,
    loc_in: BookLocationUpdate,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")

    book.floor = loc_in.floor
    book.rack_number = loc_in.rack_number
    book.rack_name = loc_in.rack_name
    if loc_in.shelf_number is not None:
        book.shelf_number = loc_in.shelf_number
    if loc_in.position is not None:
        book.position = loc_in.position

    db.commit()
    db.refresh(book)
    return book

@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")

    # Requirement 10: Do not allow staff to remove a book that currently has active borrowing transactions without proper validation
    active_tx = db.query(BorrowingTransaction).filter(
        BorrowingTransaction.book_id == book_id,
        BorrowingTransaction.status.in_(["BORROWED", "RETURN_REQUESTED", "OVERDUE"])
    ).count()

    if active_tx > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot remove '{book.title}'. There are currently {active_tx} active borrowing transaction(s) for this book. Please ensure all borrowed copies are returned before removal."
        )

    db.delete(book)
    db.commit()
    return {"message": f"Book '{book.title}' removed successfully", "id": book_id}
