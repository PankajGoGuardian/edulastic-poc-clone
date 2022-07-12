import React from 'react'
import { Form, Icon } from 'antd'
import {
  EduButton,
  notification,
  RadioBtn,
  CheckboxLabel,
} from '@edulastic/common'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'

import StandardsProficiencyEditableCell from './StandardsProficiencyEditableCell/StandardsProficiencyEditableCell'

import {
  StyledTableContainer,
  TopDiv,
  InfoDiv,
  SaveButtonDiv,
  SaveAlert,
  StyledH3,
  StyledUl,
  StyledDescription,
  StyledMasterDiv,
  StyledButton,
  StyledAddButton,
  StyledAverageRadioDiv,
  StyledAverageInput,
  StyledLabel,
  StyledScoreDiv,
  InputOption,
  BandStyledTable,
} from './styled'
import { ScoreColorSpan } from './StandardsProficiencyEditableCell/styled'

import {
  updateStandardsProficiencyAction,
  createStandardsProficiencyAction,
  setScaleDataAction,
  setCalcTypeAction,
  setDecayingAttrValueAction,
  setMovingAttrValueAction,
} from '../../ducks'

import { getUserOrgId } from '../../../src/selectors/user'
import {
  StyledCol,
  StyledRadioGrp,
  StyledRow,
} from '../../../../admin/Common/StyledComponents/settingsContent'

const EditableContext = React.createContext()

class StandardsProficiencyTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editingKey: '',
      isAdding: false,
      isChangeState: false,
    }
  }

  setChanged = (v) => this.setState({ isChangeState: v })

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      data: nextProps.standardsProficiency,
      calcType: nextProps.calcType,
      calcDecayingAttr: nextProps.calcDecayingAttr,
      calcMovingAvrAttr: nextProps.calcMovingAvrAttr,
    }
  }

  isEditing = (record) => record.key === this.state.editingKey

  cancel = (key) => {
    if (this.state.isAdding) this.handleDelete(key)
    this.setState({ editingKey: '', isAdding: false })
  }

  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      const newData = [...this.state.data]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
      } else {
        newData.push(row)
      }
      this.setState({ editingKey: '', isAdding: false, isChangeState: true })
      this.props.setScaleData({ data: newData, _id: this.props._id })
    })
  }

  edit = (key) => {
    this.setState({ editingKey: key })
  }

  handleAdd = () => {
    const { data, editingKey } = this.state
    if (data.length >= 5) {
      notification({ messageKey: 'maximumFiveLevels' })
      return
    }

    if (editingKey !== '') return

    const newData = {
      key: data[data.length - 1].key + 1,
      score: 1,
      masteryLevel: 'Proficiency 1',
      shortName: 'P1',
      threshold: 0,
      color: '#a1c3ea',
    }

    data.map((row) => {
      row.score += 1
    })

    data[data.length - 1].threshold =
      data[data.length - 2].threshold > 10
        ? data[data.length - 2].threshold - 10
        : 0

    this.setState({
      editingKey: data.length,
      isChangeState: true,
      isAdding: true,
    })
    this.props.setScaleData({ data: [...data, newData], _id: this.props._id })
  }

  handleDelete = (key) => {
    const data = [...this.state.data]
    if (data.length <= 3) {
      notification({ messageKey: 'minimumThreeLevel' })
      return
    }
    const newData = data.filter((item) => item.key !== key)
    newData.map((row, nIndex) => {
      row.score = newData.length - nIndex
      if (newData.length - 1 == nIndex) row.threshold = 0
    })

    this.setState({ isChangeState: true })
    this.props.setScaleData({ data: newData, _id: this.props._id })
  }

  changeCalcType = (e) => {
    this.setState({ isChangeState: true })
    this.props.setCalcType({ data: e.target.value, _id: this.props._id })
  }

  saveScale = (e) => {
    if (this.state.isAdding) return
    const dataSource = []
    const { data, calcType } = this.state
    const { standardsProficiencyID, userOrgId } = this.props

    data.map((row) => {
      dataSource.push({
        score: row.score,
        masteryLevel: row.masteryLevel,
        shortName: row.shortName,
        threshold: row.threshold,
        color: row.color,
        domainMastery: row.domainMastery,
      })
    })

    const updateData = {
      orgId: userOrgId,
      scale: dataSource,
      calcType,
      orgType: 'district',
    }
    if (calcType === 'DECAYING_AVERAGE') {
      const calcDecayingAttr = this.state.calcDecayingAttr || this.props.decay
      if (!calcDecayingAttr && calcDecayingAttr !== 0) {
        return notification({ messageKey: 'DecayError' })
      }
      updateData.calcAttribute = calcDecayingAttr
      updateData.decay = calcDecayingAttr
    } else if (calcType === 'MOVING_AVERAGE') {
      const { calcMovingAvrAttr } = this.state
      updateData.calcAttribute = calcMovingAvrAttr || this.props.noOfAssessments
      updateData.noOfAssessments =
        calcMovingAvrAttr || this.props.noOfAssessments
    } else {
      updateData.calcAttribute = 0
    }

    this.setState({ isChangeState: false })
    if (standardsProficiencyID.length == 0)
      this.props.createStandardProficiency(updateData)
    else
      this.props.updateStandardsProficiency({
        ...updateData,
        _id: this.props._id,
        name: this.props.name,
      })
  }

  onChangeCalcAttr = (e, keyName) => {
    const { value } = e.target
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if (
      (!Number.isNaN(value) && reg.test(value)) ||
      value === '' ||
      value === '-'
    ) {
      if (keyName === 'DECAYING_AVERAGE')
        this.props.setDecayingAttrValue({ data: value, _id: this.props._id })
      else if (keyName === 'MOVING_AVERAGE')
        this.props.setMovingAttrValue({ data: value, _id: this.props._id })
      this.setState({ isChangeState: true })
    }
  }

  onChangeDomainMastery = (e, key) => {
    const { data } = this.state
    const newData = data.map((row) => {
      if (row.key === key) {
        return {
          ...row,
          domainMastery: !row.domainMastery,
        }
      }
      return row
    })

    this.setState({ isChangeState: true })
    this.props.setScaleData({ data: newData, _id: this.props._id })
  }

  render() {
    const {
      isChangeState,
      calcType,
      calcDecayingAttr,
      calcMovingAvrAttr,
      data,
    } = this.state

    const components = {
      body: {
        cell: StandardsProficiencyEditableCell,
      },
    }
    this.columns = [
      {
        title: 'Score',
        dataIndex: 'color',
        width: '15%',
        editable: true,
        render: (text, record) => (
          <StyledScoreDiv>
            <ScoreColorSpan color={text} />
            <Icon type="down" />
            {record.score}
          </StyledScoreDiv>
        ),
      },
      {
        title: 'Domain Mastery',
        dataIndex: 'domainMastery',
        width: '15%',
        render: (domainMastery, record) => {
          const editable = this.isEditing(record)
          return editable ? (
            <CheckboxLabel
              checked={domainMastery}
              onChange={(e) => this.onChangeDomainMastery(e, record.key)}
            />
          ) : (
            <CheckboxLabel disabled checked={domainMastery} />
          )
        },
      },
      {
        title: 'Mastery Level',
        dataIndex: 'masteryLevel',
        width: '20%',
        editable: true,
      },
      {
        title: 'Short Name',
        dataIndex: 'shortName',
        width: '25%',
        editable: true,
      },
      {
        title: 'Performance Threshold',
        dataIndex: 'threshold',
        width: '25%',
        editable: true,
        render: (text) => <>{text}%</>,
      },
      {
        title: this.props.readOnly ? null : (
          <StyledAddButton type="primary" onClick={this.handleAdd}>
            ADD LEVEL
          </StyledAddButton>
        ),
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state
          const editable = this.isEditing(record)
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {(form) => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <a onClick={() => this.cancel(record.key)}>Cancel</a>
                </span>
              ) : this.props.readOnly ? null : (
                <>
                  <StyledButton
                    disabled={editingKey !== ''}
                    onClick={() => this.edit(record.key)}
                    title="Edit"
                  >
                    <Icon type="edit" theme="twoTone" />
                  </StyledButton>
                  <StyledButton
                    disabled={editingKey !== ''}
                    onClick={() => this.handleDelete(record.key)}
                    title="Delete"
                  >
                    <Icon type="delete" theme="twoTone" />
                  </StyledButton>
                </>
              )}
            </div>
          )
        },
      },
    ]

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          context: EditableContext,
          dataSource: data,
        }),
      }
    })

    return (
      <StyledTableContainer>
        <TopDiv>
          <InfoDiv>
            <StyledH3>Set Standards Based Grading Scale</StyledH3>
            <StyledDescription>
              Select scale and minimum percentage criteria for standard score
              <br />
              Note: Teachers can edit the performance threshold while assigning
            </StyledDescription>
          </InfoDiv>
          {this.props.readOnly ? null : (
            <SaveButtonDiv>
              {isChangeState && (
                <SaveAlert>You have unsaved changes.</SaveAlert>
              )}
              <EduButton
                type="primary"
                onClick={this.saveScale}
                disabled={!isChangeState}
                data-cy="saveProfile"
              >
                Save
              </EduButton>
            </SaveButtonDiv>
          )}
        </TopDiv>

        <EditableContext.Provider value={this.props.form}>
          <BandStyledTable
            components={components}
            dataSource={data}
            columns={columns}
            rowClassName="editable-row"
            pagination={false}
          />
        </EditableContext.Provider>
        <StyledMasterDiv>
          <StyledH3>Mastery Calculation Method</StyledH3>
          <StyledUl>
            <li>
              Select calculation method to determine the student's mastery
            </li>
            <li>
              Standards based scores persist across classes(they do NOT reset
              automatically)
            </li>
            <li>
              Mastery score is rounded up when the calculated score is at/above
              mid point between two levels
            </li>
          </StyledUl>
          <StyledRadioGrp
            disabled={this.props.readOnly}
            defaultValue={calcType}
            onChange={this.changeCalcType}
            value={calcType}
          >
            <StyledRow mt="20px" gutter={30} type="flex">
              <StyledCol>
                <RadioBtn value="MOST_RECENT">Most Recent</RadioBtn>
              </StyledCol>
              <StyledCol>
                <RadioBtn value="AVERAGE">Simple Average</RadioBtn>
              </StyledCol>
              <StyledCol>
                <RadioBtn value="MAX_SCORE">Max Score</RadioBtn>
              </StyledCol>
              <StyledCol>
                <RadioBtn value="POWER_LAW">Power Law</RadioBtn>
              </StyledCol>
              <StyledCol>
                <RadioBtn value="MODE_SCORE">Mode Score</RadioBtn>
              </StyledCol>
              <StyledCol>
                <StyledAverageRadioDiv direction="column">
                  <RadioBtn value="DECAYING_AVERAGE">Decaying Average</RadioBtn>
                  <InputOption
                    margin={calcType === 'DECAYING_AVERAGE' ? '5px' : '0px'}
                  >
                    {calcType === 'DECAYING_AVERAGE' && (
                      <>
                        <StyledLabel>Decay %</StyledLabel>
                        <StyledAverageInput
                          disabled={this.props.readOnly}
                          placeholder={this.props.decay}
                          value={calcDecayingAttr}
                          maxLength={2}
                          onChange={(e) =>
                            this.onChangeCalcAttr(e, 'DECAYING_AVERAGE')
                          }
                        />
                      </>
                    )}
                  </InputOption>
                </StyledAverageRadioDiv>
              </StyledCol>
              <StyledCol>
                <StyledAverageRadioDiv direction="column">
                  <RadioBtn value="MOVING_AVERAGE">Moving Average</RadioBtn>
                  <InputOption
                    margin={calcType === 'MOVING_AVERAGE' ? '5px' : '0px'}
                  >
                    {calcType === 'MOVING_AVERAGE' && (
                      <>
                        <StyledLabel>No of Assesments</StyledLabel>
                        <StyledAverageInput
                          disabled={this.props.readOnly}
                          placeholder={this.props.noOfAssessments}
                          value={calcMovingAvrAttr}
                          onChange={(e) =>
                            this.onChangeCalcAttr(e, 'MOVING_AVERAGE')
                          }
                        />
                      </>
                    )}
                  </InputOption>
                </StyledAverageRadioDiv>
              </StyledCol>
            </StyledRow>
          </StyledRadioGrp>
        </StyledMasterDiv>
      </StyledTableContainer>
    )
  }
}
const EditableStandardsProficiencyTable = Form.create()(
  StandardsProficiencyTable
)

const enhance = compose(
  connect(
    (state, ownProps) => {
      const calcType = get(
        state,
        ['standardsProficiencyReducer', 'data', ownProps.index, 'calcType'],
        ''
      )
      const calcDecayingAttr = get(
        state,
        [
          'standardsProficiencyReducer',
          'data',
          ownProps.index,
          'calcDecayingAttr',
        ],
        ''
      )
      const calcMovingAvrAttr = get(
        state,
        [
          'standardsProficiencyReducer',
          'data',
          ownProps.index,
          'calcMovingAvrAttr',
        ],
        ''
      )
      return {
        standardsProficiency: get(
          state,
          ['standardsProficiencyReducer', 'data', ownProps.index, 'scale'],
          []
        ),
        userOrgId: getUserOrgId(state),
        calcType,
        /**
         * NOTE: pay attention here
         */
        calcDecayingAttr:
          calcType === 'DECAYING_AVERAGE' ? calcDecayingAttr : '',
        calcMovingAvrAttr:
          calcType === 'MOVING_AVERAGE' ? calcMovingAvrAttr : '',
        standardsProficiencyID: get(
          state,
          ['standardsProficiencyReducer', 'data', ownProps.index, '_id'],
          ''
        ),
      }
    },
    {
      updateStandardsProficiency: updateStandardsProficiencyAction,
      createStandardProficiency: createStandardsProficiencyAction,
      setScaleData: setScaleDataAction,
      setCalcType: setCalcTypeAction,
      setDecayingAttrValue: setDecayingAttrValueAction,
      setMovingAttrValue: setMovingAttrValueAction,
    }
  )
)

export default enhance(EditableStandardsProficiencyTable)
