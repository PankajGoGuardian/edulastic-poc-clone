import ui from "./Sidebar/ducks";
import skillReport from "./SkillReport/ducks";
import { studentAssignmentReducer } from "./sharedDucks/AssignmentModule";
import { studentReportReducer } from "./sharedDucks/ReportsModule";
import { studentEnrollClassReducer } from "./ManageClass";
import testItem from "./sharedDucks/TestItem";
import testFeedback, { testActivitiesReducer } from "./TestAcitivityReport/ducks";

import user from "./Login/ducks";
import signup from "./Signup/duck";
import { slice as studentPlaylistSlice } from "./StudentPlaylist/ducks";

const studentReducer = {
  ui,
  skillReport,
  user,
  testFeedback,
  testActivities: testActivitiesReducer,
  studentReport: studentReportReducer,
  studentAssignment: studentAssignmentReducer,
  studentTestItems: testItem,
  studentEnrollClassList: studentEnrollClassReducer,
  signup,
  studentPlaylist: studentPlaylistSlice.reducer
};

export default studentReducer;
