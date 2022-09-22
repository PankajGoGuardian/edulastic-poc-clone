import React from 'react'
import { Input, Dropdown, Menu, Icon } from 'antd'

import { colors as colorConstants } from '@edulastic/constants'
import {
  StyledFormItem,
  ScoreColorSpan,
  StyledScoreDiv,
  StyledHiddenInput,
  StyledColorMenu,
  ScoreMenuColorSpan,
} from './styled'

class StandardsProficiencyEditableCell extends React.Component {
  constructor(props) {
    super(props)
    let selectedColor = ''
    if (this.props.dataIndex === 'color') {
      selectedColor = this.props.record.color
    }
    this.state = {
      colorValidate: {
        validateStatus: 'success',
        validateMsg: '',
      },
      selectedColor,
    }
  }

  checkLevelUique = (rule, value, callback) => {
    const dataSource = this.props.dataSource.filter(
      (item) => item.key !== this.props.record.key
    )
    const sameNameRow = dataSource.filter((item) => item.masteryLevel === value)
    if (sameNameRow.length <= 0) {
      callback()
      return
    }
    callback('Name should be unique.')
  }

  checkShortNameUnique = (rule, value, callback) => {
    if (value.length > 2) {
      callback('Short name should not be greater than 2 characters')
      return
    }
    const dataSource = this.props.dataSource.filter(
      (item) => item.key !== this.props.record.key
    )
    const sameShortNameRow = dataSource.filter(
      (item) => item.shortName === value
    )
    if (sameShortNameRow.length <= 0) {
      callback()
      return
    }

    callback('Short name should be unique.')
  }

  checkPerThre = (rule, value, callback) => {
    if (value.length == 0) {
      callback()
      return
    }

    const { dataSource, record } = this.props
    if (record.score == 1) {
      callback()
      return
    }

    const isnum = /^\d+$/.test(value)
    if (!isnum) {
      callback('Please input number.')
    } else if (parseInt(value, 10) > 100) {
      callback('Should not exceed 100.')
    } else if (record.score === dataSource.length) {
      if (parseInt(value, 10) <= dataSource[1].threshold)
        callback(`Value should not be less then ${dataSource[1].threshold}.`)
      else {
        callback()
      }
    } else if (
      parseInt(value, 10) >=
      dataSource[dataSource.length - record.score - 1].threshold
    ) {
      callback(
        `Value should be less then ${
          dataSource[dataSource.length - record.score - 1].threshold
        }.`
      )
    } else if (
      parseInt(value, 10) <=
      dataSource[dataSource.length - record.score + 1].threshold
    ) {
      callback(
        `Value should not be less then ${
          dataSource[dataSource.length - record.score + 1].threshold
        }.`
      )
    } else {
      callback()
    }
  }

  checkColorUnique = (rule, value, callback) => {
    const dataSource = this.props.dataSource.filter(
      (item) => item.key !== this.props.record.key
    )
    const sameNameRow = dataSource.filter((item) => item.color === value)
    if (sameNameRow.length <= 0) {
      callback()
      return
    }
    callback('Color should be unique')
  }

  handleColorMenuClick = (e, form) => {
    form.setFieldsValue({ color: e.key })
    const dataSource = this.props.dataSource.filter(
      (item) => item.key !== this.props.record.key
    )
    const sameNameRow = dataSource.filter((item) => item.color === e.key)
    if (sameNameRow.length <= 0) {
      this.setState({
        colorValidate: {
          validateStatus: 'success',
          validateMsg: '',
        },
      })
    } else {
      this.setState({
        colorValidate: {
          validateStatus: 'error',
          validateMsg: 'Color should be unique',
        },
      })
    }
    this.setState({ selectedColor: e.key })
  }

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      context,
      ...restProps
    } = this.props
    const { selectedColor, colorValidate } = this.state

    const colorMenuItems = []
    const colors = [...colorConstants.standardProficiencyColors]
    for (let i = 0; i < colors.length; i++) {
      colorMenuItems.push(
        <Menu.Item key={colors[i]}>
          <ScoreMenuColorSpan
            isActive={selectedColor === colors[i]}
            color={colors[i]}
          />
        </Menu.Item>
      )
    }

    return (
      <>
        {editing ? (
          <context.Consumer>
            {(form) => {
              const { getFieldDecorator } = form

              return (
                <td {...restProps}>
                  {inputType === 'shortName' && (
                    <StyledFormItem>
                      {getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: `Please Input ${title}!`,
                          },
                          {
                            validator: this.checkShortNameUnique,
                          },
                        ],
                        initialValue: record[dataIndex],
                      })(<Input />)}
                    </StyledFormItem>
                  )}
                  {inputType === 'threshold' && (
                    <StyledFormItem>
                      {getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: `Please Input ${title}!`,
                          },
                          { validator: this.checkPerThre },
                        ],
                        initialValue: record[dataIndex],
                      })(<Input disabled={record.score == 1} />)}
                    </StyledFormItem>
                  )}
                  {inputType === 'color' && (
                    <StyledFormItem
                      validateStatus={colorValidate.validateStatus}
                      help={colorValidate.validateMsg}
                    >
                      {getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: `Please Input ${title}!`,
                          },
                          { validator: this.checkColorUnique },
                        ],
                        initialValue: record[dataIndex],
                      })(<StyledHiddenInput />)}
                      <Dropdown
                        overlay={
                          <StyledColorMenu
                            onClick={(e) => this.handleColorMenuClick(e, form)}
                          >
                            {colorMenuItems}
                          </StyledColorMenu>
                        }
                        trigger={['click']}
                      >
                        <StyledScoreDiv>
                          <ScoreColorSpan color={selectedColor} />
                          <Icon type="down" />
                          {record.score}
                        </StyledScoreDiv>
                      </Dropdown>
                    </StyledFormItem>
                  )}

                  {inputType === 'masteryLevel' && (
                    <StyledFormItem>
                      {getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: `Please Input ${title}!`,
                          },
                          {
                            validator: this.checkLevelUique,
                          },
                        ],
                        initialValue: record[dataIndex],
                      })(<Input />)}
                    </StyledFormItem>
                  )}
                </td>
              )
            }}
          </context.Consumer>
        ) : (
          <td {...restProps}>{restProps.children}</td>
        )}
      </>
    )
  }
}

export default StandardsProficiencyEditableCell
