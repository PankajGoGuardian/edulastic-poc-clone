// exact match Object 1 no answer
export const emObj1 = {
  userResponse: undefined,
  validation: {
    scoringType: "exactMatch",
    validResponse: {
      score: 1,
      value: [
        "6795d549-90a4-444e-b494-597d5f0bd9d4"
        // "bfcafc56-eb6a-47b1-8647-3608002dd1bd"
      ]
    },
    altResponses: [
      {
        score: 1,
        value: [
          "4e1a6779-7ba4-4ebf-8b71-b1d3193a5728"
          // "22f8294c-e611-4228-b55f-5b6331cc0761"
        ]
      }
    ]
  }
};

// exact match object 2 all correct with alternate answer
export const emObj2 = {
  userResponse: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728"],
  validation: {
    scoringType: "exactMatch",
    validResponse: {
      score: 2,
      value: ["6795d549-90a4-444e-b494-597d5f0bd9d4"]
    },
    altResponses: [
      {
        score: 3,
        value: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728"]
      }
    ]
  }
};

// exact match object 3, partial correct
export const emObj3 = {
  userResponse: ["6795d549-90a4-444e-b494-597d5f0bd9d4"],
  validation: {
    scoringType: "exactMatch",
    validResponse: {
      score: 2,
      value: ["6795d549-90a4-444e-b494-597d5f0bd9d4", "bfcafc56-eb6a-47b1-8647-3608002dd1bd"]
    },
    altResponses: [
      {
        score: 2,
        value: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728"]
      }
    ]
  }
};

// exact match object 4 all correct with correct answer
export const emObj4 = {
  userResponse: ["6795d549-90a4-444e-b494-597d5f0bd9d4"],
  validation: {
    scoringType: "exactMatch",
    validResponse: {
      score: 2,
      value: ["6795d549-90a4-444e-b494-597d5f0bd9d4"]
    },
    altResponses: [
      {
        score: 2,
        value: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728"]
      }
    ]
  }
};

// exact match object 5 incorrect answer
export const emObj5 = {
  userResponse: ["bfcafc56-eb6a-47b1-8647-3608002dd1bd"],
  validation: {
    scoringType: "exactMatch",
    validResponse: {
      score: 2,
      value: ["6795d549-90a4-444e-b494-597d5f0bd9d4"]
    },
    altResponses: [
      {
        score: 2,
        value: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728"]
      }
    ]
  }
};
export const emObj6 = {
  userResponse: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728"],
  validation: {
    scoringType: "exactMatch",
    validResponse: {
      score: 2,
      value: ["6795d549-90a4-444e-b494-597d5f0bd9d4"]
    },
    altResponses: [
      {
        score: 1,
        value: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728"]
      }
    ]
  }
};

// partial match object 1 no answer
export const pmObj1 = {
  userResponse: undefined,
  validation: {
    scoringType: "partialMatch",
    validResponse: {
      score: 1,
      value: ["6795d549-90a4-444e-b494-597d5f0bd9d4", "bfcafc56-eb6a-47b1-8647-3608002dd1bd"]
    },
    altResponses: [
      {
        score: 1,
        value: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728", "22f8294c-e611-4228-b55f-5b6331cc0761"]
      }
    ],
    penalty: 1
  }
};

// partial match object 2, partially correct answer
export const pmObj2 = {
  userResponse: ["6795d549-90a4-444e-b494-597d5f0bd9d4"],
  validation: {
    scoringType: "partialMatch",
    validResponse: {
      score: 1,
      value: ["6795d549-90a4-444e-b494-597d5f0bd9d4", "bfcafc56-eb6a-47b1-8647-3608002dd1bd"]
    },
    altResponses: [
      {
        score: 1,
        value: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728", "22f8294c-e611-4228-b55f-5b6331cc0761"]
      }
    ],
    penalty: 1
  }
};

// partial match object 3, full match correct answer
export const pmObj3 = {
  userResponse: ["6795d549-90a4-444e-b494-597d5f0bd9d4", "bfcafc56-eb6a-47b1-8647-3608002dd1bd"],
  validation: {
    scoringType: "partialMatch",
    validResponse: {
      score: 1,
      value: ["6795d549-90a4-444e-b494-597d5f0bd9d4", "bfcafc56-eb6a-47b1-8647-3608002dd1bd"]
    },
    altResponses: [
      {
        score: 1,
        value: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728", "22f8294c-e611-4228-b55f-5b6331cc0761"]
      }
    ],
    penalty: 1
  }
};

// partial match object 2, full match alternate answer
export const pmObj4 = {
  userResponse: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728", "22f8294c-e611-4228-b55f-5b6331cc0761"],
  validation: {
    scoringType: "partialMatch",
    validResponse: {
      score: 1,
      value: ["6795d549-90a4-444e-b494-597d5f0bd9d4", "bfcafc56-eb6a-47b1-8647-3608002dd1bd"]
    },
    altResponses: [
      {
        score: 1,
        value: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728", "22f8294c-e611-4228-b55f-5b6331cc0761"]
      }
    ],
    penalty: 1
  }
};

export const pmObj5 = {
  userResponse: ["6795d549-90a4-444e-b494-597d5f0bd9d4", "4e1a6779-7ba4-4ebf-8b71-b1d3193a5728"],
  validation: {
    scoringType: "partialMatch1",
    validResponse: {
      score: 1,
      value: ["6795d549-90a4-444e-b494-597d5f0bd9d4", "bfcafc56-eb6a-47b1-8647-3608002dd1bd"]
    },
    altResponses: [
      {
        score: 1,
        value: ["4e1a6779-7ba4-4ebf-8b71-b1d3193a5728", "22f8294c-e611-4228-b55f-5b6331cc0761"]
      }
    ],
    penalty: 1
  }
};

// attempt score
// partial match object 2
export const attObj1 = {
  userResponse: [0, 1],
  validation: {
    scoring_type: "exactMatch",
    valid_response: {
      score: 2,
      value: [1, 2]
    },
    min_score_if_attempted: 4,
    alt_responses: []
  },
  multiple_responses: false,
  smallSize: true
};

// attempt score
// partial match object 2
export const attObj2 = {
  userResponse: [],
  validation: {
    scoring_type: "exactMatch",
    valid_response: {
      score: 2,
      value: [1, 2]
    },
    min_score_if_attempted: 4,
    alt_responses: []
  },
  multiple_responses: false,
  smallSize: true
};
