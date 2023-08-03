import React, { useEffect, useRef, useState } from 'react'
import { SelectInputStyled } from '@edulastic/common'
import { getInputIdList } from '../utils/SelectWithPasteEnabledInputUtils'

const SelectWithPasteEnabledInput = ({
  children,
  onSearch,
  allOptionsIds = [],
  onChange,
  customSelectComponent,
  ...props
}) => {
  const [idsListData, setIdsListData] = useState([])
  const selectRef = useRef()

  useEffect(() => {
    if (allOptionsIds?.length && idsListData?.length) {
      const optionsToSelect = (allOptionsIds || []).filter((optionValue) =>
        idsListData.includes(optionValue)
      )
      onChange(optionsToSelect, { isPastedIdsList: true })
      if (selectRef?.current) {
        selectRef?.current?.blur()
      }
      setIdsListData([])
    }
  }, [allOptionsIds])

  const handleOnSearch = (input) => {
    const idsList = getInputIdList(input)
    if (typeof onSearch !== 'function' && idsList?.length) {
      const optionsToSelect = (allOptionsIds || []).filter((optionValue) =>
        idsList.includes(optionValue)
      )
      if (optionsToSelect?.length) {
        onChange(optionsToSelect, { isPastedIdsList: true })
        if (selectRef?.current) {
          selectRef?.current?.blur()
        }
      }
      return
    }
    if (typeof onSearch === 'function') {
      if (idsList?.length) {
        setIdsListData(idsList)
      }
      onSearch(input, idsList?.length ? idsList : [])
    }
  }

  const selectProps = {
    ...props,
    onSearch: handleOnSearch,
    onChange,
  }

  const SelectComponent = customSelectComponent || SelectInputStyled

  return (
    <SelectComponent {...selectProps} ref={selectRef}>
      {children}
    </SelectComponent>
  )
}

export default SelectWithPasteEnabledInput
