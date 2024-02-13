import React, { useEffect, useState } from 'react'
import { LeftContainer, RightContainer, TableHeaderContainer } from './styled'
import Heading from '../../../../../common/components/Heading'
import AnalyseByFilter from '../../../common/components/filters/AnalyseByFilter'
import { analyzeBy } from '../../static/json/dropDownData.json'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { compareByOptions } from '../../../common/utils/constants'

const TableHeader = ({ settings, setMARSettings }) => {
  const [tableFilters, setTableFilters] = useState({
    analyseBy: analyzeBy[0],
    compareBy: compareByOptions[0],
  })

  const handleFiltersChange = (filterKey) => (value) => {
    console.log({ value })
    setTableFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }))
  }

  useEffect(() => {
    setMARSettings({
      requestFilters: {
        ...settings.requestFilters,
        selectedCompareBy: tableFilters.compareBy,
        analyseBy: tableFilters.analyseBy,
      },
    })
  }, [tableFilters])

  return (
    <TableHeaderContainer>
      {/* Left Container */}
      <LeftContainer>
        {/* Table title */}
        <Heading
          title="Completion report by School"
          description="Click on the number to download list of students"
        />
      </LeftContainer>

      {/* Right Container */}
      <RightContainer>
        {/* CompareBy Filter */}
        <ControlDropDown
          prefix="Compare by"
          by={tableFilters.compareBy}
          selectCB={(value) => handleFiltersChange('compareBy')(value)}
          data={compareByOptions}
        />
        {/* Analyze filter */}
        <AnalyseByFilter
          data={analyzeBy}
          analyseBy={tableFilters.analyseBy}
          onFilterChange={(value) => handleFiltersChange('analyseBy')(value)}
        />
      </RightContainer>
    </TableHeaderContainer>
  )
}

export default TableHeader
