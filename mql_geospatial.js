/**
 * 지역 기반 쿼리를 위해서는?
 * 1. GeoJson으로 하기
 * 2. 레거시 좌표 형태로 사용하기
 *
 * 다양한 형태의 지역기반을 쿼리로 그릴 수 있음
 */

db.grids.insertMany([
  {
    _id: 1,
    loc: [0, 0],
  },
  {
    _id: 2,
    loc: [3, 4],
  },
  {
    _id: 3,
    loc: [15, 2],
  },
  {
    _id: 4,
    loc: [7, 8],
  },
  {
    _id: 5,
    loc: {
      type: "point",
      coordinates: [5, 5],
    },
  },
  {
    _id: 6,
    loc: {
      type: "point",
      coordinates: [14, 8],
    },
  },
  {
    _id: 7,
    loc: {
      type: "LineString",
      coordinates: [
        [6, 6],
        [15, 13],
      ],
    },
  },
  {
    _id: 8,
    loc: {
      type: "LineString",
      coordinates: [
        [0, 12],
        [5, 12],
      ],
    },
  },
  {
    _id: 9,
    loc: {
      type: "Polygon",
      coordinates: [
        [2, 2],
        [3, 3],
        [4, 2],
        [2, 2],
      ],
    },
  },
  {
    _id: 10,
    loc: {
      type: "Polygon",
      coordinates: [
        [
          [
            [9, 0],
            [5, 13],
            [14, 6],
            [9, 0],
          ],
        ],
      ],
    },
  },
]);

// polygon 타입은 마지막 배열은 막기 배열

db.grids.find({
  loc: {
    $geoIntersects: {
      $geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [10, 0],
            [10, 10],
            [0, 10],
            [0, 0],
          ],
        ],
      },
    },
  },
});

db.grids.find({
  loc: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [5, 5],
      },
      $maxDistance: 3,
    },
  },
});
