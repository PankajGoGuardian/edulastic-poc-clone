import React from 'react'
import { debounce, keyBy, uniq, isEmpty } from 'lodash'
import { SelectInputStyled } from '@edulastic/common'
import { courseApi } from '@edulastic/api'

function isValidMongoId(id) {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/
  return objectIdPattern.test(id)
}
function isExcelContent(text) {
  // Check for tab-separated values (TSV) or Excel formulas
  var excelPattern = /(\t|=[A-Za-z]+\(|\$.+\$)/
  return excelPattern.test(text)
}

function isExcelCSV(content) {
  var rows = content.split(/\r\n|\r|\n/)
  // Assuming the first row contains headers and at least one comma in each subsequent row
  return (
    rows.length > 1 &&
    rows[0].includes(',') &&
    rows.slice(1).some((row) => row.includes(','))
  )
}

function isExcelData(content) {
  if (content.includes(' ')) {
    return content.split(' ').filter(isValidMongoId).length > 1
  }
  return false
}

const sanitizeSearchString = (searchStr) => {
  if (searchStr.includes('\t')) {
    return searchStr.split('\t').filter(isValidMongoId)
  }
  if (isExcelData(searchStr)) {
    return searchStr.split(' ').filter(isValidMongoId)
  }
  if (searchStr) {
    return searchStr.split(',').filter(isValidMongoId)
  }
  return ''
}
const SelectWithCopyPaste = ({
  children,
  searchData,
  value,
  onChange,
  mode,
  setNoDataFound = undefined,
  id,
  onSearch,
  receiveAggregateCourseListSuccess,
  ...props
}) => {
  const searchAndApply = debounce(async (searchValue) => {
    const search = {
      limit: 25,
      page: 1,
      districtId: '6380b567070dd1000810a15b',
      active: 1,
      aggregate: true,
      includes: ['name'],
    }
    console.log(
      searchValue,
      '===searchValue',
      searchValue.includes('\t'),
      searchValue.includes('\n'),
      searchValue.startsWith('='),
      isExcelContent(searchValue),
      isExcelCSV(searchValue),
      isExcelData(searchValue)
    )

    if (
      searchValue &&
      typeof searchValue === 'string' &&
      (searchValue.includes(',') || isExcelData(searchValue)) &&
      mode === 'multiple'
    ) {
      const sanitizedString = sanitizeSearchString(searchValue)
      console.log(sanitizedString, '---sanitizedString')
      const response = await courseApi.searchCourse({
        ...search,
        search: {
          courseIds: sanitizedString,
        },
      })
      const _courseIds = Object.values(response.result).flat()
      const values = uniq([...value, ..._courseIds])
      const courses = []
      for (const [key, value] of Object.entries(response.result)) {
        courses.push({
          _id: value.join('_'),
          name: key,
        })
      }
      receiveAggregateCourseListSuccess(courses)
      onChange(values)
    } else if (searchValue) {
      onSearch(searchValue)
    }

    //64ac062f0642d84dfb62088b,642a7e8aa6e6810008ff69a0,64ac062f0642d84dfb62087d

    // if (searchValue && searchValue.includes(',') && mode === 'multiple') {
    //   let searchValues = []
    //   if (searchValue.split(',')?.length) {
    //     searchValues = searchValue.split(',')
    //   }
    //   searchValues = searchValues
    //     .filter((item) => !!item)
    //     .map((item) => {
    //       const output = item?.replaceAll('"', '')
    //       return output?.toLowerCase()?.trim()
    //     })
    //   if (searchValues.length) {
    //     const searchValuesKeyed = keyBy(searchValues)
    //     const selectedValuesKeyed = keyBy(value)
    //     const dataIdsAndNames = searchData
    //       .filter(({ name, _id }) => {
    //         return (
    //           searchValuesKeyed[_id.toLowerCase()] ||
    //           searchValuesKeyed[name.toLowerCase()] ||
    //           selectedValuesKeyed[_id.toLowerCase()]
    //         )
    //       })
    //       .map((item) => ({ _id: item._id, name: item.name }))

    //     const dataIds = dataIdsAndNames
    //       .filter(({ _id }) => {
    //         return !selectedValuesKeyed[_id]
    //       })
    //       .map((item) => item._id)

    //     const noDataFound = searchValues.filter((item) => {
    //       return !dataIdsAndNames.some(
    //         (data) =>
    //           data._id.toLowerCase() === item.toLowerCase() ||
    //           data.name.toLowerCase() === item.toLowerCase()
    //       )
    //     })
    //     const uniqDataIds = uniq([...value, ...dataIds])
    //     const select = document.getElementById('searchSelect')
    //     const inputEle = select.getElementsByTagName('input')[0]
    //     if (inputEle) {
    //       inputEle.blur()
    //       setTimeout(() => {
    //         inputEle.focus()
    //       }, 500)
    //     }
    //     onChange(uniqDataIds)

    //     if (setNoDataFound) {
    //       if (!isEmpty(noDataFound))
    //         setNoDataFound({ data: noDataFound, total: searchValues.length })
    //       else setNoDataFound({})
    //     }
    //   }
    // }
  }, 500)

  return (
    <SelectInputStyled
      {...props}
      onSearch={searchAndApply}
      value={value}
      onChange={onChange}
      mode={mode}
    >
      {children}
    </SelectInputStyled>
  )
}

export default SelectWithCopyPaste
