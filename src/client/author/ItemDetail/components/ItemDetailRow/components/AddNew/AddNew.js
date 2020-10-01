import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import { IconPlusCircle } from '@edulastic/icons'
import { white } from '@edulastic/colors'
import { Container, AddNewButton } from './styled'

const AddNew = ({ onClick, t, isAddFirstPart }) => (
  <Container>
    <AddNewButton onClick={onClick}>
      <IconPlusCircle style={{ fill: `${white}` }} />
      {isAddFirstPart
        ? t('component.itemDetail.addFirstPart')
        : t('component.itemDetail.addNew')}
    </AddNewButton>
  </Container>
)

AddNew.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

const enhance = compose(withNamespaces('author'))

export default enhance(AddNew)
