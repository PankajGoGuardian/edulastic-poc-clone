import React from 'react'
import { debounce, keyBy, uniq } from 'lodash'
import { SelectInputStyled } from '@edulastic/common'

const SelectWithCopyPaste = ({
  children,
  searchData,
  value,
  onChange,
  mode,
  ...props
}) => {
  const searchAndApply = debounce((searchValue) => {
    if (searchValue && searchValue.includes(',') && mode === 'multiple') {
      let searchValues = []
      if (searchValue.split(',')?.length) {
        searchValues = searchValue.split(',')
      }
      searchValues = searchValues
        .filter((item) => !!item)
        .map((item) => {
          const output = item?.replaceAll('"', '')
          return output?.toLowerCase()?.trim()
        })
      if (searchValues.length) {
        const searchValuesKeyed = keyBy(searchValues)
        const selectedValuesKeyed = keyBy(value)
        const dataIds = searchData
          .filter(({ name, _id }) => {
            return (
              (searchValuesKeyed[_id.toLowerCase()] ||
                searchValuesKeyed[name.toLowerCase()]) &&
              !selectedValuesKeyed[_id]
            )
          })
          .map((item) => item._id)
        const uniqDataIds = uniq([...value, ...dataIds])
        const select = document.getElementById('searchSelect')
        const inputEle = select.getElementsByTagName('input')[0]
        if (dataIds.length && inputEle) {
          inputEle.blur()
          setTimeout(() => {
            inputEle.focus()
          }, 500)
        }
        onChange(uniqDataIds)
      }
    }
  }, 500)

  return (
    <SelectInputStyled
      {...props}
      onSearch={searchAndApply}
      value={value}
      onChange={onChange}
      id="searchSelect"
      mode={mode}
    >
      {children}
    </SelectInputStyled>
  )
}

export default SelectWithCopyPaste
