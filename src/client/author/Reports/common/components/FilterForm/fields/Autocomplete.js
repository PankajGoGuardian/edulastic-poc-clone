import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SelectSearch } from '@edulastic/common'
import { debounce } from 'lodash'

function Autocomplete(props) {
  const {
    onChange: triggerChange,
    searchOptions: _searchOptionsApi,
    clearSearchOnBlur = true,
    ...restProps
  } = props
  const [searchTerm, setSearchTerm] = useState('')
  const [options, setOptions] = useState([])
  const isMultiple = restProps.mode === 'multiple'

  const onSearch = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  const onChange = useCallback(
    (selected, selectedElements) => {
      selectedElements = Array.isArray(selectedElements)
        ? selectedElements
        : selectedElements
        ? [selectedElements]
        : []
      const values = selectedElements.map((el) => ({
        key: el.props.value,
        title: el.props.title,
      }))
      triggerChange?.(isMultiple ? values : values[0])
    },
    [triggerChange]
  )

  const onBlur = useCallback(() => {
    // reset the search keyword
    if (clearSearchOnBlur) {
      setSearchTerm('')
    }
  }, [setSearchTerm, clearSearchOnBlur])

  const searchOptionsApiDebounced = useCallback(
    debounce(
      async (term) => {
        const result = await _searchOptionsApi(term)
        const _options = result.map((r) => ({
          key: r.key ?? r._id,
          title: r.title ?? r.name,
        }))
        setOptions(_options)
      },
      500,
      { trailing: true }
    ),
    [_searchOptionsApi]
  )

  useEffect(() => {
    searchOptionsApiDebounced(searchTerm)
  }, [searchOptionsApiDebounced, searchTerm])

  return (
    <SelectSearch
      onChange={onChange}
      onSearch={onSearch}
      onBlur={onBlur}
      options={options}
      labelInValue
      {...restProps}
    />
  )
}

Autocomplete.propTypes = {
  onChange: PropTypes.func,
  searchOptions: PropTypes.array,
}
Autocomplete.defaultProps = {}

export default Autocomplete
