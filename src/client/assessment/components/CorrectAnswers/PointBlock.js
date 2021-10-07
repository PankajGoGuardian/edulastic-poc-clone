import React from 'react'
import PropTypes from 'prop-types'
import { FlexContainer, getFormattedAttrId } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { Label } from '../../styled/WidgetOptions/Label'
import { PointsInput } from '../../styled/CorrectAnswerHeader'

const PointBlock = ({
  t,
  width = '',
  isCorrectAnsTab,
  onChangePoints,
  points,
  correctAnsScore,
  questionType,
  updateScoreOnBlur,
}) => (
  <FlexContainer flexDirection="column" mt="8px">
    <Label>{t('component.correctanswers.points')}</Label>
    <PointsInput
      type="number"
      data-cy="points"
      value={points}
      width={width}
      onChange={onChangePoints}
      onBlur={(e) => updateScoreOnBlur(e?.target?.value)}
      id={getFormattedAttrId(
        `${questionType}-${t('component.correctanswers.points')}`
      )}
      max={!isCorrectAnsTab ? correctAnsScore : Number.MAX_SAFE_INTEGER}
      min={0}
      step={0.5}
    />
  </FlexContainer>
)

PointBlock.propTypes = {
  updateScoreOnBlur: PropTypes.func,
}

PointBlock.defaultProps = {
  updateScoreOnBlur: () => {},
}

export default withNamespaces('assessment')(PointBlock)
