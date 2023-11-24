import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FlexContainer } from '@edulastic/common'
import { white } from '@edulastic/colors'
import {
  IconLogoCompact,
  IconPearAssessLogoCompact,
  IconPearAssessLogoCompactOnDarkBg,
} from '@edulastic/icons'
import { Tooltip } from 'antd'
import {
  MAX_MOBILE_WIDTH,
  IPAD_PORTRAIT_WIDTH,
  IPAD_LANDSCAPE_WIDTH,
} from '../../constants/others'
import { isPearDomain } from '../../../../utils/pear'

const LogoCompact = ({ isMobile, buttons, title, fillColor, isBgLight }) => (
  <LogoCompactContainer>
    {isPearDomain ? (
      isBgLight ? (
        <LogoPearAssessCompactIcon marginRight="12px" />
      ) : (
        <LogoPearAssessCompactIconOnDarkBg marginRight="12px" />
      )
    ) : (
      <LogoCompactIcon marginRight="12px" color={fillColor} />
    )}
    {isMobile && buttons}
    {title && (
      <Tooltip title={title}>
        <PlayerTitle>{title}</PlayerTitle>
      </Tooltip>
    )}
  </LogoCompactContainer>
)

LogoCompact.propTypes = {
  isMobile: PropTypes.bool,
  buttons: PropTypes.any,
  title: PropTypes.string,
  fillColor: PropTypes.string,
}

LogoCompact.defaultProps = {
  isMobile: false,
  buttons: null,
  title: null,
  fillColor: white,
}

const LogoCompactContainer = styled(FlexContainer)`
  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    width: 100%;
    justify-content: space-between;
  }
`

const LogoPearAssessCompactIcon = styled(IconPearAssessLogoCompact)`
  width: 31px;
  height: 31px;
  margin-right: ${({ marginRight }) => marginRight};
`
const LogoPearAssessCompactIconOnDarkBg = styled(
  IconPearAssessLogoCompactOnDarkBg
)`
  width: 31px;
  height: 31px;
  margin-right: ${({ marginRight }) => marginRight};
`

const LogoCompactIcon = styled(IconLogoCompact)`
  fill: ${({ color }) => color};
  width: 21px;
  height: 21px;
  margin-right: ${({ marginRight }) => marginRight};

  &:hover {
    fill: ${({ color }) => color};
  }
`

const PlayerTitle = styled.h1`
  max-width: 350px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  zoom: ${({ theme }) => theme?.widgets?.assessmentPlayers?.textZoom};
  font-size: ${(props) =>
    props.theme.widgets.assessmentPlayerSimple.headerTitleFontSizeLarge};
  font-weight: bold;
  margin: 0;
  margin-right: 24px;
  color: ${white};
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH}px) {
    font-size: ${(props) =>
      props.theme.widgets.assessmentPlayerSimple.headerFilterFontSizeSmall};
  }
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    max-width: 160px;
  }
  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    display: none;
  }
`

export default LogoCompact
