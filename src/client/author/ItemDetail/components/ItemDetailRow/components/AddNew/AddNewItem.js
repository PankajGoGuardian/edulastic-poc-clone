import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { white } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import { IconPlusCircle } from '@edulastic/icons'
import { PassageButtonContainer, PassageAddNewButton } from './styled'

const AddNewItem = ({ onClick, t }) => (
  <PassageButtonContainer>
    <PassageAddNewButton onClick={onClick}>
      <IconPlusCircle style={{ fill: `${white}` }} />
      {t('component.itemDetail.addNewItemToPassage')}
    </PassageAddNewButton>
  </PassageButtonContainer>
)

AddNewItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

const enhance = compose(withNamespaces('author'))

export default enhance(AddNewItem)
