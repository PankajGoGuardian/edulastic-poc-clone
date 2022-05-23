import { withWindowSizes } from '@edulastic/common'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Magnifier } from './Magnifier'

Magnifier.defaultProps = {
  enable: false,
  config: {
    width: 182,
    height: 182,
    scale: 2,
  },
  offset: {
    top: 0,
    left: 0,
  },
}

Magnifier.propTypes = {
  children: PropTypes.node.isRequired,
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  enable: PropTypes.bool,
  offset: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
  config: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
  }),
}

const enhance = compose(
  withWindowSizes,
  connect((state) => ({
    contentChanged: state.testPlayer.contentChanged,
  }))
)

export default enhance(Magnifier)
