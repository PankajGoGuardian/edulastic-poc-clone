import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import produce from 'immer'

import { withNamespaces } from '@edulastic/localization'

import { Input, Select } from 'antd'
import { updateVariables } from '../../../utils/variables'

import QuestionTextArea from '../../../components/QuestionTextArea'
import { Subtitle } from '../../../styled/Subtitle'
import Question from '../../../components/Question'
import { compilersList } from '@edulastic/constants/const/questionType'

const languages = [
  'python',
  'javascript',
  'java',
  'golang',
  'typescript',
  'c_cpp',
  'objectivec',
  'swift',
  'ruby',
  'perl',
]

const languageDisplayName = {
  javascript: 'JavaScript',
  java: 'Java',
  python: 'Python',
  ruby: 'Ruby',
  golang: 'Go',
  typescript: 'TypeScript',
  c_cpp: 'C++',
  objectivec: 'C',
  swift: 'Swift',
  perl: 'Perl',
}

const ComposeQuestion = (props) => {
  const { item, setQuestionData, t, fillSections, cleanSections } = props
  const mode = item.selectedProgram || 'python'
  const compiler = compilersList[mode]?.[0]
  const inputValue = item.inputValue || ''
  const outPutvalue = item.outPutvalue || ''

  useEffect(() => {
    setQuestionData(
      produce(item, (draft) => {
        draft.selectedProgram = 'python'
        draft.compiler = compiler?.name
      })
    )
  }, [])

  const handleItemChangeChange = (prop, uiStyle) => {
    setQuestionData(
      produce(item, (draft) => {
        draft[prop] = uiStyle
        updateVariables(draft)
      })
    )
  }
  // const [mode, setMode] = useState('python')
  const onSelectProgram = (v) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.selectedProgram = v
        draft.compiler = compiler?.name
      })
    )
  }

  const setInputValue = (e) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.inputValue = e.target.value
      })
    )
  }

  const setOutputValue = (e) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.outPutvalue = e.target.value
      })
    )
  }

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

      <QuestionTextArea
        placeholder={t('component.essayText.enterQuestion')}
        onChange={(stimulus) => handleItemChangeChange('stimulus', stimulus)}
        value={item.stimulus}
        toolbarId="compose-question"
        border="border"
      />
      <br />
      <div>
        Select the programming language:{'  '}
        <Select
          name="mode"
          onChange={onSelectProgram}
          value={mode}
          style={{ width: '200px' }}
        >
          {languages.map((lang) => (
            <Select.Option key={lang} value={lang}>
              {languageDisplayName[lang]}
            </Select.Option>
          ))}
        </Select>
        <span> Compiler: </span>
        <span>{compiler?.['display-name'] || '-'}</span>
      </div>

      <br />
      <div>
        Input of the program:
        <Input type="text" value={inputValue} onChange={setInputValue} />
      </div>
      <div>
        Output of the program:
        <Input type="text" value={outPutvalue} onChange={setOutputValue} />
      </div>
    </Question>
  )
}

ComposeQuestion.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

ComposeQuestion.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
}

export default withNamespaces('assessment')(ComposeQuestion)
