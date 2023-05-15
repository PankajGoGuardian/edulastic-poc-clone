import {
  darkGrey3,
  extraDesktopWidthMax,
  grey,
  mobileWidthMax,
  secondaryTextColor,
  themeColor,
  title,
  white,
} from '@edulastic/colors'
import { IconExpandBox } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { segmentApi } from '@edulastic/api'
import { Button, Col, Form, Row, Select } from 'antd'
import { find, get, isEmpty, keyBy, map, mapKeys, pick, isArray } from 'lodash'
import PropTypes from 'prop-types'
import React, { createRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { dictionaries } from '@edulastic/constants'
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
  setSchoolSelectWarningAction,
} from '../../duck'
import { ContainerForButtonAtEnd } from '../../styled'
import { StyledDiv } from '../../../../assessment/containers/QuestionMetadata/styled/ELOList'

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
    setIsCompleteSignupInProgress: PropTypes.func,
    user: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isModal: false,
    isTestRecommendationCustomizer: false,
    setShowTestCustomizerModal: () => {},
    onSuccessCallback: () => {},
    setIsCompleteSignupInProgress: () => {},
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

  componentDidUpdate(prevProps) {
    const { schoolSelected, form, isCompleteSignupInProgress } = this.props

    if (
      schoolSelected !== prevProps.schoolSelected &&
      !isCompleteSignupInProgress
    ) {
      form.resetFields()
    }
  }

  updateSubjects = (e) => {
    this.setState({ subjects: e })

    const { curriculums, userInfo, form } = this.props
    let { interestedCurriculums } = this.props
    const { showAllStandards } = get(this, 'props.userInfo.orgData', {})
    interestedCurriculums = interestedCurriculums.filter(
      (x) => x.orgType === userInfo?.role
    )

    const formattedCurriculums = isEmpty(e)
      ? []
      : getFormattedCurriculums(
          interestedCurriculums,
          curriculums,
          { subject: e },
          showAllStandards
        )
    const standardSets = form.getFieldValue('standard') || []

    if (isEmpty(standardSets)) return

    const selectedCurriculumIds = formattedCurriculums
      ?.filter((x) => standardSets.includes(x.value))
      ?.map((x) => x.value)

    this.handleCuriculumChange(selectedCurriculumIds)
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
      schoolSelected,
      setSchoolSelectWarning,
      withJoinSchoolModal,
      isSchoolSignupOnly,
    } = this.props
    const isSignUp = true
    e.preventDefault()
    if (isEmpty(schoolSelected) && withJoinSchoolModal) {
      return setSchoolSelectWarning(true)
    }

    form.validateFields((err, values) => {
      if (!err) {
        const {
          curriculums,
          curriculumStandards = {},
          onSuccessCallback,
          schoolSelectedFromDropdown = false,
          setIsCompleteSignupInProgress,
        } = this.props

        const { email, firstName, middleName, lastName } = userInfo
        setIsCompleteSignupInProgress(true)

        const addSchoolFlow = isSchoolSignupOnly
        const schoolId = schoolSelected?.schoolId || schoolSelected?._id
        let schoolData = {
          institutionIds: [schoolId || ''],
          districtId: schoolSelected?.districtId,
          currentSignUpState: 'ACCESS_WITHOUT_SCHOOL',
          email: email || '',
          ...(firstName ? { firstName } : {}),
          middleName,
          lastName,
        }
        if (isSchoolSignupOnly) {
          const institutionIds = userInfo?.institutionIds || []
          const newInstitutionIds = schoolId
            ? [...institutionIds, schoolId]
            : institutionIds
          schoolData = {
            ...schoolData,
            institutionIds: [...new Set(newInstitutionIds)],
          }
        }

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
          schoolSelectedFromDropdown,
          schoolData,
          addSchoolFlow,
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

        map(
          values.curriculumStandards.map((item) => item._id),
          (id) => {
            const standard = find(
              curriculumStandards.elo || [],
              (x) => x._id === id
            )
            data.curriculumStandards[standard.curriculumId] = (
              data.curriculumStandards[standard.curriculumId] || []
            ).concat(id)
          }
        )

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
    const { form, elosByTloId, curriculumStandards } = this.props
    const dropDownElos = curriculumStandards.elo
    const cachedElos = Object.values(elosByTloId).flat()
    const elosById = keyBy([...dropDownElos, ...cachedElos], '_id')
    form.setFieldsValue({
      curriculumStandards: standardIds.map((item) => ({
        _id: item,
        identifier: elosById[item].identifier,
      })),
    })
  }

  handleCuriculumChange = (curriculumIds) => {
    const {
      getDictStandardsForCurriculum,
      form,
      curriculumStandards,
      elosByTloId,
    } = this.props

    form.setFields({
      standard: {
        value: curriculumIds,
      },
    })
    const dropDownElos = curriculumStandards.elo
    const cachedElos = Object.values(elosByTloId).flat()
    const selectedCurriculamStandardIds = form
      .getFieldValue('curriculumStandards')
      .map((item) => item._id)
    const standardIds = ([...dropDownElos, ...cachedElos] || [])
      .filter(
        (s) =>
          selectedCurriculamStandardIds.includes(s.id) &&
          curriculumIds.includes(s.curriculumId)
      )
      .map((s) => s._id)

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
      withJoinSchoolModal = false,
      standardsLoading,
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

    const selectedCurriculamDetails = formattedCurriculums?.filter((x) =>
      standardSets.includes(x.value)
    )
    const selectedCurriculam = {
      text: selectedCurriculamDetails?.map((x) => x.text)?.join(', ') || '',
      value: selectedCurriculamDetails?.map((x) => x.value),
    }

    const dropDownElosById = keyBy(curriculumStandards.elo, '_id')
    const selectedStandards = form.getFieldValue('curriculumStandards')
    const standardsNotInDropdown = (isArray(selectedStandards)
      ? selectedStandards
      : []
    ).filter((item) => !dropDownElosById[item._id])
    const _curriculumStandards = {
      ...curriculumStandards,
      elo: [...curriculumStandards.elo, ...standardsNotInDropdown],
    }
    const showMoreButtonEnabled =
      curriculumStandards.elo?.length >=
      dictionaries.STANDARD_DROPDOWN_LIMIT_1000
    return (
      <>
        {!withJoinSchoolModal && (
          <BannerText>
            <Img src={schoolIcon} alt="" />
            <H3>
              {t('component.signup.teacher.provide')}{' '}
              {t('component.signup.teacher.curriculumdetails')}
            </H3>
            <H5>{t('component.signup.teacher.gsinfotext')}</H5>
          </BannerText>
        )}
        <SubjectGradeBody
          mA={withJoinSchoolModal && '0px -60px -55px -60px'}
          hasMinHeight={!isModal}
        >
          <Col
            xs={{ span: 20 }}
            lg={{ span: isModal ? 22 : 18 }}
            style={{ width: '100%' }}
          >
            <SelectForm onSubmit={this.handleSubmit}>
              <FlexWrapper type="flex" align="middle" gutter={56}>
                <Col xs={24} sm={18} md={12}>
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
                </Col>
                <Col xs={24} sm={18} md={12}>
                  <Form.Item label="Subject">
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
                </Col>
              </FlexWrapper>
              <FlexWrapper type="flex" align="middle" gutter={56}>
                <Col xs={24} sm={18} md={12}>
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
                </Col>
                <Col xs={24} sm={18} md={12}>
                  <Form.Item
                    label={
                      <>
                        What are you teaching?{' '}
                        <OptionalText>(optional)</OptionalText>
                      </>
                    }
                  >
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
                          value={
                            isArray(selectedStandards)
                              ? selectedStandards.map((item) => item._id)
                              : []
                          }
                          optionFilterProp="children"
                          filterOption
                          size="large"
                          placeholder="Select topic / standard"
                          mode="multiple"
                          onChange={this.handleStandardsChange}
                          disabled={
                            !(form.getFieldValue('standard') || []).length ||
                            standardsLoading
                          }
                          ref={this.standardsRef}
                          onSelect={() => this.standardsRef?.current?.blur()}
                          onDeselect={() => this.standardsRef?.current?.blur()}
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode
                          }
                        >
                          {_curriculumStandards.elo.map(
                            ({ _id, identifier }) => (
                              <Option key={`${_id}-${identifier}`} value={_id}>
                                {identifier}
                              </Option>
                            )
                          )}
                          {showMoreButtonEnabled && (
                            <Select.Option
                              title="show"
                              value="show"
                              style={{ display: 'block', cursor: 'pointer' }}
                              disabled
                            >
                              <StyledDiv onClick={this.handleSetShowModal}>
                                <span>Show More</span>
                              </StyledDiv>
                            </Select.Option>
                          )}
                        </GradeSelect>
                      </FilterItemWrapper>
                    )}
                  </Form.Item>
                </Col>
              </FlexWrapper>
              <ContainerForButtonAtEnd pR="30px" mB="10px">
                <ProceedBtn
                  data-cy="getStarted"
                  type="primary"
                  htmlType="submit"
                  loading={saveSubjectGradeloading}
                  onMouseDown={onMouseDown}
                >
                  {isTestRecommendationCustomizer ? 'Update' : 'Get Started'}
                </ProceedBtn>
              </ContainerForButtonAtEnd>
            </SelectForm>
          </Col>
        </SubjectGradeBody>
        {showStandardsModal && (
          <StandardsSearchModal
            setShowModal={(x) => this.setState({ showStandardsModal: x })}
            showModal={showStandardsModal}
            handleApply={this.handleStandardsChange}
            selectedCurriculam={selectedCurriculam}
            grades={grades}
            standardIds={selectedStandards.map((item) => item._id)}
            standards={selectedStandards}
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
      schoolSelected: get(state, 'signup.schoolSelectedInJoinModal', {}),
      elosByTloId: get(state, 'dictionaries.elosByTloId', {}),
      standardsLoading: get(state, 'dictionaries.standards.loading', false),
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      saveSubjectGrade: saveSubjectGradeAction,
      getDictStandardsForCurriculum: getDictStandardsForCurriculumAction,
      setSchoolSelectWarning: setSchoolSelectWarningAction,
    }
  )
)

export default enhance(SubjectGradeForm)

const SubjectGradeBody = styled(Row)`
  padding: 25px 30px;
  margin: ${(props) => props.mA || '0px'};
  border-radius: 20px;
  background: ${white};
  ${({ hasMinHeight = true }) =>
    hasMinHeight && `min-height: calc(100vh - 93px);`}
`

const FlexWrapper = styled(Row)`
  padding: 10px 30px;
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
    align-items: center;
  }
`

const SelectForm = styled(Form)`
  text-align: center;

  .ant-form-item {
    text-align: left;

    label {
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      color: ${secondaryTextColor};
    }

    .ant-select-arrow {
      top: 50%;
      svg {
        fill: ${themeColor};
      }
    }
  }
  .ant-form-item-required::before {
    content: '';
  }
  .ant-form-item-required::after {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #ff0000;
    margin-left: 4px;
    content: '*' !important;
  }
  .ant-select-disabled {
    .ant-select-selection {
      background-color: ${white};
    }
  }
  .ant-form-item-label > label {
    font-size: 14px;
  }
  .ant-form-item-label > label::after {
    content: '';
  }
  .ant-form-explain {
    padding-top: 8px;
  }
  .ant-select-selection {
    border: 1px solid #a0a0a0;
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
        background: #d9d9d9;
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
        padding: 0px 15px;
        margin-top: 6px;
        .ant-select-selection__choice__content {
          font-size: 11px;
          color: #000000;
          text-transform: uppercase;
          padding-right: 5px;
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

const GradeSelect = styled(Select)`
  width: 100%;
`

const ProceedBtn = styled(Button)`
  background: ${themeColor};
  width: 134px;
  height: 42px;
  white-space: none;
  padding: 10px;
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

const OptionalText = styled.span`
  font-weight: 300;
  font-size: 14px;
  line-height: 19px;
  color: ${darkGrey3};
`
const BannerText = styled.div`
  display: grid;
  justify-content: center;
  margin-top: 50px;
`
const Img = styled.img`
  margin: auto;
  width: 135px;
  height: 120px;
`
const H3 = styled.h3`
  font-size: 45px;
  font-weight: bold;
  color: ${secondaryTextColor};
  line-height: 1;
  letter-spacing: -2.25px;
  margin-top: 10px;
  margin-bottom: 15px;
`
const H5 = styled.h5`
  font-size: 24px;
  margin: auto;
  color: ${secondaryTextColor};
`
