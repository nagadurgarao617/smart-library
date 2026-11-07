from datetime import datetime, timedelta
import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

try:
    from ..database import get_db
    from ..models import Staff, Student
    from ..schemas import (
        LoginRequest, LoginResponse, ProfileResponse, StaffUser,
        StudentRegisterRequest, StudentLoginRequest, StudentAuthResponse,
        StudentProfileResponse, StudentUser, StudentProfileUpdateRequest,
        StudentChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest
    )
    from ..auth import (
        verify_password, hash_password, create_access_token,
        get_current_staff, get_current_student
    )
except ImportError:
    from database import get_db
    from models import Staff, Student
    from schemas import (
        LoginRequest, LoginResponse, ProfileResponse, StaffUser,
        StudentRegisterRequest, StudentLoginRequest, StudentAuthResponse,
        StudentProfileResponse, StudentUser, StudentProfileUpdateRequest,
        StudentChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest
    )
    from auth import (
        verify_password, hash_password, create_access_token,
        get_current_staff, get_current_student
    )

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# ---------------- STAFF AUTHENTICATION ----------------
@router.post("/login", response_model=LoginResponse)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    username = creds.username.strip()
    password = creds.password

    staff = db.query(Staff).filter(Staff.username == username).first()
    if not staff or not verify_password(password, staff.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid staff username or password."
        )

    staff_user = StaffUser.model_validate(staff)
    token = create_access_token({
        "id": staff.id,
        "username": staff.username,
        "name": staff.name,
        "role": staff.role
    })

    return LoginResponse(
        message="Authentication successful",
        token=token,
        staff=staff_user
    )

@router.get("/me", response_model=ProfileResponse)
def get_profile(current_staff: Staff = Depends(get_current_staff)):
    return ProfileResponse(staff=StaffUser.model_validate(current_staff))

# ---------------- STUDENT AUTHENTICATION ----------------
@router.post("/student/register", response_model=StudentAuthResponse, status_code=status.HTTP_201_CREATED)
def register_student(req: StudentRegisterRequest, db: Session = Depends(get_db)):
    roll = req.roll_number.strip().upper()
    name = req.name.strip()
    dept = req.department.strip()
    pwd = req.password.strip()

    if not roll or not name or not pwd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name, Roll Number, and Password are required."
        )

    # Check if roll number already exists
    existing_roll = db.query(Student).filter(Student.roll_number == roll).first()
    if existing_roll:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Student with Roll Number '{roll}' is already registered."
        )

    # Check email if provided
    email = req.email.strip().lower() if req.email and req.email.strip() else None
    if email:
        existing_email = db.query(Student).filter(Student.email == email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Student with email '{email}' is already registered."
            )

    pwd_hash = hash_password(pwd)
    new_student = Student(
        name=name,
        roll_number=roll,
        department=dept,
        email=email,
        phone=req.phone.strip() if req.phone else None,
        year=req.year.strip() if req.year else "3rd Year",
        password_hash=pwd_hash,
        is_active=True
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    student_user = StudentUser.model_validate(new_student)
    token = create_access_token({
        "student_id": new_student.id,
        "roll_number": new_student.roll_number,
        "name": new_student.name,
        "department": new_student.department,
        "role": "Student"
    })

    return StudentAuthResponse(
        message="Student account created successfully!",
        token=token,
        student=student_user
    )

@router.post("/student/login", response_model=StudentAuthResponse)
def login_student(creds: StudentLoginRequest, db: Session = Depends(get_db)):
    roll = creds.roll_number.strip().upper()
    pwd = creds.password

    student = db.query(Student).filter(
        (Student.roll_number == roll) | (Student.email == roll.lower())
    ).first()

    if not student or not verify_password(pwd, student.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Roll Number / Email or password."
        )

    if not student.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your student account has been deactivated by library administration."
        )

    student_user = StudentUser.model_validate(student)
    token = create_access_token({
        "student_id": student.id,
        "roll_number": student.roll_number,
        "name": student.name,
        "department": student.department,
        "role": "Student"
    })

    return StudentAuthResponse(
        message="Login successful",
        token=token,
        student=student_user
    )

@router.get("/student/me", response_model=StudentProfileResponse)
def get_student_profile(current_student: Student = Depends(get_current_student)):
    return StudentProfileResponse(student=StudentUser.model_validate(current_student))

@router.put("/student/profile", response_model=StudentProfileResponse)
def update_student_profile(
    req: StudentProfileUpdateRequest,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    if req.name is not None and req.name.strip():
        current_student.name = req.name.strip()
    if req.email is not None:
        email = req.email.strip().lower() if req.email.strip() else None
        if email:
            existing = db.query(Student).filter(Student.email == email, Student.id != current_student.id).first()
            if existing:
                raise HTTPException(status_code=400, detail="This email is already registered to another student.")
        current_student.email = email
    if req.phone is not None:
        current_student.phone = req.phone.strip()
    if req.year is not None:
        current_student.year = req.year.strip()

    db.commit()
    db.refresh(current_student)
    return StudentProfileResponse(student=StudentUser.model_validate(current_student))

@router.post("/student/change-password")
def change_password(
    req: StudentChangePasswordRequest,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    if not verify_password(req.old_password, current_student.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")

    current_student.password_hash = hash_password(req.new_password)
    db.commit()
    return {"message": "Password changed successfully."}

@router.post("/student/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    term = req.roll_number_or_email.strip().upper()
    student = db.query(Student).filter(
        (Student.roll_number == term) | (Student.email == term.lower())
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="No registered student found with this Roll Number or Email.")

    # Generate a secure 6-character reset token
    token = secrets.token_hex(3).upper()  # e.g. "A3F8B2"
    student.reset_token = token
    student.reset_token_expiry = datetime.utcnow() + timedelta(minutes=30)
    db.commit()

    return {
        "message": f"Password reset code generated. Use code: {token} to reset your password.",
        "reset_token": token,
        "roll_number": student.roll_number
    }

@router.post("/student/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    roll = req.roll_number.strip().upper()
    token = req.reset_token.strip().upper()
    new_pwd = req.new_password.strip()

    student = db.query(Student).filter(Student.roll_number == roll).first()
    if not student or student.reset_token != token:
        raise HTTPException(status_code=400, detail="Invalid reset code or Roll Number.")

    if student.reset_token_expiry and datetime.utcnow() > student.reset_token_expiry:
        raise HTTPException(status_code=400, detail="Reset code has expired. Please request a new one.")

    if len(new_pwd) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    student.password_hash = hash_password(new_pwd)
    student.reset_token = None
    student.reset_token_expiry = None
    db.commit()

    return {"message": "Password reset successfully! You can now login with your new password."}
