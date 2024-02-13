import React, { useEffect, useState } from 'react'
import { LeftContainer, RightContainer, TableHeaderContainer } from './styled'
import Heading from '../../../../../common/components/Heading'
import AnalyseByFilter from '../../../common/components/filters/AnalyseByFilter'
import { analyzeBy } from '../../static/json/dropDownData.json'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { compareByOptions } from '../../../common/utils/constants'

const TableHeader = ({ settings, setMARSettings, compareByCB }) => {
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
        selectedCompareBy: tableFilters.compareBy.key,
      },
    })
  }, [tableFilters])

  return (
    <TableHeaderContainer>
      <LeftContainer>
        <Heading
          title="Completion report by School"
          description="Click on the number to download list of students"
        />
      </LeftContainer>
      <RightContainer>
        <ControlDropDown
          prefix="Compare by"
          by={tableFilters.compareBy}
          selectCB={(e, value) => handleFiltersChange('compareBy')(value)}
          data={compareByOptions}
        />
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
