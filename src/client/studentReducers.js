import { combineReducers } from 'redux'
import allStudentReducers from './student/reducers'
import assessmentReducers from './assessment/reducers';
import authorUi from './author/src/reducers/authorUi'
import dictionaries from './author/src/reducers/dictionaries'
import { reducer as tests } from './author/TestPage/ducks';
import authorQuestions from './author/sharedDucks/questions';
import studentTestItems from './student/sharedDucks/TestItem';
import { scratchpad } from './common/components/Scratchpad/duck'
import tutorial from './tutorials/tutorialReducer';
import testPlayer from './author/sharedDucks/testPlayer';
import author_classboard_testActivity from './author/src/reducers/testActivity';

export const studentReducers = combineReducers({
	...allStudentReducers,
	...assessmentReducers,
	authorUi,
	dictionaries,
	scratchpad,
	tutorial,
	tests,
	authorQuestions,
	studentTestItems,
	testPlayer,
	author_classboard_testActivity
  })
  