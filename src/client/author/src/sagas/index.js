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
import { reportSaga } from "../../Reports/ducks";
import { authorGroupsWatcherSaga } from "../../sharedDucks/groups";
import { authorRoutesWatcherSaga } from "../../sharedDucks/routes";
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
import { studentSaga } from "../../Student";
import { teacherSaga } from "../../Teacher";
import { districtAdminSaga } from "../../DistrictAdmin";
import { schoolAdminSaga } from "../../SchoolAdmin";
import { coursesSaga } from "../../Courses";
import { classesSaga } from "../../Classes";
import folderSaga from "./folder";
import { interestedStandardsSaga } from "../../InterestedStandards";
import { playlistSaga } from "../../Playlist";
import { playlistPageSaga } from "../../PlaylistPage";
import { dashboardTeacherSaga } from "../../Dashboard";
import { watcherSaga as expressGraderWatcherSaga } from "../../ExpressGrader/ducks";
import { classEnrollmentSaga } from "../../ClassEnrollment";

const authorSagas = [
  itemsSaga(),
  itemDetailSaga(),
  testItemSaga(),
  questionSaga(),
  dictionariesSaga(),
  classBoardSaga(),
  assignmentsSaga(),
  reportSaga(),
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
  studentSaga(),
  teacherSaga(),
  districtAdminSaga(),
  schoolAdminSaga(),
  coursesSaga(),
  classesSaga(),
  folderSaga(),
  playlistSaga(),
  playlistPageSaga(),
  interestedStandardsSaga(),
  dashboardTeacherSaga(),
  authorRoutesWatcherSaga(),
  expressGraderWatcherSaga(),
  classEnrollmentSaga()
];

export default authorSagas;
