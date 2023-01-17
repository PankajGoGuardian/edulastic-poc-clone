import React, { useRef } from 'react'
import { debounce, uniq, isEmpty, isFunction } from 'lodash'
import { SelectInputStyled } from '@edulastic/common'

const seperator = ','

const SelectWithCopyPaste = ({
  children,
  searchData,
  value: selectedValues = [],
  onChange,
  mode,
  setNoDataFound,
  optionsDisabled,
  selectIdentifier,
  handleOnSearch,
  ...props
}) => {
  const selectRef = useRef()

  const searchAndApply = debounce((searchValue) => {
    if (searchValue && searchValue.includes(seperator) && mode === 'multiple') {
      const searchValues = searchValue
        .split(seperator)
        ?.filter((item) => !!item)
        ?.map((item) => {
          const output = item?.replaceAll('"', '')
          return output?.toLowerCase()?.trim()
        })
      if (searchValues.length) {
        const validSearchedIds = []
        const noDataFound = []

        searchValues.forEach((searchVal) => {
          let id = false
          if (
            searchData.some(({ _id, name, sisId = '' }) => {
              if (optionsDisabled.includes(_id)) return false
              id = _id
              return (
                searchVal === _id.toLowerCase() ||
                searchVal === name.toLowerCase() ||
                searchVal === sisId?.toLowerCase()
              )
            })
          ) {
            id && validSearchedIds.push(id)
          } else {
            noDataFound.push(searchVal)
          }
        })

        const uniqDataIds = uniq([...selectedValues, ...validSearchedIds])

        selectRef?.current?.blur()
        setTimeout(() => {
          selectRef?.current?.focus()
        }, 500)

        onChange(uniqDataIds)

        if (!isEmpty(noDataFound)) {
          setNoDataFound({
            [selectIdentifier]: {
              data: noDataFound,
              missingData: noDataFound.length,
              total: searchValues.length,
            },
          })
        } else {
          setNoDataFound({})
        }
      }
    } else if (searchValue && handleOnSearch && isFunction(handleOnSearch)) {
      handleOnSearch(searchValue)
    }
  }, 500)

  return (
    <SelectInputStyled
      {...props}
      {...(!isEmpty(selectedValues) ? { value: selectedValues } : {})}
      onSearch={searchAndApply}
      onChange={onChange}
      mode={mode}
      ref={selectRef}
    >
      {children}
    </SelectInputStyled>
  )
}

SelectWithCopyPaste.defaultProps = {
  setNoDataFound: () => {},
  optionsDisabled: [],
}

export default SelectWithCopyPaste
