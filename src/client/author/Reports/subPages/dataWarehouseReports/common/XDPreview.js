import React, { useRef, useEffect } from 'react'
import { StyledIframe } from '../../../common/styled'
import { SubHeader } from '../../../common/components/Header'
import navigation from '../../../common/static/json/navigation.json'

const XDPreview = ({
  url,
  title,
  breadcrumbData,
  isCliUser,
  updateNavigation,
  loc,
}) => {
  console.log(url)
  useEffect(() => {
    const navigationItems =
      navigation.navigation[navigation.locToData[loc].group]
    updateNavigation(navigationItems)
  }, [])

  const frameRef = useRef()
  return (
    <>
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="basline"
      />
      <StyledIframe
        width="100%"
        height="100%"
        ref={frameRef}
        id=""
        frameborder="0"
        allowtransparency="true"
        allowfullscreen="true"
        marginheight="0"
        marginwidth="0"
        style={{ display: 'block', width: '100%', height: '100%' }}
        src={url}
        title={title}
      />
    </>
  )
}

export default XDPreview
