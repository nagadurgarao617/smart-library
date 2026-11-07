from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

try:
    from ..database import get_db
    from ..models import Student, Staff, BorrowingTransaction, Book
    from ..schemas import StudentUser, StaffStudentUpdate
    from ..auth import get_current_staff
except ImportError:
    from database import get_db
    from models import Student, Staff, BorrowingTransaction, Book
    from schemas import StudentUser, StaffStudentUpdate
    from auth import get_current_staff

router = APIRouter(prefix="/api/staff/students", tags=["Staff Student Management"])

@router.get("/")
def list_students(
    search: Optional[str] = None,
    department: Optional[str] = None,
    limit: int = 200,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    query = db.query(Student)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Student.name.ilike(term),
                Student.roll_number.ilike(term),
                Student.email.ilike(term),
                Student.phone.ilike(term)
            )
        )

    if department and department != "All":
        query = query.filter(Student.department == department)

    students = query.order_by(Student.roll_number.asc()).limit(limit).all()

    results = []
    for s in students:
        # Count active borrowed books
        active_count = db.query(BorrowingTransaction).filter(
            BorrowingTransaction.student_id == s.id,
            BorrowingTransaction.status.in_(["BORROWED", "RETURN_REQUESTED", "OVERDUE"])
        ).count()
        total_history = db.query(BorrowingTransaction).filter(
            BorrowingTransaction.student_id == s.id
        ).count()

        results.append({
            "id": s.id,
            "name": s.name,
            "roll_number": s.roll_number,
            "department": s.department,
            "year": s.year,
            "email": s.email,
            "phone": s.phone,
            "is_active": s.is_active,
            "created_at": s.created_at,
            "active_borrowed_count": active_count,
            "total_borrowed_count": total_history
        })

    return {"count": len(results), "students": results}

@router.get("/{student_id}")
def get_student_details(
    student_id: int,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    # Get loans
    loans = (
        db.query(BorrowingTransaction)
        .filter(BorrowingTransaction.student_id == student_id)
        .order_by(desc(BorrowingTransaction.borrow_date))
        .all()
    )

    formatted_loans = []
    for t in loans:
        formatted_loans.append({
            "id": t.id,
            "book_title": t.book.title if t.book else "Unknown",
            "book_author": t.book.author if t.book else "",
            "borrow_date": t.borrow_date,
            "due_date": t.due_date,
            "return_date": t.return_date,
            "status": t.status
        })

    return {
        "id": student.id,
        "name": student.name,
        "roll_number": student.roll_number,
        "department": student.department,
        "year": student.year,
        "email": student.email,
        "phone": student.phone,
        "is_active": student.is_active,
        "created_at": student.created_at,
        "loans": formatted_loans
    }

@router.patch("/{student_id}/status")
def toggle_student_status(
    student_id: int,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    student.is_active = not student.is_active
    db.commit()
    db.refresh(student)

    status_str = "activated" if student.is_active else "deactivated"
    return {
        "message": f"Student account {student.roll_number} has been {status_str}.",
        "is_active": student.is_active
    }

@router.put("/{student_id}")
def update_student(
    student_id: int,
    update_data: StaffStudentUpdate,
    current_staff: Staff = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    data = update_data.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(student, k, v)

    db.commit()
    db.refresh(student)
    return {"message": "Student details updated successfully."}
