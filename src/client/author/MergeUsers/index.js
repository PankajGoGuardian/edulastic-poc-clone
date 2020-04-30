// imports
import React from "react";
import MergeUsersModal from "./components/MergeUsersModal";

// export ducks
export { watcherSaga as mergeUsersSaga } from "./ducks";
export { reducer as mergeUsersReducer } from "./ducks";

// export components
export const MergeStudentsModal = props => <MergeUsersModal {...props} type="student" />;
export const MergeTeachersModal = props => <MergeUsersModal {...props} type="teacher" />;
