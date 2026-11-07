from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc

try:
    from ..database import get_db
    from ..models import Book, Student, Staff, BorrowingTransaction, Notification
    from ..schemas import (
        BorrowRequest, ReturnRequest, TransactionOut, NotificationOut
    )
    from ..auth import get_current_student, get_current_staff
except ImportError:
    from database import get_db
    from models import Book, Student, Staff, BorrowingTransaction, Notification
    from schemas import (
        BorrowRequest, ReturnRequest, TransactionOut, NotificationOut
    )
    from auth import get_current_student, get_current_staff

router = APIRouter(prefix="/api/borrowing", tags=["Borrowing & Returns"])

def format_transaction_out(t: BorrowingTransaction) -> dict:
    now = datetime.utcnow()
    days_left = (t.due_date - now).days if t.status in ["BORROWED", "RETURN_REQUESTED"] else 0
    is_overdue = (now > t.due_date) if t.status in ["BORROWED", "RETURN_REQUESTED"] else False

    return {
        "id": t.id,
        "student_id": t.student_id,
        "book_id": t.book_id,
        "borrow_date": t.borrow_date,
        "due_date": t.due_date,
        "return_request_date": t.return_request_date,
        "return_date": t.return_date,
        "status": "OVERDUE" if (is_overdue and t.status == "BORROWED") else t.status,
        "collected_confirmed": t.collected_confirmed,
        "staff_notes": t.staff_notes,
        "created_at": t.created_at,
        "student_name": t.student.name if t.student else None,
        "student_roll": t.student.roll_number if t.student else None,
        "student_dept": t.student.department if t.student else None,
        "book_title": t.book.title if t.book else None,
        "book_author": t.book.author if t.book else None,
        "book_floor": t.book.floor if t.book else None,
        "book_rack": t.book.rack_number if t.book else None,
        "book_shelf": t.book.shelf_number if t.book else None,
        "days_left": days_left,
        "is_overdue": is_overdue
    }

# ----------------- STUDENT BORROWING -----------------
@router.post("/collect")
def collect_book(
    req: BorrowRequest,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    if not req.confirm_collection:
        return {"message": "Borrowing cancelled. No book was collected.", "success": False}

    # 1. Check book exists
    book = db.query(Book).filter(Book.id == req.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")

    # 2. Check duplicate borrowing
    existing = db.query(BorrowingTransaction).filter(
        BorrowingTransaction.student_id == current_student.id,
        BorrowingTransaction.book_id == book.id,
        BorrowingTransaction.status.in_(["BORROWED", "RETURN_REQUESTED", "OVERDUE"])
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"You have already borrowed '{book.title}'. Please return your existing copy first."
        )

    # 3. Check book available copies
    available = book.available_copies if book.available_copies is not None else 1
    if available <= 0 or book.availability_status == "Not Available":
        raise HTTPException(
            status_code=400,
            detail=f"Sorry, '{book.title}' is currently not available or fully checked out."
        )

    # 4. Create borrowing transaction
    now = datetime.utcnow()
    due = now + timedelta(days=14)  # 14-day borrowing period
    tx = BorrowingTransaction(
        student_id=current_student.id,
        book_id=book.id,
        borrow_date=now,
        due_date=due,
        status="BORROWED",
        collected_confirmed=True
    )
    db.add(tx)

    # 5. Update book copies and status
    new_avail = max(0, available - 1)
    book.available_copies = new_avail
    book.borrowed_copies = (book.borrowed_copies or 0) + 1
    if new_avail == 0:
        book.availability_status = "Not Available"
    elif new_avail == 1:
        book.availability_status = "Limited Copies Available"
    else:
        book.availability_status = "Available"

    # 6. Add student notification
    notif = Notification(
        student_id=current_student.id,
        title="Book Issued Successfully",
        message=f"You borrowed '{book.title}'. Due return date is {due.strftime('%d %b %Y')} (14 days).",
        type="BORROW_CONFIRMED"
    )
    db.add(notif)

    db.commit()
    db.refresh(tx)

    return {
        "success": True,
        "message": f"Successfully recorded! '{book.title}' added to your Borrowed Books.",
        "transaction": format_transaction_out(tx)
    }

@router.post("/return-request")
def request_return(
    req: ReturnRequest,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    if not req.confirm_return:
        return {"message": "Return request cancelled.", "success": False}

    tx = db.query(BorrowingTransaction).filter(
        BorrowingTransaction.id == req.transaction_id,
        BorrowingTransaction.student_id == current_student.id
    ).first()

    if not tx:
        raise HTTPException(status_code=404, detail="Borrowing transaction not found.")

    if tx.status == "RETURNED":
        raise HTTPException(status_code=400, detail="This book has already been returned.")

    now = datetime.utcnow()
    tx.return_request_date = now
    tx.status = "RETURN_REQUESTED"

    # Add notification for student
    notif = Notification(
        student_id=current_student.id,
        title="Return Request Submitted",
        message=f"Return request for '{tx.book.title}' is submitted. Please deposit the physical copy at the Central Library counter for verification.",
        type="RETURN_REQUESTED"
    )
    db.add(notif)
    db.commit()

    return {
        "success": True,
        "message": "Return request submitted! Please deposit the physical book with library staff for final verification.",
        "transaction": format_transaction_out(tx)
    }

@router.get("/student/my-loans")
def get_my_loans(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    transactions = (
        db.query(BorrowingTransaction)
        .filter(BorrowingTransaction.student_id == current_student.id)
        .order_by(desc(BorrowingTransaction.borrow_date))
        .all()
    )

    now = datetime.utcnow()
    active_loans = []
    history = []

    for t in transactions:
        t_out = format_transaction_out(t)
        if t.status in ["BORROWED", "RETURN_REQUESTED", "OVERDUE"]:
            active_loans.append(t_out)
        else:
            history.append(t_out)

    return {
        "active_loans": active_loans,
        "history": history,
        "total_borrowed_count": len(active_loans),
        "total_history_count": len(history)
    }

# ----------------- STUDENT NOTIFICATIONS & REMINDERS -----------------
@router.get("/notifications")
def get_notifications(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    # Auto-generate dynamic due-date reminders if not generated today
    now = datetime.utcnow()
    active = db.query(BorrowingTransaction).filter(
        BorrowingTransaction.student_id == current_student.id,
        BorrowingTransaction.status.in_(["BORROWED", "RETURN_REQUESTED"])
    ).all()

    for tx in active:
        days_left = (tx.due_date - now).days
        if days_left < 0:
            # Overdue alert check
            existing_overdue = db.query(Notification).filter(
                Notification.student_id == current_student.id,
                Notification.type == "OVERDUE",
                Notification.message.like(f"%{tx.book.title}%")
            ).first()
            if not existing_overdue:
                notif = Notification(
                    student_id=current_student.id,
                    title="OVERDUE: Book Return Required",
                    message=f"Urgent: '{tx.book.title}' is overdue by {abs(days_left)} days (due was {tx.due_date.strftime('%d %b %Y')}). Please return it immediately to avoid library fine.",
                    type="OVERDUE"
                )
                db.add(notif)
        elif days_left <= 3:
            # Due soon reminder check
            existing_rem = db.query(Notification).filter(
                Notification.student_id == current_student.id,
                Notification.type == "DUE_SOON",
                Notification.message.like(f"%{tx.book.title}%")
            ).first()
            if not existing_rem:
                day_word = "today" if days_left == 0 else f"in {days_left} day(s)"
                notif = Notification(
                    student_id=current_student.id,
                    title="Reminder: Return Date Approaching",
                    message=f"Reminder: Your borrowed book '{tx.book.title}' is due for return {day_word} ({tx.due_date.strftime('%d %b %Y')}).",
                    type="DUE_SOON"
                )
                db.add(notif)

    db.commit()

    notifs = (
        db.query(Notification)
        .filter(Notification.student_id == current_student.id)
        .order_by(desc(Notification.created_at))
        .limit(50)
        .all()
    )

    unread_count = db.query(Notification).filter(
        Notification.student_id == current_student.id,
        Notification.is_read == False
    ).count()

    return {
        "notifications": [NotificationOut.model_validate(n) for n in notifs],
        "unread_count": unread_count
    }

@router.patch("/notifications/{notif_id}/read")
def mark_notification_read(
    notif_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    notif = db.query(Notification).filter(
        Notification.id == notif_id,
        Notification.student_id == current_student.id
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"message": "Notification marked read."}

@router.patch("/notifications/read-all")
def mark_all_notifications_read(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    db.query(Notification).filter(
        Notification.student_id == current_student.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read."}

# ----------------- STAFF BORROWING MANAGEMENT -----------------
@router.get("/staff/transactions")
def get_staff_transactions(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    limit: int = 200,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    query = db.query(BorrowingTransaction)

    if status_filter and status_filter.upper() != "ALL":
        filter_val = status_filter.upper()
        if filter_val == "OVERDUE":
            now = datetime.utcnow()
            query = query.filter(
                BorrowingTransaction.status.in_(["BORROWED", "RETURN_REQUESTED"]),
                BorrowingTransaction.due_date < now
            )
        else:
            query = query.filter(BorrowingTransaction.status == filter_val)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.join(Student).join(Book).filter(
            or_(
                Student.name.ilike(term),
                Student.roll_number.ilike(term),
                Book.title.ilike(term),
                Book.author.ilike(term)
            )
        )

    transactions = query.order_by(desc(BorrowingTransaction.borrow_date)).limit(limit).all()
    return {
        "count": len(transactions),
        "transactions": [format_transaction_out(t) for t in transactions]
    }

@router.post("/staff/confirm-return/{transaction_id}")
def staff_confirm_return(
    transaction_id: int,
    notes: Optional[str] = None,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    tx = db.query(BorrowingTransaction).filter(BorrowingTransaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    if tx.status == "RETURNED":
        raise HTTPException(status_code=400, detail="Transaction is already finalized as Returned.")

    now = datetime.utcnow()
    tx.status = "RETURNED"
    tx.return_date = now
    if notes:
        tx.staff_notes = notes

    # Synchronize book inventory
    book = tx.book
    if book:
        book.available_copies = (book.available_copies or 0) + 1
        book.borrowed_copies = max(0, (book.borrowed_copies or 1) - 1)
        if book.available_copies > 1:
            book.availability_status = "Available"
        elif book.available_copies == 1:
            book.availability_status = "Limited Copies Available"

    # Notify student
    notif = Notification(
        student_id=tx.student_id,
        title="Book Return Verified & Confirmed",
        message=f"Library staff confirmed the return of '{book.title if book else 'book'}'. Thank you for returning on time!",
        type="RETURN_CONFIRMED"
    )
    db.add(notif)

    db.commit()
    db.refresh(tx)

    return {
        "success": True,
        "message": f"Book return verified and inventory synchronized. Book '{book.title if book else ''}' is now marked available.",
        "transaction": format_transaction_out(tx)
    }
