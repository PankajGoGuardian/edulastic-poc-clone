import { createSlice } from "redux-starter-kit";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { studentPlaylistApi, recommendationsApi } from "@edulastic/api";
import { createSelector } from "reselect";
import moment from "moment";

const slice = createSlice({
  name: "studentPlaylist",
  initialState: {
    isLoading: false,
    playlists: [],
    recommendations: [],
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
    },
    fetchRecommendations: state => {
      state.isLoading = true;
    },
    fetchRecommendationsSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.recommendations = payload;
    },
    fetchRecommendationsError: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    }
  }
});

export { slice };

function* fetchPlaylist() {
  try {
    const apiResponse = yield call(studentPlaylistApi.fetchStudentPlaylists);
    yield put(slice.actions.fetchStudentPlaylistSuccess(apiResponse));
  } catch (err) {
    yield put(slice.actions.fetchStudentPlaylistFailure(err?.data?.message));
    console.error("ERROR WHILE FETCHING STUDENT PLAYLIST : ", err);
  }
}

function* fetchRecommendations() {
  try {
    const res = yield call(recommendationsApi.fetchRecommendations);
    yield put(slice.actions.fetchRecommendationsSuccess(res));
  } catch (err) {
    yield put(slice.actions.fetchRecommendationsError(err?.data));
    console.error("ERROR WHILE FETCHING STUDENT PLAYLIST : ", err);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.fetchStudentPlaylist, fetchPlaylist),
    yield takeEvery(slice.actions.fetchRecommendations, fetchRecommendations)
  ]);
}

const stateSelector = state => state.studentPlaylist;

export const getIsLoadingSelector = createSelector(
  stateSelector,
  state => state.isLoading
);

export const getRecommendationsSelector = createSelector(
  stateSelector,
  state => {
    //TODO update to return state.recommendations
    return [
      {
        userId: "1111111",
        groupId: "1111111",
        districtId: "1111111",
        status: "1111111",
        updatedAt: "1583912632165",
        createdAt: "1583912632165",
        referenceId: "1111111",
        referenceType: "1111111",
        referenceName: "1111111",
        recommendedResource: [
          {
            _id: "1111111",
            name: "assignment title 1",
            resourceType: "TEST",
            recommendationType: "PRACTICE",
            metadata: {
              standardIdentifiers: []
            }
          }
        ]
      },
      {
        userId: "1111111",
        groupId: "1111111",
        districtId: "1111111",
        status: "1111111",
        updatedAt: "1583164999891",
        createdAt: "1583164863419",
        referenceId: "1111111",
        referenceType: "1111111",
        referenceName: "1111111",
        recommendedResource: [
          {
            _id: "1111111",
            name: "assignment title 2",
            resourceType: "TEST",
            recommendationType: "CHALLENGE",
            metadata: {
              standardIdentifiers: []
            }
          }
        ]
      },
      {
        userId: "1111111",
        groupId: "1111111",
        districtId: "1111111",
        status: "1111111",
        updatedAt: "1583150002238",
        createdAt: "1583149309395",
        referenceId: "1111111",
        referenceType: "1111111",
        referenceName: "1111111",
        recommendedResource: [
          {
            _id: "1111111",
            name: "assignment title 3",
            resourceType: "TEST",
            recommendationType: "REVIEW",
            metadata: {
              standardIdentifiers: []
            }
          }
        ]
      }
    ];
  }
);

const formatDate = timeStamp => {
  //As the moment doesnt apply super script suffix for date do it manually here
  const formated = moment(parseInt(timeStamp)).format("ddd, MMMM Do , YYYY");
  const splitted = formated.split(" ");
  const [, , Do] = splitted;
  const date = parseInt(Do);
  const [_, suffix] = Do.split(date);
  splitted[2] = date + `<sup>${suffix}</sup>`;
  return splitted.join(" ");
};

export const getTransformedRecommendations = createSelector(
  getRecommendationsSelector,
  recommendations => {
    return recommendations.map(item => ({
      ...item,
      updatedAt: formatDate(item.updatedAt),
      createdAt: formatDate(item.createdAt)
    }));
  }
);
