import React, { useState, useRef, useCallback, useEffect } from 'react'
import AceEditor from 'react-ace'
import { debounce, get } from 'lodash'

import 'ace-builds/src-noconflict/mode-jsx'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import styled from 'styled-components'
import { Select, Button } from 'antd'
import { EduButton, EduSwitchStyled } from '@edulastic/common'

import { connect } from 'react-redux'
import { compilersList } from '@edulastic/constants/const/questionType'
import { IconPlay } from '@edulastic/icons'
import { setQuestionDataAction } from '../../../author/src/actions/question'
import { getQuestionDataSelector } from '../../../author/QuestionEditor/ducks'

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
// eslint-ignore-next-line
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

const themes = [
  'monokai',
  'github',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'textmate',
  'solarized_dark',
  'solarized_light',
  'terminal',
]

// const themeDisplayNames = {
//   monokai: 'Monokai',
//   github: 'Github',
//   tomorrow: 'Tomorrow',
//   kuroir: 'Kuroir',
//   twilight: 'Twilight',
//   xcode: 'Xcode',
//   textmate: 'Textmate',
//   solarized_dark: 'Solarized Dark',
//   solarized_light: 'Solarized Light',
//   terminal: 'Terminal',
// }
languages.forEach((lang) => {
  import(`ace-builds/src-noconflict/mode-${lang}`)
  import(`ace-builds/src-noconflict/snippets/${lang}`)
})

themes.forEach((theme) => import(`ace-builds/src-noconflict/theme-${theme}`))

const aceEditorProps = {
  placeholder: '',
  enableBasicAutocompletion: false,
  enableLiveAutocompletion: false,
  showGutter: true,
  showPrintMargin: true,
  highlightActiveLine: true,
  enableSnippets: false,
  showLineNumbers: true,
  theme: 'github',
}

const defaultEditorOptions = {
  useWorker: false,
  enableBasicAutocompletion: aceEditorProps.enableBasicAutocompletion,
  enableLiveAutocompletion: aceEditorProps.enableLiveAutocompletion,
  enableSnippets: aceEditorProps.enableSnippets,
  showLineNumbers: aceEditorProps.showLineNumbers,
  tabSize: 2,
}

export function CodeEditorSimple({
  value = '',
  onChange,
  defaultFontSize = 20,
  mode = 'python',
  onRun,
  executing,
  lines = 25,
  disableResponse,
}) {
  const [fontSize, setFontSize] = useState(defaultFontSize)
  const aceRef = useRef()

  return (
    <EditorContainer>
      <Header>
        <OptionWrapper>
          <Select name="mode" onChange={setFontSize} value={fontSize}>
            {[14, 16, 18, 20, 24, 28, 32, 40].map((fsz) => (
              <Select.Option key={fsz} value={fsz}>
                {fsz}
              </Select.Option>
            ))}
          </Select>
        </OptionWrapper>
        <Lang>Python 3 Turtle</Lang>
        {onRun && (
          <OptionWrapper>
            <EduButton type="primary" loading={executing} onClick={onRun}>
              <IconPlay />
            </EduButton>
          </OptionWrapper>
        )}
      </Header>
      <EditorWrapper>
        <AceEditor
          ref={aceRef}
          mode={mode}
          theme={aceEditorProps.theme}
          onChange={onChange}
          value={value}
          fontSize={fontSize}
          showPrintMargin={aceEditorProps.showPrintMargin}
          showGutter={aceEditorProps.showGutter}
          highlightActiveLine={ disableResponse?false:aceEditorProps.highlightActiveLine}
          readOnly={disableResponse}
          setOptions={{ ...defaultEditorOptions, maxLines: lines, minLines:13 }}
        />
      </EditorWrapper>
    </EditorContainer>
  )
}

const CodeEditor = ({
  item,
  questionData,
  setText,
  text,
  disableResponse,
  allowReset = true,
}) => {
  const [fontSize, setFontSize] = useState(14)
  const [darkTheme, onEnableDarkTheme] = useState(false)
  const aceRef = useRef()

  function onLoad() {}

  function onSelectionChange() {}

  function onCursorChange() {}

  function onValidate() {}
  const onChange = useCallback(
    debounce((_value) => {
      setText(_value)
    }, 1000),
    []
  )
  const data = item || questionData || {}
  const language = get(data, 'language', '')
  const compiler = compilersList[language][0].name
  const template = get(data, 'defaultCode', '')
  const onReset = useCallback(() => {
    setText(template)
  }, [template])
  useEffect(() => {
    if (!text && template) setTimeout(() => setText(template), 0)
  }, [template])
  return (
    <EditorContainer>
      <Header darkTheme={darkTheme}>
        {/* <OptionWrapper>
          <Select name="mode" onChange={onSelectProgram} value={mode}>
            {languages.map((lang) => (
              <Select.Option key={lang} value={lang}>
                {languageDisplayName[lang]}
              </Select.Option>
            ))}
          </Select>
        </OptionWrapper> */}
        {/* <OptionWrapper>
          <Select name="mode" onChange={setTheme} value={theme}>
            {themes.map((lang) => (
              <Select.Option key={lang} value={lang}>
                {themeDisplayNames[lang]}
              </Select.Option>
            ))}
          </Select>
        </OptionWrapper> */}
        <OptionWrapper>
          <Lang darkTheme={darkTheme}>
            {languageDisplayName[language]}: {compiler}
          </Lang>
        </OptionWrapper>
        {template && allowReset && (
          <OptionWrapper>
            <Button
              shape="round"
              icon="reload"
              title="Reload Default Template"
              isGhost
              onClick={onReset}
            />
          </OptionWrapper>
        )}
        <div style={{ flex: '1' }} />
        {/* <OptionWrapper>
          <Select name="mode" onChange={setFontSize} value={fontSize}>
            {[14, 16, 18, 20, 24, 28, 32, 40].map((lang) => (
              <Select.Option key={lang} value={lang}>
                {lang}
              </Select.Option>
            ))}
          </Select>
        </OptionWrapper> */}
        {/* <OptionWrapper>
          <span type="primary">
            <IconPlay />
          </span>
        </OptionWrapper> */}
        <OptionWrapper>
          Dark Mode:{' '}
          <EduSwitchStyled
            defaultChecked={darkTheme}
            onChange={onEnableDarkTheme}
          />
        </OptionWrapper>
      </Header>
      <EditorWrapper>
        <AceEditor
          ref={aceRef}
          mode={language}
          theme={darkTheme ? 'monokai' : aceEditorProps.theme}
          name="blah2"
          onLoad={onLoad}
          onChange={onChange}
          onSelectionChange={onSelectionChange}
          onCursorChange={onCursorChange}
          onValidate={onValidate}
          value={text}
          fontSize={fontSize}
          showPrintMargin={aceEditorProps.showPrintMargin}
          showGutter={aceEditorProps.showGutter}
          highlightActiveLine={
            disableResponse ? false : aceEditorProps.highlightActiveLine
          }
          width="auto"
          readOnly={disableResponse}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: aceEditorProps.enableBasicAutocompletion,
            enableLiveAutocompletion: aceEditorProps.enableLiveAutocompletion,
            enableSnippets: aceEditorProps.enableSnippets,
            showLineNumbers: aceEditorProps.showLineNumbers,
            tabSize: 2,
          }}
        />
      </EditorWrapper>
    </EditorContainer>
  )
}

export default connect(
  (state) => ({
    value: state.user,
    questionData: getQuestionDataSelector(state),
  }),
  {
    setQuestionData: setQuestionDataAction,
  }
)(CodeEditor)

const Header = styled.div`
  background: ${(props) => (props.darkTheme ? '#272822' : '#e8e8e8')};
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${(props) => (props.darkTheme ? '#fff' : '')};
`

const OptionWrapper = styled.div`
  display: inline-block;
  margin: 0 10px 0 10px;
  .ant-select-selection {
    width: 140px;
  }
`
const EditorWrapper = styled.div``

const EditorContainer = styled.div`
  min-width: 500px;
  max-width: 1200px;
  margin: 20px auto;
`

const Lang = styled.span`
  display: inline-block;
  background: ${(props) => (props.darkTheme ? '#303129' : '#d8d8d8')};
  padding: 4px 20px;
  border-radius: 5px;
  font-weight: bold;
  color: ${(props) => (props.darkTheme ? '#fff' : '#000')};
  text-align: center;
`
