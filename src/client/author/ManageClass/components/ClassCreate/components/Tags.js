import { tagsApi } from '@edulastic/api'
import { SelectInputStyled, notification } from '@edulastic/common'
import { Select } from 'antd'
import { uniq } from 'lodash'
import React, { useState } from 'react'
import { FieldLabel } from './index'

const Tags = (props) => {
  const {
    tags = [],
    allTagsData,
    addNewTag,
    setFieldsValue,
    getFieldValue,
  } = props
  const [searchValue, setSearchValue] = useState('')
  const selectTags = async (id) => {
    let newTag = {}
    const tempSearchValue = searchValue
    setSearchValue('')
    if (id === searchValue) {
      try {
        const { _id, tagName } = await tagsApi.create({
          tagName: tempSearchValue.trim(),
          tagType: 'group',
        })
        newTag = { _id, tagName }

        const tagsSelected = getFieldValue('tags')
        const newTags = uniq([...tagsSelected, newTag._id])
        setFieldsValue({ tags: newTags.filter((t) => t !== tempSearchValue) })

        addNewTag({ tag: newTag, tagType: 'group' })
      } catch (e) {
        const tagsSelected = getFieldValue('tags')
        setFieldsValue({
          tags: tagsSelected.filter((t) => t !== tempSearchValue),
        })
        notification({ messageKey: 'savingTagErr' })
      }
    }
  }

  const deselectTags = (id) => {
    const tagsSelected = getFieldValue('tags')
    const newTags = tagsSelected.filter((tag) => tag !== id)
    setFieldsValue({ tags: newTags })
  }

  const searchTags = async (value) => {
    if (
      allTagsData.some(
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

  return (
    <>
      <FieldLabel
        label="Tags"
        optional
        {...props}
        fiedlName="tags"
        initialValue={tags.map((tag) => tag._id)}
      >
        <SelectInputStyled
          showArrow
          data-cy="tagsSelect"
          mode="multiple"
          style={{ marginBottom: 0 }}
          optionLabelProp="title"
          placeholder="Select Tags"
          onSearch={searchTags}
          onSelect={selectTags}
          onDeselect={deselectTags}
          filterOption={(input, option) =>
            option.props.title
              .toLowerCase()
              .includes(input.trim().toLowerCase())
          }
        >
          {searchValue.trim() ? (
            <Select.Option key={0} value={searchValue} title={searchValue}>
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
      </FieldLabel>
    </>
  )
}

export default Tags
