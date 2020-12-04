const {
  EDITING_TASK,
  SORT_LIST,
  EXPRESSION_MULTIPART,
  MCQ_STANDARD,
  MCQ_TRUE_OR_FALSE,
  CLOZE_IMAGE_TEXT,
  CLOZE_DRAG_DROP,
  CLOZE_IMAGE_DROP_DOWN,
  CLOZE_TEXT,
  CLASSIFICATION,
  CHOICE_MATRIX_LABELS,
  CHOICE_MATRIX_INLINE,
  SHORT_TEXT,
  ESSAY_PLAIN_TEXT,
  ESSAY_RICH_TEXT,
  MCQ_BLOCK_LAYOUT,
  MATCH_LIST,
  PASSAGE_WITH_QUESTIONS,
  MCQ_MULTIPLE_RESPONSE,
  CHOICE_MATRIX_STANDARD,
  RE_SEQUENCE,
} = require('./questionTitle')
// 16:9

const uiConfig = {
  width: '720px',
  height: '405px',
}

const youtubeVideoDetails = {
  [MCQ_STANDARD]: {
    title: `Authoring ${MCQ_STANDARD} question`,
    videoId: 'mvVjnpWAqKM',
    uiConfig,
  },
  [MCQ_TRUE_OR_FALSE]: {
    title: `Authoring ${MCQ_TRUE_OR_FALSE} question`,
    videoId: 'lt5jSu3E220',
    uiConfig,
  },
  [EDITING_TASK]: {
    title: `Authoring ${EDITING_TASK} question`,
    videoId: 'pUtYLvL6gvU',
    uiConfig,
  },
  [SORT_LIST]: {
    title: `Authoring ${SORT_LIST} question`,
    videoId: 'q3eZv6kh5oA',
    uiConfig,
  },
  [EXPRESSION_MULTIPART]: {
    title: `Authoring ${EXPRESSION_MULTIPART} question`,
    videoId: 'q7Reu5nBWjc',
    uiConfig,
  },
  [CLOZE_IMAGE_TEXT]: {
    title: `Authoring ${CLOZE_IMAGE_TEXT} question`,
    videoId: '9L6mgpmx-D4',
    uiConfig,
  },
  [CLOZE_IMAGE_DROP_DOWN]: {
    title: `Authoring ${CLOZE_IMAGE_DROP_DOWN} question`,
    videoId: 'nsHSFwe-kx0',
    uiConfig,
  },
  [CLOZE_DRAG_DROP]: {
    title: `Authoring ${CLOZE_DRAG_DROP} question`,
    videoId: '2WhAszYJbaY',
    uiConfig,
  },
  [CLOZE_TEXT]: {
    title: `Authoring ${CLOZE_TEXT} question`,
    videoId: '2LhYFb7sOPQ',
    uiConfig,
  },
  [CLASSIFICATION]: {
    title: `Authoring ${CLASSIFICATION} question`,
    videoId: 'H6FFyMkmftM',
    uiConfig,
  },
  [CHOICE_MATRIX_STANDARD]: {
    title: `Authoring ${CHOICE_MATRIX_STANDARD} question`,
    videoId: 'UrqcZ1-YxzE',
    uiConfig,
  },
  [CHOICE_MATRIX_LABELS]: {
    title: `Authoring ${CHOICE_MATRIX_LABELS} question`,
    videoId: 'Whc3vB8kVBA',
    uiConfig,
  },
  [CHOICE_MATRIX_INLINE]: {
    title: `Authoring ${CHOICE_MATRIX_INLINE} question`,
    videoId: '_8v_ZQtEiSU',
    uiConfig,
  },
  [SHORT_TEXT]: {
    title: `Authoring ${SHORT_TEXT} question`,
    videoId: 'r3P41KkbMJ4',
    uiConfig,
  },
  [ESSAY_PLAIN_TEXT]: {
    title: `Authoring ${ESSAY_PLAIN_TEXT} question`,
    videoId: '4z1o1woYIDw',
    uiConfig,
  },
  [ESSAY_RICH_TEXT]: {
    title: `Authoring ${ESSAY_RICH_TEXT} question`,
    videoId: 'swQAFyGSm1w',
    uiConfig,
  },
  [MCQ_MULTIPLE_RESPONSE]: {
    title: `Authoring ${MCQ_MULTIPLE_RESPONSE} question`,
    videoId: 'a1LFlbgheiM',
    uiConfig,
  },
  [MATCH_LIST]: {
    title: `Authoring ${MATCH_LIST} question`,
    videoId: 'AlnxgepDHww',
    uiConfig,
  },
  [MCQ_BLOCK_LAYOUT]: {
    title: `Authoring ${MCQ_BLOCK_LAYOUT} question`,
    videoId: 'kB6_s6yRrz8',
    uiConfig,
  },
  [PASSAGE_WITH_QUESTIONS]: {
    title: `Authoring ${PASSAGE_WITH_QUESTIONS} question`,
    videoId: 'uubQlY0VCjQ',
    uiConfig,
  },
  [RE_SEQUENCE]: {
    title: `Authoring ${RE_SEQUENCE} question`,
    videoId: 'YY0oTbP6smQ',
    uiConfig,
  },
}

module.exports = { youtubeVideoDetails, uiConfig }
