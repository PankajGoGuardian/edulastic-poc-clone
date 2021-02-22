import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import WidgetOptions from '../../../containers/WidgetOptions'
import Extras from '../../../containers/Extras'
import LayoutComponent from './LayoutComponent'

const Options = ({
  t,
  advancedAreOpen,
  fillSections,
  cleanSections,
  item = {},
}) => (
  <WidgetOptions
    title={t('common.options.title')}
    advancedAreOpen={advancedAreOpen}
    fillSections={fillSections}
    cleanSections={cleanSections}
    item={item}
  >
    <LayoutComponent
      advancedAreOpen={advancedAreOpen}
      fillSections={fillSections}
      cleanSections={cleanSections}
    />

    <Extras
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    />
  </WidgetOptions>
)

Options.propTypes = {
  t: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

Options.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

export default withNamespaces('assessment')(Options)
