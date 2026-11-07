import psycopg2

conn = psycopg2.connect('postgresql://postgres:postgres@localhost:5432/SmartLibrary')
cur = conn.cursor()

cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='books';")
print('BOOKS columns:', cur.fetchall())

cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='students';")
print('STUDENTS columns:', cur.fetchall())

cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='staff';")
print('STAFF columns:', cur.fetchall())

cur.execute("SELECT count(*) FROM books;")
print('Books count:', cur.fetchone()[0])

cur.execute("SELECT count(*) FROM students;")
print('Students count:', cur.fetchone()[0])

cur.execute("SELECT count(*) FROM staff;")
print('Staff count:', cur.fetchone()[0])

conn.close()

