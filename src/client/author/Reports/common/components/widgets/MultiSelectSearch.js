import React, { useMemo } from 'react'
import { SelectSearch } from '@edulastic/common'
import { FilterLabel } from '../../styled'

const MultiSelectSearch = ({
  el,
  label,
  dataCy,
  options,
  suffixIcon,
  loc,
  ...props
}) => {
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
        suffixIcon={suffixIcon}
        loc={loc}
        mode="multiple"
        {...props}
      />
    </>
  )
}

export default MultiSelectSearch
