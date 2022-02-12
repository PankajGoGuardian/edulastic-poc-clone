import React, { useState } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import _ from 'lodash'

import { Row, Col } from 'antd'

import { withNamespaces } from '@edulastic/localization'
import { CheckboxLabel } from '@edulastic/common'

import { ContentArea } from '../../../styled/ContentArea'

import ComposeQuestion from './ComposeQuestion'
// import FormattingOptions from './FormattingOptions'

import Question from '../../../components/Question'
import { Scoring } from '../../../containers/WidgetOptions/components'
import CodeEditor from '../../../components/CodeEditor/CodeEditor'

const EditEssayPlainText = ({
  item,
  setQuestionData,
  advancedLink,
  advancedAreOpen,
  fillSections,
  cleanSections,
}) => {
  const handleItemChangeChange = (prop, value) => {
    setQuestionData(
      produce(item, (draft) => {
        _.set(draft.validation.validResponse, prop, value)
      })
    )
  }
  const [showTemplate, setShowTemplate] = useState(_.get(item, 'validation.validResponse.template', false))

  return (
    <ContentArea>
      <ComposeQuestion
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
      />

      <Question
        section="main"
        label="Scoring"
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen
        showScoringSectionAnyRole
      >
        <Scoring
          scoringTypes={[]}
          fillSections={fillSections}
          cleanSections={cleanSections}
          advancedAreOpen={advancedAreOpen}
          showSelect={false}
          item={item}
        >
          {/* <CodeEditor /> */}
          {/* <WordLimitAndCount
            data-cy="setShowWordLimit"
            onChange={handleItemChangeChange}
            selectValue={item.showWordLimit}
            inputValue={item.maxWord}
            advancedAreOpen={advancedAreOpen}
            fillSections={fillSections}
            cleanSections={cleanSections}
            title={item?.title}
            showHeading={false}
          /> */}
          <Row gutter={24}>
            <Col md={12}>
              <CheckboxLabel
                defaultChecked={
                  !!item.validation.validResponse.options?.noExtraOutput
                }
                onChange={(e) =>
                  handleItemChangeChange(
                    'options.noExtraOutput',
                    e.target.checked
                  )
                }
                style={{ marginBottom: '1rem' }}
              >
                No extra ouput
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                defaultChecked={item.validation.validResponse.trimExtraLines}
                onChange={(e) =>
                  handleItemChangeChange(
                    'options.trimExtraLines',
                    e.target.checked
                  )
                }
                style={{ marginBottom: '1rem' }}
              >
                Trim extra lines
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                defaultChecked={showTemplate}
                onChange={(e) => {
                  setShowTemplate(e.target.checked)
                  handleItemChangeChange('template', '')
                }}
                style={{ marginBottom: '1rem' }}
              >
                Initial Template
              </CheckboxLabel>
            </Col>
          </Row>
        </Scoring>
      </Question>

      {advancedLink}

      {/* <Options
        item={item}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
        handleItemChangeChange={handleItemChangeChange}
      /> */}
      {showTemplate && (
        <CodeEditor
          item={item}
          text={item.validation.validResponse.template || ''}
          setText={(t) => handleItemChangeChange('template', t)}
          allowReset={false}
        />
      )}
    </ContentArea>
  )
}

EditEssayPlainText.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
}

EditEssayPlainText.defaultProps = {
  advancedAreOpen: false,
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {},
}

export default withNamespaces('assessment')(EditEssayPlainText)
