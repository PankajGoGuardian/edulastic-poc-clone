import React, { useCallback } from 'react'
import BlocklyWorkspace from 'react-blockly'
import Blockly from 'blockly'
import styled from 'styled-components'
import toolboxCategories from './toolboxCategories.json'

const StyledBlocklyWorkspace = styled(({ className, ...props }) => (
  <BlocklyWorkspace wrapperDivClassName={className} {...props} />
))`
  width: 100%;
  height: 500px;
`

// const toolboxCategories = parseWorkspaceXml(X.INITIAL_TOOLBOX_XML)
// import

const VisualEditor = (props) => {
  const { initialCode, onChange } = props

  const onChangeHandler = useCallback(
    (workspace) => {
      console.log(Blockly, workspace)
      onChange?.({
        xml: Blockly.Xml.workspaceToDom(workspace).outerHTML,
        code: Blockly.JavaScript.workspaceToCode(workspace),
      })
    },
    [onChange]
  )
  return (
    <StyledBlocklyWorkspace
      toolboxCategories={toolboxCategories}
      initialXml={initialCode?.xml}
      workspaceConfiguration={{
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true,
        },
      }}
      workspaceDidChange={onChangeHandler}
    />
  )
}

export default VisualEditor
