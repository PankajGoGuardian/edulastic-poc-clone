import { all } from 'redux-saga/effects'

import dictionariesSaga from './author/src/sagas/dictionaries'

// export { addEvaluationWatcherSaga as answerSaga } from './sharedDucks/AssignmentModule/ducks'
// export { watcherSaga as skillReportSaga } from './SkillReport/ducks'
// export { AssignmentSaga as studentAssignmentsSaga } from './Assignments'
// export { authenticationSaga } from './Login'
// export { testActivityReportSaga } from './TestAcitivityReport'
// export { signupSaga } from './Signup'
// export { studentManageClassSaga } from './ManageClass'
// export { StudentPlaylistSaga } from './StudentPlaylist'
import { answerSaga,skillReportSaga,studentAssignmentsSaga,authenticationSaga,testActivityReportSaga,signupSaga,studentManageClassSaga,StudentPlaylistSaga } from './student/sagas';

export function* studentsSagas() {
	yield all([
		answerSaga(),
		skillReportSaga(),
		studentAssignmentsSaga(),
		authenticationSaga(),
		testActivityReportSaga(),
		signupSaga(),
		studentManageClassSaga(),
		StudentPlaylistSaga(),
		dictionariesSaga()
  	])
  }