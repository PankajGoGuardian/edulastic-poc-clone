import API from './utils/API'

const api = new API()
const prefix = 'enrollment'

const fetch = (
  classId,
  isActiveStudents = false,
  getObservationCount = false
) =>
  api
    .callApi({
      url: `${prefix}/class/${classId}`,
      method: 'get',
      params: { isActiveStudents, getObservationCount },
    })
    .then((result) => result.data.result)

// fetch multiple classes by Ids
const fetchByIds = (classIds) => {
  const ids = classIds.join(',')
  return api
    .callApi({
      url: `${prefix}/class`,
      method: 'get',
      params: { ids },
    })
    .then((result) => result.data.result)
}

const create = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const addStudent = (data) =>
  api.callApi({
    url: `${prefix}/user`,
    method: 'post',
    data,
  })

const removeStudents = (data) =>
  api.callApi({
    url: `${prefix}/student`,
    method: 'delete',
    data,
  })

const addEnrolMultiStudents = ({ classId, data }) =>
  api.callApi({
    url: `${prefix}/${classId}/students`,
    method: 'post',
    data,
  })
const SearchAddEnrolMultiStudents = (data) =>
  api.callApi({
    url: `${prefix}/student`,
    method: 'post',
    data,
  })
const fetchStudentEnrollClass = () =>
  api.callApi({
    url: `${prefix}/student`,
    method: 'get',
  })
const fetchClassEnrollmentUsers = (data) =>
  api
    .callApi({
      url: `search/enrollment`,
      data,
      method: 'post',
    })
    .then((result) => result.data)

const removeUsers = (data) =>
  api.callApi({
    url: `${prefix}`,
    method: 'delete',
    data,
  })
export default {
  fetch,
  create,
  fetchByIds,
  addStudent,
  removeStudents,
  addEnrolMultiStudents,
  SearchAddEnrolMultiStudents,
  fetchStudentEnrollClass,
  fetchClassEnrollmentUsers,
  removeUsers,
}
