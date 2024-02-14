import React, { useEffect, useState } from 'react'
import { LeftContainer, RightContainer, TableHeaderContainer } from './styled'
import Heading from '../../../../../common/components/Heading'
import AnalyseByFilter from '../../../common/components/filters/AnalyseByFilter'
import { analyzeBy } from '../../static/json/dropDownData.json'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { compareByOptions } from '../../../common/utils/constants'

const TableHeader = ({ compareBy, setCompareBy, setAnalyseBy, analyseBy }) => {
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
          by={compareBy}
          selectCB={(e, value) => setCompareBy(value)}
          data={compareByOptions}
        />
        <AnalyseByFilter
          data={analyzeBy}
          analyseBy={analyseBy}
          onFilterChange={(value) => setAnalyseBy(value)}
        />
      </RightContainer>
    </TableHeaderContainer>
  )
}

export default TableHeader
