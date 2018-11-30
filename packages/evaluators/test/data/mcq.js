// exact match Object 1
export const emObj1 = {
  userResponses: [0, 1],
  type: 'multipleChoice',
  stimulus: 'batman is black',
  ui_style: {
    type: 'horizontal'
  },
  options: [
    {
      value: 0,
      label: 'True'
    },
    {
      value: 1,
      label: 'False'
    }
  ],
  validation: {
    scoring_type: 'exactMatch',
    valid_response: {
      score: 1,
      value: [1, 0]
    },
    alt_responses: []
  },
  multiple_responses: false,
  smallSize: true
};

// exact match object 2
export const emObj2 = {
  userResponses: [1],
  type: 'multipleChoice',
  stimulus: 'batman is black',
  ui_style: {
    type: 'horizontal'
  },
  options: [
    {
      value: 0,
      label: 'True'
    },
    {
      value: 1,
      label: 'False'
    }
  ],
  validation: {
    scoring_type: 'exactMatch',
    valid_response: {
      score: 2,
      value: [0]
    },
    alt_responses: [
      {
        score: 3,
        value: [0]
      }
    ]
  },
  multiple_responses: false,
  smallSize: true
};

// exact match object 3
export const emObj3 = {
  userResponses: [0, 1],
  type: 'multipleChoice',
  stimulus: 'batman is black',
  ui_style: {
    type: 'horizontal'
  },
  options: [
    {
      value: 0,
      label: 'True'
    },
    {
      value: 1,
      label: 'False'
    }
  ],
  validation: {
    scoring_type: 'exactMatch',
    valid_response: {
      score: 2,
      value: [0]
    },
    alt_responses: [
      {
        score: 3,
        value: [0]
      }
    ]
  },
  multiple_responses: false,
  smallSize: true
};
