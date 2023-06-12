import React from 'react'
import { themeColor, grey } from '@edulastic/colors'
import StandardTags from './styled/StandardTags'
import StandardsWrapper, { RecentStandards } from './styled/StandardsWrapper'

const RecentCollectionsList = ({
  recentCollectionsList,
  collections,
  handleCollectionsSelect,
  isDocBased,
  isDerivedFromPremiumBank = false,
}) => {
  return (
    <StandardsWrapper isDocBased={isDocBased}>
      <div>RECENTLY USED:</div>
      <RecentStandards>
        {recentCollectionsList.map((recentCollection) => (
          <StandardTags
            color={
              collections.find((o) => o._id === recentCollection._id) ||
              isDerivedFromPremiumBank
                ? grey
                : themeColor
            }
            onClick={() => {
              if (isDerivedFromPremiumBank) return
              if (!collections.find((o) => o._id === recentCollection._id)) {
                handleCollectionsSelect(recentCollection)
              }
            }}
          >
            {recentCollection.name}
          </StandardTags>
        ))}
      </RecentStandards>
    </StandardsWrapper>
  )
}

export default RecentCollectionsList
