import os
from dotenv import load_dotenv
import pika

load_dotenv()

RAB_USER = os.getenv("RABUSER")
RAB_PASS = os.getenv("RABPASS")

def produce(host, body):
    credentials = pika.PlainCredentials(RAB_USER, RAB_PASS)
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=host, port=5672, credentials=credentials)
    )
    channel = connection.channel()

    # declare exchange & queue
    channel.exchange_declare(exchange="jobs", exchange_type="direct")
    channel.queue_declare(queue="router_jobs")
    channel.queue_bind(queue="router_jobs", exchange="jobs", routing_key="get_log")

    # ส่ง message
    channel.basic_publish(exchange="jobs", routing_key="get_log", body=body)
    print(f"✅ Sent message to queue 'router_jobs': {body}")

    connection.close()


if __name__ == "__main__":
    produce("localhost", "192.168.1.44")
