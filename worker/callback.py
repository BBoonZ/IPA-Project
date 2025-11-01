from bson import json_util
from netmiko_getLog import get_log
from database import save_logs

def callback(ch, method, props, body):
    job = json_util.loads(body.decode())
    router_ip = job["ip"]
    router_username = job["username"]
    router_password = job["password"]
    print(f"Received job for router {router_ip}")

    try:
        output = get_log(router_ip, router_username, router_password)
        save_logs(router_ip, output)
    except Exception as e:
        print(f" Error: {e}")