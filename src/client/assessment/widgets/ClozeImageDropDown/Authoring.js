import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import 'react-quill/dist/quill.snow.css'
import { withTheme } from 'styled-components'

import { withNamespaces } from '@edulastic/localization'

import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'

import ComposeQuestion from './ComposeQuestion'
import Responses from './Responses'

class Authoring extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
    maxHeight: PropTypes.number,
    maxWidth: PropTypes.number,
  }

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {},
    maxHeight: 490,
    maxWidth: 660,
  }

  render() {
    const {
      item,
      theme,
      fillSections,
      cleanSections,
      maxHeight,
      maxWidth,
    } = this.props

    return (
      <>
        <ComposeQuestion
          item={item}
          theme={theme}
          fillSections={fillSections}
          cleanSections={cleanSections}
          maxHeight={maxHeight}
          maxWidth={maxWidth}
        />
        <Responses
          options={item.options || []}
          item={item}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />
      </>
    )
  }
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  withTheme,
  connect(null, { setQuestionData: setQuestionDataAction })
)

export default enhance(Authoring)
