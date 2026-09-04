import sqlite3
import os

conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

print("Deleting temporary additional bulk rows (SG, CO, EFTA, TR, PA, CR, HN)...")
cur.execute("DELETE FROM hs_rate_master WHERE country_code IN ('SG', 'CO', 'EFTA', 'TR', 'PA', 'CR', 'HN')")
conn.commit()

# Vacuum to shrink file
print("Vacuuming...")
cur.execute("VACUUM")
conn.close()

db_size_mb = os.path.getsize('cusway.db') / (1024*1024)
print(f"Optimized cusway.db size: {db_size_mb:.2f} MB (GitHub Limit: 100.00 MB)")
