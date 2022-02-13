import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import produce from 'immer'

import { withNamespaces } from '@edulastic/localization'

import { Input, Select } from 'antd'
import { compilersList } from '@edulastic/constants/const/questionType'
import { updateVariables } from '../../../utils/variables'

import QuestionTextArea from '../../../components/QuestionTextArea'
import { Subtitle } from '../../../styled/Subtitle'
import Question from '../../../components/Question'

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
  const mode = item.validation.language || item.language || 'python'
  const compiler = compilersList[mode]?.[0]
  const input = item.validation.validResponse.input || ''
  const output = item.validation.validResponse.output || ''

  useEffect(() => {
    setQuestionData((draft) => {
      const language = draft.language || draft.validation.language || 'python'
      draft.validation.language = language
      draft.validation.compiler = compilersList[mode]?.[0]?.name
      draft.language = language
    })
  }, [])

  const handleItemChangeChange = (prop, uiStyle) => {
    setQuestionData((draft) => {
      draft[prop] = uiStyle
      updateVariables(draft)
    })
  }
  // const [mode, setMode] = useState('python')
  const onSelectProgram = (v) => {
    setQuestionData((draft) => {
      draft.validation.language = v
      draft.validation.compiler = compilersList[v][0].name
      draft.language = v
    })
  }

  const setInputValue = (e) => {
    setQuestionData((draft) => {
      draft.validation.validResponse.input = e.target.value
    })
  }

  const setOutputValue = (e) => {
    setQuestionData((draft) => {
      draft.validation.validResponse.output = e.target.value
    })
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
        Language:{'  '}
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
        <div>
          <span> Compiler: </span>
          <span>
            {compiler?.['display-name']
              ? `${compiler?.['display-name']} (${compiler?.['name']})`
              : '-'}
          </span>
        </div>
      </div>

      <br />
      <div>
        Standard Input:
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 15 }}
          type="text"
          value={input}
          onChange={setInputValue}
        />
      </div>
      <div>
        Standard Output:
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 15 }}
          type="text"
          value={output}
          onChange={setOutputValue}
        />
      </div>
      {/* <div style={{ marginTop: '10px' }}>
        <EduButton>Add More</EduButton>
      </div> */}
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
