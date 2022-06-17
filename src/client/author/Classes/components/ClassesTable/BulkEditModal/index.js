import { tagsApi } from '@edulastic/api'
import {
  DatePickerStyled,
  EduButton,
  FieldLabel,
  notification,
  RadioBtn,
  RadioGrp,
  SelectInputStyled,
  StyledComponents,
  CustomModalStyled,
} from '@edulastic/common'
import { Form, Icon, Select, Table } from 'antd'
import { debounce, uniq } from 'lodash'
import moment from 'moment'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { ButtonsContainer } from '../../../../../common/styled'
import { currentDistrictInstitutionIds } from '../../../../src/selectors/user'
import { addNewTagAction, getAllTagsAction } from '../../../../TestPage/ducks'
import selectsData from '../../../../TestPage/components/common/selectsData'
import { FieldWrapper } from './styled'

const { Button } = StyledComponents
const { Option } = Select

const { allGrades, allSubjects } = selectsData

const CONFIG = {
  course: 'Course',
  tags: 'Tags',
  endDate: 'End Date',
  grades: 'Grade',
  subject: 'Subject',
}

function BulkEditModal({
  bulkEditData: { showModal, updateMode, updateView },
  districtId,
  onCloseModal,
  setBulkEditMode,
  setBulkEditUpdateView,
  selectedIds,
  selectedClasses = [],
  bulkUpdateClasses,
  searchCourseList,
  coursesForDistrictList,
  institutionIds,
  form,
  allTagsData,
  addNewTag,
  t,
}) {
  const [value, setValue] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const { setFieldsValue, getFieldValue, getFieldDecorator } = form

  const handleSubmit = () => {
    let updatedData = value
    if (updateMode === 'tags') {
      const tags = getFieldValue('tags')
      updatedData = tags.map((tag) => allTagsData?.find((o) => o?._id === tag))
    }

    // end date should not be less than the start date
    let isInvalidEndDate = false
    if (updateMode === 'endDate') {
      isInvalidEndDate = selectedClasses.some(
        ({ _source = {} }) => updatedData < _source.startDate
      )
    }

    if (isInvalidEndDate) {
      return notification({ messageKey: 'startDateGreaterThanEndDate' })
    }

    bulkUpdateClasses({
      groupIds: selectedIds,
      districtId,
      [updateMode]: updatedData,
      institutionIds,
    })
  }

  const fetchCoursesForDistrict = debounce((_searchValue) => {
    const searchParams = _searchValue
      ? {
          search: {
            name: [{ type: 'cont', value: _searchValue }],
            number: [{ type: 'cont', value: _searchValue }],
            operator: 'or',
          },
        }
      : {}
    const data = {
      districtId,
      active: 1,
      page: 0,
      limit: 50,
      ...searchParams,
    }
    searchCourseList(data)
  }, 1000)

  const selectTags = async (id) => {
    let newTag = {}
    const tempSearchValue = searchValue
    if (id === searchValue) {
      setSearchValue('')
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
    setSearchValue('')
  }

  const deselectTags = (id) => {
    const tagsSelected = getFieldValue('tags')
    const newTags = tagsSelected.filter((tag) => tag !== id)
    setFieldsValue({ tags: newTags })
  }

  const searchTags = async (_value) => {
    if (
      allTagsData?.some(
        (tag) =>
          tag?.tagName.toLowerCase() === _value.toLowerCase() ||
          tag?.tagName.toLowerCase() === _value?.trim().toLowerCase()
      )
    ) {
      setSearchValue('')
    } else {
      setSearchValue(_value)
    }
  }

  const disabledDate = (current) => current && current < moment().startOf('day')

  const renderEditableView = () => {
    switch (updateMode) {
      case 'course':
        return (
          <FieldWrapper>
            <FieldLabel>
              {t('class.components.bulkedit.chosecourse')}
            </FieldLabel>
            <SelectInputStyled
              style={{ width: '100%' }}
              showSearch
              onSearch={fetchCoursesForDistrict}
              notFoundContent={null}
              placeholder="Please enter 1 or more characters"
              onChange={(val) => setValue(val)}
              filterOption={false}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {coursesForDistrictList.map((course) => (
                <Option key={course._id} value={course._id}>
                  {`${course.name} - ${course.number}`}
                </Option>
              ))}
            </SelectInputStyled>
          </FieldWrapper>
        )
      case 'grades':
        return (
          <FieldWrapper>
            <FieldLabel>{t('class.components.bulkedit.addgrades')}</FieldLabel>
            <SelectInputStyled
              style={{ width: '100%' }}
              mode="multiple"
              notFoundContent={null}
              placeholder="Please enter 1 or more characters"
              onChange={(val) => setValue(val)}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              optionFilterProp="children"
            >
              {allGrades.map((el) => (
                <Option key={el.value} value={el.value}>
                  {el.text}
                </Option>
              ))}
            </SelectInputStyled>
          </FieldWrapper>
        )
      case 'subject':
        return (
          <FieldWrapper>
            <FieldLabel>
              {t('class.components.bulkedit.choosesubject')}
            </FieldLabel>
            <SelectInputStyled
              style={{ width: '100%' }}
              notFoundContent={null}
              placeholder="Please enter 1 or more characters"
              onChange={(val) => setValue(val)}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {allSubjects.map((el) => (
                <Option key={el.value} value={el.value}>
                  {el.text}
                </Option>
              ))}
            </SelectInputStyled>
          </FieldWrapper>
        )
      case 'tags':
        return (
          <FieldWrapper>
            <FieldLabel>{t('class.components.bulkedit.addtags')}</FieldLabel>
            {getFieldDecorator('tags')(
              <SelectInputStyled
                data-cy="tagsSelect"
                mode="multiple"
                style={{ marginBottom: 0, width: '100%' }}
                optionLabelProp="title"
                placeholder={t('class.components.bulkedit.selecttags')}
                onSearch={searchTags}
                onSelect={selectTags}
                onDeselect={deselectTags}
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
          </FieldWrapper>
        )
      case 'endDate':
        return (
          <FieldWrapper>
            <FieldLabel>
              {t('class.components.bulkedit.choseenddate')}
            </FieldLabel>
            <DatePickerStyled
              disabledDate={disabledDate}
              onChange={(date) => setValue(date.valueOf())}
              format="ll"
            />
          </FieldWrapper>
        )
      default:
        return <span>{t('class.components.bulkedit.default')}</span>
    }
  }

  const selectedClassesWithDateFormat = selectedClasses?.map((data) => {
    const { _source = {} } = data || {}
    if (_source?.endDate) _source.endDate = moment(_source.endDate).format('ll')
    return data
  })

  return (
    <CustomModalStyled
      visible={showModal}
      title={t('class.components.bulkedit.title')}
      onCancel={onCloseModal}
      maskClosable={false}
      centered
      footer={[
        updateView ? (
          <EduButton key="update" onClick={handleSubmit}>
            {t('class.components.bulkedit.updateclasses')}
          </EduButton>
        ) : (
          <ButtonsContainer>
            <EduButton isGhost onClick={onCloseModal}>
              {t('class.components.bulkedit.cancel')}
            </EduButton>
            <EduButton onClick={() => setBulkEditUpdateView(true)}>
              {t('class.components.bulkedit.proceed')}
            </EduButton>
          </ButtonsContainer>
        ),
      ]}
    >
      {updateView ? (
        <>
          <Button
            onClick={() => setBulkEditUpdateView(false)}
            style={{ marginBottom: '10px' }}
          >
            <Icon type="left" />
            {t('class.components.bulkedit.back')}
          </Button>
          <Table
            rowKey={(record) => record._id}
            dataSource={selectedClassesWithDateFormat}
            pagination={false}
            columns={
              updateMode === 'tags'
                ? [
                    {
                      title: 'Name',
                      dataIndex: '_source.name',
                    },
                    {
                      title: CONFIG[updateMode],
                      dataIndex: `_source.${updateMode}`,
                      render: (tags) => {
                        if (Array.isArray(tags)) {
                          return tags.map((tag, i, allTags) => (
                            <span key={tag._id} style={{ margin: '3px' }}>
                              {tag.tagName}
                              {+i + 1 < allTags.length ? ', ' : ''}
                            </span>
                          ))
                        }
                        return null
                      },
                    },
                  ]
                : [
                    {
                      title: 'Name',
                      dataIndex: '_source.name',
                    },
                    {
                      title: CONFIG[updateMode],
                      dataIndex:
                        updateMode === 'course'
                          ? `_source.${updateMode}.name`
                          : `_source.${updateMode}`,
                    },
                  ]
            }
          />
          {renderEditableView()}
        </>
      ) : (
        <>
          <h4>
            {`You have selected ${selectedClasses.length} Class(es) to update, please select the bulk action required`}
          </h4>
          <RadioGrp
            onChange={(evt) => setBulkEditMode(evt.target.value)}
            value={updateMode}
          >
            <RadioBtn mb="5px" value="course">
              {t('class.components.bulkedit.changecourseassociation')}
            </RadioBtn>
            <RadioBtn mb="5px" value="grades">
              {t('class.components.bulkedit.updategrades')}
            </RadioBtn>
            <RadioBtn mb="5px" value="subject">
              {t('class.components.bulkedit.updatesubject')}
            </RadioBtn>
            <RadioBtn mb="5px" value="tags">
              {t('class.components.bulkedit.updatetags')}
            </RadioBtn>
            <RadioBtn mb="5px" value="endDate">
              {t('class.components.bulkedit.updateenddate')}
            </RadioBtn>
          </RadioGrp>
        </>
      )}
    </CustomModalStyled>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      institutionIds: currentDistrictInstitutionIds(state),
    }),
    {
      getAllTags: getAllTagsAction,
      addNewTag: addNewTagAction,
    }
  ),
  Form.create()
)

export default enhance(BulkEditModal)
