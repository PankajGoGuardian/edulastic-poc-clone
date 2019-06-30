import API from "./utils/API";

const api = new API();
const prefix = "/auth";

const login = data =>
  api
    .callApi({
      url: `${prefix}/login`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const signup = data =>
  api
    .callApi({
      url: `${prefix}/signup`,
      method: "post",
      data
    })
    .then(result => result.data);

const signupWithGoogle = () =>
  api.callApi({
    url: `${prefix}/login-google`,
    method: "post"
  });

const getGoogleAuth = () =>
  api.callApi({
    url: `${prefix}/googleLoginOAuth`,
    method: "post"
  });

const checkUserExist = data =>
  api
    .callApi({
      url: `${prefix}/user/exist`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const googleLogin = params =>
  api
    .callApi({
      url: `${prefix}/login-google`,
      method: "get",
      params
    })
    .then(result => result.data.result);

const cleverLogin = () =>
  api
    .callApi({
      url: `${prefix}/login-clever`,
      method: "get"
    })
    .then(result => result.data.result);

const msoLogin = params =>
  api
    .callApi({
      url: `${prefix}/login-mso`,
      method: "get",
      params
    })
    .then(result => result.data.result);

const googleSSOLogin = data =>
  api
    .callApi({
      url: `${prefix}/callback-sso/google`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const cleverSSOLogin = data =>
  api
    .callApi({
      url: `${prefix}/callback-sso/clever`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const msoSSOLogin = data =>
  api
    .callApi({
      url: `${prefix}/callback-sso/mso`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const V1Redirect = id =>
  api
    .callApi({
      url: `${prefix}/fwd?id=${id}`
    })
    .then(result => result.data);

export default {
  login,
  signup,
  getGoogleAuth,
  googleLogin,
  googleSSOLogin,
  cleverSSOLogin,
  cleverLogin,
  msoLogin,
  msoSSOLogin,
  checkUserExist,
  signupWithGoogle,
  V1Redirect
};
