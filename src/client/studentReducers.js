import { combineReducers } from 'redux'
import allStudentReducers from './student/reducers'
import assessmentReducers from './assessment/reducers'
import authorUi from './author/src/reducers/authorUi'
import dictionaries from './author/src/reducers/dictionaries'
import { reducer as tests } from './author/TestPage/ducks'
import { reducer as playlists } from './author/Playlist/ducks'
import curriculumSequence from './author/CurriculumSequence/ducks'
import authorUserList from './author/sharedDucks/userDetails'
import author_assignments from './author/src/reducers/assignments'
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
  playlists,
  curriculumSequence,
  authorUserList,
  author_assignments,
})
