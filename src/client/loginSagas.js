import { all } from 'redux-saga/effects'


import {
	watcherSaga as signupSaga
} from './student/Signup/duck';
import { watcherSaga as authenticationSaga } from './student/Login/ducks';


import dictionariesSaga from './author/src/sagas/dictionaries'

export function* loginSaga() {
  yield all([
	  authenticationSaga(),
	   signupSaga(), 
	  dictionariesSaga()
])
}
