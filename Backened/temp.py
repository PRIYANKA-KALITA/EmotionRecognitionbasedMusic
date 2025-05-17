import pg8000

try:
    conn = pg8000.connect(
        database="moodscape_db",
        user="postgres",
        password="password",
        host="localhost",
        port=5432
    )
    print("Database connected successfully!")
    conn.close()
except Exception as e:
    print("Database connection failed:", e)
