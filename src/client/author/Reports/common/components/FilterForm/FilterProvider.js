import React, { createContext, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const FilterContext = createContext(null)

function FilterProvider({ children }) {
  // maybe use reducer ?
  const [filters, setFilters] = useState(null)
  const contextValue = useMemo(() => ({ filters, setFilters }), [filters])

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  )
}

export const useFilters = () => useContext(FilterContext)

FilterProvider.propTypes = {}
FilterProvider.defaultProps = {}

export default FilterProvider
