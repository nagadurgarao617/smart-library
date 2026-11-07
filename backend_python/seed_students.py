"""
Seed sample student and staff data into PostgreSQL SmartLibrary database.
Run from: backend_python/ directory → python seed_students.py
"""
import sys
import os

# Allow running from backend_python/ folder
sys.path.insert(0, os.path.dirname(__file__))

try:
    from database import SessionLocal, engine, Base
    from models import Student, Staff
    from auth import hash_password
except ImportError:
    from backend_python.database import SessionLocal, engine, Base
    from backend_python.models import Student, Staff
    from backend_python.auth import hash_password

def seed():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        from sqlalchemy import text
        # Sync sequences with existing rows to avoid duplicate key errors
        try:
            db.execute(text("SELECT setval(pg_get_serial_sequence('staff', 'id'), COALESCE(max(id), 1)) FROM staff;"))
            db.execute(text("SELECT setval(pg_get_serial_sequence('books', 'id'), COALESCE(max(id), 1)) FROM books;"))
            db.commit()
        except Exception as seq_err:
            db.rollback()
            print("Note on sequences:", seq_err)

        # ─── SAMPLE STUDENTS ───────────────────────────────────────────────
        students_data = [
            {
                "name": "Naga Durga Rao",
                "roll_number": "22B91A6128",
                "department": "CSE",
                "email": "nagadurga@svec.edu.in",
                "password": "student123"
            },
            {
                "name": "Ravi Kumar",
                "roll_number": "22B91A0501",
                "department": "ECE",
                "email": "ravikumar@svec.edu.in",
                "password": "student123"
            },
            {
                "name": "Priya Sharma",
                "roll_number": "22B91A1201",
                "department": "Civil",
                "email": "priyasharma@svec.edu.in",
                "password": "student123"
            },
            {
                "name": "Sai Teja",
                "roll_number": "22B91A0310",
                "department": "EEE",
                "email": "saiteja@svec.edu.in",
                "password": "student123"
            },
            {
                "name": "Anjali Reddy",
                "roll_number": "22B91A1502",
                "department": "Mech",
                "email": "anjali@svec.edu.in",
                "password": "student123"
            },
        ]

        inserted_students = 0
        skipped_students = 0
        for data in students_data:
            existing = db.query(Student).filter(
                Student.roll_number == data["roll_number"]
            ).first()
            if existing:
                print(f"  [SKIP] Student '{data['roll_number']}' already exists.")
                skipped_students += 1
                continue

            student = Student(
                name=data["name"],
                roll_number=data["roll_number"],
                department=data["department"],
                email=data["email"],
                password_hash=hash_password(data["password"])
            )
            db.add(student)
            inserted_students += 1
            print(f"  [ADD]  Student: {data['name']} ({data['roll_number']}) - {data['department']}")

        # ─── SAMPLE STAFF / ADMIN ──────────────────────────────────────────
        staff_data = [
            {
                "username": "admin",
                "password": "admin123",
                "name": "Library Administrator",
                "role": "Admin"
            },
            {
                "username": "staff",
                "password": "staff123",
                "name": "Library Staff",
                "role": "Librarian"
            },
            {
                "username": "librarian",
                "password": "lib123",
                "name": "Head Librarian",
                "role": "Head Librarian"
            },
        ]

        inserted_staff = 0
        skipped_staff = 0
        for data in staff_data:
            existing = db.query(Staff).filter(Staff.username == data["username"]).first()
            if existing:
                print(f"  [SKIP] Staff '{data['username']}' already exists.")
                skipped_staff += 1
                continue
            staff = Staff(
                username=data["username"],
                name=data["name"],
                role=data["role"],
                password_hash=hash_password(data["password"])
            )
            db.add(staff)
            inserted_staff += 1
            print(f"  [ADD]  Staff: {data['name']} (username: {data['username']}) - {data['role']}")

        db.commit()
        print(f"\nSeeding complete!")
        print(f"   Students: {inserted_students} added, {skipped_students} skipped")
        print(f"   Staff:    {inserted_staff} added, {skipped_staff} skipped")
        print(f"\nSample Login Credentials:")
        print(f"   Student Roll: 22B91A6128  Password: student123")
        print(f"   Student Roll: 22B91A0501  Password: student123")
        print(f"   Staff  Login: admin        Password: admin123")
        print(f"   Staff  Login: staff        Password: staff123")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Seeding failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Seeding SVEC Smart Library database...\n")
    seed()
