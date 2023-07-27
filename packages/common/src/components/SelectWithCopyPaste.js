import React from 'react'
import { debounce, keyBy, uniq, isEmpty } from 'lodash'
import { SelectInputStyled } from '@edulastic/common'

const SelectWithCopyPaste = ({
  children,
  searchData,
  value,
  onChange,
  mode,
  setNoDataFound = undefined,
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
        const dataIdsAndNames = searchData
          .filter(({ name, _id }) => {
            return (
              searchValuesKeyed[_id.toLowerCase()] ||
              searchValuesKeyed[name.toLowerCase()] ||
              selectedValuesKeyed[_id.toLowerCase()]
            )
          })
          .map((item) => ({ _id: item._id, name: item.name }))

        const dataIds = dataIdsAndNames
          .filter(({ _id }) => {
            return !selectedValuesKeyed[_id]
          })
          .map((item) => item._id)

        const noDataFound = searchValues.filter((item) => {
          return !dataIdsAndNames.some(
            (data) =>
              data._id.toLowerCase() === item.toLowerCase() ||
              data.name.toLowerCase() === item.toLowerCase()
          )
        })
        const uniqDataIds = uniq([...value, ...dataIds])
        const select = document.getElementById('searchSelect')
        const inputEle = select.getElementsByTagName('input')[0]
        if (inputEle) {
          inputEle.blur()
          setTimeout(() => {
            inputEle.focus()
          }, 500)
        }
        onChange(uniqDataIds)

        if (setNoDataFound) {
          if (!isEmpty(noDataFound))
            setNoDataFound({ data: noDataFound, total: searchValues.length })
          else setNoDataFound({})
        }
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
