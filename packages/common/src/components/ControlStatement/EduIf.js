import PropTypes from 'prop-types'

export const EduIf = ({ children, condition }) => {
  if (!children || !condition) {
    return null
  }
  if (typeof children === 'function') {
    return children()
  }
  return children
}

EduIf.propTypes = {
  condition: PropTypes.bool.isRequired,
  children: PropTypes.oneOf(PropTypes.node, PropTypes.func).isRequired,
}
