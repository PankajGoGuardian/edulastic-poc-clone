import API from './utils/API'

const api = new API()

const fetchYoutubeVideos = ({ query, safeSearch, nextPageToken }) =>
  api
    .callApi({
      url: `/youtube/search`,
      method: 'post',
      data: { query, safeSearch, nextPageToken },
    })
    .then(({ data }) => data)

const fetchVideoDetails = ({ id }) =>
  api
    .callApi({
      url: `/youtube/video/${id}`,
      method: 'get',
    })
    .then(({ data }) => data)

export default {
  fetchYoutubeVideos,
  fetchVideoDetails,
}
