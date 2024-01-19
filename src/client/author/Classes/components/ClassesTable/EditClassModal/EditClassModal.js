import { tagsApi } from '@edulastic/api'
import {
  CustomModalStyled,
  DatePickerStyled,
  EduButton,
  notification,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Form, Row, Select } from 'antd'
import { debounce, uniq, uniqBy } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'
import selectsData from '../../../../TestPage/components/common/selectsData'

const { Option } = Select
const { allGrades, allSubjects } = selectsData
class EditClassModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
    }
  }

  onSaveClass = () => {
    const { form } = this.props
    form.validateFields((err, row) => {
      const {
        selClassData: {
          _source: { parent, districtId, standardSets, startDate } = {},
        } = {},
        allTagsData,
        saveClass,
      } = this.props
      if (!err) {
        const saveClassData = {
          name: row.name,
          type: 'class',
          owners: [row.teacher],
          parent,
          districtId,
          institutionId: row.institutionId,
          subject: row.subject,
          grades: row.grades,
          tags: row.tags.map((t) => allTagsData.find((e) => e._id === t)),
          // not implemented in add model so sending empty
          // if not present i.e. created in da settings
          standardSets: standardSets || [],
          courseId: row.courseId,
        }

        const endDate = row?.endDate?.valueOf()

        if (startDate && endDate) {
          // end date should not be less than the start date
          let isInvalidEndDate = false
          isInvalidEndDate = startDate > endDate

          if (isInvalidEndDate) {
            return notification({ messageKey: 'startDateGreaterThanEndDate' })
          }

          Object.assign(saveClassData, { endDate })
        }

        saveClass(saveClassData)
      }
    })
  }

  fetchCoursesForDistrict = debounce((value) => {
    const { userOrgId: districtId, searchCourseList } = this.props
    const searchTerms = {
      districtId,
      active: 1,
      page: 0,
      limit: 50,
    }
    if (value)
      Object.assign(searchTerms, {
        search: {
          name: [{ type: 'cont', value }],
          number: [{ type: 'cont', value }],
          operator: 'or',
        },
      })

    searchCourseList(searchTerms)
  }, 1000)

  onCloseModal = () => {
    const { closeModal } = this.props
    closeModal()
  }

  selectTags = async (id) => {
    const { form } = this.props
    const { setFieldsValue, getFieldValue } = form
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
    const { form } = this.props
    const { setFieldsValue, getFieldValue } = form
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
      selClassData,
      schoolsData = [],
      teacherList = [],
      coursesForDistrictList = [],
      allTagsData,
      t,
      form,
    } = this.props
    const { searchValue } = this.state
    const {
      _source: {
        owners = [],
        name,
        subject,
        institutionId = '',
        institutionName = '',
        grades,
        tags,
        endDate,
        course = {},
        primaryTeacherId,
        parent,
      } = {},
    } = selClassData

    let courseFinalList = [...coursesForDistrictList]
    const ownerId = primaryTeacherId || parent?.id
    if (course?.id) {
      courseFinalList.push({ _id: course.id, name: course.name })
      courseFinalList = uniqBy(courseFinalList, '_id')
    }

    let teacherFinalList = [...teacherList]
    const owner = owners?.find((o) => o.id == ownerId)
    if (owners.length) {
      teacherFinalList.push({
        _id: owner?.id,
        firstName: owner?.name,
        email: owner?.email,
      })
      teacherFinalList = uniqBy(teacherFinalList, '_id')
    }

    let schoolsFinalList = [...schoolsData]
    if (institutionId && institutionName) {
      schoolsFinalList.push({ _id: institutionId, name: institutionName })
      schoolsFinalList = uniqBy(schoolsFinalList, '_id')
    }

    const schoolsOptions = []
    if (schoolsFinalList.length) {
      schoolsFinalList.forEach((row) => {
        schoolsOptions.push(
          <Option key={row._id} value={row._id} title={row.name}>
            {row.name}
          </Option>
        )
      })
    }

    const teacherOptions = []
    if (teacherFinalList.length) {
      teacherFinalList.forEach((row) => {
        const teacherName = row.lastName
          ? `${row.firstName} ${row.lastName}`
          : `${row.firstName || 'Anonymous'}`
        teacherOptions.push(<Option value={row._id}>{teacherName}</Option>)
      })
    }

    const alreadySelectedTags = tags?.map((e) => e._id) || []

    const subjects = allSubjects.filter((el) => el.value !== '')

    const { getFieldDecorator } = form

    const disabledDate = (current) =>
      current && current < moment().startOf('day')

    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t('class.components.editclass.title')}
        onOk={this.onSaveClass}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton
              data-cy="cancelClassButton"
              isGhost
              onClick={this.onCloseModal}
            >
              {t('common.cancel')}
            </EduButton>
            <EduButton data-cy="saveClassButton" onClick={this.onSaveClass}>
              {t('class.components.addclass.saveclass')}
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
                initialValue: name,
              })(
                <TextInputStyled
                  data-cy="selectClassName"
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
              {getFieldDecorator('subject', {
                initialValue: subject,
              })(
                <SelectInputStyled
                  data-cy="selectSubject"
                  placeholder={t('class.components.addclass.selectsubject')}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {subjects.map((el) => (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.addclass.grade')}>
              {getFieldDecorator('grades', {
                initialValue: grades,
              })(
                <SelectInputStyled
                  data-cy="selectGrade"
                  placeholder={t('class.components.addclass.selectgrade')}
                  mode="multiple"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {allGrades.map((el) => (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.addclass.course')}>
              {getFieldDecorator('courseId', {
                initialValue: course && course.id,
              })(
                <SelectInputStyled
                  data-cy="selectCourse"
                  showSearch
                  placeholder={t(
                    'class.components.addclass.placeholder.course'
                  )}
                  onSearch={this.fetchCoursesForDistrict}
                  onFocus={this.fetchCoursesForDistrict}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  defaultValue={{ key: course.id }}
                  filterOption={false}
                >
                  {courseFinalList.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {`${c.name}${c.number ? ` - ${c.number}` : ''}`}
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
              {getFieldDecorator('tags', {
                initialValue: alreadySelectedTags,
              })(
                <SelectInputStyled
                  placeholder={t('class.components.addclass.placeholder.tags')}
                  data-cy="tagsSelect"
                  mode="multiple"
                  style={{ marginBottom: 0 }}
                  optionLabelProp="title"
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
                initialValue: ownerId,
              })(
                <SelectInputStyled
                  data-cy="selectTeacher"
                  placeholder="Search by Username"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {teacherOptions}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.addclass.schoolname')}>
              {getFieldDecorator('institutionId', {
                rules: [
                  {
                    required: true,
                    message: t('class.components.addclass.validation.school'),
                  },
                ],
                initialValue: institutionId,
              })(
                <SelectInputStyled
                  data-cy="selectSchool"
                  placeholder={t('class.components.addclass.selectschool')}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {schoolsOptions}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('class.components.editclass.enddate')}>
              {getFieldDecorator('endDate', {
                initialValue: moment(endDate),
              })(
                <DatePickerStyled
                  data-cy="selectEnddate"
                  disabledDate={disabledDate}
                  style={{ width: '100%' }}
                  format="ll"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </CustomModalStyled>
    )
  }
}

EditClassModal.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
  }).isRequired,
  selClassData: PropTypes.object,
  modalVisible: PropTypes.bool,
  saveClass: PropTypes.string,
  closeModal: PropTypes.string,
  schoolsData: PropTypes.array,
  teacherList: PropTypes.array,
  userOrgId: PropTypes.string,
  searchCourseList: PropTypes.string,
  coursesForDistrictList: PropTypes.array,
  allTagsData: PropTypes.array,
  addNewTag: PropTypes.string,
  t: PropTypes.func.isRequired,
}

EditClassModal.defaultProps = {
  selClassData: {},
  modalVisible: false,
  saveClass: '',
  closeModal: '',
  schoolsData: [],
  teacherList: [],
  userOrgId: '',
  searchCourseList: '',
  coursesForDistrictList: [],
  allTagsData: [],
  addNewTag: '',
}

const EditClassModalForm = Form.create()(EditClassModal)
export default EditClassModalForm
