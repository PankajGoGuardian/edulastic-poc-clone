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

export const scaleData = {
  [AGREEMENT]: {
    title: 'Agreement',
    options: [
      {
        label: 'Strongly Disagree',
        score: 0,
        bgColor: '#E43836',
      },
      {
        label: 'Disagree',
        score: 1,
        bgColor: '#FF7575',
      },
      {
        label: 'Undecided',
        score: 2,
        bgColor: '#FFC825',
      },
      {
        label: 'Agree',
        score: 3,
        bgColor: '#9CCD2F',
      },
      {
        label: 'Strongly Agree',
        score: 4,
        bgColor: '#36AE26',
      },
    ],
  },
  [DIFFICULTY]: {
    title: 'Difficulty',
    options: [
      {
        label: 'Very Easy',
        score: 0,
        bgColor: '#E43836',
      },
      {
        label: 'Easy',
        score: 1,
        bgColor: '#FF7575',
      },
      {
        label: 'Neutral',
        score: 2,
        bgColor: '#FFC825',
      },
      {
        label: 'Difficult',
        score: 3,
        bgColor: '#9CCD2F',
      },
      {
        label: 'Very Difficult',
        score: 4,
        bgColor: '#36AE26',
      },
    ],
  },
  [FREQUENCY]: {
    title: 'Frequency',
    options: [
      {
        label: 'Never',
        score: 1,
        bgColor: '#E43836',
      },
      {
        label: 'Rarely',
        score: 2,
        bgColor: '#FF7575',
      },
      {
        label: 'Sometimes',
        score: 3,
        bgColor: '#FFC825',
      },
      {
        label: 'Often',
        score: 4,
        bgColor: '#9CCD2F',
      },
      {
        label: 'Always',
        score: 5,
        bgColor: '#36AE26',
      },
    ],
  },
  [IMPORTANCE]: {
    title: 'Importance',
    options: [
      {
        label: 'Not At All Important',
        score: 0,
        bgColor: '#E43836',
      },
      {
        label: 'Slightly Important',
        score: 1,
        bgColor: '#FF7575',
      },
      {
        label: 'Moderately Important',
        score: 2,
        bgColor: '#FFC825',
      },
      {
        label: 'Very Important',
        score: 3,
        bgColor: '#9CCD2F',
      },
      {
        label: 'Extremely Important',
        score: 4,
        bgColor: '#36AE26',
      },
    ],
  },
  [INTEREST]: {
    title: 'Interest',
    options: [
      {
        label: 'Not Interested At All',
        score: 0,
        bgColor: '#E43836',
      },
      {
        label: 'Slightly Interested',
        score: 1,
        bgColor: '#FF7575',
      },
      {
        label: 'Moderately Interested',
        score: 2,
        bgColor: '#FFC825',
      },
      {
        label: 'Very Interested',
        score: 3,
        bgColor: '#9CCD2F',
      },
      {
        label: 'Extremely Interested',
        score: 4,
        bgColor: '#36AE26',
      },
    ],
  },
  [LIKELIHOOD]: {
    title: 'Likelihood',
    options: [
      {
        label: 'Very Unlikely',
        score: 0,
        bgColor: '#E43836',
      },
      {
        label: 'Unlikely',
        score: 1,
        bgColor: '#FF7575',
      },
      {
        label: 'Neutral',
        score: 2,
        bgColor: '#FFC825',
      },
      {
        label: 'Likely',
        score: 3,
        bgColor: '#9CCD2F',
      },
      {
        label: 'Very Likely',
        score: 4,
        bgColor: '#36AE26',
      },
    ],
  },
  [QUALITY]: {
    title: 'Quality',
    options: [
      {
        label: 'Very poor',
        score: 0,
        bgColor: '#E43836',
      },
      {
        label: 'Poor',
        score: 1,
        bgColor: '#FF7575',
      },
      {
        label: 'Average',
        score: 2,
        bgColor: '#FFC825',
      },
      {
        label: 'Good',
        score: 3,
        bgColor: '#9CCD2F',
      },
      {
        label: 'Excellent',
        score: 4,
        bgColor: '#36AE26',
      },
    ],
  },
  [SATISFACTION]: {
    title: 'Satisfaction',
    options: [
      {
        label: 'Very Unsatisfied',
        score: 0,
        bgColor: '#E43836',
      },
      {
        label: 'Unsatisfied',
        score: 1,
        bgColor: '#FF7575',
      },
      {
        label: 'Neutral',
        score: 2,
        bgColor: '#FFC825',
      },
      {
        label: 'Satisfied',
        score: 3,
        bgColor: '#9CCD2F',
      },
      {
        label: 'Very Satisfied',
        score: 4,
        bgColor: '#36AE26',
      },
    ],
  },
  [SUPPORT]: {
    title: 'Support',
    options: [
      {
        label: 'Strongly Oppose',
        score: 0,
        bgColor: '#E43836',
      },
      {
        label: 'Oppose',
        score: 1,
        bgColor: '#FF7575',
      },
      {
        label: 'Neutral',
        score: 2,
        bgColor: '#FFC825',
      },
      {
        label: 'Support',
        score: 3,
        bgColor: '#9CCD2F',
      },
      {
        label: 'Strongly Support',
        score: 4,
        bgColor: '#36AE26',
      },
    ],
  },
  [CUSTOM]: {
    title: 'Custom',
    options: [
      { label: '', score: 0, bgColor: '#E43836' },
      { label: '', score: 1, bgColor: '#FF7575' },
      { label: '', score: 2, bgColor: '#FFC825' },
      { label: '', score: 3, bgColor: '#9CCD2F' },
      { label: '', score: 4, bgColor: '#36AE26' },
    ],
  },
}

export const SCALE_COLORS = [
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

export const SCALE_COLORS_FOR_5_OPTIONS = [
  '#E43836',
  '#FF7575',
  '#FFC825',
  '#9CCD2F',
  '#36AE26',
]
