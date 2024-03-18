import ui from './Sidebar/ducks'
import skillReport from './SkillReport/ducks'
import { studentAssignmentReducer } from './sharedDucks/AssignmentModule'
import { studentReportReducer } from './sharedDucks/ReportsModule'
import { studentEnrollClassReducer } from './ManageClass'
import testItem from './sharedDucks/TestItem'
import testFeedback, {
  testActivitiesReducer,
} from './TestAcitivityReport/ducks'

import user from './Login/ducks'
import signup from './Signup/duck'
import { slice as studentPlaylistSlice } from './StudentPlaylist/ducks'
import { slice as sectionStartSlice } from './SectionsStart/ducks'
import { assessmentPageReducer } from '../author/AssessmentPage/ducks'

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
  studentPlaylist: studentPlaylistSlice.reducer,
  studentSections: sectionStartSlice.reducer,
  assessmentPageReducer,
}

export default studentReducer
