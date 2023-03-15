import { Typography } from 'antd'
import React from 'react'
import { DashedLine, SectionLabelWrapper } from '../styled'

const SectionLabel = (props) => {
  const { children, ...restProps } = props
  return (
    <SectionLabelWrapper {...restProps}>
      <Typography.Title style={{ margin: 0 }} level={3}>
        {children}
      </Typography.Title>
      <DashedLine />
    </SectionLabelWrapper>
  )
}

export default SectionLabel
