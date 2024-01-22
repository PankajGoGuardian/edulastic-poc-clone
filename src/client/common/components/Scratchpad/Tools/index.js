import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { notification } from '@edulastic/common'
import { drawTools } from '@edulastic/constants'
import MainToolBox from './MainToolBox'
import SubToolBox from './SubToolBox'
import { updateScratchpadAction, updateEditModeAction } from '../duck'
import { ToolBoxContainer } from './styled'

const Tools = (props) => {
  const {
    scratchData,
    updateScratchpad,
    editScratchpad,
    isDropDownInUse,
    t: i18Translate,
  } = props
  const {
    fillColor,
    lineWidth,
    lineColor,
    fontSize,
    fontFamily,
    fontColor,
    deleteMode,
    activeMode,
    selectedNodes,
    canRedo,
    canUndo,
  } = scratchData
  const onClickEditingButton = (mode) => {
    editScratchpad({ editMode: mode })
  }

  const onChangeTool = (value) => {
    const data = {}
    if (value === drawTools.UNDO_TOOL || value === drawTools.REDO_TOOL) {
      return onClickEditingButton(value)
    }

    if (value === drawTools.DELETE_TOOL) {
      data.deleteMode = !deleteMode
      data.activeMode = ''
    } else if (activeMode === value) {
      data.activeMode = ''
    } else {
      data.activeMode = value
      data.deleteMode = false
    }
    if (
      value === drawTools.DRAW_BREAKING_LINE ||
      value === drawTools.DRAW_CURVE_LINE
    ) {
      notification({
        type: 'info',
        messageKey: 'pleaseDoubleClickToStopDrawing',
      })
    }
    updateScratchpad(data)
  }

  const onChangeOption = (prop, value) => {
    updateScratchpad({ ...scratchData, [prop]: value })
  }

  return (
    <ToolBoxContainer
      alignItems="stretch"
      flexDirection="column"
      isDropDownInUse={isDropDownInUse}
    >
      <PerfectScrollbar options={{ suppressScrollY: true }}>
        <MainToolBox
          onChangeTool={onChangeTool}
          deleteMode={deleteMode}
          activeMode={activeMode}
          canRedo={canRedo}
          canUndo={canUndo}
        />
        <SubToolBox
          activeMode={activeMode}
          fillColor={fillColor}
          lineWidth={lineWidth}
          lineColor={lineColor}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontColor={fontColor}
          selectedNodes={selectedNodes}
          onChangeOption={onChangeOption}
          onClickEditBtn={onClickEditingButton}
          i18Translate={i18Translate}
        />
      </PerfectScrollbar>
    </ToolBoxContainer>
  )
}

Tools.propTypes = {
  scratchData: PropTypes.object.isRequired,
  isDropDownInUse: PropTypes.bool,
}

Tools.defaultProps = {
  isDropDownInUse: false,
}

const enhance = compose(
  withNamespaces('student'),
  connect(
    (state) => ({
      scratchData: state.scratchpad,
      isDropDownInUse: state.ui.isDropDownInUse,
    }),
    {
      updateScratchpad: updateScratchpadAction,
      editScratchpad: updateEditModeAction,
    }
  )
)

export default enhance(Tools)
