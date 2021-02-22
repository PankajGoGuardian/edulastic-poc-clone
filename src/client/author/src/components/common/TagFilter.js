import React, { useMemo, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { uniqBy } from 'lodash'
import { Select } from 'antd'
import { SelectInputStyled, notification } from '@edulastic/common'
import { tagsApi } from '@edulastic/api'
import {
  getAllTagsAction,
  getAllTagsSelector,
  addNewTagAction,
} from '../../../TestPage/ducks'

const TagFilter = ({
  selectedTags = [],
  testTagList = [],
  onChangeField = () => {},
  addNewTag = () => {},
  canCreate = false,
  getAllTags = () => {},
  margin = '0px',
  tagType = 'assignment',
  selectedTagIds,
}) => {
  let selectedTagObjects = selectedTags
  if (selectedTagIds && !selectedTags.length) {
    selectedTagObjects = testTagList.filter(({ _id }) =>
      selectedTagIds.includes(_id)
    )
  }
  const newAllTagsData = uniqBy([...testTagList, ...selectedTagObjects], '_id')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    getAllTags({ type: ['test', 'assignment'] })
  }, [])

  const selectTags = async (id) => {
    let newTag = {}
    if (id === searchValue) {
      const tempSearchValue = searchValue
      setSearchValue('')
      try {
        const { _id, tagName } = await tagsApi.create({
          tagName: tempSearchValue,
          tagType,
        })
        newTag = { _id, tagName }
        addNewTag({ tag: newTag, tagType })
      } catch (e) {
        notification({ messageKey: 'savingTagErr' })
      }
    } else {
      newTag = newAllTagsData.find((tag) => tag._id === id)
    }
    const newTags = [...selectedTagObjects, newTag]
    onChangeField('tags', newTags)
    setSearchValue('')
  }

  const deselectTags = (id) => {
    const newTags = selectedTagObjects.filter((tag) => tag._id !== id)
    onChangeField('tags', newTags)
  }

  const searchTags = async (value) => {
    if (!canCreate) return

    if (
      newAllTagsData.some(
        (tag) =>
          tag.tagName.toLowerCase() === value.toLowerCase() ||
          tag.tagName.toLowerCase() === value.trim().toLowerCase()
      )
    ) {
      setSearchValue('')
    } else {
      setSearchValue(value)
    }
  }

  const _selectedTagIds = useMemo(() => selectedTagObjects.map((t) => t._id), [
    selectedTagObjects,
  ])

  return (
    <SelectInputStyled
      showArrow
      data-cy="tagsSelect"
      className="tagsSelect"
      mode="multiple"
      optionLabelProp="title"
      placeholder="Please select"
      value={_selectedTagIds}
      onSearch={searchTags}
      onSelect={selectTags}
      onDeselect={deselectTags}
      getPopupContainer={(trigger) => trigger.parentNode}
      filterOption={(input, option) =>
        option.props.title.toLowerCase().includes(input.trim().toLowerCase())
      }
      margin={margin}
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
  )
}

export default connect(
  (state) => ({
    testTagList: getAllTagsSelector(state, 'test'),
    assignmentTagList: getAllTagsSelector(state, 'assignment'),
  }),
  { getAllTags: getAllTagsAction, addNewTag: addNewTagAction }
)(TagFilter)
