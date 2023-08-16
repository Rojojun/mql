db.students.insertMany([
  { _id: 1, grades: [85, 80, 80] },
  { _id: 2, grades: [88, 90, 92] },
  { _id: 3, grades: [85, 100, 90] },
]);

db.students.updateOne({ _id: 1, grades: 80 }, { $set: { "grades.$": 82 } });
// $set 포지셔닝 오퍼레이터

db.students.updateMany({}, { $inc: { "grades.$[]": 10 } });

db.students.insertMany([
  {
    _id: 4,
    grades: [
      { grades: 80, mean: 75, std: 8 },
      { grades: 85, mean: 90, std: 5 },
      { grades: 80, mean: 85, std: 8 },
    ],
  },
]);

db.students.updateOne(
  { _id: 4, "grades.grades": 85 },
  { $set: { "grades.$.std": 6 } }
);

db.students.updateOne(
  { _id: 4, grades: { $elemMatch: { grades: { $gte: 85 } } } },
  { $set: { "grades.$[].grade": 100 } }
);

db.students.insertMany([
  {
    _id: 6,
    grades: [
      { grades: 90, mean: 75, std: 8 },
      { grades: 87, mean: 90, std: 5 },
      { grades: 85, mean: 85, std: 8 },
    ],
  },
]);

db.students.updateMany(
  { _id: 6 },
  { $set: { "grades.$[element].grades": 100 } },
  { arrayFilter: [{ "element.grades": { $gte: 87 } }] }
);

db.shopping.insertMany([
  {
    _id: 1,
    cart: ["banana", "cheeze", "milk"],
    coupon: ["10%", "20%", "30%"],
  },
  {
    _id: 2,
    cart: [],
    coupon: [],
  },
]);

db.shopping.updateOne({ _id: 1 }, { $addToSet: { cart: "beer" } });
db.shopping.updateOne({ _id: 1 }, { $addToSet: { cart: ["beer", "candy"] } });
// 문제 생김

db.shopping.updateOne(
  { _id: 1 },
  { $addToSet: { cart: { $each: ["beer", "candy"] } } }
);
// 배열이 아닌 각각 하나로 넣기 위해선 each 오퍼레이터 사용

db.shopping.updateOne({ _id: 1 }, { $pull: { cart: "beer" } });
// 드랍

db.shopping.updateOne(
  { _id: 1 },
  { $pull: { cart: { $in: [["beer", "candy"], "milk"] } } }
);

//배열 양쪽 끝 제어 오퍼레이터 pop, push 꺼내기, 넣기
db.shopping.updateOne({ _id: 1 }, { $pop: { cart: -1 } });

db.shopping.updateOne({ _id: 1 }, { $push: { cart: "popcorn" } });
//push에서 position operator는 위치 지정 가능

db.shopping.updateOne(
  {},
  {
    $push: {
      coupon: {
        $each: ["90%", "70%"],
        $position: 0,
      },
    },
  }
);

// slice -> 배열 크기 지정
db.shopping.updateOne(
  {},
  {
    $push: {
      coupon: {
        $each: ["90%", "70%"],
        $position: 0,
        $slice: 5,
      },
    },
  }
);

// $sort : desc = -1, asc = 0
db.shopping.updateOne(
  {},
  {
    $push: {
      coupon: {
        $each: ["90%", "70%"],
        $position: -1,
        $sort: -1,
        $slice: 5,
      },
    },
  }
);
