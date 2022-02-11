import React, { useState } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-jsx'
/*eslint-disable no-alert, no-console */
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import styled from 'styled-components'
import { Select } from 'antd'
const languages = [
  'javascript',
  'java',
  'python',
  'ruby',
  'golang',
  'typescript',
  'c_cpp',
  'objectivec',
  'swift',
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
  // eslint-disable-next-line import/no-dynamic-require
  require(`ace-builds/src-noconflict/mode-java`)
  // eslint-disable-next-line import/no-dynamic-require
  require(`ace-builds/src-noconflict/snippets/${lang}`)
})

themes.forEach((theme) => require(`ace-builds/src-noconflict/theme-${theme}`))

const defaultValue = `function onLoad(editor) {
  console.log("i've loaded");
}`
const CodeEditor = () => {
  const [state, setState] = useState({
    value: defaultValue,
    placeholder: '',
    theme: 'monokai',
    mode: 'python',
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: false,
    fontSize: 14,
    showGutter: true,
    showPrintMargin: true,
    highlightActiveLine: true,
    enableSnippets: false,
    showLineNumbers: true,
  })

  function onLoad() {
    console.log("i've loaded")
  }
  function onChange(newValue) {
    console.log('change', newValue)
    setState({ ...state, value: newValue })
  }

  function onSelectionChange(newValue, event) {
    console.log('select-change', newValue)
    console.log('select-change-event', event)
  }

  function onCursorChange(newValue, event) {
    console.log('cursor-change', newValue)
    console.log('cursor-change-event', event)
  }

  function onValidate(annotations) {
    console.log('onValidate', annotations)
  }

  function setTheme(value) {
    setState({ ...state, theme: value })
  }
  function setMode(value) {
    setState({ ...state, mode: value })
  }
  function setFontSize(value) {
    setState({ ...state, fontSize: value })
  }
  return (
    <EditorContainer>
      <Header>
        <OptionWrapper>
          <Select name="mode" onChange={setMode} value={state.mode}>
            {languages.map((lang) => (
              <Select.Option key={lang} value={lang}>
                {languageDisplayName[lang]}
              </Select.Option>
            ))}
          </Select>
        </OptionWrapper>
        <OptionWrapper>
          <Select name="mode" onChange={setTheme} value={state.theme}>
            {themes.map((lang) => (
              <Select.Option key={lang} value={lang}>
                {themeDisplayNames[lang]}
              </Select.Option>
            ))}
          </Select>
        </OptionWrapper>
        <OptionWrapper>
          <Select name="mode" onChange={setFontSize} value={state.fontSize}>
            {[14, 16, 18, 20, 24, 28, 32, 40].map((lang) => (
              <Select.Option key={lang} value={lang}>
                {lang}
              </Select.Option>
            ))}
          </Select>
        </OptionWrapper>
      </Header>
      <EditorWrapper>
        <CodeHeader>Editor</CodeHeader>
        <AceEditor
          placeholder={state.placeholder}
          mode={state.mode}
          theme={state.theme}
          name="blah2"
          onLoad={onLoad}
          onChange={onChange}
          onSelectionChange={onSelectionChange}
          onCursorChange={onCursorChange}
          onValidate={onValidate}
          value={state.value}
          fontSize={state.fontSize}
          showPrintMargin={state.showPrintMargin}
          showGutter={state.showGutter}
          highlightActiveLine={state.highlightActiveLine}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: state.enableBasicAutocompletion,
            enableLiveAutocompletion: state.enableLiveAutocompletion,
            enableSnippets: state.enableSnippets,
            showLineNumbers: state.showLineNumbers,
            tabSize: 2,
          }}
        />
      </EditorWrapper>
    </EditorContainer>
  )
}

export default CodeEditor

const Header = styled.div`
  background: #000;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const OptionWrapper = styled.div`
  background: #fff;
  display: inline-block;
  margin: 0 10px 0 10px;
  .ant-select-selection {
    width: 140px;
  }
`
const EditorWrapper = styled.div``

const EditorContainer = styled.div`
  width: 500px;
  border: 1px solid #e3e3e2;
`

const CodeHeader = styled.div`
  padding: 10px;
`
