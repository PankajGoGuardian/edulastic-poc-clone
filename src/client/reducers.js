import { combineReducers } from "redux";

import assessmentReducers from "./assessment/reducers";
import authorReducers from "./author/src/reducers";
import studentReducers from "./student/reducers";
import curriculumSequenceReducers from "./author/CurriculumSequence/ducks";
import tutorial from "./tutorials/tutorialReducer";
import adminReducers from "./admin/reducers";

const rootReducer = combineReducers({
  ...assessmentReducers,
  ...authorReducers,
  ...studentReducers,
  ...adminReducers,
  tutorial,
  curriculumSequence: curriculumSequenceReducers
});

export default rootReducer;
