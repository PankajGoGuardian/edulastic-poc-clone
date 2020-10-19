import { combineReducers } from 'redux'

import assessmentReducers from './assessment/reducers'
import authorReducers from './author/src/reducers'
import studentReducers from './student/reducers'
import curriculumSequenceReducers from './author/CurriculumSequence/ducks'
import tutorial from './tutorials/tutorialReducer'
import adminReducers from './admin/reducers'
import publisherReducer from './publisher/reducers'
import { customReportReducer } from './admin/Components/CustomReportContainer/ducks'
import commonReducers from './common/ducks'
import { slice as resetPasswordSlice } from './SetParentPassword/ducks'
import { publicTestReducer } from './publicTest/ducks'
import user from './student/Login/ducks'
import signup from './student/Signup/duck'
import authorUi from './author/src/reducers/authorUi'

const rootReducer = combineReducers({
  ...assessmentReducers,
  ...authorReducers,
  ...studentReducers,
  ...adminReducers,
  tutorial,
  curriculumSequence: curriculumSequenceReducers,
  ...publisherReducer,
  customReportReducer,
  ...commonReducers,
  resetPassword: resetPasswordSlice.reducer,
  publicTest: publicTestReducer,
})

export const loginReducer = combineReducers({
  authorUi,
  user,
  signup,
})

export default rootReducer
