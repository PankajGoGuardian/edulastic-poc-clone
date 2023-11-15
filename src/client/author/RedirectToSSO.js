import React, { useEffect } from 'react'
import { Spin } from 'antd'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import { setSignOutUrl } from '../common/utils/helpers'

const RedirectToSSO = () => {
  useEffect(() => {
    const { ssoLink } = queryString.parse(window.location.search)
    setSignOutUrl(ssoLink)
    window.location.replace(ssoLink)
  }, [])
  return (
    <div>
      <Spin />
    </div>
  )
}

export default withRouter(RedirectToSSO)
