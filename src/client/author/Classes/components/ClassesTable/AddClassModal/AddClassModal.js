import { schoolApi, tagsApi, userApi } from '@edulastic/api'
import {
  CustomModalStyled,
  EduButton,
  notification,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Form, Row, Select, Spin } from 'antd'
import { debounce, get, uniq } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'
import {
  getCourseLoading,
  getCoursesForDistrictSelector,
} from '../../../../Courses/ducks'
import selectsData from '../../../../TestPage/components/common/selectsData'

const { Option } = Select
const { allGrades, allSubjects } = selectsData

class AddClassModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      schoolList: [],
      fetchingSchool: false,
      teacherList: [],
      fetchingTeacher: false,
      searchValue: '',
    }
    this.fetchSchool = debounce(this.fetchSchool, 1000)
    this.fetchTeacher = debounce(this._fetchTeacher, 1000)
    this.fetchCoursesForDistrict = debounce(this.fetchCoursesForDistrict, 1000)
  }

  selectTeacherRef = React.createRef()

  onAddClass = () => {
    this.props.form.validateFieldsAndScroll((err, user) => {
      if (!err) {
        const {
          teacher,
          name,
          institutionId,
          subject,
          tags,
          courseId,
          grades,
        } = user
        const { allTagsData } = this.props

        const createClassData = {
          name,
          type: 'class',
          owners: [teacher.key],
          institutionId: institutionId.key,
          subject: subject || 'Other Subjects',
          tags: tags && tags.map((t) => allTagsData.find((o) => o._id === t)),
          courseId,
          // here multiple grades has to be sent as a comma separated string
          grades,
          // not implemented in add model so sending empty
          standardSets: [],
        }
        this.props.addClass(createClassData)
      }
    })
  }

  onCloseModal = () => {
    this.props.closeModal()
  }

  fetchSchool = async (value) => {
    // here searchParams is added only when value exists
    const searchParam = value
      ? { search: { name: [{ type: 'cont', value }] } }
      : {}
    this.setState({ schoolList: [], fetchingSchool: true })
    const schoolListData = await schoolApi.getSchools({
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      ...searchParam,
    })
    this.setState({ schoolList: schoolListData.data, fetchingSchool: false })
  }

  handleSchoolChange = () => {
    // this code was commented out since the form handles setting of fields automatically, and
    // there is no need to manually set fields
    // this.props.form.setFieldsValue({ institutionId: value });
    this.setState({
      schoolList: [],
      fetchingSchool: false,
    })
  }

  fetchCoursesForDistrict = (value) => {
    const { userOrgId: districtId, searchCourseList } = this.props
    const searchTerms = {
      districtId,
      active: 1,
      page: 0,
      limit: 50,
    }
    value &&
      Object.assign(searchTerms, {
        search: {
          name: [{ type: 'cont', value }],
          number: [{ type: 'cont', value }],
          operator: 'or',
        },
      })
    searchCourseList(searchTerms)
  }

  _fetchTeacher = async (value) => {
    this.setState({ teacherList: [], fetchingTeacher: true })
    const searchData = {
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      role: 'teacher',
      status: 1,
    }

    value &&
      Object.assign(searchData, {
        search: {
          username: [{ type: 'cont', value }],
          email: [{ type: 'cont', value }],
        },
      })

    const { result: teacherListData } = await userApi.fetchUsers(searchData)
    this.setState({ teacherList: teacherListData, fetchingTeacher: false })
  }

  handleTeacherChange = () => {
    // this code was commented out since the form handles setting of fields automatically, and
    // there is no need to manually set fields
    // this.props.form.setFieldsValue({ teacher: value });
    this.setState({
      teacherList: [],
      fetchingTeacher: false,
    })
    this.selectTeacherRef.current.blur()
  }

  selectTags = async (id) => {
    const { setFieldsValue, getFieldValue } = this.props.form
    const { searchValue } = this.state
    const { allTagsData, addNewTag } = this.props
    let newTag = {}
    const tempSearchValue = searchValue
    if (id === searchValue) {
      this.setState({ searchValue: '' })
      try {
        const { _id, tagName } = await tagsApi.create({
          tagName: tempSearchValue,
          tagType: 'group',
        })
        newTag = { _id, tagName }
        addNewTag({ tag: newTag, tagType: 'group' })
      } catch (e) {
        notification({ messageKey: 'savingTagFailed' })
      }
    } else {
      newTag = allTagsData.find((tag) => tag._id === id)
    }
    const tagsSelected = getFieldValue('tags') || []
    const newTags = uniq([...tagsSelected, newTag._id])
    setFieldsValue({ tags: newTags.filter((tag) => tag !== tempSearchValue) })
    this.setState({ searchValue: '' })
  }

  deselectTags = (id) => {
    const { setFieldsValue, getFieldValue } = this.props.form
    const tagsSelected = getFieldValue('tags')
    const newTags = tagsSelected.filter((tag) => tag !== id)
    setFieldsValue({ tags: newTags })
  }

  searchTags = async (value) => {
    const { allTagsData } = this.props
    if (
      allTagsData.some(
        (tag) =>
          tag.tagName.toLowerCase() === value.toLowerCase() ||
          tag.tagName.toLowerCase() === value.trim().toLowerCase()
      )
    ) {
      this.setState({ searchValue: '' })
    } else {
      this.setState({ searchValue: value })
    }
  }

  render() {
    const {
      modalVisible,
      allTagsData,
      t,
      courseList,
      fetchingCourse = false,
    } = this.props
    const {
      fetchingSchool,
      schoolList,
      fetchingTeacher,
      teacherList,
      searchValue,
    } = this.state

    const { getFieldDecorator } = this.props.form
    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t('class.components.addclass.title')}
        onOk={this.onAddClass}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal}>
              {t('common.cancel')}
            </EduButton>
            <EduButton onClick={this.onAddClass}>
              {t('class.components.addclass.title')}
            </EduButton>
          </ButtonsContainer>,
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.addclass.classname')}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: t('class.components.addclass.validation.class'),
                  },
                ],
              })(
                <TextInputStyled
                  placeholder={t('class.components.addclass.classname')}
                  maxLength={128}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.addclass.subject')}>
              {getFieldDecorator('subject')(
                <SelectInputStyled
                  placeholder={t('class.components.addclass.selectsubject')}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {allSubjects.map((el) => (
                    <Option key={el.value} value={el.value}>
                      {el.text}
                    </Option>
                  ))}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.addclass.grade')}>
              {getFieldDecorator('grades')(
                <SelectInputStyled
                  mode="multiple"
                  placeholder={t('class.components.addclass.selectgrade')}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {allGrades.map(({ value, text }) => (
                    <Option key={value} value={value}>
                      {text}
                    </Option>
                  ))}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.addclass.course')}>
              {getFieldDecorator('courseId')(
                <SelectInputStyled
                  showSearch
                  onSearch={this.fetchCoursesForDistrict}
                  onFocus={this.fetchCoursesForDistrict}
                  filterOption={false}
                  notFoundContent={
                    fetchingCourse ? <Spin size="small" /> : null
                  }
                  placeholder={t(
                    'class.components.addclass.placeholder.course'
                  )}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {courseList.map((course) => (
                    <Option key={course._id} value={course._id}>
                      {`${course.name} - ${course.number}`}
                    </Option>
                  ))}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.addclass.tags')}>
              {getFieldDecorator('tags')(
                <SelectInputStyled
                  data-cy="tagsSelect"
                  mode="multiple"
                  style={{ marginBottom: 0 }}
                  optionLabelProp="title"
                  placeholder={t('class.components.addclass.selecttag')}
                  onSearch={this.searchTags}
                  onSelect={this.selectTags}
                  onDeselect={this.deselectTags}
                  filterOption={(input, option) =>
                    option.props.title
                      .toLowerCase()
                      .includes(input.trim().toLowerCase())
                  }
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {searchValue.trim() ? (
                    <Select.Option
                      key={0}
                      value={searchValue}
                      title={searchValue}
                    >
                      {`${searchValue} (Create new Tag)`}
                    </Select.Option>
                  ) : (
                    ''
                  )}
                  {allTagsData.map(({ tagName, _id }) => (
                    <Select.Option key={_id} value={_id} title={tagName}>
                      {tagName}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.addclass.teachername')}>
              {getFieldDecorator('teacher', {
                rules: [
                  {
                    required: true,
                    message: t('class.components.addclass.validation.teacher'),
                  },
                ],
              })(
                <SelectInputStyled
                  showSearch
                  labelInValue
                  placeholder={t(
                    'class.components.addclass.placeholder.teacher'
                  )}
                  notFoundContent={
                    fetchingTeacher ? <Spin size="small" /> : null
                  }
                  filterOption={false}
                  onSearch={this.fetchTeacher}
                  onFocus={this.fetchTeacher}
                  onChange={this.handleTeacherChange}
                  ref={this.selectTeacherRef}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {teacherList.map((teacher) => (
                    <Option key={teacher._id} value={teacher._id}>
                      {`${
                        get(teacher, ['_source', 'username'], '') ||
                        get(teacher, ['_source', 'email'], '')
                      }`}
                    </Option>
                  ))}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.addclass.selectschool')}>
              {getFieldDecorator('institutionId', {
                rules: [
                  {
                    required: true,
                    message: t('class.components.addclass.validation.school'),
                  },
                ],
              })(
                <SelectInputStyled
                  showSearch
                  labelInValue
                  placeholder={t(
                    'class.components.addclass.placeholder.school'
                  )}
                  notFoundContent={
                    fetchingSchool ? <Spin size="small" /> : null
                  }
                  filterOption={false}
                  onSearch={this.fetchSchool}
                  onChange={this.handleSchoolChange}
                  onFocus={this.fetchSchool}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {schoolList.map((school) => (
                    <Option key={school._id} value={school._id}>
                      {school._source.name}
                    </Option>
                  ))}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </CustomModalStyled>
    )
  }
}

const AddClassModalForm = Form.create()(AddClassModal)

const mapStateToProps = (state) => ({
  courseList: getCoursesForDistrictSelector(state),
  fetchingCourse: getCourseLoading(state),
})
export default connect(mapStateToProps, null)(AddClassModalForm)
