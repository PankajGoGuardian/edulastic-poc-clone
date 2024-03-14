export const AGREEMENT = 'agreement'
export const DIFFICULTY = 'difficulty'
export const FREQUENCY = 'frequency'
export const IMPORTANCE = 'importance'
export const INTEREST = 'interest'
export const LIKELIHOOD = 'likelihood'
export const QUALITY = 'quality'
export const SATISFACTION = 'satisfaction'
export const SUPPORT = 'support'
export const CUSTOM = 'custom'

export const ASC = 'ASC'
export const DESC = 'DESC'

export const MAX_OPTIONS_LIMIT = 10

export const allScaleTypes = [
  AGREEMENT,
  DIFFICULTY,
  FREQUENCY,
  IMPORTANCE,
  INTEREST,
  LIKELIHOOD,
  QUALITY,
  SATISFACTION,
  SUPPORT,
  CUSTOM,
]

export const displayOrderOptions = {
  [ASC]: 'Ascending',
  [DESC]: 'Descending',
}

export const AVAILABLE_SCALE_COLORS = [
  '#E43836',
  '#FD6349',
  '#FF8641',
  '#FFA834',
  '#FFC825',
  '#FDE217',
  '#D8DC3D',
  '#AED65B',
  '#86D275',
  '#36AE26',
]

export const DEFAULT_SCORE = [0, 1, 2, 3, 4]
export const DEFAULT_SCALE_COLORS = [
  '#E43836',
  '#FF7575',
  '#FFC825',
  '#9CCD2F',
  '#36AE26',
]

export const scaleData = {
  [AGREEMENT]: {
    title: 'Agreement',
    options: [
      {
        label: 'Strongly Disagree',
        score: DEFAULT_SCORE[0],
        bgColor: DEFAULT_SCALE_COLORS[0],
      },
      {
        label: 'Disagree',
        score: DEFAULT_SCORE[1],
        bgColor: DEFAULT_SCALE_COLORS[1],
      },
      {
        label: 'Undecided',
        score: DEFAULT_SCORE[2],
        bgColor: DEFAULT_SCALE_COLORS[2],
      },
      {
        label: 'Agree',
        score: DEFAULT_SCORE[3],
        bgColor: DEFAULT_SCALE_COLORS[3],
      },
      {
        label: 'Strongly Agree',
        score: DEFAULT_SCORE[4],
        bgColor: DEFAULT_SCALE_COLORS[4],
      },
    ],
  },
  [DIFFICULTY]: {
    title: 'Difficulty',
    options: [
      {
        label: 'Very Easy',
        score: DEFAULT_SCORE[0],
        bgColor: DEFAULT_SCALE_COLORS[0],
      },
      {
        label: 'Easy',
        score: DEFAULT_SCORE[1],
        bgColor: DEFAULT_SCALE_COLORS[1],
      },
      {
        label: 'Neutral',
        score: DEFAULT_SCORE[2],
        bgColor: DEFAULT_SCALE_COLORS[2],
      },
      {
        label: 'Difficult',
        score: DEFAULT_SCORE[3],
        bgColor: DEFAULT_SCALE_COLORS[3],
      },
      {
        label: 'Very Difficult',
        score: DEFAULT_SCORE[4],
        bgColor: DEFAULT_SCALE_COLORS[4],
      },
    ],
  },
  [FREQUENCY]: {
    title: 'Frequency',
    options: [
      {
        label: 'Never',
        score: DEFAULT_SCORE[0],
        bgColor: DEFAULT_SCALE_COLORS[0],
      },
      {
        label: 'Rarely',
        score: DEFAULT_SCORE[1],
        bgColor: DEFAULT_SCALE_COLORS[1],
      },
      {
        label: 'Sometimes',
        score: DEFAULT_SCORE[2],
        bgColor: DEFAULT_SCALE_COLORS[2],
      },
      {
        label: 'Often',
        score: DEFAULT_SCORE[3],
        bgColor: DEFAULT_SCALE_COLORS[3],
      },
      {
        label: 'Always',
        score: DEFAULT_SCORE[4],
        bgColor: DEFAULT_SCALE_COLORS[4],
      },
    ],
  },
  [IMPORTANCE]: {
    title: 'Importance',
    options: [
      {
        label: 'Not At All Important',
        score: DEFAULT_SCORE[0],
        bgColor: DEFAULT_SCALE_COLORS[0],
      },
      {
        label: 'Slightly Important',
        score: DEFAULT_SCORE[1],
        bgColor: DEFAULT_SCALE_COLORS[1],
      },
      {
        label: 'Moderately Important',
        score: DEFAULT_SCORE[2],
        bgColor: DEFAULT_SCALE_COLORS[2],
      },
      {
        label: 'Very Important',
        score: DEFAULT_SCORE[3],
        bgColor: DEFAULT_SCALE_COLORS[3],
      },
      {
        label: 'Extremely Important',
        score: DEFAULT_SCORE[4],
        bgColor: DEFAULT_SCALE_COLORS[4],
      },
    ],
  },
  [INTEREST]: {
    title: 'Interest',
    options: [
      {
        label: 'Not Interested At All',
        score: DEFAULT_SCORE[0],
        bgColor: DEFAULT_SCALE_COLORS[0],
      },
      {
        label: 'Slightly Interested',
        score: DEFAULT_SCORE[1],
        bgColor: DEFAULT_SCALE_COLORS[1],
      },
      {
        label: 'Moderately Interested',
        score: DEFAULT_SCORE[2],
        bgColor: DEFAULT_SCALE_COLORS[2],
      },
      {
        label: 'Very Interested',
        score: DEFAULT_SCORE[3],
        bgColor: DEFAULT_SCALE_COLORS[3],
      },
      {
        label: 'Extremely Interested',
        score: DEFAULT_SCORE[4],
        bgColor: DEFAULT_SCALE_COLORS[4],
      },
    ],
  },
  [LIKELIHOOD]: {
    title: 'Likelihood',
    options: [
      {
        label: 'Very Unlikely',
        score: DEFAULT_SCORE[0],
        bgColor: DEFAULT_SCALE_COLORS[0],
      },
      {
        label: 'Unlikely',
        score: DEFAULT_SCORE[1],
        bgColor: DEFAULT_SCALE_COLORS[1],
      },
      {
        label: 'Neutral',
        score: DEFAULT_SCORE[2],
        bgColor: DEFAULT_SCALE_COLORS[2],
      },
      {
        label: 'Likely',
        score: DEFAULT_SCORE[3],
        bgColor: DEFAULT_SCALE_COLORS[3],
      },
      {
        label: 'Very Likely',
        score: DEFAULT_SCORE[4],
        bgColor: DEFAULT_SCALE_COLORS[4],
      },
    ],
  },
  [QUALITY]: {
    title: 'Quality',
    options: [
      {
        label: 'Very poor',
        score: DEFAULT_SCORE[0],
        bgColor: DEFAULT_SCALE_COLORS[0],
      },
      {
        label: 'Poor',
        score: DEFAULT_SCORE[1],
        bgColor: DEFAULT_SCALE_COLORS[1],
      },
      {
        label: 'Average',
        score: DEFAULT_SCORE[2],
        bgColor: DEFAULT_SCALE_COLORS[2],
      },
      {
        label: 'Good',
        score: DEFAULT_SCORE[3],
        bgColor: DEFAULT_SCALE_COLORS[3],
      },
      {
        label: 'Excellent',
        score: DEFAULT_SCORE[4],
        bgColor: DEFAULT_SCALE_COLORS[4],
      },
    ],
  },
  [SATISFACTION]: {
    title: 'Satisfaction',
    options: [
      {
        label: 'Very Unsatisfied',
        score: DEFAULT_SCORE[0],
        bgColor: DEFAULT_SCALE_COLORS[0],
      },
      {
        label: 'Unsatisfied',
        score: DEFAULT_SCORE[1],
        bgColor: DEFAULT_SCALE_COLORS[1],
      },
      {
        label: 'Neutral',
        score: DEFAULT_SCORE[2],
        bgColor: DEFAULT_SCALE_COLORS[2],
      },
      {
        label: 'Satisfied',
        score: DEFAULT_SCORE[3],
        bgColor: DEFAULT_SCALE_COLORS[3],
      },
      {
        label: 'Very Satisfied',
        score: DEFAULT_SCORE[4],
        bgColor: DEFAULT_SCALE_COLORS[4],
      },
    ],
  },
  [SUPPORT]: {
    title: 'Support',
    options: [
      {
        label: 'Strongly Oppose',
        score: DEFAULT_SCORE[0],
        bgColor: DEFAULT_SCALE_COLORS[0],
      },
      {
        label: 'Oppose',
        score: DEFAULT_SCORE[1],
        bgColor: DEFAULT_SCALE_COLORS[1],
      },
      {
        label: 'Neutral',
        score: DEFAULT_SCORE[2],
        bgColor: DEFAULT_SCALE_COLORS[2],
      },
      {
        label: 'Support',
        score: DEFAULT_SCORE[3],
        bgColor: DEFAULT_SCALE_COLORS[3],
      },
      {
        label: 'Strongly Support',
        score: DEFAULT_SCORE[4],
        bgColor: DEFAULT_SCALE_COLORS[4],
      },
    ],
  },
  [CUSTOM]: {
    title: 'Custom',
    options: [
      { label: '', score: DEFAULT_SCORE[0], bgColor: DEFAULT_SCALE_COLORS[0] },
      { label: '', score: DEFAULT_SCORE[1], bgColor: DEFAULT_SCALE_COLORS[1] },
      { label: '', score: DEFAULT_SCORE[2], bgColor: DEFAULT_SCALE_COLORS[2] },
      { label: '', score: DEFAULT_SCORE[3], bgColor: DEFAULT_SCALE_COLORS[3] },
      { label: '', score: DEFAULT_SCORE[4], bgColor: DEFAULT_SCALE_COLORS[4] },
    ],
  },
}
