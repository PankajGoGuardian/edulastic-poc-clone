import React, { useContext } from 'react'
import UnScored from '@edulastic/common/src/components/Unscored'
import {
  FlexContainer,
  ItemLevelContext,
  getFormattedAttrId,
} from '@edulastic/common'
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
  unscored,
}) => {
  const itemLevelScoring = useContext(ItemLevelContext)
  return (
    itemLevelScoring || (
      <FlexContainer flexDirection="column" mt="8px">
        <Label>{t('component.correctanswers.points')}</Label>
        {!unscored ? (
          <PointsInput
            type="number"
            data-cy="points"
            value={points}
            width={width}
            onChange={onChangePoints}
            id={getFormattedAttrId(
              `${questionType}-${t('component.correctanswers.points')}`
            )}
            max={!isCorrectAnsTab ? correctAnsScore : Number.MAX_SAFE_INTEGER}
            min={0}
            step={0.5}
          />
        ) : (
          <UnScored text="UNSCORED" height={"50px"} width={width}/>
        )}
      </FlexContainer>
    )
  )
}

export default withNamespaces('assessment')(PointBlock)
