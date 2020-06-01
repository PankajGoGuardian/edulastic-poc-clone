const partialMatch = [
  {
    userResponse: [
      {
        value: "Option 1",
        index: 0,
        id: "624c860e-97a7-4cc7-865d-b976991f18f7"
      },
      {
        value: "Option 4",
        index: 1,
        id: "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c"
      }
    ],
    validation: {
      scoringType: "partialMatch",
      validResponse: {
        score: 4.5,
        value: [
          {
            value: "Option 1",
            index: 0,
            id: "624c860e-97a7-4cc7-865d-b976991f18f7"
          },
          {
            value: "Option 3",
            index: 1,
            id: "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c"
          }
        ]
      },
      altResponses: [],
      rounding: "roundDown"
    },
    result: {
      score: 2,
      evaluation: {
        "624c860e-97a7-4cc7-865d-b976991f18f7": true,
        "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c": false
      },
      maxScore: 4.5
    }
  },
  {
    userResponse: [
      {
        value: "Option 1",
        index: 0,
        id: "624c860e-97a7-4cc7-865d-b976991f18f7"
      },
      {
        value: "Option 4",
        index: 1,
        id: "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c"
      }
    ],
    validation: {
      scoringType: "partialMatch",
      validResponse: {
        score: 2.5,
        value: [
          {
            value: "Option 1",
            index: 0,
            id: "624c860e-97a7-4cc7-865d-b976991f18f7"
          },
          {
            value: "Option 3",
            index: 1,
            id: "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c"
          }
        ]
      },
      altResponses: [],
      rounding: "roundDown"
    },
    result: {
      score: 1,
      evaluation: {
        "624c860e-97a7-4cc7-865d-b976991f18f7": true,
        "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c": false
      },
      maxScore: 2.5
    }
  },
  {
    userResponse: [
      {
        value: "Option 1",
        index: 0,
        id: "624c860e-97a7-4cc7-865d-b976991f18f7"
      },
      {
        value: "Option 3",
        index: 1,
        id: "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c"
      }
    ],
    validation: {
      scoringType: "partialMatch",
      validResponse: {
        score: 4.5,
        value: [
          {
            value: "Option 1",
            index: 0,
            id: "624c860e-97a7-4cc7-865d-b976991f18f7"
          },
          {
            value: "Option 3",
            index: 1,
            id: "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c"
          }
        ]
      },
      altResponses: [],
      rounding: "roundDown"
    },
    result: {
      score: 4.5,
      evaluation: {
        "624c860e-97a7-4cc7-865d-b976991f18f7": true,
        "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c": true
      },
      maxScore: 4.5
    }
  },
  {
    userResponse: [
      {
        value: "Option 1",
        index: 0,
        id: "624c860e-97a7-4cc7-865d-b976991f18f7"
      },
      {
        value: "Option 3",
        index: 1,
        id: "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c"
      }
    ],
    validation: {
      scoringType: "partialMatch",
      validResponse: {
        score: 2.5,
        value: [
          {
            value: "Option 1",
            index: 0,
            id: "624c860e-97a7-4cc7-865d-b976991f18f7"
          },
          {
            value: "Option 3",
            index: 1,
            id: "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c"
          }
        ]
      },
      altResponses: [],
      rounding: "roundDown"
    },
    result: {
      score: 2.5,
      evaluation: {
        "624c860e-97a7-4cc7-865d-b976991f18f7": true,
        "4c0669c5-a13f-4ec9-ad69-0a5c2dc1b48c": true
      },
      maxScore: 2.5
    }
  }
];

export const cases = {
  partialMatch
};
