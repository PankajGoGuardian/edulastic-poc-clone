import React from 'react'
import { FilterSection, Wrap } from './styled'

const FiltersSection = ({ subjects, selected, changeSubject }) => {
  return (
    <FilterSection>
      <div className="line" />
      <Wrap>
        <span>Addons</span>
        <ul data-cy="addonFilters">
          {['all', ...subjects?.filter((subject) => subject !== 'all')].map(
            (s) => (
              <li
                onClick={() => changeSubject(s)}
                className={selected === s ? `active` : undefined}
                data-cy={s}
              >
                {s}
              </li>
            )
          )}
        </ul>
      </Wrap>
    </FilterSection>
  )
}

export default FiltersSection
