import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import {
  IconEdit,
  IconLayout,
  IconMath,
  IconNewList,
  IconSelection,
  IconTarget,
} from '@edulastic/icons'
import { Container, AddNewButton, TextWrapper } from './styled'

const AddNew = ({ onClick, t, isAddFirstPart }) => (
  <Container>
    <AddNewButton onClick={onClick}>
      <TextWrapper>
        +{' '}
        {isAddFirstPart
          ? t('component.itemDetail.addFirstPartMultipart')
          : t('component.itemDetail.addNewPartMultipart')}
      </TextWrapper>
      <IconNewList />
      <IconSelection />
      <IconLayout />
      <IconEdit />
      <IconTarget />
      <IconMath />
    </AddNewButton>
  </Container>
)

AddNew.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

const enhance = compose(withNamespaces('author'))

export default enhance(AddNew)
