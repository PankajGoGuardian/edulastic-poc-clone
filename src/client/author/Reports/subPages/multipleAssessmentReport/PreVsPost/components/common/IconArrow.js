import { EduIf } from '@edulastic/common'
import React from 'react'
import { ArrowLarge, ArrowSmall } from '../../common/styledComponents'

const IconArrow = ({ value, size }) => {
  const type = value < 0 ? 'top' : value > 0 ? 'bottom' : ''
  return (
    <>
      <EduIf condition={size === 'large'}>
        <ArrowLarge type={type} />
      </EduIf>
      <EduIf condition={size === 'small'}>
        <ArrowSmall type={type} />
      </EduIf>
    </>
  )
}

export default IconArrow
