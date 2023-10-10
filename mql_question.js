// 1정답
db.movies.find();

// 2
db.movies.countDocuments();
db.movies.count();

// 3
db.movies.find(
  {},
  { title: 1, year: 1, genres: 1, runtime: 1, rated: 1, _id: 0 }
);
// 주의점 첫번째 인자만 빈 값, 두번째 인자 (projection에 쓸 것들사용)

// 4
db.movies.find({ runtime: { $lte: 100 } });

//5
db.movies.find({ runtime: { $lte: 100 }, genres: "Drama" });
db.movies.find({ runtime: { $lte: 100 }, genres: { $in: ["Drama"] } });

//6
db.movies.find({
  $and: [
    { runtime: { $lte: 100 } },
    { genres: { $in: ["Drama"] } },
    { genres: { $size: 1 } },
  ],
});
// 조회용 프로젝션
db.movies.find(
  {
    $and: [
      { runtime: { $lte: 100 } },
      { genres: { $in: ["Drama"] } },
      { genres: { $size: 1 } },
    ],
  },
  {
    genres: 1,
  }
);

// 7 + type이 series가 아닌것
db.movies.find(
  {
    $and: [
      { runtime: { $lte: 100 } },
      { type: { $ne: "series" } },
      {
        $or: [{ year: { $gte: 2015 } }, { year: { $lte: 1925 } }],
      },
    ],
  },
  {
    runtime: 1,
    type: 1,
    year: 1,
  }
);

//and operator는 써주는거 권장 쿼리 옵티마이저에서 , and 조건을 넘길 경우가 있음

//8 movies collection에서 viewer 평가가 4.5이상이거나 critic 평가가 9.5이상인 영화를 찾고 runtime이
//가장 긴 순서대로 document를 출력
//필드는 title, runtime, tomatoes, _id 필드 출력

db.movies
  .find(
    {
      $or: [
        { "tomatoes.viewer.rating": { $gte: 4.5 } },
        { "tomatoes.critic.rating": { $gte: 9.5 } },
      ],
    },
    { title: 1, runtime: 1, tomatoes: 1 }
  )
  .sort({ runtime: -1 })
  .limit(5);

//9 sample_resturants database의 restruants collection에서 Queens에 있는
// 음식점 중 Agrade가 없는 음식점을 찾는다.
db.restaurants.find({
  borough: "Queens",
  "grades.grade": { $ne: "A" },
});
db.restaurants.find({
  $and: [{ borough: "Queens" }, { "grades.grade": { $ne: "A" } }],
});

// 10 restaurants collection에서 Queens에 있는 음식점 중에, A와 Z가 같이 있는 음식점을 찾는다.
db.restaurants.find({
  $and: [
    { borough: "Queens" },
    { grades: { $elemMatch: { grade: "A" } } },
    { grades: { $elemMatch: { grade: "Z" } } },
  ],
});

// 11 restaurants collection에서 Queens에 있는 음식점 중에, grades의 score가 하나라도
// 70이상인 document를 조회하고 grades 배열에는 70이 넘는 document 하나만 출력한다
// 나머지 필드는 그대로 출력
db.restaurants.find(
  {
    $and: [
      { borough: "Queens" },
      { grades: { $elemMatch: { score: { $gte: 70 } } } },
    ],
  },
  {}
); //오답 -> 굳이 elemMatch 안써도 됨

db.restaurants.find(
  {
    $and: [{ borough: "Queens" }, { "grades.score": { $gte: 70 } }],
  },
  {
    address: 1,
    borough: 1,
    cuisine: 1,
    "grades.$": 1,
    name: 1,
    restaurant_id: 1,
  }
);
