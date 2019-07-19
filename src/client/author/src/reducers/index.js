import authorUi from "./authorUi";
import view from "./view";
import items from "./items";
import testItem from "./testItem";
import dictionaries from "./dictionaries";
import author_assignments from "./assignments";
import { reportAssignmentsReducer } from "../../Reports/assignmentsDucks";
import { reportSARFilterDataReducer } from "../../Reports/subPages/singleAssessmentReport/common/filterDataDucks";
import { reportMARFilterDataReducer } from "../../Reports/subPages/multipleAssessmentReport/common/filterDataDucks";
import { reportAssessmentSummaryReducer } from "../../Reports/subPages/singleAssessmentReport/AssessmentSummary/ducks";
import { reportReducer } from "../../Reports/ducks";
import { reportResponseFrequencyReducer } from "../../Reports/subPages/singleAssessmentReport/ResponseFrequency/ducks";
import { reportPeerPerformanceReducer } from "../../Reports/subPages/singleAssessmentReport/PeerPerformance/ducks";
import { reportQuestionAnalysisReducer } from "../../Reports/subPages/singleAssessmentReport/QuestionAnalysis/ducks";
import { reportPerformanceByStandardsReducer } from "../../Reports/subPages/singleAssessmentReport/PerformanceByStandards/ducks";
import { reportPerformanceByStudentsReducer } from "../../Reports/subPages/singleAssessmentReport/PerformanceByStudents/ducks";
import { reportStandardsGradebookReducer } from "../../Reports/subPages/standardsMasteryReport/standardsGradebook/ducks";
import { reportStandardsPerformanceSummaryReducer } from "../../Reports/subPages/standardsMasteryReport/standardsPerformance/ducks";
import { reportStandardsFilterDataReducer } from "../../Reports/subPages/standardsMasteryReport/common/filterDataDucks";
import { reportPeerProgressAnalysisReducer } from "../../Reports/subPages/multipleAssessmentReport/PeerProgressAnalysis/ducks";
import { reportStudentProgressReducer } from "../../Reports/subPages/multipleAssessmentReport/StudentProgress/ducks";
import { reportPerformanceOverTimeReducer } from "../../Reports/subPages/multipleAssessmentReport/PerformanceOverTime/ducks";
import author_classboard_gradebook from "./gradeBook";
import author_classboard_testActivity from "./testActivity";
import authorGroups from "../../sharedDucks/groups";
import authorQuestions from "../../sharedDucks/questions";
import authorUserList from "../../sharedDucks/userDetails";
import classResponse from "./classResponse";
import studentResponse from "./studentResponse";
import classStudentResponse from "./classStudentResponse";
import feedbackResponse from "./feedbackResponse";
import studentQuestionResponse from "./studentQuestionResponse";
import classQuestionResponse from "./classQuestionResponse";
import { itemAdd } from "../../ItemAdd";
import { testList } from "../../TestList";
import { tests } from "../../TestPage";
import { itemDetail } from "../../ItemDetail";
import { question } from "../../QuestionEditor";
import { testsAddItems } from "../../TestPage/components/AddItems";
import { testAssignmentsReducer } from "../../TestPage/components/Assign";
import { assessmentCreate } from "../../AssessmentCreate";
import { manageClass } from "../../ManageClass";
import { districtProfileReducer } from "../../DistrictProfile";
import { testSettingReducer } from "../../TestSetting";
import { termReducer } from "../../Term";
import { districtPolicyReducer } from "../../DistrictPolicy";
import { performanceBandReducer } from "../../PerformanceBand";
import { standardsProficiencyReducer } from "../../StandardsProficiency";
import { schoolsReducer } from "../../Schools";
import { studentReducer } from "../../Student";
import { teacherReducer } from "../../Teacher";
import { districtAdminReducer } from "../../DistrictAdmin";
import { schoolAdminReducer } from "../../SchoolAdmin";
import { coursesReducer } from "../../Courses";
import { classesReducer } from "../../Classes";
import folder from "./folder";
import { interestedStandardsReducer } from "../../InterestedStandards";
import { playlists } from "../../Playlist";
import { playlist } from "../../PlaylistPage";
import pickUpQuestion from "./pickUpQuestion";
import { dashboardTeacher } from "../../Dashboard";

const authorReducers = {
  authorUi,
  view,
  authorGroups,
  items,
  testsAddItems,
  itemAdd,
  question,
  testItem,
  itemDetail,
  dictionaries,
  authorQuestions,
  author_assignments,
  reportAssignmentsReducer,
  reportSARFilterDataReducer,
  reportMARFilterDataReducer,
  reportAssessmentSummaryReducer,
  reportReducer,
  reportResponseFrequencyReducer,
  reportPeerPerformanceReducer,
  reportPerformanceByStudentsReducer,
  reportQuestionAnalysisReducer,
  reportStandardsGradebookReducer,
  reportStandardsPerformanceSummaryReducer,
  reportStandardsFilterDataReducer,
  reportPeerProgressAnalysisReducer,
  reportStudentProgressReducer,
  reportPerformanceOverTimeReducer,
  authorTestAssignments: testAssignmentsReducer,
  author_classboard_gradebook,
  author_classboard_testActivity,
  classResponse,
  studentResponse,
  classStudentResponse,
  feedbackResponse,
  tests,
  testList,
  assessmentCreate,
  studentQuestionResponse,
  classQuestionResponse,
  manageClass,
  authorUserList,
  districtProfileReducer,
  testSettingReducer,
  termReducer,
  districtPolicyReducer,
  performanceBandReducer,
  standardsProficiencyReducer,
  schoolsReducer,
  reportPerformanceByStandardsReducer,
  studentReducer,
  teacherReducer,
  districtAdminReducer,
  schoolAdminReducer,
  coursesReducer,
  classesReducer,
  folder,
  playlist,
  playlists,
  interestedStandardsReducer,
  pickUpQuestion,
  dashboardTeacher
};

export default authorReducers;
