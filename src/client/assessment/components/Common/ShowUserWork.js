import React from 'react'
import { connect } from 'react-redux'
import { EduButton } from '@edulastic/common'
import PropTypes from 'prop-types'

function ShowUserWorkButton({ onClickHandler, loading = false, children }) {
  return (
    <EduButton
      mr="8px"
      type="primary"
      isGhost
      onClick={onClickHandler}
      loading={loading}
    >
      {children}
    </EduButton>
  )
}

const mapStateToProps = (state) => ({
  loading: state.scratchpad.loading,
})

ShowUserWorkButton.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.object.isRequired,
}

ShowUserWorkButton.defaultProps = {
  loading: false,
}

export default connect(mapStateToProps)(ShowUserWorkButton)
