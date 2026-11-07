from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship

try:
    from .database import Base
except ImportError:
    from database import Base

class Floor(Base):
    __tablename__ = "floors"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

class Rack(Base):
    __tablename__ = "racks"

    id = Column(String(50), primary_key=True, index=True)
    floor = Column(String(50), nullable=False, index=True)
    rack_number = Column(String(50), nullable=False, index=True)
    rack_name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False)
    subject = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    book_id = Column(String(100), unique=True, index=True, nullable=True)
    title = Column(String(255), nullable=False, index=True)
    author = Column(String(255), nullable=False, index=True)
    subject = Column(String(150), nullable=False, index=True)
    department = Column(String(100), nullable=False, index=True)
    floor = Column(String(50), nullable=False, index=True)
    rack_number = Column(String(50), nullable=False, index=True)
    rack_name = Column(String(150), nullable=False)
    shelf_number = Column(Integer, default=1)
    position = Column(String(100), nullable=True)
    availability_status = Column(String(50), default="Available", index=True)
    is_sample = Column(Integer, default=0)

    # Enhanced copy & catalog fields
    total_copies = Column(Integer, default=1)
    available_copies = Column(Integer, default=1)
    borrowed_copies = Column(Integer, default=0)
    isbn = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    transactions = relationship("BorrowingTransaction", back_populates="book")

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(150), nullable=False)
    role = Column(String(50), default="Librarian")
    created_at = Column(DateTime, default=datetime.utcnow)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    roll_number = Column(String(50), unique=True, index=True, nullable=False)
    department = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=True)
    phone = Column(String(50), nullable=True)
    year = Column(String(50), default="3rd Year", nullable=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    reset_token = Column(String(100), nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    transactions = relationship("BorrowingTransaction", back_populates="student", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="student", cascade="all, delete-orphan")

class BorrowingTransaction(Base):
    __tablename__ = "borrowing_transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="RESTRICT"), nullable=False, index=True)
    borrow_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=False)
    return_request_date = Column(DateTime, nullable=True)
    return_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="BORROWED", index=True)  # 'BORROWED', 'RETURN_REQUESTED', 'RETURNED', 'OVERDUE'
    collected_confirmed = Column(Boolean, default=True)
    staff_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="transactions")
    book = relationship("Book", back_populates="transactions")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO")  # 'DUE_SOON', 'OVERDUE', 'RETURN_CONFIRMED', 'BORROW_CONFIRMED', 'INFO'
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="notifications")
