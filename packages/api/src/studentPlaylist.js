import API from "./utils/API";

const api = new API();
const prefix = "/user-playlist-activity";

const fetchStudentPlaylists = studentId =>
    api
        .callApi({
            url: `${prefix}`,
            method: "get"
        })
        .then(result => result.data.result);

export default {
    fetchStudentPlaylists
};