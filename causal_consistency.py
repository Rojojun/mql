from pymongo import MongoClient
from pymongo.read_concern import ReadConcern
from pymongo.write_concern import WriteConcern

conn = "mongodb://localhost:27017, localhost:27018, localhost:27019"

client = MongoClient(conn)
with client.start_session(causal_consistency = True) as session:
    db = client.test