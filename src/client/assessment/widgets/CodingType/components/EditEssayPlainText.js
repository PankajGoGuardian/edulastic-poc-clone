import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
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
  const handleItemChangeChange = useCallback(
    (prop, value) => {
      setQuestionData((draft) => {
        _.set(draft, prop, value)
      })
    },
    [setQuestionData]
  )
  const [showTemplate, setShowTemplate] = useState(
    typeof _.get(item, 'defaultCode') !== 'undefined'
  )

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
                  !item.validation.validResponse.options?.noExtraOutput
                }
                onChange={(e) =>
                  handleItemChangeChange(
                    'validation.validResponse.options.noExtraOutput',
                    !e.target.checked
                  )
                }
                style={{ marginBottom: '1rem' }}
              >
                Ignore Warnings
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                defaultChecked={
                  !!item.validation.validResponse.options?.trimExtraLines
                }
                onChange={(e) =>
                  handleItemChangeChange(
                    'validation.validResponse.options.trimExtraLines',
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
                  const { checked } = e.target
                  setShowTemplate(checked)
                  handleItemChangeChange(
                    'defaultCode',
                    checked ? '' : undefined
                  )
                }}
                style={{ marginBottom: '1rem' }}
              >
                Default Template
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
          text={item.defaultCode || ''}
          setText={(t) => handleItemChangeChange('defaultCode', t)}
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
