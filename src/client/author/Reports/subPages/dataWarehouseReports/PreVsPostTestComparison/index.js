import React, { useRef, useEffect } from 'react'
import { StyledIframe } from '../../../common/styled'

import { SubHeader } from '../../../common/components/Header'
import navigation from '../../../common/static/json/navigation.json'

const PreVsPostTestComparison = ({
  breadcrumbData,
  isCliUser,
  updateNavigation,
  loc,
}) => {
  useEffect(() => {
    const navigationItems =
      navigation.navigation[navigation.locToData[loc].group]
    updateNavigation(navigationItems)
  }, [])
  const frameRef = useRef()
  return (
    <>
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser} />
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
        src="https://xd.adobe.com/embed/fb69fe2f-19fd-4d54-908e-553d7c045b99-ae3a/"
        title="Pre vs Post Test Comparison"
      />
    </>
  )
}

export default PreVsPostTestComparison
