import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { uniqBy } from 'lodash'
import { Empty, Select } from 'antd'
import { SelectInputStyled, notification } from '@edulastic/common'
import { tagsApi } from '@edulastic/api'
import {
  getAllTagsAction,
  getAllTagsSelector,
  addNewTagAction,
} from '../../../TestPage/ducks'
import useDropdownData from '../../../Reports/common/hooks/useDropdownData'

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
  const [searchText, setSearchText] = useState('')

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
        addNewTag({ tag: newTag, tagType: 'test' })
      } catch (e) {
        notification({ messageKey: 'savingTagErr' })
      }
    } else {
      newTag = newAllTagsData.find((tag) => tag._id === id)
    }
    const newTags = [...selectedTagObjects, newTag]
    onChangeField('tags', newTags)
    setSearchValue('')
    setSearchText('')
  }

  const deselectTags = (id) => {
    const newTags = selectedTagObjects.filter((tag) => tag._id !== id)
    onChangeField('tags', newTags)
  }

  const searchTags = async (value) => {
    setSearchText(value)
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
  const onBlur = useCallback(() => {
    setSearchText('')
  }, [])
  const _selectedTagIds = useMemo(() => selectedTagObjects.map((t) => t._id), [
    selectedTagObjects,
  ])
  const options = useDropdownData(newAllTagsData, {
    title_key: 'tagName',
    id_key: '_id',
    value_key: '_id',
    searchText,
    OptionComponent: Select.Option,
  })
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
      onBlur={onBlur}
      getPopupContainer={(trigger) => trigger.parentNode}
      filterOption={(input, option) =>
        option.props.title.toLowerCase().includes(input.trim().toLowerCase())
      }
      margin={margin}
      notFoundContent={
        <Empty
          className="ant-empty-small"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ textAlign: 'left', margin: '10px 0' }}
          description="No matching results"
        />
      }
    >
      {searchValue?.trim() ? (
        <Select.Option key={0} value={searchValue} title={searchValue}>
          {`${searchValue} (Create new Tag)`}
        </Select.Option>
      ) : (
        ''
      )}
      {options}
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
