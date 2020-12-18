import { combineReducers } from 'redux'
import allStudentReducers from './student/reducers'
import authorUi from './author/src/reducers/authorUi'
import dictionaries from './author/src/reducers/dictionaries'
import { scratchpad } from './common/components/Scratchpad/duck'
import tutorial from './tutorials/tutorialReducer'

export const studentReducers = combineReducers({
	allStudentReducers,
	authorUi,
	dictionaries,
	scratchpad,
	tutorial,
  })
  