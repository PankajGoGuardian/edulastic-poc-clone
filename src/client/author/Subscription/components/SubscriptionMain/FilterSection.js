import React from 'react'
import { FilterSection, Wrap } from './styled'

const FiltersSection = ({subjects,selected, changeSubject}) => {
  return (
    <FilterSection>
      <div className="line" />
      <Wrap>
        <span>Addons</span>
        <ul>
          {["all",...subjects].map(s => (<li onClick={()=> changeSubject(s)} className={selected===s?`active`:undefined}>{s}</li>))}
        </ul>
      </Wrap>
    </FilterSection>
  )
}

export default FiltersSection
