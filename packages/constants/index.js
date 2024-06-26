const questionType = require("./const/questionType");
const questionTitle = require("./const/questionTitle");
const evaluationType = require("./const/evaluationType.js");
const nonAutoGradableTypes = require("./const/nonAutoGradableTypes.js");
const httpMessages = require("./const/httpMessage");
const roleuser = require("./const/roleType");
const math = require("./const/math.js");
const testActivityStatus = require("./const/testActivityStatus");
const assignmentSortParams = require("./const/assignmentSortParams");
const assignmentPolicyOptions = require("./const/assignmentPolicyOptions");
const typedList = require("./const/typedList");
const drawTools = require("./const/drawTools");
const rounding = require("./const/rounding");
const test = require("./const/test");
const evaluatorTypes = require("./const/evaluatorTypes");
const variableTypes = require("./const/variableTypes");
const testActivity = require("./const/testActivity");
const tutorials = require("./tutorials");
const videoTypes = require("./const/videoTypes");
const aws = require("./const/aws");
const playlists = require("./const/playlists");
const signUpState = require("./const/signUpState");
const grades = require("./const/grades");
const response = require("./const/dimensions");
const canvasDimensions = require("./const/canvas");
const clozeImage = require("./const/clozeImage");
const fonts = require("./const/fonts");
const question = require("./const/question");
const ChoiceDimensions = require("./const/ChoiceDimensions");
const assignmentStatusOptions = require("./const/assignmentStatus");
const { youtubeVideoDetails } = require("./const/howToAuthorVideos");
const customTags = require("./const/customTags");
const libraryFilters = require("./const/filters");
const collections = require("./const/collections");
const sortOptions = require("./const/sortOptions");
const folderTypes = require("./const/folderTypes");

module.exports = {
  question,
  questionType,
  questionTitle,
  evaluationType,
  nonAutoGradableTypes,
  evaluatorTypes,
  httpMessages,
  roleuser,
  math,
  testActivityStatus,
  assignmentSortParams,
  assignmentPolicyOptions,
  typedList,
  drawTools,
  rounding,
  variableTypes,
  test,
  testActivity,
  tutorials,
  videoTypes,
  playlists,
  aws,
  signUpState,
  grades,
  response,
  ChoiceDimensions,
  canvasDimensions,
  clozeImage,
  fonts,
  assignmentStatusOptions,
  youtubeVideoDetails,
  customTags,
  libraryFilters,
  collections,
  sortOptions,
  folderTypes
};
