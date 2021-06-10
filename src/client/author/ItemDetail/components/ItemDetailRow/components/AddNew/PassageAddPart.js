import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Tooltip } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { IconPlusCircle } from '@edulastic/icons'
import { white } from '@edulastic/colors'
import { PassageAddNewButton, PassageButtonContainer } from './styled'
import { getIsEditDisbledSelector } from '../../../../../sharedDucks/questions'

const PassageAddNewPart = ({
  onClick,
  t,
  isAddFirstPart,
  itemEditDisabled,
}) => {
  const [isDisabled, disabedReason] = itemEditDisabled
  const handleAddNew = () => {
    if (isDisabled) {
      return
    }
    onClick()
  }
  return (
    <Tooltip title={isDisabled ? disabedReason : ''}>
      <PassageButtonContainer>
        <PassageAddNewButton onClick={handleAddNew} disabled={isDisabled}>
          <IconPlusCircle
            style={{ fill: `${white}` }}
            data-cy="createNewItem"
          />
          {isAddFirstPart
            ? t('component.itemDetail.addFirstPart')
            : t('component.itemDetail.addNew')}
        </PassageAddNewButton>
      </PassageButtonContainer>
    </Tooltip>
  )
}

PassageAddNewPart.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

const enhance = compose(
  withNamespaces('author'),
  connect(
    (state) => ({
      itemEditDisabled: getIsEditDisbledSelector(state),
    }),
    null
  )
)

export default enhance(PassageAddNewPart)
