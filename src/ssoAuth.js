import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import 'font-awesome/css/font-awesome.css'
import 'antd/dist/antd.css'
import './client/index.css'
import { withRouter } from 'react-router'
import { get } from 'lodash'
import { compose } from 'redux'
import { authApi } from '@edulastic/api'
import { Spin } from 'antd'

const SsoAuth = ({ user, redirectUrl, contentId, action }) => {
  const [loading, setLoading] = useState(true)
  const [responseData, setResponseData] = useState('Something went wrong.')
  useEffect(() => {
    // call api and get signature and data
    if (user && redirectUrl) {
      authApi
        .wordPressLoginData({ redUrl: redirectUrl, cId: contentId, action })
        .then((response) => {
          setLoading(false)
          // post the signature to the third party
          if (response.redirectUrl) {
            setResponseData('Redirecting ...')
            window.location.href = response.redirectUrl
          } else {
            setResponseData('Failed to get redirect url ...')
          }
        })
        .catch(() => {
          setLoading(false)
          setResponseData('Failed to get redirect url ...')
        })
        .finally(() => {
          // remove the storage data
          localStorage.removeItem('thirdPartyOAuth')
          localStorage.removeItem('thirdPartyOAuthRedirectUrl')
        })
    }
    return () => {
      // on component unmount
    }
  }, [])
  return loading ? (
    <Spin />
  ) : (
    <>
      <p>{responseData}</p>
    </>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      user: get(state, 'user', null),
    }),
    {}
  )
)

export default enhance(SsoAuth)
