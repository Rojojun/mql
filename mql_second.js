db.bulk.bulkWrite(
  [
    { insertOne: { doc: 1, order: 1 } },
    { insertOne: { doc: 2, order: 2 } },
    { insertOne: { doc: 3, order: 3 } },
    { insertOne: { doc: 4, order: 4 } },
    { insertOne: { doc: 5, order: 5 } },
    { insertOne: { doc: 6, order: 6 } },
    {
      deleteOne: {
        filter: { doc: 3 },
      },
    },
    {
      updateOne: {
        filter: { doc: 2 },
        update: {
          $set: { doc: 12 },
        },
      },
    },
  ],
  { ordered: false }
  // default 는 true -> 순차적으로 false일때 순서 상관없이 성능에 최적화해서 알아서 진행함
  // 특정 단위의 원자성을 하기 위해서는 트랜잭션을 사용 -> 권장 X (몽고DB)
);

db.bulk.countDocuments(); // 정확한 값  -> 느림

db.bulk.estimatedDocumentCount(); // 예상되는 값  -> 빠름

db.bulk.distinct("doc"); // 고유한 형태

db.bulk.findAndModify({
  query: { doc: 4 },
  update: { $inc: { doc: 1 } },
});
// 하나씩만 수정됨 (처음만든 도큐먼트만)
// >> autoIncrement 같은 것

db.bulk.getIndexes();
