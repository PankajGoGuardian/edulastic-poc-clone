import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { roleuser as userRoles } from '@edulastic/constants'
import {
  getUserRole,
  getUserFeatures,
} from '../../../author/src/selectors/user'

import { Widget } from '../../styled/Widget'
import { canUseAllOptionsByDefault } from '../../../common/utils/helpers'

const { TEACHER, DISTRICT_ADMIN, SCHOOL_ADMIN } = userRoles

class Question extends Component {
  constructor(props) {
    super(props)

    this.state = {
      el: null,
      intervalID: null,
    }

    this.node = React.createRef()
  }

  componentDidMount = () => {
    const { fillSections, section, label, sectionId, visible } = this.props

    if (this.showSection()) {
      const { current: node } = this.node
      if (typeof node !== 'object') return false
      if (visible === false) return false

      fillSections(section, label, node, sectionId)

      this.setState({
        intervalID: setInterval(() => {
          this.updateVariablesOfSection()
        }, 1000),
      })

      this.setState({
        el: node,
      })
    }
  }

  showSection = () => {
    const {
      userRole,
      isPowerTeacher,
      isPremiumUser,
      section,
      label,
      features,
      permissions,
    } = this.props

    // show all tools except advanced section and 'Solution' section
    if (section !== 'advanced' || label === 'Solution') {
      return true
    }
    let showAdvancedTools = true

    if (canUseAllOptionsByDefault(permissions, userRole)) return true
    /**
     * allowed for teacher/DA/SA having premium feature and enabled power tools
     * scoring section needs to be shown for non power users as well
     * @see https://snapwiz.atlassian.net/browse/EV-15883
     */
    if (
      (userRole === TEACHER &&
        !features.isPublisherAuthor &&
        !features.isCurator) ||
      [DISTRICT_ADMIN, SCHOOL_ADMIN].includes(userRole)
    ) {
      showAdvancedTools = false
      if (isPremiumUser && isPowerTeacher) {
        showAdvancedTools = true
      }
    }

    return showAdvancedTools
  }

  componentWillUnmount() {
    const { cleanSections, sectionId } = this.props
    const { intervalID } = this.state

    cleanSections(sectionId)
    clearInterval(intervalID)
  }

  updateVariablesOfSection = () => {
    const { el } = this.state
    const { current: node } = this.node

    if (!node) return false

    if (
      node.clientHeight !== el.clientHeight ||
      node.offsetTop !== el.offsetTop
    ) {
      const { fillSections, section, label } = this.props

      fillSections(section, label, node)

      this.setState({
        el: node,
      })
    }
  }

  render() {
    if (!this.showSection()) {
      return null
    }

    const {
      dataCy,
      children,
      questionTextArea,
      advancedAreOpen,
      position,
      visible,
      overflowHandlers,
      styles = {},
    } = this.props

    return (
      <Widget
        ref={this.node}
        data-cy={dataCy}
        questionTextArea={questionTextArea}
        advancedAreOpen={advancedAreOpen}
        position={position}
        visible={visible}
        overflowHandlers={overflowHandlers}
        style={styles}
      >
        {children}
      </Widget>
    )
  }
}

Question.propTypes = {
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  dataCy: PropTypes.string,
  questionTextArea: PropTypes.bool,
  advancedAreOpen: PropTypes.bool,
  visible: PropTypes.bool,
  position: PropTypes.string,
  overflowHandlers: PropTypes.object,
  permissions: PropTypes.array,
}

Question.defaultProps = {
  dataCy: '',
  questionTextArea: false,
  visible: true,
  advancedAreOpen: null,
  position: 'relative',
  overflowHandlers: {},
  permissions: [],
}

export default compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      userRole: getUserRole(state),
      isPowerTeacher: get(state, ['user', 'user', 'isPowerTeacher'], false),
      isPremiumUser: get(state, ['user', 'user', 'features', 'premium'], false),
      features: getUserFeatures(state),
      permissions: get(state, 'user.user.permissions', []),
    }),
    null
  )
)(Question)
