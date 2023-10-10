from pymongo import MongoClient
from pymongo.read_concern import ReadConcern
from pymongo.write_concern import WriteConcern

conn = "mongodb://localhost:27017, localhost:27018, localhost:27019"
#"mongodb://localhost:27017, localhost:27018, localhost:27019/?w=majority&readConcernLevel=linearizable"
client = MongoClient(conn)
db = client.test

db.sales.insert_many([
    {
        "name": "pencil",
        "price" : 1000
    },
    {
        "name": "paper",
        "price" : 100
    },
    {
        "name": "pen",
        "price" : 2000
    },
])

# 3개 중 하나만 성공이여도 성공으로 코드 수정
db.sales.with_options(write_concern=WriteConcern(w=1)).insert_many([
    {
        "name": "pencil",
        "price" : 1000
    },
    {
        "name": "paper",
        "price" : 100
    },
    {
        "name": "pen",
        "price" : 2000
    },
])

query_filter = {"price" : {"$gt" : 1500}}
while True:
    res = db.sales.find_one(query_filter)
    print(res)

# 'linearizable' -> 현재 진행중인 majority의 결과를 반환하고 보여줌 = 3개중 2개가 락이면 안 보여줌 (복제가 안되기 때문)
# 'majority' -> 특정 쿼리 시점에서 과반수의 멤버가 가지고 있는 데이터 반환 = 3개중 2개가 락일 때 보여줌 (복제 안되도 OK) , 최신화 데이터는 안보여줌
while True:
    res = db.sales.with_options(read_concern=ReadConcern('majority')).find_one(query_filter)
    print(res)

# mongosh "mongodb://localhost:27019" -> 원하는 클러스터의 아이피 입력
# db.fsyncLock() -> 복제를 못하게 막음 : 과반수가 막혀있으면 복제가 안되서 락이됨
# db.fsyncUnlock() -> 복제 가능