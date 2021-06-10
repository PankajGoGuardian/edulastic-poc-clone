import API from './utils/API'

const api = new API()
const prefix = '/item-bank'

const createNewCollection = (data) =>
  api
    .callApi({ url: `${prefix}/`, method: 'post', data })
    .then((result) => result.data.result)

const editCollection = (data) =>
  api
    .callApi({ url: `${prefix}/${data.id}`, method: 'put', data: data.data })
    .then((result) => result.data.result)

const getCollectionList = () => {
  return api
    .callApi({
      url: `${prefix}`,
      method: 'get',
    })
    .then((result) => result.data)
}

const addPermission = (data) =>
  api
    .callApi({
      url: `${prefix}/${data.bankId}/add-permission`,
      method: 'post',
      data: data.data,
    })
    .then((result) => result.data.result)

const editPermission = (data) =>
  api
    .callApi({
      url: `${prefix}/${data.bankId}/edit-permission/${data.id}`,
      method: 'put',
      data: data.data,
    })
    .then((result) => result.data.result)

const deletePermission = ({ bankId, id }) =>
  api
    .callApi({
      url: `${prefix}/${bankId}/delete-permission/${id}`,
      method: 'delete',
    })
    .then((result) => result.data.data)

const getPermissions = ({ _id, paginationData }) =>
  api
    .callApi({
      url: `${prefix}/${_id}/permissions`,
      method: 'get',
      params: paginationData,
    })
    .then((result) => result.data)

const organizationSearch = (data) =>
  api
    .callApi({
      url: `${prefix}/organisation-entities-search`,
      method: 'post',
      data,
    })
    .then((result) => result.data)

const saveItemsToBucket = ({ itemBankId, _id, contentType, contentIds }) => {
  return api
    .callApi({
      url: `${prefix}/${itemBankId}/bucket/${_id}/add-content`,
      method: 'post',
      data: {
        contentType,
        contentIds,
      },
    })
    .then((result) => result.data)
}

export default {
  createNewCollection,
  editCollection,
  getCollectionList,
  addPermission,
  editPermission,
  deletePermission,
  getPermissions,
  organizationSearch,
  saveItemsToBucket,
}
