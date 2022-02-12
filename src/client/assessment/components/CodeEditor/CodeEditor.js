import React, { useState, useRef } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-jsx'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import styled from 'styled-components'
import { Select } from 'antd'
import { EduSwitchStyled } from '@edulastic/common'

import { connect } from 'react-redux'
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

const themeDisplayNames = {
  monokai: 'Monokai',
  github: 'Github',
  tomorrow: 'Tomorrow',
  kuroir: 'Kuroir',
  twilight: 'Twilight',
  xcode: 'Xcode',
  textmate: 'Textmate',
  solarized_dark: 'Solarized Dark',
  solarized_light: 'Solarized Light',
  terminal: 'Terminal',
}
languages.forEach((lang) => {
  import(`ace-builds/src-noconflict/mode-${lang}`)
  import(`ace-builds/src-noconflict/snippets/${lang}`)
})

themes.forEach((theme) => import(`ace-builds/src-noconflict/theme-${theme}`))

const defaultValue = `function onLoad(editor) {
  console.log("i've loaded");
}`

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

const CodeEditor = ({ item, questionData, setText, text }) => {
  const [value, setValue] = useState(text)
  const [fontSize, setFontSize] = useState(14)
  const [darkTheme, onEnableDarkTheme] = useState(false)
  const aceRef = useRef()

  function onLoad() {}

  function onSelectionChange() {}

  function onCursorChange() {}

  function onValidate() {}
  function onChange(_value) {
    setValue(_value)
    setText?.(_value)
  }

  const { language = '' } = item || questionData || {}
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
          <Select name="mode" onChange={setFontSize} value={fontSize}>
            {[14, 16, 18, 20, 24, 28, 32, 40].map((lang) => (
              <Select.Option key={lang} value={lang}>
                {lang}
              </Select.Option>
            ))}
          </Select>
        </OptionWrapper>
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
          value={value}
          fontSize={fontSize}
          showPrintMargin={aceEditorProps.showPrintMargin}
          showGutter={aceEditorProps.showGutter}
          highlightActiveLine={aceEditorProps.highlightActiveLine}
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
  margin: 0 10px 0 50px;
  .ant-select-selection {
    width: 140px;
  }
`
const EditorWrapper = styled.div``

const EditorContainer = styled.div`
  width: 500px;
  margin: 20px 0;
`
