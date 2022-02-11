import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
// import produce from 'immer'

import { withNamespaces } from '@edulastic/localization'

// import { updateVariables } from '../../../utils/variables'

// import QuestionTextArea from '../../../components/QuestionTextArea'
import { Subtitle } from '../../../styled/Subtitle'
import Question from '../../../components/Question'
import CodeEditor from '../../../components/CodeEditor/CodeEditor'
// import CodeEditor from '../../../../../../../^/untitled/Untitled-5'

class ComposeQuestion extends Component {
  render() {
    const { item, t, fillSections, cleanSections } = this.props

    return (
      <Question
        section="main"
        label={t('component.essayText.composequestion')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle
          id={getFormattedAttrId(
            `${item?.title}-${t('component.essayText.composequestion')}`
          )}
        >
          {t('component.essayText.composequestion')}
        </Subtitle>
        <CodeEditor />
      </Question>
    )
  }
}

ComposeQuestion.propTypes = {
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

ComposeQuestion.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
}

export default withNamespaces('assessment')(ComposeQuestion)
