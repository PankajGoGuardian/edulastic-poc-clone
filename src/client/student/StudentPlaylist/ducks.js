import { createSlice } from "redux-starter-kit";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { studentPlaylistApi } from "@edulastic/api";

const slice = createSlice({
    name: "studentPlaylist",
    initialState: {
        isLoading: false,
        playlists: [],
        error: ""
    },
    reducers: {
        fetchStudentPlaylist: state => {
            state.isLoading = true;
        },
        fetchStudentPlaylistSuccess: (state, { payload }) => {
            state.isLoading = false;
            state.playlists = payload;
            state.error = "";
        },
        fetchStudentPlaylistFailure: (state, { payload }) => {
            state.isLoading = false;
            state.playlists = [];
            state.error = payload;
        }
    }
});

export { slice };

function* fetchPlaylist({ payload }) {
    try {
        const apiResponse = yield call(studentPlaylistApi.fetchStudentPlaylists);
        yield put(slice.actions.fetchStudentPlaylistSuccess(apiResponse));
    } catch (err) {
        yield put(slice.actions.fetchStudentPlaylistFailure(err?.data?.message));
        console.error("ERROR WHILE FETCHING STUDENT PLAYLIST : ", err);
    }
}

export function* watcherSaga() {
    yield all([
        yield takeEvery(slice.actions.fetchStudentPlaylist, fetchPlaylist)
    ]);
}
