import React, { useEffect, useState } from 'react'
import qs from 'qs'
import { LeftContainer, RightContainer, TableHeaderContainer } from './styled'
import Heading from '../../../../../common/components/Heading'
import AnalyseByFilter from '../../../common/components/filters/AnalyseByFilter'
import { analyzeBy } from '../../static/json/dropDownData.json'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { compareByOptions } from '../../../common/utils/constants'

const TableHeader = ({
  settings,
  setMARSettings,
  location,
  setAnalyseBy,
  analyseBy,
}) => {
  const search = qs.parse(location.search, {
    ignoreQueryPrefix: true,
    indices: true,
  })
  const urlCompareBy = compareByOptions.find(
    (option) => option.key === search.selectedCompareBy
  )

  const [compareBy, setCompareBy] = useState(
    urlCompareBy || compareByOptions[0]
  )

  useEffect(() => {
    setMARSettings({
      requestFilters: {
        ...settings.requestFilters,
        selectedCompareBy: compareBy.key,
      },
    })
  }, [compareBy])

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
