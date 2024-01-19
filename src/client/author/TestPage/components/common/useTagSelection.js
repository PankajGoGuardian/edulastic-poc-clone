import { notification } from '@edulastic/common'
import { uniqBy } from 'lodash'
import { useMemo, useState } from 'react'
import { tagsApi } from '@edulastic/api'

const useTagSelection = ({ allTagsData, tags, onChangeField, addNewTag }) => {
  const [searchValue, setSearchValue] = useState('')
  const newAllTagsData = uniqBy([...allTagsData, ...tags], '_id')

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

  const selectedTags = useMemo(() => tags.map((t) => t._id), [tags])
  return {
    searchValue,
    newAllTagsData,
    selectTags,
    deselectTags,
    searchTags,
    selectedTags,
  }
}

export default useTagSelection
