import authorUi from './authorUi'
import view from './view'
import items from './items'
import itemScore from '../ItemScore/ducks'
import testItem from './testItem'
import dictionaries from './dictionaries'
import author_assignments from './assignments'
import { reportReducer } from '../../Reports/ducks'
import { expressGraderReducer } from '../../ExpressGrader/ducks'
import author_classboard_gradebook from './gradeBook'
import author_classboard_testActivity from './testActivity'
import authorGroups from '../../sharedDucks/groups'
import authorQuestions from '../../sharedDucks/questions'
import authorUserList from '../../sharedDucks/userDetails'
import classResponse from './classResponse'
import studentResponse from './studentResponse'
import classStudentResponse from './classStudentResponse'
import feedbackResponse from './feedbackResponse'
import studentQuestionResponse from './studentQuestionResponse'
import classQuestionResponse from './classQuestionResponse'
import { itemAdd } from '../../ItemAdd'
import { testList } from '../../TestList'
import { tests } from '../../TestPage'
import { itemDetail } from '../../ItemDetail'
import { question } from '../../QuestionEditor'
import { testsAddItems } from '../../TestPage/components/AddItems'
import { testAssignmentsReducer } from '../../TestPage/components/Assign'
import { assessmentCreate } from '../../AssessmentCreate'
import { manageClass } from '../../ManageClass'
import { manageSubscription } from '../../ManageSubscription'
import { districtProfileReducer } from '../../DistrictProfile'
import { testSettingReducer } from '../../TestSetting'
import { termReducer } from '../../Term'
import { districtPolicyReducer } from '../../DistrictPolicy'
import { performanceBandReducer } from '../../PerformanceBand'
import { standardsProficiencyReducer } from '../../StandardsProficiency'
import { schoolsReducer } from '../../Schools'
import { studentReducer } from '../../Student'
import { teacherReducer } from '../../Teacher'
import { districtAdminReducer } from '../../DistrictAdmin'
import { schoolAdminReducer } from '../../SchoolAdmin'
import { coursesReducer } from '../../Courses'
import { classesReducer } from '../../Classes'
import { groupsReducer } from '../../Groups'
import folder from './folder'
import { interestedStandardsReducer } from '../../InterestedStandards'
import { playlists } from '../../Playlist'
import { playlist } from '../../PlaylistPage'
import pickUpQuestion from './pickUpQuestion'
import { dashboardTeacher } from '../../Dashboard'
import { testItemPreview } from '../components/common/PreviewModal'
import { classEnrollmentReducer } from '../../ClassEnrollment'
import { rubricReducer } from '../../GradingRubric'
import { bucketReducer } from '../../ContentBuckets'
import { collectionsReducer } from '../../ContentCollections'
import { slice as LCBAssignmentSlice } from '../../LCBAssignmentSettings/ducks'
import { slice as subscriptionSlice } from '../../Subscription/ducks'
import { testItemPreviewAttachment } from '../components/common/PreviewModal/previewAttachment.ducks'
import { assignmentSettings } from '../../AssignTest/duck'
import playlistTestBoxSlice from '../../CurriculumSequence/components/ManageContentBlock/ducks'
import { externalToolsReducer } from '../../ExternalTools'
import testPlayer from '../../sharedDucks/testPlayer'
import { feedback } from './feedback'
import { mergeUsersReducer } from '../../MergeUsers'
import { gradebookReducer } from '../../Gradebook'
import collaborationGroup from '../../Collaboration/ducks'
import { dataWarehouseReducer } from '../../sharedDucks/dataWarehouse'
import { rosterImportReducer } from '../../RosterImport'
import { advanceSearchReducer } from '../../AdvanceSearch'
import { goalAndInterventionsReducer } from '../../Reports/subPages/dataWarehouseReports/GoalsAndInterventions/ducks'

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
  reportReducer,
  expressGraderReducer,
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
  manageSubscription,
  authorUserList,
  districtProfileReducer,
  testSettingReducer,
  termReducer,
  districtPolicyReducer,
  performanceBandReducer,
  standardsProficiencyReducer,
  schoolsReducer,
  studentReducer,
  teacherReducer,
  districtAdminReducer,
  schoolAdminReducer,
  coursesReducer,
  classesReducer,
  groupsReducer,
  folder,
  playlist,
  playlists,
  interestedStandardsReducer,
  pickUpQuestion,
  dashboardTeacher,
  testItemPreview,
  classEnrollmentReducer,
  rubricReducer,
  bucketReducer,
  collectionsReducer,
  itemScore,
  LCBAssignmentSettings: LCBAssignmentSlice.reducer,
  subscription: subscriptionSlice.reducer,
  testItemPreviewAttachment,
  assignmentSettings,
  playlistTestBox: playlistTestBoxSlice.reducer,
  externalToolsReducer,
  testPlayer,
  feedback,
  mergeUsersReducer,
  gradebookReducer,
  collaborationGroup,
  dataWarehouseReducer,
  rosterImportReducer,
  advanceSearchReducer,
  goalAndInterventionsReducer,
}

export default authorReducers
