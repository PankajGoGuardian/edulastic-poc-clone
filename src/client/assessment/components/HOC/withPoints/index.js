import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import React, { useContext } from 'react'
import { getFormattedAttrId, PointBlockContext } from '@edulastic/common'
import { Label } from '../../../styled/WidgetOptions/Label'
import {
  CorrectAnswerHeader,
  PointsInput,
} from '../../../styled/CorrectAnswerHeader'
import { getCurrentQuestionSelector } from '../../../../author/sharedDucks/questions'

export default (WrappedComponent) => {
  const hocComponent = ({
    points,
    onChangePoints,
    t,
    title,
    width = '',
    placement = {},
    ...props
  }) => {
    const { item = {}, isCorrectAnsTab = false } = props
    const hidingScoringBlock = useContext(PointBlockContext)
    return (
      <>
        {!hidingScoringBlock && (
          <CorrectAnswerHeader mb="15px" placement={placement}>
            <Label>{t('component.correctanswers.points')}</Label>
            <PointsInput
              type="number"
              id={getFormattedAttrId(
                `${title}-${t('component.correctanswers.points')}`
              )}
              data-cy="points"
              value={points}
              onChange={(score) => {
                onChangePoints(+score)
              }}
              width={width}
              step={0.5}
              size="large"
              max={
                !isCorrectAnsTab
                  ? item?.validation?.validResponse?.score
                  : Number.MAX_SAFE_INTEGER
              }
              min={0.5}
            />
          </CorrectAnswerHeader>
        )}
        <WrappedComponent {...props} title={title} />
      </>
    )
  }

  hocComponent.propTypes = {
    points: PropTypes.number.isRequired,
    onChangePoints: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    item: PropTypes.func.isRequired,
  }

  const enhance = compose(
    withNamespaces('assessment'),
    connect((state) => {
      const question = getCurrentQuestionSelector(state)
      return {
        title: question?.title || '',
      }
    }, null)
  )
  return enhance(hocComponent)
}
