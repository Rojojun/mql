from pymongo import MongoClient
from pymongo.read_preferences import ReadPreferences
import certifi

conn = "mongodb+srv://<ID>:<PW>@cluster0.zxlp1ur.mongodb.net/"
client = MongoClient(conn, tlsCAFile=certifi.where())
db = client.test

db.fruits.insertMany([
    {
        "name" : "melon",
        "qty" : 1000,
        "price" : 16000
    },
    {
        "name" : "starberry",
        "qty" : 100,
        "price" : 10000
    },
    {
        "name" : "grape",
        "qty" : 1500,
        "price" : 6000
    }
])

query_filter = {"name" : "melon"}
while True :
    res = db.fruits.with_options(read_preferences=ReadPreferences.SECONDARY).find_one(query_filter);
    print(res)