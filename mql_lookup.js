db.restaurants.insertMany([
  {
    _id: 1,
    name: "American Steak House",
    food: ["filet", "sirloin"],
    beverages: ["beer", "wine"],
  },
  {
    _id: 2,
    name: "Honest John Pizza",
    food: ["cheese pizza", "pepperoni pizza"],
    beverages: ["soda"],
  },
]);

db.orders.insertMany([
  {
    _id: 1,
    item: "filet",
    restaurant_name: "American Steak House",
  },
  {
    _id: 2,
    item: "cheese pizza",
    restaurant_name: "Honest John Pizza",
    drink: "lemonade",
  },
  {
    _id: 3,
    item: "cheese pizza",
    restaurant_name: "Honest John Pizza",
    drink: "soda",
  },
]);

db.restaurants.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "name",
      foreignField: "restaurants_name",
      as: "orders",
    },
  },
]);

db.restaurants.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "name",
      foreignField: "restaurants_name",
      as: "orders",
    },
  },
  {
    $unwind: "$orders",
  },
  {
    $match: {
      $expr: {
        $and: [
          { $in: ["$orders.item", "$food"] },
          { $in: ["$orders.item", "$beverage"] },
        ],
      },
    },
  },
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      food: { $first: "$food" },
      beverages: { $first: "$beverages" },
      orders: {
        $push: "$orders",
      },
    },
  },
]);

db.restaurants.aggregate([
  {
    $lookup: {
      from: "orders",
      let: {
        name_var: "$name",
        beverages_lst: "$beverages",
        food_lst: "$food",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$$name_var", "$restaurant_name"] },
                {
                  $in: ["$drink", "$$beverages_lst"],
                },
                { $in: ["$item", "$$food_lst"] },
              ],
            },
          },
        },
      ],
      as: "orders",
    },
  },
]);
// 개선된 쿼리

db.restaurants.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "name",
      foreignField: "restaurant_name",
      let: {
        name_var: "$name",
        beverages_lst: "$beverages",
        food_lst: "$food",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $in: ["$drink", "$$beverages_lst"],
                },
                { $in: ["$item", "$$food_lst"] },
              ],
            },
          },
        },
      ],
      as: "orders",
    },
  },
]);

// JSON 형태로 데이터 추출 및 삽입
/**
 * mongoexport와 mongoimport라는 sh로 간단하게 export와 import가능
 * 각각의 명령어는 --help를 통해 확인 가능
 */
