import ui from './ui';
import assignments from './assignment';
import reports from './reports';
import skillReport from './skillreport';
import testItemActivity from '../src/reducers/testItemActivity';
import items from '../src/reducers/items';
import { studentAssignmentReducer } from '../AssignmentModule';
import { studentReportReducer } from '../ReportsModule';
import user from './user';

const studentReducer = {
  ui,
  reports,
  skillReport,
  user,
  studentItems: items,
  testItemActivity,
  assignments,
  studentReport: studentReportReducer,
  studentAssignment: studentAssignmentReducer
};

export default studentReducer;
