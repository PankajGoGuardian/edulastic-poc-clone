// exact match Object 1
export const emObj1 = {
  userResponses: [0, 1, 2],
  validation: {
    scoring_type: 'exactMatch',
    valid_response: {
      score: 1,
      value: [0, 1, 2]
    },
    alt_responses: []
  }
};

// exact match Object 1
export const emObj2 = {
  userResponses: [0, 1, 2],
  validation: {
    scoring_type: 'exactMatch',
    valid_response: {
      score: 1,
      value: [1, 0, 2]
    },
    alt_responses: []
  }
};

// exact match Object 3
export const emObj3 = {
  userResponses: [0, 1, 2],
  validation: {
    scoring_type: 'exactMatch',
    valid_response: {
      score: 1,
      value: [1, 0, 2]
    },
    alt_responses: [
      {
        score: 3,
        value: [0, 1, 2]
      }
    ]
  }
};
