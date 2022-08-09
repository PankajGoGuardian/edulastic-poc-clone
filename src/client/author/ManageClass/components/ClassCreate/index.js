import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { isEmpty, find, get, pickBy, identity } from 'lodash'
import { Form, Spin, Row, Col } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { segmentApi } from '@edulastic/api'
// actions
import { CustomModalStyled } from '@edulastic/common'
import styled from 'styled-components'
import { getDictCurriculumsAction } from '../../../src/actions/dictionaries'
import {
  createClassAction,
  getSelectedSubject,
  setCreateClassTypeDetailsAction,
  setSubjectAction,
} from '../../ducks'
// selectors
import {
  getCurriculumsListSelector,
  getFormattedCurriculumsSelector,
} from '../../../src/selectors/dictionaries'
import {
  getUserOrgData,
  getUserRole,
  getUserFeatures,
  getUserOrgId,
} from '../../../src/selectors/user'
import {
  receiveSearchCourseAction,
  getCoursesForDistrictSelector,
} from '../../../Courses/ducks'

// componentes
import LeftFields from './LeftFields'
import RightFields from './RightFields'
import { LeftContainer } from './styled'
import {
  addNewTagAction,
  getAllTagsAction,
  getAllTagsSelector,
} from '../../../TestPage/ducks'
import { setShowClassCreationModalAction } from '../../../Dashboard/ducks'
import { TitleHeader, TitleParagraph } from '../../../Welcome/styled/styled'

class ClassCreate extends React.Component {
  static propTypes = {
    getCurriculums: PropTypes.func.isRequired,
    curriculums: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        curriculum: PropTypes.string.isRequired,
        grades: PropTypes.array.isRequired,
        subject: PropTypes.string.isRequired,
      })
    ).isRequired,
    filteredCurriculums: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        text: PropTypes.string,
        disabled: PropTypes.bool,
      })
    ).isRequired,
    setSubject: PropTypes.func.isRequired,
    selectedSubject: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    userOrgData: PropTypes.object.isRequired,
    createClass: PropTypes.func.isRequired,
    searchCourseList: PropTypes.func.isRequired,
    creating: PropTypes.bool.isRequired,
    isSearching: PropTypes.bool.isRequired,
    error: PropTypes.any,
    courseList: PropTypes.array.isRequired,
  }

  state = {}

  static defaultProps = {
    error: null,
  }

  componentDidMount() {
    const {
      curriculums,
      getCurriculums,
      getAllTags,
      createClassType,
    } = this.props
    const { fromDashboard, type } = createClassType || {}
    segmentApi.genericEventTrack('createClassStart', { fromDashboard, type })

    if (isEmpty(curriculums)) {
      getCurriculums()
    }
    getAllTags({ type: 'group' })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {
      form,
      userId,
      userOrgData,
      allTagsData,
      userFeatures,
      districtId,
    } = this.props

    const { premiumGradeSubject } = userFeatures

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { createClass, curriculums, createClassType } = this.props
        const { fromDashboard, type, studentIds = [], exitPath } =
          createClassType || {}
        const {
          standardSets,
          endDate,
          startDate,
          courseId,
          grades,
          subject,
          tags,
          description,
        } = values

        // default start and end date
        const term =
          userOrgData.terms.length &&
          userOrgData.terms.find(
            (t) => t.endDate > Date.now() && t.startDate < Date.now()
          )
        const defaultStartDate = moment()
        const defaultEndDate = term
          ? term.endDate
          : defaultStartDate.add(1, 'year')

        const updatedStandardsSets = standardSets?.map((el) => {
          const selectedCurriculum = find(
            curriculums,
            (curriculum) => curriculum._id === el
          )
          return {
            _id: selectedCurriculum._id,
            name: selectedCurriculum.curriculum,
          }
        })

        values.districtId = districtId
        values.type = type === 'group' ? 'custom' : 'class'
        values.parent = { id: userId }
        values.owners = [userId]
        values.description = description || ''
        values.standardSets = updatedStandardsSets || []
        values.endDate = moment(endDate || defaultEndDate).format('x')
        values.startDate = moment(startDate || defaultStartDate).format('x')
        values.courseId = isEmpty(courseId) ? '' : courseId
        values.grades = isEmpty(grades) ? ['O'] : grades
        values.subject = isEmpty(subject) ? 'Other Subjects' : subject
        values.tags = tags?.map((t) => allTagsData.find((o) => o._id === t))
        values.studentIds = studentIds || []

        // eslint-disable-next-line react/no-unused-state
        this.setState({ submitted: true })
        let callUserMeApi = false
        // if user has premium grade subject then call /users/me api to refresh premium flag value
        if (!isEmpty(premiumGradeSubject)) {
          callUserMeApi = true
        }
        const submitValues = pickBy(values, identity)
        createClass({ ...submitValues, callUserMeApi, exitPath })
        segmentApi.genericEventTrack('createClassSubmit', {
          ...submitValues,
          fromDashboard,
          type,
        })
      }
    })
  }

  clearStandards = () => {
    const { form } = this.props
    form.setFieldsValue({
      standardSets: [],
    })
  }

  searchCourse = (keyword) => {
    const { searchCourseList, districtId } = this.props
    let searchTerms
    const key = keyword.trim()
    if (keyword == '') {
      searchTerms = {
        districtId,
        active: 1,
      }
    } else {
      searchTerms = {
        districtId,
        active: 1,
        search: {
          name: [{ type: 'cont', value: key }],
          number: [{ type: 'eq', value: key }],
          operator: 'or',
        },
      }
    }

    searchCourseList(searchTerms)
  }

  getBreadCrumbData = () => {
    const { match, createClassType } = this.props
    const { type = 'class', exitPath } = createClassType || {}
    const pathList = match.url.split('/')
    let breadCrumbData = []

    const createClassBreadCrumb = {
      title: `Create ${type}`,
      to: match.url,
      state: { type, exitPath },
    }

    // pathList[2] determines the origin of the ClassCreate component
    switch (pathList[2]) {
      case 'gradebook':
      case 'groups':
      case 'class-enrollment':
        breadCrumbData = [
          {
            title: pathList[2].split('-').join(' '),
            to: `/author/${pathList[2]}`,
          },
        ]
        break
      case 'reports':
        breadCrumbData = [
          {
            title: 'INSIGHTS',
            to: '/author/reports',
          },
          {
            // pathList[3] contains the report-type
            title: pathList[3].split('-').join(' '),
            to: exitPath,
          },
        ]
        break
      case 'manageClass':
      default:
        breadCrumbData = [
          {
            title: 'MANAGE CLASS',
            to: '/author/manageClass',
          },
          ...(type !== 'class'
            ? [
                {
                  title: 'GROUPS',
                  to: '/author/manageClass',
                  state: { currentTab: 'group' },
                },
              ]
            : []),
        ]
    }
    return [...breadCrumbData, createClassBreadCrumb]
  }

  render() {
    const {
      form,
      courseList,
      userOrgData,
      isSearching,
      creating,
      error,
      filteredCurriculums,
      setSubject,
      selectedSubject,
      entity,
      allTagsData,
      addNewTag,
      history,
      location,
      userRole,
      isVisible,
      setShowClassCreationModal,
      setCreateClassTypeDetails,
      createClassType,
      userFeatures,
    } = this.props

    const { type, exitPath } = createClassType || {}

    const { _id: classId, tags } = entity
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form
    const {
      defaultGrades,
      defaultSubjects,
      interestedCurriculums,
      defaultSchool,
      schools,
    } = userOrgData
    const { submitted } = this.state

    const modalTitle = (
      <Row gutter={96}>
        <Col span={12}>
          <StyledDiv>
            <TitleHeader>Enter your {type || 'class'} details</TitleHeader>
            <TitleParagraph>before we go ahead</TitleParagraph>
          </StyledDiv>
        </Col>
        <LeftContainer span={12}>
          <LeftFields />
        </LeftContainer>
      </Row>
    )

    if (!creating && submitted && isEmpty(error)) {
      setShowClassCreationModal(false)
      if (!exitPath) {
        history.push({
          pathname: `/author/manageClass/${classId}`,
          state: location?.state,
        })
      }
    }
    return (
      <CustomModalStyled
        visible={isVisible}
        title={modalTitle}
        footer={null}
        width="900px"
        onCancel={() => {
          setShowClassCreationModal(false)
          setCreateClassTypeDetails({})
        }}
        centered
        padding="30px 60px"
        bodyPadding="0px"
        borderRadius="10px"
        closeTopAlign="14px"
        closeRightAlign="10px"
        closeIconColor="black"
      >
        <FormWrapper onSubmit={this.handleSubmit}>
          <Spin spinning={creating}>
            <RightFields
              selectedSubject={selectedSubject}
              filteredCurriculums={filteredCurriculums}
              getFieldDecorator={getFieldDecorator}
              getFieldValue={getFieldValue}
              defaultSchool={defaultSchool}
              courseList={courseList}
              schoolList={schools}
              searchCourse={this.searchCourse}
              isSearching={isSearching}
              setSubject={setSubject}
              userOrgData={userOrgData}
              clearStandards={this.clearStandards}
              tags={tags}
              setFieldsValue={setFieldsValue}
              allTagsData={allTagsData}
              addNewTag={addNewTag}
              type={type || 'class'}
              userRole={userRole}
              defaultGrades={defaultGrades}
              defaultSubjects={defaultSubjects}
              interestedCurriculums={interestedCurriculums}
              isCourseVisible={userFeatures?.selectCourse}
            />
          </Spin>
        </FormWrapper>
      </CustomModalStyled>
    )
  }
}

const ClassCreateForm = Form.create()(ClassCreate)

const enhance = compose(
  withNamespaces('classCreate'),
  withRouter,
  connect(
    (state) => {
      const selectedSubject = getSelectedSubject(state)
      return {
        curriculums: getCurriculumsListSelector(state),
        courseList: getCoursesForDistrictSelector(state),
        isSearching: get(state, 'coursesReducer.searching'),
        userOrgData: getUserOrgData(state),
        userId: get(state, 'user.user._id'),
        creating: get(state, 'manageClass.creating'),
        error: get(state, 'manageClass.error'),
        entity: get(state, 'manageClass.entity'),
        allTagsData: getAllTagsSelector(state, 'group'),
        filteredCurriculums: getFormattedCurriculumsSelector(state, {
          subject: selectedSubject,
        }),
        selectedSubject,
        userRole: getUserRole(state),
        userFeatures: getUserFeatures(state),
        districtId: getUserOrgId(state),
        createClassType: get(state, 'manageClass.createClassType'),
      }
    },
    {
      getCurriculums: getDictCurriculumsAction,
      createClass: createClassAction,
      getAllTags: getAllTagsAction,
      addNewTag: addNewTagAction,
      searchCourseList: receiveSearchCourseAction,
      setSubject: setSubjectAction,
      setShowClassCreationModal: setShowClassCreationModalAction,
      setCreateClassTypeDetails: setCreateClassTypeDetailsAction,
    }
  )
)

export default enhance(ClassCreateForm)

const StyledDiv = styled(Row)`
  padding-top: 20px;
`
const FormWrapper = styled(Form)`
  .ant-row {
    text-align: left;
    padding: 0px;
    label {
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      text-transform: uppercase;
      color: #000000;
      &:after {
        display: none;
      }
    }
    .ant-form-item-children {
      .ant-input {
        min-height: 45px;
        margin-top: 10px;
      }
      .remote-autocomplete-dropdown {
        line-height: normal;
        .ant-input-affix-wrapper {
          .ant-input {
            min-height: 45px;
          }
        }
      }
      .ant-select-selection .ant-select-selection__rendered {
        min-height: 45px;
        .ant-select-selection-selected-value {
          margin-top: 7px;
        }
      }
      .ant-select-selection__choice {
        height: 35px !important;
      }
      .ant-select-arrow {
        top: 50% !important;
      }
    }
  }
`
