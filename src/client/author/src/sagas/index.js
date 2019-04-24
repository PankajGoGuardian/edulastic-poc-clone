import itemsSaga from "./items";
import testItemSaga from "./testItem";
import dictionariesSaga from "./dictionaries";
import { classBoardSaga } from "../../ClassBoard";
import { classResponsesSaga } from "../../ClassResponses";
import { testsListSaga } from "../../TestList";
import { testPageSaga } from "../../TestPage";
import { itemDetailSaga } from "../../ItemDetail";
import { ManageClassSaga } from "../../ManageClass";
import { questionSaga } from "../../QuestionEditor";
import { testsAddItemsSaga } from "../../TestPage/components/AddItems";
import { testsAssignSaga } from "../../TestPage/components/Assign";
import assignmentsSaga from "./assignments";
import { reportAssignmentsSaga } from "../../Reports/assignmentsDucks";
import { reportSARFilterDataSaga } from "../../Reports/subPages/singleAssessmentReport/common/filterDataDucks";
import { reportAssessmentSummarySaga } from "../../Reports/subPages/singleAssessmentReport/AssessmentSummary/ducks";
import { reportResponseFrequencySaga } from "../../Reports/subPages/singleAssessmentReport/ResponseFrequency/ducks";
import { reportPeerPerformanceSaga } from "../../Reports/subPages/singleAssessmentReport/PeerPerformance/ducks";
import { performanceByStandardsSaga } from "../../Reports/subPages/singleAssessmentReport/PerformanceByStandards/ducks";
import { authorGroupsWatcherSaga } from "../../sharedDucks/groups";
import { watcherSaga as UserDetails } from "../../sharedDucks/userDetails";
import { assessmentPageSaga } from "../../AssessmentCreate";
import { itemListSaga } from "../../ItemList";
import { districtProfileSaga } from "../../DistrictProfile";
import { testSettingSaga } from "../../TestSetting";
import { termSaga } from "../../Term";
import { districtPolicySaga } from "../../DistrictPolicy";
import { performanceBandSaga } from "../../PerformanceBand";
import { standardsProficiencySaga } from "../../StandardsProficiency";
import { schoolsSaga } from "../../Schools";
import { teacherSaga } from "../../Teacher";
import { districtAdminSaga } from "../../DistrictAdmin";
import { schoolAdminSaga } from "../../SchoolAdmin";
import { coursesSaga } from "../../Courses";
import { classesSaga } from "../../Classes";

const authorSagas = [
  itemsSaga(),
  itemDetailSaga(),
  testItemSaga(),
  questionSaga(),
  dictionariesSaga(),
  classBoardSaga(),
  assignmentsSaga(),
  reportAssignmentsSaga(),
  reportSARFilterDataSaga(),
  reportAssessmentSummarySaga(),
  reportResponseFrequencySaga(),
  reportPeerPerformanceSaga(),
  classResponsesSaga(),
  testsListSaga(),
  testPageSaga(),
  testsAddItemsSaga(),
  testsAssignSaga(),
  authorGroupsWatcherSaga(),
  assessmentPageSaga(),
  ManageClassSaga(),
  UserDetails(),
  itemListSaga(),
  districtProfileSaga(),
  testSettingSaga(),
  termSaga(),
  districtPolicySaga(),
  performanceBandSaga(),
  standardsProficiencySaga(),
  schoolsSaga(),
  performanceByStandardsSaga(),
  teacherSaga(),
  districtAdminSaga(),
  schoolAdminSaga(),
  coursesSaga(),
  classesSaga()
];

export default authorSagas;
