import React from 'react'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { IconMagnify } from '@edulastic/icons'
import { EduIf } from '@edulastic/common'
import { Tooltip } from '../../../common/utils/helpers'
import { CalculatorIcon, CloseIcon, ToolBox, ToolButton } from './styled'

const Tools = ({
  changeTool,
  currentTool,
  calcTypes,
  handleMagnifier,
  enableMagnifier,
  showCalculator,
}) => (
  <ToolBox>
    <EduIf condition={showCalculator && !isEmpty(calcTypes)}>
      <Tooltip title="Calculator">
        <ToolButton
          active={currentTool === 1}
          onClick={() => changeTool(currentTool === 1 ? 0 : 1)}
        >
          <CalculatorIcon />
        </ToolButton>
      </Tooltip>
    </EduIf>
    <Tooltip>
      <ToolButton
        active={currentTool === 2}
        disabled
        onClick={() => changeTool(2)}
      >
        <CloseIcon />
      </ToolButton>
    </Tooltip>
    <Tooltip>
      <ToolButton
        active={enableMagnifier}
        onClick={handleMagnifier}
        id="magnifier-icon"
      >
        <IconMagnify />
      </ToolButton>
    </Tooltip>
  </ToolBox>
)

export default Tools

Tools.propTypes = {
  changeTool: PropTypes.func.isRequired,
  currentTool: PropTypes.number.isRequired,
}
