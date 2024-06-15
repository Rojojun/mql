MongoRunner.dataPath = "경로";

st = ShardingTest({
  name: "샤드_이름",
  chunkSize: 1, // 디폴트는 64mb
  shards: 3, // 샤드의 갯수
  rs: {
    nodes: 3,
    oplogSize: 10
  },
  other: {
    enableBalancer: true
  }
})

sh.status() // 샤딩에 대한 명령어

arr = []
for (i = 0; i < 100000; i++) {
  document = {
    index: i,
    text : "text" + i
  }
  arr.push(document);
}
db.도큐먼트명.insertMany(arr);

sh.enableSharding('db명')

db.도큐먼트명.createIndex({index:1});   // 기본 숫자형

sh.shardCollection("test.testing", {index : 1})

// 샤드의 형태 변경

db.도큐먼트명.createIndex({text: "hashed"});    // 
sh.reshardCollection("test.testing", {text : "hashed"})
