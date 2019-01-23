import ui from './Sidebar/ducks';
import skillReport from './SkillReport/ducks';
import { studentAssignmentReducer } from './sharedDucks/AssignmentModule';
import { studentReportReducer } from './sharedDucks/ReportsModule';
import user from './Login/ducks';

const studentReducer = {
  ui,
  skillReport,
  user,
  studentReport: studentReportReducer,
  studentAssignment: studentAssignmentReducer
};

export default studentReducer;
