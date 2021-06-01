import React from 'react'
import { FilterSection, Wrap } from './styled'

const FiltersSection = () => {
  return (
    <FilterSection>
      <div className="line" />
      <Wrap>
        <span>Addons</span>
        <ul>
          <li className="active">All</li>
          <li>Math & CS</li>
          <li>ELA</li>
          <li>Science</li>
          <li>Languages</li>
        </ul>
      </Wrap>
    </FilterSection>
  )
}

export default FiltersSection
