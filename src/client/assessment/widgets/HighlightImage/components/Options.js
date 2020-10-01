import React from 'react'
import PropTypes from 'prop-types'

import WidgetOptions from '../../../containers/WidgetOptions'
import Extras from '../../../containers/Extras'

import LayoutComponent from './LayoutComponent'

const Options = ({ fillSections, cleanSections, advancedAreOpen, item }) => (
  <WidgetOptions
    showScoring
    showSelect={false}
    fillSections={fillSections}
    cleanSections={cleanSections}
    advancedAreOpen={advancedAreOpen}
    item={item}
    showScoringSection
    showScoringSectionAnyRole
  >
    <LayoutComponent
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    />

    <Extras
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    >
      <Extras.Distractors />
      <Extras.Hints />
    </Extras>
  </WidgetOptions>
)

Options.propTypes = {
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

Options.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false,
}

export default Options
