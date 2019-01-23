import ui from '../Sidebar/ducks';
//import assignments from './assignment';
//import reports from './reports';
import skillReport from '../skillReport/ducks';
import { studentAssignmentReducer } from '../AssignmentModule';
import { studentReportReducer } from '../ReportsModule';
import user from '../Login/ducks';

const studentReducer = {
  ui,
  skillReport,
  user,
  studentReport: studentReportReducer,
  studentAssignment: studentAssignmentReducer
};

export default studentReducer;
