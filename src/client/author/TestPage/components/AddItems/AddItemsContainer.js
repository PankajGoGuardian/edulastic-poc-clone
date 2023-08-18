import React from 'react'
import {
  Container,
  FullScreenModal,
} from '../../../ItemList/components/Container/styled'

const AddItemsContainer = ({ children, isFullScreenMode }) => {
  return isFullScreenMode ? (
    <FullScreenModal
      destroyOnClose
      keyboard={false}
      closable
      maskClosable={false}
      footer={false}
      maskStyle={{ background: '#000', opacity: 1 }}
      visible
    >
      {children}
    </FullScreenModal>
  ) : (
    <Container>{children}</Container>
  )
}

export default AddItemsContainer
