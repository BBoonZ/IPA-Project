from netmiko import ConnectHandler

def get_log(ip, username, password):
    device = {
        "device_type": "cisco_ios",  # ตัวอย่าง Cisco IOS
        "host": ip,
        "username": username,
        "password": password
    }

    net_connect = ConnectHandler(**device)
    output = net_connect.send_command("show logging")
    net_connect.disconnect()
    return output

if __name__ == "__main__":
    get_log("10.0.15.61", "admin", "cisco")