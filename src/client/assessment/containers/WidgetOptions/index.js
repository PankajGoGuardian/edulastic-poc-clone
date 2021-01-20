import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { evaluationType } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'

import Scoring from './components/Scoring'
import Variables from './components/Variables'
import Question from '../../components/Question'

const types = [evaluationType.exactMatch, evaluationType.partialMatch]

class WidgetOptions extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    scoringTypes: PropTypes.array,
    showScoring: PropTypes.bool,
    showVariables: PropTypes.bool,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
    advancedAreOpen: PropTypes.bool,
    showSelect: PropTypes.bool,
    renderExtra: PropTypes.any,
    showScoringSection: PropTypes.bool,
    extraInScoring: PropTypes.elementType,
    showScoringType: PropTypes.bool,
  }

  static defaultProps = {
    scoringTypes: types,
    showScoring: true,
    showVariables: false,
    advancedAreOpen: false,
    fillSections: () => {},
    cleanSections: () => {},
    renderExtra: null,
    showSelect: true,
    showScoringSection: false,
    extraInScoring: null,
    showScoringType: true,
  }

  render() {
    const {
      children,
      scoringTypes,
      showScoring,
      showVariables,
      fillSections,
      cleanSections,
      advancedAreOpen,
      showSelect,
      renderExtra,
      item,
      showScoringSection = false,
      showScoringType,
      extraInScoring, // extraInScoring (Component required inside scoring section)
      isCorrectAnsTab,
    } = this.props

    return (
      <>
        {renderExtra}
        {(showScoring || showScoringSection) && (
          <Question
            section="main"
            label="Scoring"
            fillSections={fillSections}
            cleanSections={cleanSections}
            advancedAreOpen
          >
            <Scoring
              scoringTypes={scoringTypes}
              fillSections={fillSections}
              cleanSections={cleanSections}
              advancedAreOpen
              showSelect={showSelect}
              item={item}
              showScoringType={showScoringType}
              extraInScoring={extraInScoring}
              isCorrectAnsTab={isCorrectAnsTab}
            />
          </Question>
        )}
        {showVariables && (
          <Variables
            fillSections={fillSections}
            cleanSections={cleanSections}
            advancedAreOpen={advancedAreOpen}
            item={item}
          />
        )}
        {children}
      </>
    )
  }
}

export default withNamespaces('assessment')(WidgetOptions)
