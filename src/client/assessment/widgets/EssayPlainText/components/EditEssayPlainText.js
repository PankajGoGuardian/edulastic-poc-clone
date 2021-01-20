import React from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'

import { Row, Col } from 'antd'

import { withNamespaces } from '@edulastic/localization'
import { CheckboxLabel } from '@edulastic/common'

import { updateVariables } from '../../../utils/variables'

import { ContentArea } from '../../../styled/ContentArea'

import ComposeQuestion from './ComposeQuestion'
import FormattingOptions from './FormattingOptions'
import Options from './Options'
import Question from '../../../components/Question'
import {
  Scoring,
  BrowserSpellcheckOption,
} from '../../../containers/WidgetOptions/components'
import WordLimitAndCount from '../../../components/WordLimitAndCount'

const EditEssayPlainText = ({
  item,
  setQuestionData,
  advancedLink,
  advancedAreOpen,
  fillSections,
  cleanSections,
  t,
}) => {
  const handleItemChangeChange = (prop, uiStyle) => {
    setQuestionData(
      produce(item, (draft) => {
        draft[prop] = uiStyle
        updateVariables(draft)
      })
    )
  }

  return (
    <ContentArea>
      <ComposeQuestion
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
      />

      <FormattingOptions
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
      >
        <Scoring
          scoringTypes={[]}
          fillSections={fillSections}
          cleanSections={cleanSections}
          advancedAreOpen
          showSelect={false}
          item={item}
        >
          <WordLimitAndCount
            data-cy="setShowWordLimit"
            onChange={handleItemChangeChange}
            selectValue={item.showWordLimit}
            inputValue={item.maxWord}
            advancedAreOpen={advancedAreOpen}
            fillSections={fillSections}
            cleanSections={cleanSections}
            title={item?.title}
            showHeading={false}
          />
          <Row gutter={24}>
            <Col md={12}>
              <CheckboxLabel
                data-cy="showWordCount"
                defaultChecked={item.showWordCount}
                onChange={(e) =>
                  handleItemChangeChange('showWordCount', e.target.checked)
                }
                style={{ marginBottom: '1rem' }}
              >
                {t('component.essayText.showWordCheckbox')}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <BrowserSpellcheckOption
                data-cy="browserSpellCheckOption"
                onChange={(checked) =>
                  handleItemChangeChange('spellcheck', checked)
                }
                checked={!!item.spellcheck}
              />
            </Col>
          </Row>
        </Scoring>
      </Question>

      {advancedLink}

      <Options
        item={item}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
        handleItemChangeChange={handleItemChangeChange}
      />
    </ContentArea>
  )
}

EditEssayPlainText.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
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
