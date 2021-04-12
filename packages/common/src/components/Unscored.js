import React from 'react'
import { Tooltip } from 'antd'
import {
  inputBorder1,
  lightGreySecondary,
  tagTextColor,
} from '@edulastic/colors'
import styled from 'styled-components'
import propTypes from 'prop-types'
import { FlexContainer } from '../..'

const UnScored = ({ width, height, margin, fontSize, text, fontWeight }) => (
  <Tooltip title="Zero Point">
    <UnScoredBlock
      width={width}
      margin={margin}
      justifyContent="center"
      alignItems="center"
      fontSize={fontSize}
      fontWeight={fontWeight}
      height={height}
    >
      <span>{text}</span>
    </UnScoredBlock>
  </Tooltip>
)

UnScored.propTypes = {
  width: propTypes.string,
  height: propTypes.string,
  margin: propTypes.string,
  fontSize: propTypes.string,
  text: propTypes.string,
  fontWeight: propTypes.string,
}

UnScored.defaultProps = {
  width: '',
  height: '',
  margin: '',
  fontSize: '',
  text: 'Zero Point',
  fontWeight: '700',
}

export default UnScored

const UnScoredBlock = styled(FlexContainer)`
  border: 1px solid ${inputBorder1};
  background: ${lightGreySecondary};
  border-radius: 2px;
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};
  margin: ${({ margin }) => margin || ''};
  cursor: default;
  span {
    white-space: nowrap;
    color: ${tagTextColor};
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: ${({ fontSize }) => fontSize || ''};
    font-weight: ${({ fontWeight }) => fontWeight || 700};
  }
`
