import ui from './ui';
import assignments from './assignment';
import reports from './reports';
import skillReport from './skillreport';
import { studentAssignmentReducer } from '../AssignmentModule';
import { studentReportReducer } from '../ReportsModule';
import user from './user';

const studentReducer = {
  ui,
  reports,
  skillReport,
  user,
  assignments,
  studentReport: studentReportReducer,
  studentAssignment: studentAssignmentReducer
};

export default studentReducer;
