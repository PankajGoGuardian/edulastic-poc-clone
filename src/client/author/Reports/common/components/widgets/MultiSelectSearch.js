import React, { useMemo } from 'react'
import { SelectSearch } from '@edulastic/common'
import { FilterLabel } from '../../styled'

const MultiSelectSearch = ({ el, label, dataCy, options, ...props }) => {
  const updatedOptions = useMemo(() =>
    options.map((data) => ({
      ...data,
      title: data.name === 'All' ? `All ${label}` : data.title,
    }))
  )
  return (
    <>
      <FilterLabel data-cy={dataCy}>{label}</FilterLabel>
      <SelectSearch
        ref={el}
        options={updatedOptions}
        mode="multiple"
        {...props}
      />
    </>
  )
}

export default MultiSelectSearch
