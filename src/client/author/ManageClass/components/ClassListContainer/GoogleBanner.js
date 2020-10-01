import React, { useState, useEffect } from 'react'

import { Button } from 'antd'
import { themeColor, white } from '@edulastic/colors'
import { BannerDiv } from './styled'

const GoogleBanner = ({
  syncClassLoading,
  showBanner = false,
  setShowDetails,
}) => {
  if (!showBanner) return ''
  return (
    <BannerDiv syncClassLoading={syncClassLoading}>
      <span
        style={{ marginLeft: 'auto', marginRight: 'auto', padding: '5px 10px' }}
      >
        Google Classroom Import{' '}
        {syncClassLoading ? 'in Progress' : 'is Complete'}
      </span>
      {!syncClassLoading && (
        <Button
          style={{
            backgroundColor: themeColor,
            color: white,
            padding: '3px 30px 3px',
          }}
          onClick={() => setShowDetails(true)}
        >
          {' '}
          Show Details{' '}
        </Button>
      )}
    </BannerDiv>
  )
}

export default GoogleBanner
