import { tagsApi } from '@edulastic/api'
import {
  FieldLabel,
  FlexContainer,
  SelectInputStyled,
  TextInputStyled,
  notification,
} from '@edulastic/common'
import { red } from '@edulastic/colors'
import { Select } from 'antd'
import { TextAreaInputStyled } from '@edulastic/common/src/components/InputStyles'

import { uniqBy, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { createRef, useEffect, useMemo, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { selectsData } from '../../../common'
import SummaryHeader from '../SummaryHeader/SummaryHeader'
import {
  AnalyticsItem,
  Block,
  ErrorWrapper,
  MetaTitle,
  StyledInput,
} from './styled'
import { getCurriculumsListSelector } from '../../../../../src/selectors/dictionaries'
import { getDictCurriculumsAction } from '../../../../../src/actions/dictionaries'

export const renderAnalytics = (title, Icon, isLiked = false, cyAttrIndex) => (
  <AnalyticsItem>
    <Icon color={isLiked ? red : '#bbbfc4'} width={15} height={15} />
    <MetaTitle data-cy={`detail_index-${cyAttrIndex}`}>{title}</MetaTitle>
  </AnalyticsItem>
)

const Sidebar = ({
  title,
  subjects,
  onChangeSubjects,
  onChangeField,
  tags = [],
  owner,
  analytics,
  grades,
  onChangeGrade,
  collections = [],
  collectionsToShow = [],
  onChangeCollection,
  description,
  createdBy,
  thumbnail,
  addNewTag,
  allTagsData,
  windowWidth,
  isEditable,
  test,
  toggleTestLikeRequest,
  curriculums,
  getCurriculums,
  handleChangeCurriculum,
  handleChangeTotalTestItems,
}) => {
  const newAllTagsData = uniqBy([...allTagsData, ...tags], '_id')
  const subjectsList = selectsData.allSubjects
  const [searchValue, setSearchValue] = useState('')
  const testTitleInput = createRef()

  useEffect(() => {
    if (testTitleInput.current) {
      testTitleInput.current.input.focus()
    }
    if (isEmpty(curriculums)) {
      getCurriculums()
    }
  }, [])

  const filteredCollections = useMemo(
    () =>
      collections.filter((c) => collectionsToShow.some((o) => o._id === c._id)),
    [collections, collectionsToShow]
  )

  const selectTags = async (id) => {
    let newTag = {}
    if (id === searchValue) {
      const tempSearchValue = searchValue
      setSearchValue('')
      try {
        const { _id, tagName } = await tagsApi.create({
          tagName: tempSearchValue,
          tagType: 'test',
        })
        newTag = { _id, tagName }
        addNewTag({ tag: newTag, tagType: 'test' })
      } catch (e) {
        notification({ messageKey: 'savingTagErr' })
      }
    } else {
      newTag = newAllTagsData.find((tag) => tag._id === id)
    }
    const newTags = [...tags, newTag]
    onChangeField('tags', newTags)
    setSearchValue('')
  }

  const deselectTags = (id) => {
    const newTags = tags.filter((tag) => tag._id !== id)
    onChangeField('tags', newTags)
  }

  const searchTags = async (value) => {
    if (
      newAllTagsData.some(
        (tag) => tag.tagName === value || tag.tagName === value.trim()
      )
    ) {
      setSearchValue('')
    } else {
      setSearchValue(value)
    }
  }

  const selectedTags = useMemo(() => tags.map((t) => t._id), [tags])

  return (
    <FlexContainer padding="30px" flexDirection="column">
      <Block>
        <SummaryHeader
          createdBy={createdBy}
          thumbnail={thumbnail}
          owner={owner}
          windowWidth={windowWidth}
          analytics={analytics}
          onChangeField={onChangeField}
          isEditable={isEditable}
          test={test}
          toggleTestLikeRequest={toggleTestLikeRequest}
        />
        <FieldLabel>Test Name</FieldLabel>
        <TextInputStyled
          showArrow
          value={title}
          data-cy="testname"
          onChange={(e) => onChangeField('title', e.target.value)}
          size="large"
          placeholder="Enter the test name"
          ref={testTitleInput}
          margin="0px 0px 15px"
        />
        {title !== undefined && !title.trim().length ? (
          <ErrorWrapper>Please enter test title.</ErrorWrapper>
        ) : null}
        <FieldLabel>Description</FieldLabel>
        <TextAreaInputStyled
          value={description}
          onChange={(e) => onChangeField('description', e.target.value)}
          size="large"
          placeholder="Enter a description"
          margin="0px 0px 15px"
          height="110px"
        />
        <FieldLabel>Grade</FieldLabel>
        <SelectInputStyled
          showArrow
          data-cy="gradeSelect"
          mode="multiple"
          size="large"
          placeholder="Please enter"
          defaultValue={grades}
          onChange={onChangeGrade}
          optionFilterProp="children"
          getPopupContainer={(trigger) => trigger.parentNode}
          margin="0px 0px 15px"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {selectsData.allGrades.map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </SelectInputStyled>

        <FieldLabel>Subject</FieldLabel>
        <SelectInputStyled
          showArrow
          data-cy="subjectSelect"
          mode="multiple"
          size="large"
          margin="0px 0px 15px"
          placeholder="Please enter"
          defaultValue={subjects}
          onChange={onChangeSubjects}
          optionFilterProp="children"
          getPopupContainer={(trigger) => trigger.parentNode}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {subjectsList.map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </SelectInputStyled>

        {test.isAdaptiveTest && (
          <>
            <FieldLabel>Standard Sets</FieldLabel>
            <SelectInputStyled
              showArrow
              data-cy="standardSets"
              mode="multiple"
              size="large"
              margin="0px 0px 15px"
              placeholder="Please select"
              onChange={handleChangeCurriculum}
              optionFilterProp="children"
              getPopupContainer={(trigger) => trigger.parentNode}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {curriculums.map(({ _id, curriculum }) => (
                <Select.Option key={_id} value={_id}>
                  {curriculum}
                </Select.Option>
              ))}
            </SelectInputStyled>

            {collectionsToShow.length > 0 && (
              <>
                <FieldLabel>Collections</FieldLabel>
                <SelectInputStyled
                  showArrow
                  data-cy="collectionsSelect"
                  mode="multiple"
                  size="large"
                  margin="0px 0px 15px"
                  placeholder="Please enter"
                  value={filteredCollections.flatMap((c) => c.bucketIds)}
                  onChange={(value, options) =>
                    onChangeCollection(value, options)
                  }
                  optionFilterProp="children"
                  getPopupContainer={(trigger) => trigger.parentNode}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {collectionsToShow.map((o) => (
                    <Select.Option
                      key={o.bucketId}
                      value={o.bucketId}
                      _id={o._id}
                      type={o.type}
                      collectionName={o.collectionName}
                    >
                      {`${o.collectionName} - ${o.name}`}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              </>
            )}

            <FieldLabel>Maximum Number of Questions</FieldLabel>
            <StyledInput
              onChange={handleChangeTotalTestItems}
              defaultValue={test.totalTestItems || 1}
              min={1}
            />
          </>
        )}

        <FieldLabel>Tags</FieldLabel>
        <SelectInputStyled
          showArrow
          data-cy="tagsSelect"
          className="tagsSelect"
          mode="multiple"
          size="large"
          margin="0px 0px 15px"
          optionLabelProp="title"
          placeholder="Please enter"
          value={selectedTags}
          onSearch={searchTags}
          onSelect={selectTags}
          onDeselect={deselectTags}
          getPopupContainer={(trigger) => trigger.parentNode}
          filterOption={(input, option) =>
            option.props.title
              .toLowerCase()
              .includes(input.trim().toLowerCase())
          }
        >
          {searchValue?.trim() ? (
            <Select.Option key={0} value={searchValue} title={searchValue}>
              {`${searchValue} (Create new Tag)`}
            </Select.Option>
          ) : (
            ''
          )}
          {newAllTagsData.map(({ tagName, _id }) => (
            <Select.Option key={_id} value={_id} title={tagName}>
              {tagName}
            </Select.Option>
          ))}
        </SelectInputStyled>
        {!!searchValue.length && !searchValue.trim().length && (
          <p style={{ color: 'red' }}>Please enter valid characters.</p>
        )}
      </Block>
    </FlexContainer>
  )
}

Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  onChangeField: PropTypes.func.isRequired,
  analytics: PropTypes.array.isRequired,
  grades: PropTypes.array.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  subjects: PropTypes.array.isRequired,
  owner: PropTypes.bool,
  description: PropTypes.string.isRequired,
  createdBy: PropTypes.object,
  thumbnail: PropTypes.string,
  onChangeSubjects: PropTypes.func.isRequired,
}

Sidebar.defaultProps = {
  owner: false,
  createdBy: '',
  thumbnail: '',
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      curriculums: getCurriculumsListSelector(state),
    }),
    {
      getCurriculums: getDictCurriculumsAction,
    }
  )
)

export default enhance(Sidebar)
