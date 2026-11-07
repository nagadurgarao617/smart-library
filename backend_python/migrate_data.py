import sqlite3
from pathlib import Path
from backend_python.database import engine, SessionLocal, Base
from backend_python.models import Floor, Rack, Book, Staff

def migrate():
    sqlite_path = Path(__file__).resolve().parent / "data" / "smart_library.db"
    if not sqlite_path.exists():
        sqlite_path = Path(__file__).resolve().parent.parent / "backend" / "database" / "smart_library.db"
    if not sqlite_path.exists():
        print(f"Error: SQLite source file {sqlite_path} not found.")
        return

    print("Connecting to SQLite source database...")
    sq_conn = sqlite3.connect(str(sqlite_path))
    sq_conn.row_factory = sqlite3.Row
    sq_cur = sq_conn.cursor()

    print("Creating PostgreSQL tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    pg_db = SessionLocal()

    try:
        # 1. Migrate Floors
        print("Migrating floors...")
        sq_cur.execute("SELECT id, name, description FROM floors")
        floors = sq_cur.fetchall()
        for f in floors:
            existing = pg_db.query(Floor).filter(Floor.id == f["id"]).first()
            if not existing:
                pg_db.add(Floor(id=f["id"], name=f["name"], description=f["description"]))
        pg_db.commit()
        floor_count = pg_db.query(Floor).count()
        print(f" -> Floors migrated: {floor_count}")

        # 2. Migrate Racks
        print("Migrating racks...")
        sq_cur.execute("SELECT id, floor, rack_number, rack_name, category, subject FROM racks")
        racks = sq_cur.fetchall()
        for r in racks:
            existing = pg_db.query(Rack).filter(Rack.id == r["id"]).first()
            if not existing:
                pg_db.add(Rack(
                    id=r["id"],
                    floor=r["floor"],
                    rack_number=r["rack_number"],
                    rack_name=r["rack_name"],
                    category=r["category"],
                    subject=r["subject"]
                ))
        pg_db.commit()
        rack_count = pg_db.query(Rack).count()
        print(f" -> Racks migrated: {rack_count}")

        # 3. Migrate Books
        print("Migrating books (this may take a few seconds)...")
        sq_cur.execute("""
            SELECT id, book_id, title, author, subject, department, floor,
                   rack_number, rack_name, shelf_number, position, availability_status, is_sample
            FROM books
        """)
        books = sq_cur.fetchall()
        for b in books:
            existing = pg_db.query(Book).filter(Book.id == b["id"]).first()
            if not existing:
                pg_db.add(Book(
                    id=b["id"],
                    book_id=b["book_id"],
                    title=b["title"],
                    author=b["author"],
                    subject=b["subject"],
                    department=b["department"],
                    floor=b["floor"],
                    rack_number=b["rack_number"],
                    rack_name=b["rack_name"],
                    shelf_number=b["shelf_number"],
                    position=b["position"],
                    availability_status=b["availability_status"] or "Available",
                    is_sample=b["is_sample"] or 0
                ))
        pg_db.commit()
        book_count = pg_db.query(Book).count()
        print(f" -> Books migrated: {book_count}")

        # 4. Migrate Staff
        print("Migrating staff accounts...")
        sq_cur.execute("SELECT id, username, password_hash, name, role FROM staff")
        staff_list = sq_cur.fetchall()
        for s in staff_list:
            existing = pg_db.query(Staff).filter(Staff.username == s["username"]).first()
            if not existing:
                pg_db.add(Staff(
                    id=s["id"],
                    username=s["username"],
                    password_hash=s["password_hash"],
                    name=s["name"],
                    role=s["role"]
                ))
        pg_db.commit()
        staff_count = pg_db.query(Staff).count()
        print(f" -> Staff accounts migrated: {staff_count}")

        print("====================================================")
        print("MIGRATION COMPLETE TO POSTGRESQL (SmartLibrary)!")
        print(f"Summary: {floor_count} Floors, {rack_count} Racks, {book_count} Books, {staff_count} Staff")
        print("====================================================")

    except Exception as e:
        pg_db.rollback()
        print("Migration failed with error:", e)
        raise e
    finally:
        sq_conn.close()
        pg_db.close()

if __name__ == "__main__":
    migrate()

