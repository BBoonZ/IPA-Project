import os

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_router_info():
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME")
    print(mongo_uri)
    print(db_name)

    client = MongoClient(mongo_uri)
    db = client[db_name]
    routers = db["routers"]

    router_data = routers.find()
    print(router_data)   
    return router_data


if __name__ == "__main__":
    get_router_info()