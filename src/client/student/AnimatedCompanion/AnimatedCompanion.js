import React from 'react'
import IconPearAssessLogoCompact from '@edulastic/icons/src/IconPearAssessLogoCompact'
import styled from 'styled-components'
import { Popconfirm } from 'antd'

const AnimatedCompanion = () => {
  return (
    <AnimatedCompanionWrapper>
      <Popconfirm
        placement="rightTop"
        title={<div> other options</div>}
        okText="Yes"
        cancelText="No"
      >
        <IconPearAssessLogoCompact width="50px" height="50px" />
      </Popconfirm>
    </AnimatedCompanionWrapper>
  )
}

export default AnimatedCompanion

const AnimatedCompanionWrapper = styled.div`
  position: absolute;
  top: 90%;
  right: 5%;
  z-index: 99999;
`
