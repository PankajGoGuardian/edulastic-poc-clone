export const AGREEMENT = 'agreement'
export const FREQUENCY = 'frequency'
export const QUALITY = 'quality'
export const POSSIBILITY = 'possibility'
export const IMPORTANCE = 'importance'
export const CUSTOM = 'custom'
export const ASC = 'ASC'
export const DESC = 'DESC'
export const MAX_OPTIONS_LIMIT = 11
export const allScaleTypes = [
  AGREEMENT,
  FREQUENCY,
  QUALITY,
  POSSIBILITY,
  IMPORTANCE,
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
        label: 'Strongly disagree',
        score: 1,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F621.svg',
      },
      {
        label: 'Disagree',
        score: 2,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F641.svg',
      },
      {
        label: 'Undecided',
        score: 3,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F610.svg',
      },
      {
        label: 'Agree',
        score: 4,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F60A.svg',
      },
      {
        label: 'Strongly agree',
        score: 5,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F600.svg',
      },
    ],
  },
  [FREQUENCY]: {
    title: 'Frequency',
    options: [
      {
        label: 'Almost never',
        score: 1,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F621.svg',
      },
      {
        label: 'Once in a while',
        score: 2,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F641.svg',
      },
      {
        label: 'Sometimes',
        score: 3,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F610.svg',
      },
      {
        label: 'Frequently',
        score: 4,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F60A.svg',
      },
      {
        label: 'Almost all the time',
        score: 5,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F600.svg',
      },
    ],
  },
  [QUALITY]: {
    title: 'Quality',
    options: [
      {
        label: 'Very poor',
        score: 1,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F621.svg',
      },
      {
        label: 'Poor',
        score: 2,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F641.svg',
      },
      {
        label: 'Barely acceptable',
        score: 3,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F610.svg',
      },
      {
        label: 'Good',
        score: 4,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F60A.svg',
      },
      {
        label: 'Very good',
        score: 5,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F600.svg',
      },
    ],
  },
  [POSSIBILITY]: {
    title: 'Possibility',
    options: [
      {
        label: 'Not at all possible',
        score: 1,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F621.svg',
      },
      {
        label: 'A little possible',
        score: 2,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F641.svg',
      },
      {
        label: 'Somewhat possible',
        score: 3,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F610.svg',
      },
      {
        label: 'Quite possible',
        score: 4,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F60A.svg',
      },
      {
        label: 'Completely possible',
        score: 5,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F600.svg',
      },
    ],
  },
  [IMPORTANCE]: {
    title: 'Importance',
    options: [
      {
        label: 'Unimportant',
        score: 1,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F621.svg',
      },
      {
        label: 'Of little importance',
        score: 2,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F641.svg',
      },
      {
        label: 'Moderately important',
        score: 3,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F610.svg',
      },
      {
        label: 'Important',
        score: 4,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F60A.svg',
      },
      {
        label: 'Very important',
        score: 5,
        emojiUrl: 'https://openmoji.org/data/color/svg/1F600.svg',
      },
    ],
  },
  [CUSTOM]: {
    title: 'Custom',
    options: [
      { label: '', score: 1 },
      { label: '', score: 2 },
      { label: '', score: 3 },
      { label: '', score: 4 },
      { label: '', score: 5 },
    ],
  },
}
