import ui from "./Sidebar/ducks";
import skillReport from "./SkillReport/ducks";
import { studentAssignmentReducer } from "./sharedDucks/AssignmentModule";
import { studentReportReducer } from "./sharedDucks/ReportsModule";
import { studentEnrollClassReducer } from "./ManageClass";
import testItem from "./sharedDucks/TestItem";
import testFeedback from "./TestAcitivityReport/ducks";

import user from "./Login/ducks";
import signup from "./Signup/duck";

const studentReducer = {
  ui,
  skillReport,
  user,
  testFeedback,
  studentReport: studentReportReducer,
  studentAssignment: studentAssignmentReducer,
  studentTestItems: testItem,
  studentEnrollClassList: studentEnrollClassReducer,
  signup
};

export default studentReducer;
