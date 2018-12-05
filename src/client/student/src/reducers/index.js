import ui from './ui';
import tests from './test';
import reports from './reports';
import user from './user';

const studentReducer = {
  ui,
  reports,
  user,
  studentTest: tests
};

export default studentReducer;
