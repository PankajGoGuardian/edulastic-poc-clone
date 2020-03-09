const QuestionTitles = require("./questionTitles");

const { MCQ_STANDARD, MCQ_TRUE_OR_FALSE } = QuestionTitles;
// 16:9

const uiConfig = {
  width: "720px",
  height: "405px"
};

const youtubeVideoDetails = {
  [MCQ_STANDARD]: {
    title: `Authoring ${MCQ_STANDARD} question`,
    videoId: "owu5hFwREg4",
    uiConfig
  },
  [MCQ_TRUE_OR_FALSE]: {
    title: `Authoring ${MCQ_TRUE_OR_FALSE} question`,
    videoId: "-uY8CLh2DJk",
    uiConfig
  }
};

module.exports = { youtubeVideoDetails, uiConfig };
