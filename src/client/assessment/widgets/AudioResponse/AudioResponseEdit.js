import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { cloneDeep, set } from 'lodash'

import { withNamespaces } from '@edulastic/localization'
import { ComposeQuestion } from '@edulastic/common'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { StyledMessage, StyledBoldText } from './styledComponents/EditView'
import Question from '../../components/Question'
import { Scoring } from '../../containers/WidgetOptions/components'
import AudioResponseSolution from './components/AudioResponseSolution'

const AudioResponseEdit = ({
  t: i18translate,
  item,
  setQuestionData,
  fillSections,
  cleanSections,
  advancedAreOpen,
}) => {
  if (!item) return null

  const { stimulus, title, instructorStimulus, audioTimeLimitInMinutes } = item

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

      <StyledMessage>
        Note that responses will have a{' '}
        <StyledBoldText>
          {`maximum limit of ${audioTimeLimitInMinutes}  minutes`}{' '}
        </StyledBoldText>
      </StyledMessage>

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
          scoringMessage={i18translate(
            'component.audioResponse.scoringMessage'
          )}
          showScoringMessage
        />
      </Question>

      <AudioResponseSolution
        i18translate={i18translate}
        itemTitle={title}
        instructorStimulus={instructorStimulus}
        handleQuestionChange={(value) =>
          handleQuestionChange('instructorStimulus', value)
        }
        fillQuestionSections={fillSections}
        clearQuestionSections={cleanSections}
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
