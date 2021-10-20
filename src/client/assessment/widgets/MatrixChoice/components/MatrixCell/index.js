import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Checkbox, Radio } from 'antd'

import { Wrapper } from './styled/Wrapper'
import { InlineLabel } from './styled/InlineLabel'
import CrossIcon from '../../../../components/CrossIcon'

const MatrixCell = ({
  label,
  type,
  correct,
  isMultiple,
  checked,
  onChange,
  smallSize,
  isPrintPreview,
  children,
  tool,
  showCrossIcon,
  hovered,
  onMouseEnter,
  onMouseLeave,
}) => {
  let input

  if (isMultiple) {
    input = <StyledCheckbox tabIndex="-1" checked={checked} />
  } else {
    input = <StyledRadio tabIndex="-1" checked={checked} />
  }

  return (
    <Wrapper
      smallSize={smallSize}
      correct={checked && correct}
      isPrintPreview={isPrintPreview}
      onClick={onChange}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onlySpaceKey
      tool={tool}
    >
      {input}
      {type === 'inline' && (
        <InlineLabel
          dangerouslySetInnerHTML={{ __html: label }}
          className="inline-label"
        />
      )}
      {children}
      {showCrossIcon && <CrossIcon hovered={hovered} />}
    </Wrapper>
  )
}

MatrixCell.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  correct: PropTypes.any.isRequired,
  isMultiple: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  children: PropTypes.object,
}

MatrixCell.defaultProps = {
  smallSize: false,
  children: null,
}

export default MatrixCell

const StyledCheckbox = styled(Checkbox)`
  margin-left: 8px;
  border-color: red;
`

const StyledRadio = styled(Radio)`
  margin-left: 8px;
  .ant-radio-checked .ant-radio-inner {
    border-color: ${(props) =>
      props.theme.widgets.matrixChoice.inlineLabelColor};
    &:after {
      background-color: ${(props) =>
        props.theme.widgets.matrixChoice.inlineLabelColor};
    }
  }
`
