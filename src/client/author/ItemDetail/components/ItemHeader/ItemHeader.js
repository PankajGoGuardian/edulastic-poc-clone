import { white } from '@edulastic/colors'
import { MainHeader } from '@edulastic/common'
import { IconChevronLeft } from '@edulastic/icons'
import PropTypes from 'prop-types'
import React from 'react'
import { Back, LeftSide, RightSide } from './styled'

const ItemHeader = ({ title, children, link, style }) => {
  const renderIcon = () => {
    if (link) {
      return (
        <Back to={link.url}>
          <IconChevronLeft color={white} width={10} height={10} /> {link.text}
        </Back>
      )
    }
  }

  return (
    <MainHeader type="standard" headingText={title}>
      <RightSide style={style}>{children}</RightSide>
      <LeftSide>{renderIcon()}</LeftSide>
    </MainHeader>
  )
}

ItemHeader.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  link: PropTypes.any,
}

ItemHeader.defaultProps = {
  children: null,
  title: '',
  link: null,
}

export default ItemHeader
