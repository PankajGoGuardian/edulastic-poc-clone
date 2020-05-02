export const exactMatch = {
  multipleResponsesOff: [
    {
      userResponse: {
        value: [[0], [0], [0], [0]]
      },
      validation: {
        scoringType: "exactMatch",
        validResponse: {
          score: 1,
          value: [[0], [0], [1], [1]]
        },
        altResponses: [
          {
            score: 1,
            value: [[1], [1], [0], [0]]
          }
        ]
      }
    },
    {
      userResponse: {
        value: [[1], [0], [1], [0]]
      },
      validation: {
        scoringType: "exactMatch",
        validResponse: {
          score: 1,
          value: [[0], [0], [1], [1]]
        },
        altResponses: [
          {
            score: 1,
            value: [[1], [1], [0], [0]]
          }
        ]
      }
    },
    {
      userResponse: {
        value: []
      },
      validation: {
        scoringType: "exactMatch",
        validResponse: {
          score: 1,
          value: [[0], [0], [1], [1]]
        },
        altResponses: [
          {
            score: 1,
            value: [[1], [1], [0], [0]]
          }
        ]
      }
    },
    {
      userResponse: {
        value: [[1], [1], [1], [1]]
      },
      validation: {
        scoringType: "exactMatch",
        validResponse: {
          score: 4,
          value: [[0], [1], [0], [1]]
        },
        altResponses: [
          {
            score: 4,
            value: [[1], [0], [1], [0]]
          }
        ]
      }
    },
    {
      userResponse: {
        value: [[1], [0], [1], [0]]
      },
      validation: {
        scoringType: "exactMatch",
        validResponse: {
          score: 1,
          value: [[0], [0], [1], [1]]
        },
        altResponses: [
          {
            score: 4,
            value: [[1], [0], [1], [0]]
          }
        ]
      }
    },
    {
      userResponse: {},
      validation: {
        scoringType: "exactMatch",
        validResponse: {
          score: 1,
          value: [[0], [1], [0], [1]]
        },
        altResponses: [
          {
            score: 1,
            value: [[1], [0], [1], [0]]
          }
        ],
        penalty: 1
      }
    },
    {
      userResponse: {
        value: [[0], null, null, [1]]
      },
      validation: {
        scoringType: "exactMatch",
        validResponse: {
          score: 1,
          value: [[0], null, null, [1]]
        },
        altResponses: []
      }
    },
    {
      userResponse: {
        value: [[0], null, null, [0]]
      },
      validation: {
        scoringType: "exactMatch",
        validResponse: {
          score: 1,
          value: [[0], null, null, [1]]
        },
        altResponses: []
      }
    }
  ]
};

export const partialMatch = {
  multipleResponsesOff: [
    {
      userResponse: {
        value: [[0], [1], [0], [1]]
      },
      validation: {
        scoringType: "partialMatch",
        validResponse: {
          score: 1,
          value: [[0], [1], [0], [1]]
        },
        altResponses: [
          {
            score: 1,
            value: [[1], [0], [1], [0]]
          }
        ],
        penalty: 0
      }
    },
    {
      userResponse: {},
      validation: {
        scoringType: "partialMatch",
        validResponse: {
          score: 1,
          value: [[0], [1], [0], [1]]
        },
        altResponses: [
          {
            score: 1,
            value: [[1], [0], [1], [0]]
          }
        ],
        penalty: 0
      }
    },
    {
      userResponse: {
        value: [[0], [1], [1], [0]]
      },
      validation: {
        scoringType: "partialMatch",
        validResponse: {
          score: 1,
          value: [[0], [1], [0], [1]]
        },
        altResponses: [
          {
            score: 1,
            value: [[1], [0], [1], [0]]
          }
        ],
        penalty: 0
      }
    },
    {
      userResponse: {
        value: [[0], [1], [1], [0]]
      },
      validation: {
        scoringType: "partialMatch",
        validResponse: {
          score: 1,
          value: [[0], [1], [0], [1]]
        },
        altResponses: [
          {
            score: 1,
            value: [[1], [0], [1], [0]]
          }
        ],
        penalty: 1
      }
    },
    {
      userResponse: {
        value: [[0], null, null, [1]]
      },
      validation: {
        scoringType: "partialMatch",
        validResponse: {
          score: 1,
          value: [[0], null, null, [1]]
        },
        altResponses: [],
        penalty: 0
      }
    },
    {
      userResponse: {
        value: [[0], null, null, [0]]
      },
      validation: {
        scoringType: "partialMatch",
        validResponse: {
          score: 1,
          value: [[0], null, null, [1]]
        },
        altResponses: [],
        penalty: 0
      }
    },
    {
      userResponse: {
        value: [[0], null, null, [0]]
      },
      validation: {
        scoringType: "partialMatch",
        validResponse: {
          score: 1,
          value: [[0], null, null, [1]]
        },
        altResponses: [],
        penalty: 1
      }
    }
  ],
  multipleResponsesOn: []
};
