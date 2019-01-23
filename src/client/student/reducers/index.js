import ui from './ui';
//import assignments from './assignment';
//import reports from './reports';
import skillReport from '../skillReport/ducks';
import { studentAssignmentReducer } from '../AssignmentModule';
import { studentReportReducer } from '../ReportsModule';
import user from './user';

const studentReducer = {
  ui,
  skillReport,
  user,
  studentReport: studentReportReducer,
  studentAssignment: studentAssignmentReducer
};

export default studentReducer;
