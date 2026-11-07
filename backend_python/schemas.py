from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# ----------------- BOOK SCHEMAS -----------------
class BookBase(BaseModel):
    book_id: Optional[str] = None
    title: str
    author: str
    subject: str
    department: str
    floor: str
    rack_number: str
    rack_name: str
    shelf_number: Optional[int] = 1
    position: Optional[str] = None
    availability_status: Optional[str] = "Available"
    is_sample: Optional[int] = 0
    total_copies: Optional[int] = 1
    available_copies: Optional[int] = 1
    borrowed_copies: Optional[int] = 0
    isbn: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    subject: Optional[str] = None
    department: Optional[str] = None
    floor: Optional[str] = None
    rack_number: Optional[str] = None
    rack_name: Optional[str] = None
    shelf_number: Optional[int] = None
    position: Optional[str] = None
    availability_status: Optional[str] = None
    is_sample: Optional[int] = None
    total_copies: Optional[int] = None
    available_copies: Optional[int] = None
    borrowed_copies: Optional[int] = None
    isbn: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

class BookAvailabilityUpdate(BaseModel):
    availability_status: str

class BookLocationUpdate(BaseModel):
    floor: str
    rack_number: str
    rack_name: str
    shelf_number: Optional[int] = 1
    position: Optional[str] = None

class BookOut(BookBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BookSearchResponse(BaseModel):
    count: int
    books: List[BookOut]

class BookStatsResponse(BaseModel):
    totalBooks: int
    availableBooks: int
    unavailableBooks: int
    totalRacks: int
    groundFloorBooks: int
    firstFloorBooks: int
    totalBorrowed: Optional[int] = 0
    totalStudents: Optional[int] = 0
    activeLoans: Optional[int] = 0
    pendingReturns: Optional[int] = 0
    overdueLoans: Optional[int] = 0

# ----------------- RACK SCHEMAS -----------------
class RackOut(BaseModel):
    id: str
    floor: str
    rack_number: str
    rack_name: str
    category: str
    subject: Optional[str] = None
    book_count: Optional[int] = 0

    class Config:
        from_attributes = True

class RacksListResponse(BaseModel):
    racks: List[RackOut]

# ----------------- AUTH SCHEMAS -----------------
class LoginRequest(BaseModel):
    username: str
    password: str

class StaffUser(BaseModel):
    id: int
    username: str
    name: str
    role: str

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    message: str
    token: str
    staff: StaffUser

class ProfileResponse(BaseModel):
    staff: StaffUser

# ----------------- STUDENT SCHEMAS -----------------
class StudentRegisterRequest(BaseModel):
    name: str
    roll_number: str
    department: str
    email: Optional[str] = None
    phone: Optional[str] = None
    year: Optional[str] = "3rd Year"
    password: str

class StudentLoginRequest(BaseModel):
    roll_number: str
    password: str

class StudentUser(BaseModel):
    id: int
    name: str
    roll_number: str
    department: str
    email: Optional[str] = None
    phone: Optional[str] = None
    year: Optional[str] = None
    is_active: Optional[bool] = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StudentAuthResponse(BaseModel):
    message: str
    token: str
    student: StudentUser

class StudentProfileResponse(BaseModel):
    student: StudentUser

class StudentProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    year: Optional[str] = None

class StudentChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    roll_number_or_email: str

class ResetPasswordRequest(BaseModel):
    roll_number: str
    reset_token: str
    new_password: str

# ----------------- BORROWING SCHEMAS -----------------
class BorrowRequest(BaseModel):
    book_id: int
    confirm_collection: Optional[bool] = True

class ReturnRequest(BaseModel):
    transaction_id: int
    confirm_return: Optional[bool] = True

class TransactionOut(BaseModel):
    id: int
    student_id: int
    book_id: int
    borrow_date: datetime
    due_date: datetime
    return_request_date: Optional[datetime] = None
    return_date: Optional[datetime] = None
    status: str
    collected_confirmed: bool
    staff_notes: Optional[str] = None
    created_at: Optional[datetime] = None
    
    # Nested info
    student_name: Optional[str] = None
    student_roll: Optional[str] = None
    student_dept: Optional[str] = None
    book_title: Optional[str] = None
    book_author: Optional[str] = None
    book_floor: Optional[str] = None
    book_rack: Optional[str] = None
    book_shelf: Optional[int] = None
    days_left: Optional[int] = None
    is_overdue: Optional[bool] = False

    class Config:
        from_attributes = True

class NotificationOut(BaseModel):
    id: int
    student_id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class StaffStudentUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None
