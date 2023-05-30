import React, { useEffect } from 'react'
import { Spin } from 'antd'
import { withRouter } from 'react-router'
import { testsApi, TokenStorage } from '@edulastic/api'
import { notification } from '@edulastic/common'
import qs from 'qs'
import { compose } from 'redux'
import { connect } from 'react-redux'
import AppConfig from '../../app-config'

const RedirectToTest = ({
  location: { search },
  history,
  user,
  v1Id: v1IdFromProps,
}) => {
  const handleFailed = (e) => {
    console.log(e)
    notification({ type: 'error', msg: 'Unable to find the associated test.' })
    history.replace('/author/test')
  }

  const decrypt = (decoded) => {
    try {
      const salted = BigInt(decoded) ^ BigInt(AppConfig.v1RedirectDecryptSalt)
      return (
        ((BigInt(0x0000ffff) & salted) << BigInt(16)) |
        ((BigInt(0xffff0000) & salted) >> BigInt(16))
      )
    } catch (e) {
      handleFailed('Missing Salt Key')
    }
  }

  const redirectToUrl = (url) => {
    history.push(url)
    if (v1IdFromProps) {
      window.location.reload(url)
    }
  }

  const redirectToTest = (testId) => {
    if (!testId) {
      handleFailed('no test found')
    }
    if (!user?.authenticating || !TokenStorage.getAccessToken()) {
      // not authenticated user flow
      if (
        window.location.pathname.includes('demo/assessmentPreview') ||
        window.location.host.startsWith('preview')
      ) {
        redirectToUrl(`/public/test/${testId}`)
      } else {
        redirectToUrl(`/public/view-test/${testId}`)
      }
    } else {
      redirectToUrl(`/author/tests/${testId}`)
    }
  }

  useEffect(() => {
    const { eAId, aId } = qs.parse(search, { ignoreQueryPrefix: true })
    let v1Id = aId || v1IdFromProps

    if (eAId) {
      try {
        const decodedData = decodeURIComponent(eAId)
        v1Id = Number(decrypt(atob(decodedData)))
      } catch (e) {
        v1Id = eAId
      }
    }

    if (!isNaN(v1Id)) {
      try {
        testsApi
          .getByV1Id(v1Id)
          .then(({ _id } = {}) => {
            redirectToTest(_id)
          })
          .catch(handleFailed)
      } catch (e) {
        console.warn('TestId cannot be null ', e)
        handleFailed()
      }
    } else {
      redirectToTest(v1Id)
    }
  }, [])

  return (
    <div>
      <Spin />
    </div>
  )
}

export default compose(
  withRouter,
  connect(({ user }) => ({ user: user?.user }))
)(RedirectToTest)
