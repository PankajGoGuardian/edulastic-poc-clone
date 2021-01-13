import React from 'react'
import PropTypes from 'prop-types'

// components
import Bundle from './Bundle'
import AuthorCompleteSignupButton from '../../../../../../../../common/components/AuthorCompleteSignupButton'

const BundleWrapper = ({ handleFeatureClick, bundle }) => {
  const renderBundle = (handleClick) => (
    <Bundle handleClick={handleClick} bundle={bundle} />
  )

  const onClick = () => handleFeatureClick(bundle || {})

  if (bundle.isBlocked) {
    return (
      <AuthorCompleteSignupButton
        renderButton={renderBundle}
        onClick={onClick}
      />
    )
  }

  return <Bundle handleClick={onClick} bundle={bundle} />
}

Bundle.propTypes = {
  handleFeatureClick: PropTypes.func.isRequired,
  bundle: PropTypes.object.isRequired,
}

export default BundleWrapper
