import { combineReducers } from 'redux'
import allStudentReducers from './student/reducers'
import authorUi from './author/src/reducers/authorUi'
import dictionaries from './author/src/reducers/dictionaries'
import { reducer as tests } from './author/TestPage/ducks';
import authorQuestions from './author/sharedDucks/questions';
import studentTestItems from './student/sharedDucks/TestItem';
import { scratchpad } from './common/components/Scratchpad/duck'
import tutorial from './tutorials/tutorialReducer'

export const studentReducers = combineReducers({
	...allStudentReducers,
	authorUi,
	dictionaries,
	scratchpad,
	tutorial,
	tests,
	authorQuestions,
	studentTestItems
  })
  