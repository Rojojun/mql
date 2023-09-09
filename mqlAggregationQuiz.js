db.grades.aggregate([
  {
    $unwind: "$scores",
  },
  {
    $match: {
      "scores.type": {
        $in: ["exam", "quiz"],
      },
    },
  },
  {
    $group: {
      _id: {
        class_id: "$class_id",
        type: "$scores.type",
      },
      avg_score: {
        $avg: "$scores.score",
      },
    },
  },
  {
    $group: {
      _id: "$_id.class_id",
      scores: {
        $push: {
          type: "$_id.type",
          avg_score: "$avg_score",
        },
      },
    },
  },
  {
    $sort: {
      _id: -1,
    },
  },
  {
    $limit: 5,
  },
]);
// 다른 방법으로 정제하기
// #2
db.grades.aggregate([
  {
    $addFields: {
      tmp_scores: {
        $filter: {
          input: "$scores",
          as: "scores_var",
          cond: {
            $or: [
              { $eq: ["$$scores_var.type", "exam"] },
              { $eq: ["$$scores_var.type", "quiz"] },
            ],
          },
        },
      },
    },
  },
  {
    $unset: ["scores", "student_id"],
  },
  {
    $unwind: "$tmp_scores",
  },
  {
    $group: {
      _id: "$class_id",
      exam_scores: {
        $push: {
          $cond: {
            if: {
              $eq: ["$tmp_scores.type", "exam"],
            },
            then: "$tmp_scores.score",
            else: "$$REMOVE",
          },
        },
      },
      quiz_scores: {
        $push: {
          $cond: {
            if: {
              $eq: ["$tmp_scores.type", "quiz"],
            },
            then: "$tmp_scores.score",
            else: "$$REMOVE",
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 1,
      scores: {
        $objectToArray: {
          exma: {
            $avg: "$exam_scores",
          },
          quiz: {
            $avg: "$quiz_scores",
          },
        },
      },
    },
  },
  {
    $sort: {
      _id: -1,
    },
  },
  {
    $limit: 5,
  },
]);
