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

const SsoAuth = ({ user, redirectUrl }) => {
  const [loading, setLoading] = useState(true)
  const [responseData, setResponseData] = useState('')
  useEffect(() => {
    // call api and get signature and data
    if (user && redirectUrl) {
      authApi
        .wordPressLoginData({})
        .then((response) => {
          setLoading(false)
          setResponseData(JSON.stringify(response))
          // post the signature to the third party
        })
        .catch((error) => {
          setLoading(false)
          setResponseData(JSON.stringify(error))
        })
        .finally(() => {})
    }
    return () => {
      // on component unmount
    }
  }, [])
  console.log(responseData)
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
