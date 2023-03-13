import React from 'react'
import { SectionDescriptionWrapper } from '../styled'

const SectionDescription = (props) => {
  const { children, ...restProps } = props
  return (
    <SectionDescriptionWrapper {...restProps}>
      <p>{children}</p>
    </SectionDescriptionWrapper>
  )
}

export default SectionDescription
