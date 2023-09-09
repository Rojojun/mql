db.orders.insertMany([
  {
    _id: 0,
    name: "Pepperoni",
    size: "small",
    price: 19,
    quantity: 10,
    date: ISODate("2021-03-13T08:14:30Z"),
  },
  {
    _id: 1,
    name: "Pepperoni",
    size: "medium",
    price: 20,
    quantity: 20,
    date: ISODate("2021-03-13T08:14:30Z"),
  },
  {
    _id: 2,
    name: "Pepperoni",
    size: "large",
    price: 21,
    quantity: 30,
    date: ISODate("2021-03-13T08:14:30Z"),
  },
  {
    _id: 3,
    name: "Cheese",
    size: "small",
    price: 12,
    quantity: 15,
    date: ISODate("2021-03-13T08:14:30Z"),
  },
  {
    _id: 4,
    name: "Cheese",
    size: "medium",
    price: 13,
    quantity: 50,
    date: ISODate("2021-03-13T08:14:30Z"),
  },
  {
    _id: 5,
    name: "Cheese",
    size: "large",
    price: 14,
    quantity: 10,
    date: ISODate("2021-03-13T08:14:30Z"),
  },
  {
    _id: 6,
    name: "Vegan",
    size: "small",
    price: 17,
    quantity: 10,
    date: ISODate("2021-03-13T08:14:30Z"),
  },
  {
    _id: 7,
    name: "Vegan",
    size: "medium",
    price: 18,
    quantity: 10,
    date: ISODate("2021-03-13T08:14:30Z"),
  },
]);

db.orders.aggregate([
  {
    $match: {
      size: "medium",
    },
  },
  {
    $group: {
      _id: { $getField: "name" },
      totalQuantity: {
        $sum: { $getField: "quantity" },
      },
    },
  },
]);
//getField 약자 -> $getField : "name" = "$name"

db.orders.aggregate([
  {
    $match: {
      date: {
        $gte: new ISODate("2020-01-30"),
        $lt: new ISODate("2022-01-30"),
      },
    },
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$date",
        },
      },
      totalOrderValue: {
        $sum: {
          $multiply: ["$price", "$quantity"],
        },
      },
      averageOrderQuantity: {
        $avg: "$quantity",
      },
    },
  },
  {
    $sort: {
      averageOrderQuantity: -1,
    },
  },
]);

db.books.insertMany([
  { _id: 8751, title: "The Banquet", author: "Dante", copies: 2 },
  { _id: 8752, title: "Divine Comedy", author: "Dante", copies: 2 },
  { _id: 8645, title: "Eclogues", author: "Dante", copies: 2 },
  { _id: 7000, title: "The Odyssey", author: "Homer", copies: 10 },
  { _id: 7020, title: "Iliad", author: "Homer", copies: 10 },
]);

db.books.aggregate([
  {
    $group: {
      _id: "$author",
      books: {
        $push: "$title",
      },
    },
  },
]);

// 도큐먼트 자체를 집어넣을때
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      books: {
        $push: "$$ROOT",
      },
    },
  },
  {
    $addFields: {
      totalcopies: { $sum: "$books.copies" },
    },
  },
]);

// Join
db.orders.drop();

db.orders.insertMany([
  { productId: 1, price: 12 },
  { productId: 2, price: 20 },
  { productId: 3, price: 80 },
]);

db.products.insertMany([
  { id: 1, instock: 120 },
  { id: 2, instock: 80 },
  { id: 3, instock: 60 },
  { id: 4, instock: 70 },
]);

// lookup : left outter join
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "id",
      as: "data",
    },
  },
  {
    $match: {
      $expr: {
        $gt: ["$data.instock", "$price"],
      },
    },
  },
]);
// --> 값이 안 맞음
// $expr 을 배열에서 사용할경우 정상적인 결과값 X -> MongoDB의도
// 필드 형태는 ok, .형태 배열은 X

// 배열을 출력하려면 파이프라인 하나 추가해서 unwind로 -> unwind: 배열이 아닌 Object 형태로
// 배열을 document형태로 풀어서 필터링함
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "id",
      as: "data",
    },
  },
  {
    $unwind: "$data",
  },
  {
    $match: {
      $expr: {
        $gt: ["$data.instock", "$price"],
      },
    },
  },
]);

// $unwind 예시 2
db.orders.aggregate([
  {
    $group: {
      _id: "$author",
      books: {
        $push: "$$ROOT",
      },
    },
  },
  {
    $addFields: {
      totalCopies: { $sum: "$books.copies" },
    },
  },
  {
    $unwind: "$books",
  },
]);

// sampling + projection
db.listingsAndReviews.aggregate([
  {
    $sample: { size: 3 },
  },
  {
    $project: {
      name: 1,
      summary: 1,
    },
  },
]);

//skip and limit : skip = offset, limit=size -> paging
db.listingsAndReviews.aggregate([
  {
    $match: { property_type: "Apartment" },
  },
  {
    $sort: { number_of_reviews: -1 },
  },
  {
    $skip: 0,
  },
  {
    $limit: 5,
  },
  {
    $project: {
      name: 1,
      number_of_reviews: 1,
    },
  },
]);

// 다른 컬렉션에 저장하는거??? ㅇㅂㅇ...
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      books: { $push: "title" },
    },
  },
  {
    $out: "authors",
  },
]);
