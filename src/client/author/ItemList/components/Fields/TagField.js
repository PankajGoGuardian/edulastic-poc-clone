import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SelectSearch } from '@edulastic/common'
import { debounce, uniq, compact } from 'lodash'
import {
  getKnownTagsSelector,
  getTagSearchListSelector,
  getTagSearchSelector,
  searchTagsAction,
  searchTagsByIdsAction,
} from '../../../TestPage/ducks'
import {
  getCollectionsSelector,
  getUserOrgId,
} from '../../../src/selectors/user'

export const TagField = React.forwardRef(
  (
    {
      allKnownTags,
      collections,
      isLoading,
      onChange: _onChange,
      searchTags,
      searchTagsByIds,
      tagSearchList,
      tagTypes,
      types,
      userDistrictId,
      value: _value,
      valueKey,
      ...props
    },
    tagsRef
  ) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [value, setValue] = useState([])

    const query = useMemo(
      () => ({
        aggregate: true,
        limit: 25,
        page: 1,
        search: {
          searchString: [searchTerm],
          tagTypes,
          districtIds: uniq(
            compact([
              userDistrictId,
              ...collections.map((col) => col.districtId),
            ])
          ),
        },
      }),
      [searchTerm, tagTypes.join(','), collections]
    )

    const searchTagsDebounced = useCallback(
      debounce(searchTags, 500, { trailing: true }),
      []
    )

    useEffect(() => {
      searchTagsDebounced(query)
    }, [query])

    useEffect(() => {
      setValue(
        _value.map((item) =>
          typeof valueKey === 'undefined' ? item : item[valueKey]
        )
      )
    }, [_value, valueKey])

    const unknownTags = value.filter(
      (v) => !allKnownTags.find((t) => t._id === v)
    )
    useEffect(() => {
      if (unknownTags.length) {
        searchTagsByIds(unknownTags)
      }
    }, [unknownTags.join(',')])

    const onSearch = useCallback((term) => {
      setSearchTerm(term)
    }, [])

    const onChange = useCallback((selected, selectedElements) => {
      const _selectedValues = selectedElements.map(({ props: elProps }) => ({
        title: elProps.title,
        key: elProps.value,
        associatedNames: elProps.associatedNames,
      }))
      setValue(_selectedValues.map((val) => val.key))
      _onChange(_selectedValues)
      setSearchTerm('')
    }, [])

    const options = useMemo(
      () =>
        tagSearchList.map((tag, index) => ({
          key: tag.tagName,
          title: tag.tagName,
          index,
          associatedNames: tag.tagNamesAssociated,
        })),
      [tagSearchList]
    )
    return (
      <SelectSearch
        tagsSearch
        onChange={onChange}
        onSearch={onSearch}
        value={value}
        options={options}
        loading={isLoading}
        mode="multiple"
        data-cy="selectTags"
        size="large"
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        ref={tagsRef}
        tagTypes={tagTypes}
        {...props}
      />
    )
  }
)

TagField.propTypes = {
  onChange: PropTypes.func,
}
TagField.defaultProps = {
  onChange: () => null,
}

const mapStateToProps = (state) => ({
  isLoading: getTagSearchSelector(state).isLoading,
  tagSearchList: getTagSearchListSelector(state),
  collections: getCollectionsSelector(state),
  userDistrictId: getUserOrgId(state),
  allKnownTags: getKnownTagsSelector(state),
})

const mapDispatchToProps = {
  searchTags: searchTagsAction,
  searchTagsByIds: searchTagsByIdsAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(TagField)
