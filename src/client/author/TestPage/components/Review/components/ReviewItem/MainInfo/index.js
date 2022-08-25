import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Tooltip } from 'antd'
import UnScored from '@edulastic/common/src/components/Unscored'
import {
  helpers,
  WithMathFormula,
  FlexContainer,
  CheckboxLabel,
  PremiumItemBanner,
} from '@edulastic/common'
import { Stimulus, NumberInputStyledTestPage } from './styled'
import { ScoreInputWrapper, InfoIcon } from '../styled'
import Actions from '../Actions'

class MainInfo extends React.Component {
  render() {
    const {
      data,
      index,
      isAutoselect,
      handlePreview,
      isEditable,
      owner,
      onChangePoints,
      blur,
      expandRow,
      onDelete,
      onSelect,
      checked,
      isScoringDisabled = false,
      groupPoints,
      groupMinimized,
      isUnScoredItem,
      showAltScoreInfo,
      isPremiumContentWithoutAccess,
      premiumCollectionWithoutAccess,
    } = this.props
    const newHtml = helpers.sanitizeForReview(data.stimulus) || ''
    const points = groupMinimized ? groupPoints : data.points

    return (
      <FlexContainer
        data-cy-item-index={index}
        style={{ justifyContent: 'space-between' }}
      >
        {isPremiumContentWithoutAccess ? (
          <PremiumItemBanner
            itemBankName={premiumCollectionWithoutAccess}
            hideQuestionLabels
            height="auto"
            showAsTooltip
          />
        ) : (
          <Stimulus
            dangerouslySetInnerHTML={{ __html: newHtml }}
            onClick={() => handlePreview(data.id)}
            style={{ position: 'relative' }}
          />
        )}
        <FlexContainer
          flexDirection="column"
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <FlexContainer flexDirection="row" alignItems="center">
            <Actions
              isAutoselect={isAutoselect}
              onPreview={() => handlePreview(data.id)}
              onCollapseExpandRow={expandRow}
              onDelete={onDelete}
              isEditable={isEditable}
            />
            <ScoreInputWrapper>
              {!isUnScoredItem ? (
                <NumberInputStyledTestPage
                  width="60px"
                  value={points}
                  margin="0px 0px 0px 5px"
                  padding="0px 4px"
                  textAlign="center"
                  disabled={
                    !owner || !isEditable || isScoringDisabled || groupMinimized
                  }
                  onChange={(value) => onChangePoints(data.id, value)}
                  onBlur={() => blur(data.id)}
                />
              ) : (
                <UnScored
                  width="60px"
                  height="32px"
                  margin="0px 0px 0px 5px"
                  fontSize="10px"
                  text="Z"
                  fontWeight="700"
                />
              )}
              {showAltScoreInfo && (
                <Tooltip title="Question has alternate answers with different score points.">
                  <InfoIcon data-cy="alternate-score-info" />
                </Tooltip>
              )}
            </ScoreInputWrapper>
            {isEditable && (
              <CheckboxLabel checked={checked} ml="8px" onChange={onSelect} />
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    )
  }
}

MainInfo.propTypes = {
  data: PropTypes.object.isRequired,
  handlePreview: PropTypes.func.isRequired,
  isUnScoredItem: PropTypes.bool,
}

MainInfo.defaultProps = {
  isUnScoredItem: false,
}

export default WithMathFormula(withRouter(MainInfo))
