import os
import pymongo
import psutil
import socket
import time
from datetime import datetime
import sys

# --- CONFIGURATION ---
MONGO_URI = os.environ.get("MONGO_URI")
if not MONGO_URI:
    print("❌ Missing MONGO_URI environment variable. Exiting.")
    sys.exit(1)
DB_NAME = "portfolio_db"
COLLECTION_NAME = "system_health"
CHECK_INTERVAL = 10  # Seconds
ZOOM_TARGET = "8.8.8.8"
ZOOM_PORT = 53

def get_db_collection():
    try:
        client = pymongo.MongoClient(MONGO_URI)
        # Test the connection immediately
        client.admin.command('ping')
        db = client[DB_NAME]
        return db[COLLECTION_NAME]
    except Exception as e:
        print(f"❌ Database Connection Error: {e}")
        return None

def check_internet(host=ZOOM_TARGET, port=ZOOM_PORT, timeout=3):
    """
    Pings Google DNS (8.8.8.8) to check connectivity and latency.
    Returns (status, latency_ms)
    """
    start_time = time.time()
    try:
        # We use a socket connection as a "ping" equivalent because it's cross-platform and doesn't require ICMP permissions
        socket.create_connection((host, port), timeout=timeout)
        latency = (time.time() - start_time) * 1000
        return "ONLINE", int(latency)
    except OSError:
        return "OFFLINE", 0

def get_system_stats():
    """
    Returns CPU and RAM usage percentages.
    """
    cpu = int(psutil.cpu_percent(interval=None))
    ram = int(psutil.virtual_memory().percent)
    return cpu, ram

def main():
    print("--------------------------------------------------")
    print("   🕵️  NET AGENT: System Health Monitor Initialized")
    print("--------------------------------------------------")
    # Safe printing of host
    try:
        host_print = MONGO_URI.split('@')[-1]
    except:
        host_print = "Unknown Host"
        
    print(f"Target: {host_print}") 
    print(f"Interval: {CHECK_INTERVAL}s")
    print("--------------------------------------------------\n")

    collection = get_db_collection()
    
    # --- THE FIX IS HERE: Compare explicitly with None ---
    if collection is None:
        print("❌ Could not connect to MongoDB. Exiting.")
        return

    # Warm up psutil
    psutil.cpu_percent(interval=None)

    while True:
        try:
            # 1. Network Check
            status, latency = check_internet()

            # 2. System Check
            cpu, ram = get_system_stats()

            # 3. Create Payload
            payload = {
                "timestamp": datetime.now().isoformat(),
                "status": status,
                "latency": latency,
                "cpu": cpu,
                "ram": ram,
                "node": "Portfolio-Agent-Local"
            }

            # 4. Push to MongoDB
            collection.insert_one(payload)

            # 5. Log Output
            log_icon = "🚀" if status == "ONLINE" else "⚠️"
            print(f"{log_icon} [{status}] Latency: {latency}ms | CPU: {cpu}% | RAM: {ram}% | Data pushed to Atlas.")

        except Exception as e:
            print(f"❌ Error in loop: {e}")
        
        # 6. Sleep
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    # Check dependencies hint
    try:
        import pymongo
        import psutil
    except ImportError:
        print("❌ Missing dependencies! Run: pip install pymongo psutil")
        sys.exit(1)
        
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Agent stopped by user.")
        sys.exit(0)
