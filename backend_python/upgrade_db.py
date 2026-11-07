"""
Database upgrade script for SVEC Smart Library Portal.
Adds columns, creates transactions & notifications tables, and seeds sample student data.
"""
from datetime import datetime, timedelta
import psycopg2
import bcrypt

def hash_pw(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def run_upgrade():
    conn = psycopg2.connect('postgresql://postgres:postgres@localhost:5432/SmartLibrary')
    cur = conn.cursor()

    print("Step 1: Upgrading 'books' table columns...")
    cur.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='total_copies') THEN
                ALTER TABLE books ADD COLUMN total_copies INTEGER DEFAULT 1;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='available_copies') THEN
                ALTER TABLE books ADD COLUMN available_copies INTEGER DEFAULT 1;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='borrowed_copies') THEN
                ALTER TABLE books ADD COLUMN borrowed_copies INTEGER DEFAULT 0;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='isbn') THEN
                ALTER TABLE books ADD COLUMN isbn VARCHAR(100);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='image_url') THEN
                ALTER TABLE books ADD COLUMN image_url VARCHAR(500);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='category') THEN
                ALTER TABLE books ADD COLUMN category VARCHAR(100);
            END IF;
        END $$;
    """)

    # Populate category from rack_name/subject if empty, and set copies
    cur.execute("""
        UPDATE books 
        SET total_copies = COALESCE(total_copies, 2),
            available_copies = CASE 
                WHEN availability_status = 'Available' THEN COALESCE(available_copies, 2)
                ELSE 0 
            END,
            borrowed_copies = CASE 
                WHEN availability_status != 'Available' THEN 1
                ELSE 0 
            END,
            category = COALESCE(category, rack_name)
        WHERE category IS NULL OR total_copies IS NULL;
    """)
    conn.commit()
    print("✓ Books table upgraded successfully.")

    print("Step 2: Upgrading 'students' table columns...")
    cur.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='phone') THEN
                ALTER TABLE students ADD COLUMN phone VARCHAR(50);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='year') THEN
                ALTER TABLE students ADD COLUMN year VARCHAR(50) DEFAULT '3rd Year';
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='is_active') THEN
                ALTER TABLE students ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='reset_token') THEN
                ALTER TABLE students ADD COLUMN reset_token VARCHAR(100);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='reset_token_expiry') THEN
                ALTER TABLE students ADD COLUMN reset_token_expiry TIMESTAMP WITHOUT TIME ZONE;
            END IF;
        END $$;
    """)
    conn.commit()
    print("✓ Students table upgraded successfully.")

    print("Step 3: Creating 'borrowing_transactions' table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS borrowing_transactions (
            id SERIAL PRIMARY KEY,
            student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
            book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
            borrow_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            due_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            return_request_date TIMESTAMP WITHOUT TIME ZONE,
            return_date TIMESTAMP WITHOUT TIME ZONE,
            status VARCHAR(50) DEFAULT 'BORROWED',
            collected_confirmed BOOLEAN DEFAULT TRUE,
            staff_notes TEXT,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_trans_student ON borrowing_transactions(student_id);
        CREATE INDEX IF NOT EXISTS idx_trans_book ON borrowing_transactions(book_id);
        CREATE INDEX IF NOT EXISTS idx_trans_status ON borrowing_transactions(status);
    """)
    conn.commit()
    print("✓ Borrowing transactions table created successfully.")

    print("Step 4: Creating 'notifications' table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) DEFAULT 'INFO',
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_notif_student ON notifications(student_id);
    """)
    conn.commit()
    print("✓ Notifications table created successfully.")

    print("Step 5: Seeding sample students...")
    students = [
        {
            "name": "Naga Durga Rao",
            "roll_number": "22B91A6128",
            "department": "CSE",
            "email": "nagadurga@svec.edu.in",
            "phone": "+91 98765 43210",
            "year": "3rd Year B.Tech",
            "password": "student123"
        },
        {
            "name": "Ravi Kumar",
            "roll_number": "22B91A0501",
            "department": "ECE",
            "email": "ravikumar@svec.edu.in",
            "phone": "+91 98480 12345",
            "year": "3rd Year B.Tech",
            "password": "student123"
        },
        {
            "name": "Priya Sharma",
            "roll_number": "22B91A1201",
            "department": "Civil",
            "email": "priyasharma@svec.edu.in",
            "phone": "+91 91234 56789",
            "year": "2nd Year B.Tech",
            "password": "student123"
        },
        {
            "name": "Sai Teja",
            "roll_number": "22B91A0310",
            "department": "EEE",
            "email": "saiteja@svec.edu.in",
            "phone": "+91 99887 76655",
            "year": "4th Year B.Tech",
            "password": "student123"
        },
        {
            "name": "Anjali Reddy",
            "roll_number": "22B91A1502",
            "department": "Mech",
            "email": "anjali@svec.edu.in",
            "phone": "+91 95544 33221",
            "year": "1st Year B.Tech",
            "password": "student123"
        }
    ]

    for s in students:
        pw_hash = hash_pw(s["password"])
        cur.execute("""
            INSERT INTO students (name, roll_number, department, email, phone, year, password_hash, is_active, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, TRUE, CURRENT_TIMESTAMP)
            ON CONFLICT (roll_number) DO UPDATE
            SET name = EXCLUDED.name,
                department = EXCLUDED.department,
                email = EXCLUDED.email,
                phone = EXCLUDED.phone,
                year = EXCLUDED.year,
                password_hash = EXCLUDED.password_hash;
        """, (s["name"], s["roll_number"], s["department"], s["email"], s["phone"], s["year"], pw_hash))

    conn.commit()
    print(f"✓ Seeded {len(students)} students.")

    # Ensure admin & staff exist
    cur.execute("""
        INSERT INTO staff (username, name, role, password_hash, created_at)
        VALUES ('admin', 'System Administrator', 'Admin', %s, CURRENT_TIMESTAMP)
        ON CONFLICT (username) DO NOTHING;
    """, (hash_pw('admin123'),))
    cur.execute("""
        INSERT INTO staff (username, name, role, password_hash, created_at)
        VALUES ('staff', 'Librarian Staff', 'Librarian', %s, CURRENT_TIMESTAMP)
        ON CONFLICT (username) DO NOTHING;
    """, (hash_pw('staff123'),))
    conn.commit()
    print("✓ Verified staff accounts (admin & staff).")

    # Seed sample transactions for student 22B91A6128
    cur.execute("SELECT id FROM students WHERE roll_number='22B91A6128';")
    student_id = cur.fetchone()[0]

    # Get a few sample books
    cur.execute("SELECT id, title FROM books ORDER BY id ASC LIMIT 5;")
    sample_books = cur.fetchall()

    if sample_books and len(sample_books) >= 3:
        b1_id, b1_title = sample_books[0]
        b2_id, b2_title = sample_books[1]
        b3_id, b3_title = sample_books[2]

        now = datetime.utcnow()
        
        # Check if transactions already exist
        cur.execute("SELECT count(*) FROM borrowing_transactions WHERE student_id=%s;", (student_id,))
        if cur.fetchone()[0] == 0:
            # 1. Currently Borrowed (due in 3 days)
            cur.execute("""
                INSERT INTO borrowing_transactions 
                (student_id, book_id, borrow_date, due_date, status, collected_confirmed, created_at)
                VALUES (%s, %s, %s, %s, 'BORROWED', TRUE, %s);
            """, (student_id, b1_id, now - timedelta(days=11), now + timedelta(days=3), now - timedelta(days=11)))

            # Update book count
            cur.execute("""
                UPDATE books SET available_copies = GREATEST(0, available_copies - 1), borrowed_copies = borrowed_copies + 1
                WHERE id = %s;
            """, (b1_id,))

            # Notification for due in 3 days
            cur.execute("""
                INSERT INTO notifications (student_id, title, message, type, is_read, created_at)
                VALUES (%s, 'Book Return Reminder', %s, 'DUE_SOON', FALSE, %s);
            """, (student_id, f"Reminder: Your borrowed book '{b1_title}' is due for return in 3 days.", now - timedelta(hours=2)))

            # 2. Return Requested (Pending Staff Confirmation)
            cur.execute("""
                INSERT INTO borrowing_transactions 
                (student_id, book_id, borrow_date, due_date, return_request_date, status, collected_confirmed, created_at)
                VALUES (%s, %s, %s, %s, %s, 'RETURN_REQUESTED', TRUE, %s);
            """, (student_id, b2_id, now - timedelta(days=10), now + timedelta(days=4), now - timedelta(hours=4), now - timedelta(days=10)))

            # 3. Already Returned in past
            cur.execute("""
                INSERT INTO borrowing_transactions 
                (student_id, book_id, borrow_date, due_date, return_request_date, return_date, status, collected_confirmed, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, 'RETURNED', TRUE, %s);
            """, (student_id, b3_id, now - timedelta(days=30), now - timedelta(days=16), now - timedelta(days=18), now - timedelta(days=18), now - timedelta(days=30)))

            # Welcome notification
            cur.execute("""
                INSERT INTO notifications (student_id, title, message, type, is_read, created_at)
                VALUES (%s, 'Welcome to Smart Library', 'Welcome to the SVEC Smart Library Portal! Search books and navigate to shelf locations.', 'INFO', TRUE, %s);
            """, (student_id, now - timedelta(days=30)))

            conn.commit()
            print("✓ Seeded sample transactions & notifications for 22B91A6128.")

    conn.close()
    print("\nAll database upgrades completed successfully!")

if __name__ == "__main__":
    run_upgrade()

