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

// 인덱스 생성해야함

db.grids.createIndex({ loc: "2d" });
// 2d는 레거시만 지원
db.grids.createIndex({ loc: "2dsphere" });
// 2dshpere는 레거시와 최근의 코드도 잘 됨
// 평면도 형태에서는 원하는대로 maxDistance(m 단위)가 안잡힘
// 평면도는 GeoJSON 형태보다 레거시인 좌표쌍을 받아야함 그래서 결론은
// 레거시인 좌표쌍으로 하고 "2d"로 인덱싱

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
]);
// GeoJSON은 주석처리함
// {
//   _id: 5,
//   loc: {
//     type: "point",
//     coordinates: [5, 5],
//   },
// },
// {
//   _id: 6,
//   loc: {
//     type: "point",
//     coordinates: [14, 8],
//   },
// },
// {
//   _id: 7,
//   loc: {
//     type: "LineString",
//     coordinates: [
//       [6, 6],
//       [15, 13],
//     ],
//   },
// },
// {
//   _id: 8,
//   loc: {
//     type: "LineString",
//     coordinates: [
//       [0, 12],
//       [5, 12],
//     ],
//   },
// },
// {
//   _id: 9,
//   loc: {
//     type: "Polygon",
//     coordinates: [
//       [2, 2],
//       [3, 3],
//       [4, 2],
//       [2, 2],
//     ],
//   },
// },
// {
//   _id: 10,
//   loc: {
//     type: "Polygon",
//     coordinates: [
//       [
//         [
//           [9, 0],
//           [5, 13],
//           [14, 6],
//           [9, 0],
//         ],
//       ],
//     ],
//   },
// },

db.grids.find({
  loc: {
    $near: [5, 5],
    $maxDistance: 10,
  },
});

// 2d와 2dsphere 차이는 좌표의 범위 차이
