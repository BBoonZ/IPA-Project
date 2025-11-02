from pymongo import MongoClient
from datetime import datetime, UTC
import os
import hashlib
import re
from pymongo import errors

security_regex = re.compile(
    r"%SEC_LOGIN|%LOGIN|%SSH|%AAA|%AUTH|%FW|%SECURITY|%CRYPTO|%DOT1X|Unauthorized|Access denied|failed",
    re.IGNORECASE
)

config_regex = re.compile(
    r"%CONFIG|%SYS-5-CONFIG_I|coconfiguration|changed|config",
    re.IGNORECASE
)

dns_regex = re.compile(
    r"%DNS|DNS|resolve|NXDOMAIN|lookup",
    re.IGNORECASE
)

dhcp_regex = re.compile(
    r"%DHCP|DHCP|lease|assigned|released|offer",
    re.IGNORECASE
)

def is_dhcp_log(line: str) -> bool:
    return bool(dhcp_regex.search(line))

def is_security_log(line: str) -> bool:
    return bool(security_regex.search(line))

def is_config_log(line: str) -> bool:
    return bool(config_regex.search(line))

def is_dns_log(line: str) -> bool:
    return bool(dns_regex.search(line))

def save_logs(router_ip, data):

    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME")

    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db["router_log"]
    collection.create_index("hash", unique=True)

    lines = data.splitlines()
    new_logs = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        log_hash = hashlib.sha256(f"{router_ip}{line}".encode()).hexdigest()
        category = []

        if "interface" in line.lower():
            category.append("Interface log") 
        if is_security_log(line):
            category.append("Security log")
        if is_config_log(line):
            category.append("Config log")
        if is_dns_log(line):
            category.append("DNS log")
        if is_dhcp_log(line):
            category.append("DHCP log")
        if not category:
            category.append("Orther")
        
        

        data = {
            "ip": router_ip,
            "category": category,
            "message": line,
            "timestamp": datetime.now(UTC),
            "hash": log_hash
        }
        
        new_logs.append(data)
    
    if new_logs:
        try:
            collection.insert_many(new_logs, ordered=False)
            print(f"✅ Stored {len(new_logs)} logs from {router_ip}")
        except errors.BulkWriteError as bwe:
            inserted = len([x for x in bwe.details["writeErrors"] if x["code"] != 11000])
            print(f"⚠️ Some logs already exist — stored {inserted} new logs for {router_ip}")
    else:
        print(f"ℹ️ No log data found for {router_ip}")


    client.close()

if __name__ == "__main__":
    ip = "10.0.15.61"
    username = "admin"
    password = "cisco"