import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import UnScored from '@edulastic/common/src/components/Unscored'
import {
  helpers,
  WithMathFormula,
  FlexContainer,
  CheckboxLabel,
  NumberInputStyled,
} from '@edulastic/common'
import { Stimulus } from './styled'
import Actions from '../Actions'

class MainInfo extends React.Component {
  render() {
    const {
      data,
      index,
      handlePreview,
      isEditable,
      owner,
      onChangePoints,
      expandRow,
      onDelete,
      onSelect,
      checked,
      isScoringDisabled = false,
      groupPoints,
      groupMinimized,
      isUnScoredItem,
    } = this.props
    const newHtml = helpers.sanitizeForReview(data.stimulus) || ''
    const points = groupMinimized ? groupPoints : data.points

    return (
      <FlexContainer
        data-cy-item-index={index}
        style={{ justifyContent: 'space-between' }}
      >
        <Stimulus
          dangerouslySetInnerHTML={{ __html: newHtml }}
          onClick={() => handlePreview(data.id)}
          style={{ position: 'relative' }}
        />
        <FlexContainer
          flexDirection="column"
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <FlexContainer flexDirection="row" alignItems="center">
            <Actions
              onPreview={() => handlePreview(data.id)}
              onCollapseExpandRow={expandRow}
              onDelete={onDelete}
              isEditable={isEditable}
            />
            {!isUnScoredItem ? (
              <NumberInputStyled
                width="60px"
                value={points}
                margin="0px 0px 0px 5px"
                padding="0px 4px"
                disabled={
                  !owner || !isEditable || isScoringDisabled || groupMinimized
                }
                onChange={(value) => onChangePoints(data.id, value)}
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
