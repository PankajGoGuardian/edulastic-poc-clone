import React from 'react'

import { cloneDeep, set } from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withTheme } from 'styled-components'

import { ComposeQuestion } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import Question from '../../components/Question'
import Extras from '../../containers/Extras'
import { Scoring } from '../../containers/WidgetOptions/components'
import MaxAudioDuration from './components/MaxAudioDuration'

const AudioResponseEdit = ({
  t: i18translate,
  item,
  setQuestionData,
  fillSections,
  cleanSections,
  advancedAreOpen,
}) => {
  if (!item) return null

  const { stimulus, title, audioTimeLimitInMinutes } = item

  const handleQuestionChange = (path, value) => {
    const newData = cloneDeep(item)
    set(newData, path, value)
    setQuestionData(newData)
  }

  return (
    <>
      <ComposeQuestion
        fillQuestionSections={fillSections}
        clearQuestionSections={cleanSections}
        handleQuestionChange={(value) =>
          handleQuestionChange('stimulus', value)
        }
        composeQuestionLabel={i18translate('common.question.composeQuestion')}
        stimulusContent={stimulus}
        itemTitle={title}
      />

      <MaxAudioDuration
        i18translate={i18translate}
        fillSections={fillSections}
        cleanSections={cleanSections}
        audioTimeLimitInMinutes={audioTimeLimitInMinutes}
        handleQuestionChange={handleQuestionChange}
      />

      <Question
        section="main"
        label="Scoring"
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen
      >
        <Scoring
          scoringTypes={[]}
          fillSections={fillSections}
          cleanSections={cleanSections}
          showSelect={false}
          item={item}
          advancedAreOpen={advancedAreOpen}
        />
      </Question>

      <Extras
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      />
    </>
  )
}

AudioResponseEdit.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

AudioResponseEdit.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false,
}

const enhance = compose(
  withNamespaces('assessment'),
  withTheme,
  connect(null, {
    setQuestionData: setQuestionDataAction,
  })
)

export default enhance(AudioResponseEdit)
