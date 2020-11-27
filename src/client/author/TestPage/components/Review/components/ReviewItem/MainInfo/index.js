import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
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
    } = this.props
    const newHtml = helpers.sanitizeForReview(data.stimulus) || ''

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
            <NumberInputStyled
              width="60px"
              value={data.points}
              margin="0px 0px 0px 5px"
              padding="0px 12px"
              disabled={!owner || !isEditable || isScoringDisabled}
              onChange={(e) => onChangePoints(data.id, +e.target.value)}
            />
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
}

export default WithMathFormula(withRouter(MainInfo))
