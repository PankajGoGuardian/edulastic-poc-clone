import React from 'react'

import Extras from '../../../containers/Extras'

const _Extras = ({ fillSections, cleanSections, advancedAreOpen }) => {
  return (
    <Extras
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    >
      <Extras.Distractors />
      <Extras.Hints />
    </Extras>
  )
}

export default _Extras
