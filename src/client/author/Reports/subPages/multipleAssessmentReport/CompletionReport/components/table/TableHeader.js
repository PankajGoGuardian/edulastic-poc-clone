import React from 'react'
import { LeftContainer, RightContainer, TableHeaderContainer } from './styled'
import Heading from '../../../../../common/components/Heading'
import AnalyseByFilter from '../../../common/components/filters/AnalyseByFilter'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { analyzeBy } from '../../../common/utils/constants'

const TableHeader = ({
  compareBy,
  setCompareBy,
  setAnalyseBy,
  analyseBy,
  urlCompareBy,
}) => {
  return (
    <TableHeaderContainer>
      <LeftContainer>
        <Heading
          title={`Test Completion by ${compareBy.title}`}
          description="Click on the number of students in the table to download the list of students based on their test completion status."
        />
      </LeftContainer>
      <RightContainer>
        <ControlDropDown
          prefix="Compare by"
          by={compareBy}
          selectCB={(e, value) => setCompareBy(value)}
          data={urlCompareBy}
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
