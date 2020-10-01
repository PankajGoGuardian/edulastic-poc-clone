/* eslint-disable no-undef */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import 'react-quill/dist/quill.snow.css'

import { withNamespaces } from '@edulastic/localization'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'

// import ComposeQuestion from "./ComposeQuestion";
import TemplateMarkup from './TemplateMarkup'
import QuestionWrapper from './styled/QuestionWrapper'

class ClozeDropDownAuthoring extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
  }

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {},
  }

  render() {
    const { item, fillSections, cleanSections } = this.props

    return (
      <QuestionWrapper>
        {/* <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} /> */}
        <TemplateMarkup
          item={item}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />
      </QuestionWrapper>
    )
  }
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  connect(null, { setQuestionData: setQuestionDataAction })
)

export default enhance(ClozeDropDownAuthoring)
