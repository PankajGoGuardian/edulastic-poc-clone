import { combineReducers } from 'redux'
import allStudentReducers from './student/reducers'
import assessmentReducers from './assessment/reducers'
import authorUi from './author/src/reducers/authorUi'
import dictionaries from './author/src/reducers/dictionaries'
import { reducer as tests } from './author/TestPage/ducks'
import authorQuestions from './author/sharedDucks/questions'
import studentTestItems from './student/sharedDucks/TestItem'
import commonReducers from './common/ducks'
import tutorial from './tutorials/tutorialReducer'
import testPlayer from './author/sharedDucks/testPlayer'
import author_classboard_testActivity from './author/src/reducers/testActivity'
import feedbackResponse from './author/src/reducers/feedbackResponse'
import view from './author/src/reducers/view'
import { reducer as assessmentCreate } from './author/AssessmentCreate/ducks'
import { reducer as itemDetail } from './author/ItemDetail/ducks'

export const studentReducers = combineReducers({
  ...allStudentReducers,
  ...assessmentReducers,
  ...commonReducers,
  authorUi,
  dictionaries,
  tutorial,
  tests,
  authorQuestions,
  studentTestItems,
  testPlayer,
  author_classboard_testActivity,
  view,
  assessmentCreate,
  feedbackResponse,
  itemDetail,
})
