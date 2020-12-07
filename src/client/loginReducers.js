import user from './student/Login/ducks'
import signup from './student/Signup/duck'
import authorUi from './author/src/reducers/authorUi'
import dictionaries from './author/src/reducers/dictionaries'

export const loginReducer = combineReducers({
	authorUi,
	user,
	signup,
	dictionaries,
})