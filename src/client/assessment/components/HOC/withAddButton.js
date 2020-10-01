import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { withNamespaces } from '@edulastic/localization'
import { CustomStyleBtn } from '../../styled/ButtonStyles'

const withAddButton = (WrappedComponent) => {
  const withAddButtonHocComponent = ({ buttonText, onAdd, t, ...props }) => (
    <>
      <WrappedComponent t={t} {...props} />
      <CustomStyleBtn data-cy="addButton" onClick={onAdd}>
        {buttonText || t('component.options.addNewChoice')}
      </CustomStyleBtn>
    </>
  )

  withAddButtonHocComponent.propTypes = {
    buttonText: PropTypes.string,
    onAdd: PropTypes.func,
    t: PropTypes.func.isRequired,
  }

  withAddButtonHocComponent.defaultProps = {
    buttonText: '',
    onAdd: () => {},
  }

  return withNamespaces('assessment')(withAddButtonHocComponent)
}

export default withAddButton
