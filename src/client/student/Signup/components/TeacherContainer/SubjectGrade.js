import {
  extraDesktopWidthMax,
  grey,
  mobileWidthMax,
  themeColor,
  title,
  white,
} from '@edulastic/colors'
import { IconExpandBox } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { segmentApi } from '@edulastic/api'
import { Button, Col, Form, Row, Select } from 'antd'
import { find, get, isEmpty, map, mapKeys, pick } from 'lodash'
import PropTypes from 'prop-types'
import React, { createRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import StandardsSearchModal from '../../../../author/ItemList/components/Search/StandardsSearchModal'
// actions
import {
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction,
} from '../../../../author/src/actions/dictionaries'
// selectors
import {
  getCurriculumsListSelector,
  getFormattedCurriculums,
  getStandardsListSelector,
} from '../../../../author/src/selectors/dictionaries'
import {
  getInterestedCurriculumsSelector,
  getUserSelector,
} from '../../../../author/src/selectors/user'
import { FilterItemWrapper } from '../../../../author/TestList/components/Container/FiltersSidebar'
import selectsData from '../../../../author/TestPage/components/common/selectsData'
import {
  saveSubjectGradeAction,
  saveSubjectGradeloadingSelector,
} from '../../duck'

const { allGrades, allSubjects } = selectsData

const { Option } = Select
const schoolIcon =
  '//cdn.edulastic.com/JS/webresources/images/as/signup-join-school-icon.png'

class SubjectGrade extends React.Component {
  constructor(props) {
    super(props)
    this.gradeRef = createRef()
    this.subjectRef = createRef()
    this.standardRef = createRef()
    this.standardsRef = createRef()
    const { userInfo } = this.props
    const { defaultGrades, defaultSubjects } = get(
      props.user,
      'user.orgData',
      {}
    )
    let { interestedCurriculums } = get(props.user, 'user.orgData', {})

    interestedCurriculums = interestedCurriculums.filter(
      (x) => x.orgType === userInfo?.role
    )

    this.state = {
      subjects: defaultSubjects || [],
      grades: defaultGrades || [],
      standards: (interestedCurriculums || []).map((x) => x._id),
      curriculumStandard: [],
      showStandardsModal: false,
    }
  }

  static propTypes = {
    form: PropTypes.object.isRequired,
    getCurriculums: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired,
    saveSubjectGrade: PropTypes.func.isRequired,
    curriculums: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        curriculum: PropTypes.string.isRequired,
        grades: PropTypes.array.isRequired,
        subject: PropTypes.string.isRequired,
      })
    ).isRequired,
    isModal: PropTypes.bool,
    isTestRecommendationCustomizer: PropTypes.bool,
    setShowTestCustomizerModal: PropTypes.func,
    onSuccessCallback: PropTypes.func,
    user: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isModal: false,
    isTestRecommendationCustomizer: false,
    setShowTestCustomizerModal: () => {},
    onSuccessCallback: () => {},
  }

  componentDidMount() {
    const {
      curriculums,
      getCurriculums,
      user = {},
      getDictStandardsForCurriculum,
      triggerSource,
    } = this.props
    const { standards } = this.state
    const { currentStandardSetStandards } = user?.user || {}
    const curriculumIds = Object.keys(currentStandardSetStandards || {})
    if (curriculumIds.length) {
      const { defaultGrades = [] } = get(user, 'user.orgData', {})
      getDictStandardsForCurriculum(curriculumIds, defaultGrades, '')

      const curriculumStandard = curriculumIds.flatMap((cid) =>
        standards.includes(parseInt(cid, 10))
          ? currentStandardSetStandards[cid]
          : []
      )
      this.setState({ curriculumStandard })
    }

    if (isEmpty(curriculums)) {
      getCurriculums()
    }

    if (triggerSource) {
      segmentApi.genericEventTrack('Grade_SubjectModalOpen', {
        Trigger_Source: triggerSource,
      })
    }
  }

  updateSubjects = (e) => {
    this.setState({ subjects: e })
  }

  updateGrades = (e) => {
    this.setState({ grades: e })
  }

  handleSubmit = (e) => {
    const { grades: defaultGrades, subjects: defaultSubjects } = this.state
    const {
      form,
      userInfo,
      saveSubjectGrade,
      isTestRecommendationCustomizer,
      setShowTestCustomizerModal,
    } = this.props
    const isSignUp = true
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const {
          curriculums,
          curriculumStandards = {},
          onSuccessCallback,
        } = this.props

        const data = {
          orgId: userInfo._id,
          orgType: userInfo.role,
          districtId: userInfo.districtId,
          isSignUp,
          curriculums: [],
          curriculumStandards: {},
          defaultGrades,
          defaultSubjects,
          isTestRecommendationCustomizer,
          setShowTestCustomizerModal,
          onSuccessCallback,
        }

        map(values.standard, (id) => {
          const filterData = find(curriculums, (el) => el._id === id)
          const newCurriculum = mapKeys(
            pick(filterData, ['_id', 'curriculum', 'subject']),
            (vaule, key) => {
              if (key === 'curriculum') key = 'name'
              return key
            }
          )
          newCurriculum.grades = values.grade
          data.curriculums.push(newCurriculum)
        })

        map(values.curriculumStandards, (id) => {
          const standard = find(
            curriculumStandards.elo || [],
            (x) => x._id === id
          )
          data.curriculumStandards[standard.curriculumId] = (
            data.curriculumStandards[standard.curriculumId] || []
          ).concat(id)
        })

        saveSubjectGrade({ ...data })
        if (!isTestRecommendationCustomizer) {
          segmentApi.genericEventTrack('Signup_GetStarted_ButtonClick', {})
        }
      }
    })
  }

  handleSetShowModal = () => {
    const { form, curriculumStandards } = this.props
    if (
      !(form.getFieldValue('standard') || []).length ||
      !curriculumStandards.elo.length
    )
      return
    this.setState({ showStandardsModal: true })
  }

  handleStandardsChange = (standardIds) => {
    const { form } = this.props

    form.setFieldsValue({
      curriculumStandards: standardIds,
    })
  }

  handleCuriculumChange = (curriculumIds) => {
    const {
      getDictStandardsForCurriculum,
      form,
      curriculumStandards,
    } = this.props

    form.setFields({
      standard: {
        value: curriculumIds,
      },
    })
    const selectedCurriculamStandardIds = form.getFieldValue(
      'curriculumStandards'
    )
    const standardIds = (curriculumStandards.elo || [])
      .filter(
        (s) =>
          selectedCurriculamStandardIds.includes(s.id) &&
          curriculumIds.includes(s.curriculumId)
      )
      .map((s) => s.id)

    this.handleStandardsChange(standardIds)
    const grades = form.getFieldValue('grade')
    getDictStandardsForCurriculum(curriculumIds, grades, '')
  }

  render() {
    const {
      grades,
      subjects,
      standards,
      curriculumStandard,
      showStandardsModal,
    } = this.state
    const {
      curriculums,
      form,
      saveSubjectGradeloading,
      t,
      isModal,
      isTestRecommendationCustomizer,
      curriculumStandards,
      userInfo,
      onMouseDown,
    } = this.props
    let { interestedCurriculums } = this.props

    const { showAllStandards } = get(this, 'props.userInfo.orgData', {})
    interestedCurriculums = interestedCurriculums.filter(
      (x) => x.orgType === userInfo?.role
    )
    const formattedCurriculums = isEmpty(subjects)
      ? []
      : getFormattedCurriculums(
          interestedCurriculums,
          curriculums,
          { subject: subjects },
          showAllStandards
        )
    const { getFieldDecorator } = form
    const filteredAllGrades = allGrades.filter(
      (item) => item.isContentGrade !== true
    )
    const _allSubjects = allSubjects.filter((item) => item.value)

    const standardSets = form.getFieldValue('standard') || []

    const selectedCurriculam = {
      text:
        formattedCurriculums
          ?.filter((x) => standardSets.includes(x.value))
          ?.map((x) => x.text)
          ?.join(', ') || '',
    }

    return (
      <>
        <SubjectGradeBody hasMinHeight={!isModal}>
          <Col
            xs={{ span: 20, offset: 2 }}
            lg={{ span: isModal ? 22 : 18, offset: isModal ? 1 : 3 }}
          >
            <FlexWrapper type="flex" align="middle">
              <BannerText xs={24} sm={18} md={12}>
                <SchoolIcon src={schoolIcon} alt="" />
                <h3>
                  {t('component.signup.teacher.provide')} <br />{' '}
                  {t('component.signup.teacher.curriculumdetails')}
                </h3>
                <h5>{t('component.signup.teacher.gsinfotext')}</h5>
              </BannerText>
              <Col xs={24} sm={18} md={12}>
                <SelectForm onSubmit={this.handleSubmit}>
                  <Form.Item label="Grade">
                    {getFieldDecorator('grade', {
                      initialValue: grades,
                      rules: [
                        {
                          required: true,
                          message: 'Grade is not selected',
                        },
                      ],
                    })(
                      <GradeSelect
                        data-cy="grade"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        size="large"
                        placeholder="Select a grade or multiple grades"
                        mode="multiple"
                        onChange={this.updateGrades}
                        ref={this.gradeRef}
                        onSelect={() => this.gradeRef?.current?.blur()}
                        onDeselect={() => this.gradeRef?.current?.blur()}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                        showArrow
                      >
                        {filteredAllGrades.map((el) => (
                          <Option key={el.value} value={el.value}>
                            {el.text}
                          </Option>
                        ))}
                      </GradeSelect>
                    )}
                  </Form.Item>
                  <Form.Item label="Subjects">
                    {getFieldDecorator('subjects', {
                      initialValue: subjects,
                      rules: [
                        {
                          required: true,
                          message: 'Subject(s) is not selected',
                        },
                      ],
                    })(
                      <GradeSelect
                        data-cy="subject"
                        mode="multiple"
                        size="large"
                        placeholder="Select a subject"
                        onChange={this.updateSubjects}
                        ref={this.subjectRef}
                        onSelect={() => this.subjectRef?.current?.blur()}
                        onDeselect={() => this.subjectRef?.current?.blur()}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                        showArrow
                      >
                        {_allSubjects.map((el) => (
                          <Option key={el.value} value={el.value}>
                            {el.text}
                          </Option>
                        ))}
                      </GradeSelect>
                    )}
                  </Form.Item>
                  <Form.Item label="Standard Sets">
                    {getFieldDecorator('standard', {
                      initialValue:
                        formattedCurriculums
                          ?.filter((x) => standards.includes(x.value))
                          ?.map((y) => y.value) || [],
                      rules: [
                        {
                          required: false,
                          message: 'Standard Set is not selected',
                        },
                      ],
                    })(
                      <GradeSelect
                        data-cy="standardSet"
                        optionFilterProp="children"
                        filterOption
                        size="large"
                        placeholder="Select your standard sets"
                        mode="multiple"
                        onChange={this.handleCuriculumChange}
                        ref={this.standardRef}
                        onSelect={() => this.standardRef?.current?.blur()}
                        onDeselect={() => this.standardRef?.current?.blur()}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                        showArrow
                      >
                        {formattedCurriculums.map(
                          ({ value, text, disabled }) => (
                            <Option
                              key={value}
                              value={value}
                              disabled={disabled}
                            >
                              {text}
                            </Option>
                          )
                        )}
                      </GradeSelect>
                    )}
                  </Form.Item>
                  <Form.Item label="What are you teaching right now? (optional)">
                    {getFieldDecorator('curriculumStandards', {
                      initialValue: curriculumStandards?.elo?.length
                        ? curriculumStandard
                        : [],
                      rules: [
                        {
                          required: false,
                          message: 'Standard(s) is not selected',
                        },
                      ],
                    })(
                      <FilterItemWrapper title="">
                        <IconExpandBoxWrapper
                          data-cy="browseStandards"
                          className={
                            !(form.getFieldValue('standard') || []).length &&
                            'disabled'
                          }
                        >
                          <IconExpandBox onClick={this.handleSetShowModal} />
                        </IconExpandBoxWrapper>
                        <GradeSelect
                          data-cy="standards"
                          value={form.getFieldValue('curriculumStandards')}
                          optionFilterProp="children"
                          filterOption
                          size="large"
                          placeholder="Select topic / standard"
                          mode="multiple"
                          onChange={this.handleStandardsChange}
                          disabled={
                            !(form.getFieldValue('standard') || []).length
                          }
                          ref={this.standardsRef}
                          onSelect={() => this.standardsRef?.current?.blur()}
                          onDeselect={() => this.standardsRef?.current?.blur()}
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode
                          }
                        >
                          {curriculumStandards.elo.map(
                            ({ _id, identifier }) => (
                              <Option key={`${_id}-${identifier}`} value={_id}>
                                {identifier}
                              </Option>
                            )
                          )}
                        </GradeSelect>
                      </FilterItemWrapper>
                    )}
                  </Form.Item>
                  <ProceedBtn
                    data-cy="getStarted"
                    type="primary"
                    htmlType="submit"
                    loading={saveSubjectGradeloading}
                    onMouseDown={onMouseDown}
                  >
                    {isTestRecommendationCustomizer ? 'Update' : 'Get Started'}
                  </ProceedBtn>
                </SelectForm>
              </Col>
            </FlexWrapper>
          </Col>
        </SubjectGradeBody>
        {showStandardsModal && (
          <StandardsSearchModal
            setShowModal={(x) => this.setState({ showStandardsModal: x })}
            showModal={showStandardsModal}
            standardIds={form.getFieldValue('curriculumStandards') || []}
            handleApply={this.handleStandardsChange}
            selectedCurriculam={selectedCurriculam}
          />
        )}
      </>
    )
  }
}

const SubjectGradeForm = Form.create()(SubjectGrade)

const enhance = compose(
  withNamespaces('login'),
  connect(
    (state) => ({
      curriculums: getCurriculumsListSelector(state),
      user: getUserSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      saveSubjectGradeloading: saveSubjectGradeloadingSelector(state),
      curriculumStandards: getStandardsListSelector(state),
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      saveSubjectGrade: saveSubjectGradeAction,
      getDictStandardsForCurriculum: getDictStandardsForCurriculumAction,
    }
  )
)

export default enhance(SubjectGradeForm)

const SubjectGradeBody = styled(Row)`
  padding: 10px 0px;
  background: ${white};
  ${({ hasMinHeight = true }) =>
    hasMinHeight && `min-height: calc(100vh - 93px);`}
`

const FlexWrapper = styled(Row)`
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
    align-items: center;
  }
`

const BannerText = styled(Col)`
  text-align: left;
  h3 {
    font-size: 45px;
    font-weight: bold;
    color: ${title};
    line-height: 1;
    letter-spacing: -2.25px;
    margin-top: 0px;
    margin-bottom: 15px;
  }
  h5 {
    font-size: 13px;
    margin-top: 10px;
    color: ${title};
  }

  @media (max-width: ${mobileWidthMax}) {
    margin-bottom: 30px;
    h3 {
      font-weight: 400;
    }
    h5 {
      font-size: 16px;
    }
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    h5 {
      font-size: 24px;
    }
  }
`

const SelectForm = styled(Form)`
  max-width: 640px;
  margin: 0px auto;
  padding: 5px 25px;
  text-align: center;

  .ant-form-item {
    text-align: left;

    label {
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      color: #434b5d;
    }

    .ant-select-arrow {
      svg {
        fill: ${themeColor};
      }
    }
  }
  .ant-form-item-required::before {
    content: '';
  }
  .ant-form-item-label > label::after {
    content: '';
  }
  .ant-form-explain {
    padding-top: 8px;
  }
  .ant-select-selection {
    border: none;
    border-bottom: 1px solid #a0a0a0;
    border-radius: 0;
    min-height: 45px;
    box-shadow: none !important;
    .ant-select-selection__rendered {
      line-height: 45px;
      .ant-input {
        min-height: 43px;
        box-shadow: none;
        border: none;
        font-size: 20px;
        &:hover {
          box-shadow: none;
          border: none;
        }
      }
      .ant-select-selection__choice {
        background: #e3e3e3;
        height: 30px;
        line-height: 30px;
        border-radius: 20px;
        padding: 0px 15px;
        .ant-select-selection__choice__content {
          font-size: 11px;
          color: ${title};
          text-transform: uppercase;
          margin-right: 5px;
          svg {
            width: 8px;
            height: 8px;
            fill: ${title};
          }
        }
        .ant-select-selection__choice__remove {
          right: 5px;
        }
      }
    }
  }
`

const SchoolIcon = styled.img`
  width: 80px;
  margin-bottom: 10px;
`

const GradeSelect = styled(Select)`
  width: 100%;
`

const ProceedBtn = styled(Button)`
  background: ${themeColor};
  min-width: 100%;
  color: ${white};
  text-transform: uppercase;
  text-align: center;
  border: 0px;
  &:hover {
    background: ${themeColor};
    color: ${white};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 11px;
  }
`

const IconExpandBoxWrapper = styled.div`
  right: 10px;
  margin-top: 5px;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  &.disabled {
    svg path {
      fill: ${grey};
    }
  }
`
