import React from 'react'
import { themeColor, grey } from '@edulastic/colors'
import StandardTags from './styled/StandardTags'
import StandardsWrapper, { RecentStandards } from './styled/StandardsWrapper'

const RecentStandardsList = ({
  recentStandardsList,
  standardsArr,
  handleAddStandard,
  isDocBased,
}) => {
  return (
    <StandardsWrapper isDocBased={isDocBased}>
      <div>RECENTLY USED:</div>
      <RecentStandards>
        {recentStandardsList.map((recentStandard) => (
          <StandardTags
            color={
              standardsArr.includes(recentStandard.identifier)
                ? grey
                : themeColor
            }
            onClick={() => {
              handleAddStandard(recentStandard)
            }}
          >
            {recentStandard.identifier}
          </StandardTags>
        ))}
      </RecentStandards>
    </StandardsWrapper>
  )
}

export default RecentStandardsList
