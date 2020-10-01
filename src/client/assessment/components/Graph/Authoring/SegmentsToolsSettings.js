import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import { Select } from 'antd'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import { Subtitle } from '../../../styled/Subtitle'
import { SelectWrapper, ToolSelect } from '../common/styled_components'
import DeleteButton from '../common/DeleteButton'
import { SelectInputStyled } from '../../../styled/InputStyles'
import { CustomStyleBtn } from '../../../styled/ButtonStyles'

class SegmentsToolsSettings extends Component {
  controls = [
    { value: 'segments_point', label: 'Point' },
    { value: 'segment_both_point_included', label: 'Segment' },
    {
      value: 'segment_both_points_hollow',
      label: 'Segment with both hollow points',
    },
    {
      value: 'segment_left_point_hollow',
      label: 'Segment with left hollow point',
    },
    {
      value: 'segment_right_point_hollow',
      label: 'Segment with right hollow point',
    },
    { value: 'ray_left_direction', label: 'Left ray' },
    { value: 'ray_right_direction', label: 'Right ray' },
    {
      value: 'ray_left_direction_right_hollow',
      label: 'Left ray with hollow point',
    },
    {
      value: 'ray_right_direction_left_hollow',
      label: 'Right ray with hollow point',
    },
  ]

  addTool = (groupIndex) => {
    const { toolbar, onChange } = this.props
    const newTools = [...toolbar.tools]
    const areToolsArray = Array.isArray(toolbar.tools[groupIndex])
    const defaultOption =
      this.controls && this.controls[0] ? this.controls[0].value : ''

    if (toolbar.tools.length <= 3) {
      if (groupIndex !== undefined && areToolsArray) {
        newTools[groupIndex].push(defaultOption)
      } else {
        newTools.push(defaultOption)
      }

      onChange({
        ...toolbar,
        tools: newTools,
      })
    }
  }

  deleteTool = (index, groupIndex) => {
    const { toolbar, onChange } = this.props

    const newTools = [...toolbar.tools]
    const areToolsArray = Array.isArray(toolbar.tools[groupIndex])

    if (groupIndex !== undefined && areToolsArray) {
      newTools[groupIndex].splice(index, 1)
    } else {
      newTools.splice(index, 1)
    }

    onChange({
      ...toolbar,
      tools: newTools,
    })
  }

  handleSelect = (index, newItemVal, groupIndex) => {
    const { toolbar, onChange } = this.props

    const newTools = [...toolbar.tools]

    if (groupIndex !== undefined) {
      newTools[groupIndex][index] = newItemVal
    } else {
      newTools[index] = newItemVal
    }

    onChange({
      ...toolbar,
      tools: newTools,
    })
  }

  renderAddToolBtn = (groupIndex) => (
    <CustomStyleBtn onClick={() => this.addTool(groupIndex)}>
      ADD TOOL
    </CustomStyleBtn>
  )

  renderSingleToolsInDefaultGroup = () => {
    const { toolbar } = this.props
    const countOfSingleTools = toolbar.tools.filter((t) => !Array.isArray(t))
      .length

    return (
      <Col md={12} marginBottom={countOfSingleTools > 0 ? 20 : 0}>
        {toolbar.tools.map((tool, i) =>
          !Array.isArray(tool) ? (
            <React.Fragment key={`segments-tool-${i}`}>
              <ToolSelect>
                <Tool
                  value={tool}
                  options={this.controls}
                  selectWidth="100%"
                  index={i}
                  countOfSingleTools={countOfSingleTools}
                  onDelete={this.deleteTool}
                  onChange={this.handleSelect}
                />
              </ToolSelect>
            </React.Fragment>
          ) : null
        )}

        {this.renderAddToolBtn()}
      </Col>
    )
  }

  render() {
    const { t, title } = this.props

    return (
      <>
        <Subtitle id={getFormattedAttrId(`${title}-Toolbar`)}>Toolbar</Subtitle>
        <Row gutter={24}>{this.renderSingleToolsInDefaultGroup()}</Row>
      </>
    )
  }
}

SegmentsToolsSettings.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  toolbar: PropTypes.object.isRequired,
}

const enhance = compose(withNamespaces('assessment'))

export default enhance(SegmentsToolsSettings)

const Tool = (props) => {
  const {
    countOfSingleTools,
    options,
    isGroup,
    groupIndex,
    value,
    onChange,
    selectWidth,
    index,
    onDelete,
    deleteToolStyles,
  } = props

  const isNeedToShowDeleteButton = () => countOfSingleTools > 0 || isGroup

  const onSelectChange = (val) => {
    onChange(index, val, groupIndex)
  }

  return (
    <>
      <SelectWrapper>
        <SelectInputStyled
          data-cy="segmentTool"
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          style={{ width: selectWidth || '70%', height: '40px' }}
          onChange={onSelectChange}
          options={options}
          value={value}
        >
          {options.map((option) => (
            <Select.Option data-cy={option.value} key={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </SelectInputStyled>

        {isNeedToShowDeleteButton() && (
          <DeleteButton
            onDelete={() => {
              onDelete(index, groupIndex)
            }}
            deleteToolStyles={deleteToolStyles}
          />
        )}
      </SelectWrapper>
    </>
  )
}

Tool.propTypes = {
  countOfSingleTools: PropTypes.number.isRequired,
  options: PropTypes.array.isRequired,
  isGroup: PropTypes.bool,
  groupIndex: PropTypes.number,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  selectWidth: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  deleteToolStyles: PropTypes.object,
}

Tool.defaultProps = {
  deleteToolStyles: {},
  groupIndex: undefined,
  isGroup: false,
}
