/* eslint-disable max-classes-per-file */
import { sectionBorder, themeColor, white } from '@edulastic/colors'
import { CheckboxLabel, notification } from '@edulastic/common'
import { Col, Form, Icon, Input, InputNumber, Row, Slider } from 'antd'
import produce from 'immer'
import { get } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { colors as colorConstants } from '@edulastic/constants'
import ColorPicker from '@edulastic/common/src/components/ColorPickers'
import { ThemeButton } from '../../../src/components/common/ThemeButton'
import { getUserOrgId } from '../../../src/selectors/user'
import {
  createPerformanceBandAction,
  getPerformanceBandList,
  receivePerformanceBandAction,
  setPerformanceBandChangesAction,
  updatePerformanceBandAction,
} from '../../ducks'
import {
  PercentText,
  SaveAlert,
  StyledBottomDiv,
  StyledColFromTo,
  StyledDivCenter,
  StyledEnableContainer,
  StyledSaveButton,
  StyledTableContainer,
  StyledBandTable,
} from './styled'

const colorsList = [...colorConstants.performanceBandColors]

function Ellipsify({ children: text, limit }) {
  // needed to handle multibyte chars(unicode,emojis)
  const chars = [...text]
  if (chars.length <= limit) {
    return text
  }
  return `${chars.slice(0, limit - 3).join('')}...`
}

const FormItem = Form.Item
const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

const StyledSlider = styled(Slider)`
  margin: 0px;
  min-height: 20px;
  .ant-slider-rail,
  .ant-slider-track,
  .ant-slider-step {
    height: 10px;
    border-radius: 32px;
  }
  .ant-slider-rail {
    background-color: #e5e5e5;
  }
  .ant-slider-track,
  &:hover .ant-slider-track {
    background-color: #4e95f3;
  }
  .ant-slider-handle {
    height: 16px;
    width: 16px;
    margin-top: -3px;
    margin-left: -7px;
    border-color: #4e95f3;
  }
`

const StyledInputNumber = styled(InputNumber)`
  width: 60px;
  margin-right: 10px;
  margin-top: -5px;
`

const StyledAddBandButton = styled(ThemeButton)`
  border-radius: 4px;
  color: ${white};
  height: 34px;
  width: 159px;
  text-align: center;
  line-height: 34px;
  font-size: 11px;
`

const ColorBox = styled.div`
  width: 100%;
  height: 20px;
  box-sizing: border-box;
  border: 1px solid ${sectionBorder};
  margin-bottom: 4px;
  cursor: pointer;
  background-color: ${({ color }) => `${color}`};
`

const StyledIcon = styled(Icon)`
  vertical-align: middle;
  margin-top: -20px;
  padding: 0px 5px;
  font-size: 10px;
  cursor: pointer;
  path {
    fill: ${themeColor};
  }
`

const ColorPickerContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-top: 7;
`

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus()
      }
    })
  }

  save = (e) => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return
      }
      this.toggleEdit()
      handleSave({ ...record, ...values })
    })
  }

  saveToValue = (e) => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return
      }
      handleSave({ ...record, ...values })
    })
  }

  checkPrice = (rule, value, callback) => {
    const { dataSource, record } = this.props
    if (!Number.isNaN(value)) {
      const sameRow = dataSource.filter((item) => item.key === record.key)
      const sameDownRow = dataSource.filter(
        (item) => item.key === record.key + 1
      )
      if (sameRow[0].from < parseInt(value))
        callback(`To value should be less than ${sameRow[0].from}`)
      else if (sameDownRow[0].to + 1 > parseInt(value))
        callback(`To value shouldn't be less than ${sameDownRow[0].to}`)
      else if (parseInt(value) > 100 || parseInt(value) < 0)
        callback('Please input value between 0 and 100')
      else callback()
      return
    }
    callback('Please input value between 0 and 100')
  }

  changeBandName = (e) => {
    if (e.target.value.length > 150)
      e.target.value = e.target.value.slice(0, 150)
  }

  checkBandNameUnique = (rule, value, callback) => {
    const { record } = this.props
    const dataSource = this.props.dataSource.filter(
      (item) => item.key != record.key
    )

    const sameNameBand = dataSource.filter((item) => item.name === value)
    if (sameNameBand.length > 0)
      callback('Performance Band name should be unique.')
    else {
      callback()
    }
  }

  render() {
    const { editing } = this.state
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      toggleEditToValue,
      ...restProps
    } = this.props
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form
              if (dataIndex === 'to') {
                return toggleEditToValue ? (
                  <StyledEnableContainer>
                    <FormItem style={{ margin: 0 }}>
                      {form.getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: `${title} is required.`,
                          },
                          { validator: this.checkPrice },
                        ],
                        initialValue: parseInt(record[dataIndex]),
                      })(
                        <Input
                          ref={(node) => (this.toValueInput = node)}
                          onPressEnter={this.saveToValue}
                          onBlur={this.saveToValue}
                          autoFocus
                        />
                      )}
                    </FormItem>
                  </StyledEnableContainer>
                ) : (
                  <div className="editable-cell-value-wrap">
                    {restProps.children}
                  </div>
                )
              }
              return editing ? (
                <>
                  {dataIndex === 'name' && (
                    <FormItem style={{ margin: 0 }}>
                      {form.getFieldDecorator(dataIndex, {
                        rules: [
                          {
                            required: true,
                            message: `${title} is required.`,
                          },
                          { validator: this.checkBandNameUnique },
                        ],
                        initialValue: record[dataIndex],
                      })(
                        <Input
                          ref={(node) => (this.input = node)}
                          onPressEnter={this.save}
                          onBlur={this.save}
                          onChange={this.changeBandName}
                        />
                      )}
                    </FormItem>
                  )}
                </>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  onClick={this.toggleEdit}
                >
                  {restProps.children}
                </div>
              )
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    )
  }
}

export class PerformanceBandTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editingKey: -1,
      isChangeState: false,
    }
  }

  componentDidMount() {
    const { loadPerformanceBand, userOrgId } = this.props
    if (loadPerformanceBand) {
      loadPerformanceBand({ orgId: userOrgId })
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      dataSource: nextProps.dataSource,
      performanceBandId: nextProps.performanceBandId,
    }
  }

  setChanged = (v) => this.setState({ isChangeState: v })

  onClickFromTo = (e, key, keyName, value) => {
    const dataSource = [...this.state.dataSource]
    if (key == 0 && keyName === 'from') return
    if (key == dataSource.length - 1 && keyName === 'to') return

    const currentFromValue = parseInt(dataSource[key].from)
    const currentToValue = parseInt(dataSource[key].to)

    if (keyName === 'from') {
      const prevFromValue = parseInt(dataSource[key - 1]?.from)
      const prevToValue = parseInt(dataSource[key - 1]?.to)
      if (
        currentFromValue + value <= currentToValue ||
        currentFromValue + value >= prevFromValue - 1
      ) {
        return
      }
      dataSource[key].from = currentFromValue + value
      // we are updating older bands to new logic when user edits the band instead of a patch.
      // ref: https://goguardian.atlassian.net/browse/EV-42019?focusedCommentId=437923
      if (currentFromValue === prevToValue) {
        dataSource[key - 1].to = prevToValue + value + 1
      } else {
        dataSource[key - 1].to = prevToValue + value
      }
    }

    if (keyName === 'to') {
      const nextFromValue = parseInt(dataSource[key + 1]?.from)
      const nextToValue = parseInt(dataSource[key + 1]?.to)
      if (
        currentToValue + value >= currentFromValue ||
        currentToValue + value <= nextToValue
      ) {
        console.warn('return early', {
          value,
          to: dataSource[key].to,
          from: dataSource[key].from,
          key,
        })
        return
      }
      dataSource[key].to = currentToValue + value
      // we are updating older bands to new logic when user edits the band instead of a patch.
      // ref: https://goguardian.atlassian.net/browse/EV-42019?focusedCommentId=437923
      if (currentToValue === nextFromValue) {
        dataSource[key + 1].from = nextFromValue + value - 1
      } else {
        dataSource[key + 1].from = nextFromValue + value
      }
    }

    this.setState({ isChangeState: true })
    this.props.setPerformanceBandData(dataSource)
  }

  changeAbove = (e, key) => {
    const dataSource = [...this.state.dataSource]
    dataSource.map((row) => {
      if (row.key === key) row.aboveOrAtStandard = e.target.checked
    })
    this.setState({ isChangeState: true })
    this.props.setPerformanceBandData(dataSource)
  }

  changeColor = (color, key) => {
    const index = this.state.dataSource.findIndex((x) => x.key === key)
    const colorExists = this.state.dataSource
      .filter((x, ind) => ind != index)
      .map((x) => x.color)
      .includes(color)

    if (colorExists) {
      notification({ messageKey: 'pleaseSelectADifferentColor' })
      return
    }
    const data = produce(this.state.dataSource, (ds) => {
      ds[index].color = color
    })
    this.setState({ isChangeState: true, dataSource: data })
    this.props.setPerformanceBandData(data)
  }

  getUnusedColor = () => {
    const existingColors = this.state.dataSource.map((x) => x.color)
    return colorsList.find((x) => !existingColors.includes(x))
  }

  handleDelete = (e, key) => {
    const dataSource = [...this.state.dataSource]
    if (dataSource.length <= 2) {
      notification({ messageKey: 'performanceBandShouldAtLeast' })

      return
    }
    if (dataSource[0].key === key) dataSource[1].from = 100
    else if (dataSource[dataSource.length - 1].key === key)
      dataSource[dataSource.length - 2].to = 0
    else dataSource[key + 1].from = dataSource[key].from

    this.setState({ isChangeState: true })
    this.props.setPerformanceBandData(
      dataSource.filter((item) => item.key !== key)
    )
  }

  handleAdd = () => {
    const { dataSource } = this.state
    const keyArray = dataSource.map((item) => item.key)
    const totalBands = dataSource.length

    const newData = {
      key: Math.max(...keyArray) + 1,
      name: `Performance Band${Math.max(...keyArray) + 1}`,
      aboveOrAtStandard: true,
      color: this.getUnusedColor() || '#fff',
      from: 0,
      to: 0,
    }
    const withNewBandValues = dataSource.map((item, i) => {
      if (i === totalBands - 1) {
        return {
          ...item,
          to: item.from - 1,
        }
      }
      return item
    })

    this.setState({
      editingKey: withNewBandValues[totalBands - 1].key,
      isChangeState: true,
    })
    this.props.setPerformanceBandData([...withNewBandValues, newData])
  }

  handleSave = (row) => {
    const newData = [...this.state.dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    newData[newData.length - 1].from = newData[newData.length - 2].to - 1

    this.setState({
      editingKey: -1,
      isChangeState: true,
    })

    this.props.setPerformanceBandData(newData)
  }

  updatePerformanceBand = () => {
    const dataSource = []
    this.state.dataSource.map((row) => {
      dataSource.push({
        name: row.name,
        aboveOrAtStandard: row.aboveOrAtStandard,
        from: row.from,
        to: row.to,
      })
    })

    const performanceBandData = {
      orgId: this.props.userOrgId,
      orgType: 'district',
      performanceBand: dataSource,
    }

    if (this.state.performanceBandId.length === 0) {
      this.props.createPerformanceband(performanceBandData)
    } else {
      this.props.updatePerformanceBand(performanceBandData)
    }
    this.setState({ isChangeState: false })
  }

  isToValueEditing = (record) => record.key === this.state.editingKey

  render() {
    const {
      dataSource,
      editingKey,
      isChangeState,
      performanceBandId,
    } = this.state

    this.columns = [
      {
        title: 'Band Name',
        dataIndex: 'name',
        width: '20%',
        editable: !this.props.readOnly,
        render: (text, record) => {
          return (
            <>
              <ColorPickerContainer>
                <ColorPicker
                  disabled={this.props.readOnly}
                  colors={colorsList}
                  onChange={(c) => this.changeColor(c, record.key)}
                  componentToRender={({ onClick }) => (
                    <>
                      <div
                        style={{ width: 20, display: 'inline-block' }}
                        onClick={onClick}
                      >
                        <ColorBox
                          style={{
                            height: 20,
                            width: 20,
                            display: 'inline-block',
                          }}
                          color={record.color || '#576BA9'}
                        />
                      </div>
                      <StyledIcon onClick={onClick} type="down" />
                    </>
                  )}
                />
              </ColorPickerContainer>{' '}
              <span title={record.name}>
                <Ellipsify limit={20}>{record.name}</Ellipsify>
              </span>
              &nbsp;
            </>
          )
        },
      },
      {
        title: 'Above or At Standard',
        dataIndex: 'aboveOrAtStandard',
        width: '20%',
        render: (text, record) => {
          return (
            <StyledDivCenter>
              <CheckboxLabel
                defaultChecked={record.aboveOrAtStandard}
                checked={record.aboveOrAtStandard}
                disabled={this.props.readOnly}
                onChange={(e) => this.changeAbove(e, record.key)}
              />
            </StyledDivCenter>
          )
        },
      },
      {
        title: 'From',
        dataIndex: 'from',
        width: '25%',
        render: (text, record) => {
          return (
            <StyledColFromTo>
              <Row type="flex" align="center" style={{ flex: '1 1 auto' }}>
                {this.props.readOnly ? (
                  <PercentText>{record.from}%</PercentText>
                ) : (
                  <StyledInputNumber
                    value={record.from}
                    onChange={(v) => {
                      const delta = v - record.from
                      this.onClickFromTo(v, record.key, 'from', delta)
                    }}
                  />
                )}
                <Col style={{ flex: '1 1 auto' }}>
                  <StyledSlider
                    disabled={this.props.readOnly}
                    onChange={(v) => {
                      const delta = v - record.from
                      this.onClickFromTo(v, record.key, 'from', delta)
                    }}
                    value={parseInt(record.from)}
                    max={100}
                    step={1}
                    min={0}
                  />
                </Col>
              </Row>
            </StyledColFromTo>
          )
        },
      },
      {
        title: 'To',
        dataIndex: 'to',
        width: '25%',
        editable: !this.props.readOnly,
        render: (text, record) => {
          return (
            <StyledColFromTo>
              <Row type="flex" align="center" style={{ flex: '1 1 auto' }}>
                {this.props.readOnly ? (
                  <PercentText>{record.to}%</PercentText>
                ) : (
                  <StyledInputNumber
                    value={record.to}
                    onChange={(v) => {
                      const delta = v - record.to
                      this.onClickFromTo(v, record.key, 'to', delta)
                    }}
                  />
                )}
                <Col style={{ flex: '1 1 auto' }}>
                  <StyledSlider
                    disabled={this.props.readOnly}
                    onChange={(v) => {
                      const delta = v - record.to
                      this.onClickFromTo(v, record.key, 'to', delta)
                    }}
                    value={parseInt(record.to)}
                    max={100}
                    step={1}
                    min={0}
                  />
                </Col>
              </Row>
            </StyledColFromTo>
          )
        },
      },
      {
        title: this.props.readOnly ? (
          ''
        ) : (
          <StyledAddBandButton
            disabled={dataSource.length >= 10}
            title={
              dataSource.length >= 10 ? 'maximum 10 bands allowed' : undefined
            }
            onClick={this.handleAdd}
          >
            ADD BAND
          </StyledAddBandButton>
        ),
        dataIndex: 'operation',
        width: '15%',
        render: (text, record) =>
          this.state.dataSource.length >= 3 && !this.props.readOnly ? (
            <StyledDivCenter>
              <a
                href="javascript:;"
                onClick={(e) => this.handleDelete(e, record.key)}
              >
                <Icon type="delete" theme="filled" twoToneColor={themeColor} />
              </a>
            </StyledDivCenter>
          ) : null,
      },
    ]

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    }
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          toggleEditToValue: this.isToValueEditing(record),
          dataSource,
        }),
      }
    })

    const isAddDisable = !!(
      dataSource.length == 0 ||
      (dataSource[dataSource.length - 1].to == 0 &&
        dataSource[dataSource.length - 1].from == 0) ||
      editingKey != -1 ||
      dataSource.length >= 10
    )

    return (
      <StyledTableContainer>
        <StyledBandTable
          components={components}
          rowClassName={() => 'editable-row'}
          dataSource={dataSource}
          pagination={false}
          columns={columns}
          bordered={false}
        />
        <StyledBottomDiv>
          {isChangeState && <SaveAlert>You have unsaved changes.</SaveAlert>}
          {performanceBandId.length == 0 ? (
            <StyledSaveButton
              disabled={this.props.readOnly}
              type="primary"
              onClick={this.updatePerformanceBand}
            >
              Create
            </StyledSaveButton>
          ) : (
            <StyledSaveButton
              type="primary"
              onClick={this.updatePerformanceBand}
              disabled={!isChangeState}
              data-cy="saveProfile"
            >
              Save
            </StyledSaveButton>
          )}
        </StyledBottomDiv>
      </StyledTableContainer>
    )
  }
}

const enhance = compose(
  connect(
    (state) => ({
      dataSource: getPerformanceBandList(state),
      performanceBandId: get(
        state,
        ['performanceBandReducer', 'data', '_id'],
        ''
      ),
      userOrgId: getUserOrgId(state),
    }),
    {
      loadPerformanceBand: receivePerformanceBandAction,
      createPerformanceband: createPerformanceBandAction,
      updatePerformanceBand: updatePerformanceBandAction,
      setPerformanceBandData: setPerformanceBandChangesAction,
    }
  )
)
export default enhance(PerformanceBandTable)
