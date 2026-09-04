import sqlite3
import os

conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

# Check size
print("Before vacuum size:", os.path.getsize('cusway.db') / (1024*1024), "MB")

# Vacuum
cur.execute("VACUUM")
conn.close()

print("After vacuum size:", os.path.getsize('cusway.db') / (1024*1024), "MB")
