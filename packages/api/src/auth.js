import qs from 'qs'
import API from './utils/API'

const api = new API()
const prefix = '/auth'

const login = (data) =>
  api
    .callApi({
      url: `${prefix}/login`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const signup = (data) =>
  api
    .callApi({
      url: `${prefix}/signup`,
      method: 'post',
      data,
    })
    .then((result) => result.data)

const signupWithGoogle = () =>
  api.callApi({
    url: `${prefix}/login-google`,
    method: 'post',
  })

const getGoogleAuth = () =>
  api.callApi({
    url: `${prefix}/googleLoginOAuth`,
    method: 'post',
  })

const checkUserExist = (data) =>
  api
    .callApi({
      url: `${prefix}/user/exist`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const googleLogin = (params) =>
  api
    .callApi({
      url: `${prefix}/login-google`,
      method: 'get',
      params,
    })
    .then((result) => result.data.result)

const cleverLogin = () =>
  api
    .callApi({
      url: `${prefix}/login-clever`,
      method: 'get',
    })
    .then((result) => result.data.result)

const atlasLogin = (params) =>
  api
    .callApi({
      url: `${prefix}/login-atlas`,
      method: 'get',
      params,
      paramsSerializer: (_params) => qs.stringify(_params),
    })
    .then((result) => result.data.result)

const newselaLogin = (params) =>
  api
    .callApi({
      url: `${prefix}/login-newsela`,
      method: 'get',
      params,
      paramsSerializer: (_params) => qs.stringify(_params),
    })
    .then((result) => result.data.result)

const msoLogin = () =>
  api
    .callApi({
      url: `${prefix}/login-mso`,
      method: 'get',
    })
    .then((result) => result.data.result)

const googleSSOLogin = (data) =>
  api
    .callApi({
      url: `${prefix}/callback-sso/google`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const cleverSSOLogin = (data) =>
  api
    .callApi({
      url: `${prefix}/callback-sso/clever`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const atlasSSOLogin = (data) =>
  api
    .callApi({
      url: `${prefix}/callback-sso/atlas`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const msoSSOLogin = (data) =>
  api
    .callApi({
      url: `${prefix}/callback-sso/mso`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const V1Redirect = (id) =>
  api
    .callApi({
      url: `${prefix}/fwd?id=${id}`,
    })
    .then((result) => result.data)

const validateClassCode = (params) =>
  api
    .callApi({
      url: `${prefix}/class-code/validate/`,
      params,
    })
    .then((result) => result.data.result)

const getInvitedUserDetails = (params) =>
  api
    .callApi({
      url: `${prefix}/invite-teacher`,
      params,
    })
    .then((result) => result.data.result)

const updateInvitedUserDetails = (data) =>
  api
    .callApi({
      url: `${prefix}/invite-teacher`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const newselaSSOLogin = (data) =>
  api
    .callApi({
      url: `${prefix}/callback-sso/newsela`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const wordPressLoginData = (data) =>
  api
    .callApi({
      url: `user/wp`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const verifyEmail = ({ vc }) =>
  api
    .callApi({
      url: `${prefix}/verify/${vc}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const sendEmailVerificationLink = (data) =>
  api
    .callApi({
      url: `${prefix}/verify`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const getExternalUser = (params) =>
  api
    .callApi({
      url: `${prefix}/external`,
      method: 'get',
      params,
    })
    .then((result) => result.data.result)

export default {
  login,
  signup,
  getGoogleAuth,
  googleLogin,
  googleSSOLogin,
  cleverSSOLogin,
  atlasSSOLogin,
  cleverLogin,
  atlasLogin,
  msoLogin,
  msoSSOLogin,
  checkUserExist,
  signupWithGoogle,
  V1Redirect,
  validateClassCode,
  getInvitedUserDetails,
  updateInvitedUserDetails,
  newselaSSOLogin,
  newselaLogin,
  wordPressLoginData,
  verifyEmail,
  sendEmailVerificationLink,
  getExternalUser,
}
