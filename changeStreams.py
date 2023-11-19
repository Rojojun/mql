import pymongo
import certifi

conn = "mongodb+srv://"
client = pymongo.MongoClient(conn, tlsCAFile=certifi.where())
db = client.test

stream = db.test.watch()

for document in stream:
    print(document)

/*
* db.test.insertOne({a:2})
*/