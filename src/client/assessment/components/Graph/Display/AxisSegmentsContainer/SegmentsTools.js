import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import {
  IconGraphPoint as IconPoint,
  IconBothIncludedSegment,
  IconBothNotIncludedSegment,
  IconOnlyLeftIncludedSegment,
  IconOnlyRightIncludedSegment,
  IconInfinityToIncludedSegment,
  IconIncludedToInfinitySegment,
  IconInfinityToNotIncludedSegment,
  IconNotIncludedToInfinitySegment,
} from '@edulastic/icons'

import {
  GraphToolbar,
  SegmentsToolBtn,
  SegmentsToolbarItem,
  ToolbarItemIcon,
} from './styled'
import { ifZoomed } from '../../../../../common/utils/helpers'

const SegmentsTools = ({
  tool,
  onSelect,
  fontSize,
  toolbar,
  vertical,
  theme,
}) => {
  const segmentsTools = useMemo(
    () => [
      'segments_point',
      'segment_both_point_included',
      'segment_both_points_hollow',
      'segment_left_point_hollow',
      'segment_right_point_hollow',
      'ray_left_direction',
      'ray_right_direction',
      'ray_left_direction_right_hollow',
      'ray_right_direction_left_hollow',
    ],
    []
  )

  const uiTools = useMemo(
    () =>
      (toolbar?.length ? toolbar : segmentsTools).map((item, index) => ({
        name: item,
        index,
        groupIndex: -1,
      })),
    [toolbar]
  )

  const iconsByToolName = useMemo(
    () => ({
      segments_point: () => <IconPoint width={14} height={14} />,
      segment_both_point_included: () => (
        <IconBothIncludedSegment width={50} height={14} />
      ),
      segment_both_points_hollow: () => (
        <IconBothNotIncludedSegment width={50} height={14} />
      ),
      segment_left_point_hollow: () => (
        <IconOnlyRightIncludedSegment width={50} height={14} />
      ),
      segment_right_point_hollow: () => (
        <IconOnlyLeftIncludedSegment width={50} height={14} />
      ),
      ray_left_direction: () => (
        <IconInfinityToIncludedSegment width={50} height={14} />
      ),
      ray_right_direction: () => (
        <IconIncludedToInfinitySegment width={50} height={14} />
      ),
      ray_left_direction_right_hollow: () => (
        <IconInfinityToNotIncludedSegment width={50} height={14} />
      ),
      ray_right_direction_left_hollow: () => (
        <IconNotIncludedToInfinitySegment width={50} height={14} />
      ),
    }),
    []
  )

  const isActiveTool = (uiTool) => {
    if (uiTool.index === tool.index && uiTool.groupIndex === tool.groupIndex) {
      return 'active'
    }
    return ''
  }

  const onClickSegmentsTool = (uiTool) => () => onSelect(uiTool)

  const getIconTemplate = (toolName = 'segments_point') =>
    iconsByToolName[toolName] ? iconsByToolName[toolName]() : ''

  const getStyle = (_theme, _fontSize) => {
    let fontSizeValue = _fontSize
    if (fontSizeValue.includes('px')) {
      fontSizeValue = parseInt(fontSizeValue, 10)
    }
    if (ifZoomed(_theme?.zoomLevel)) {
      return {
        width: 'auto',
        padding: '0px 10px',
        zoom: _theme?.widgets?.graphPlacement?.toolsZoom,
      }
    }

    return !vertical
      ? {
          width: fontSizeValue > 20 ? 105 : 93,
        }
      : {}
  }

  const toolBtnStyle = getStyle(theme, fontSize)
  const zoomLevel = theme?.zoomLevel || localStorage.getItem('zoomLevel')

  return (
    <GraphToolbar
      data-cy="segmentsToolbar"
      fontSize={fontSize}
      vertical={vertical}
    >
      {uiTools.map(
        (uiTool, i) =>
          !uiTool.group && (
            <SegmentsToolBtn
              style={toolBtnStyle}
              zoomLevel={zoomLevel}
              className={isActiveTool(uiTool)}
              onClick={onClickSegmentsTool(uiTool)}
              key={`segments-tool-btn-${i}`}
            >
              <SegmentsToolbarItem>
                <ToolbarItemIcon
                  className="tool-btn-icon"
                  data-cy={uiTool.name}
                >
                  {getIconTemplate(uiTool.name)}
                </ToolbarItemIcon>
              </SegmentsToolbarItem>
            </SegmentsToolBtn>
          )
      )}
    </GraphToolbar>
  )
}

SegmentsTools.propTypes = {
  tool: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  vertical: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  fontSize: PropTypes.number,
  toolbar: PropTypes.array,
}

SegmentsTools.defaultProps = {
  fontSize: 14,
  tool: {
    toolIndex: 0,
    innerIndex: 0,
    toolName: 'segmentsPoint',
  },
  toolbar: [],
}

export default withTheme(SegmentsTools)
