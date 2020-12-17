import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep } from 'lodash'
import uuidv4 from 'uuid/v4'
import helpers from '@edulastic/common/src/helpers'

import MathEssayInputLine from './components/MathEssayInputLine/index'
import { Wrapper } from './styled/Wrapper'

export const MathEssayInputContext = React.createContext({})

const MathEssayInput = ({
  textFormattingOptions,
  uiStyle,
  lines,
  setLines,
  item,
  disableResponse,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState()
  const [localType, setLocalType] = useState(uiStyle.defaultMode)

  const handleChange = (index, value) => {
    const text = helpers.removeImageTags(value)
    const newLines = cloneDeep(lines)

    if ((!text || text === '<p><br></p>') && newLines.length > 1) {
      newLines.splice(index, 1)
      setCurrentLineIndex(index - 1)
    } else {
      newLines[index].text = text
    }

    setLines(newLines)
  }

  const onAddNewLine = (index) => {
    const newLines = cloneDeep(lines)

    if (item.uiStyle.max_lines && newLines.length === item.uiStyle.max_lines) {
      return
    }

    newLines.splice(index + 1, 0, {
      text: '',
      type: localType,
      index: uuidv4(),
    })
    setLines(newLines)
    setCurrentLineIndex(index + 1)
  }

  const handleChangeType = (index) => (type) => {
    const newLines = cloneDeep(lines)
    newLines[index].type = type
    if (newLines[index].text === '<p><br></p>' && type === 'math') {
      newLines[index].text = ''
    }
    setLines(newLines)
    setLocalType(type)
  }

  // input response length when using multiple lines
  const contentLength = useMemo(
    () => lines.reduce((acc, line) => line.text.length + acc, 0),
    [lines]
  )

  return (
    <div style={{ width: disableResponse ? 'auto' : '100%' }}>
      <MathEssayInputContext.Provider
        value={{ textFormattingOptions, uiStyle }}
      >
        <Wrapper>
          {lines.map((line, i) => (
            <MathEssayInputLine
              disableResponse={disableResponse}
              key={line.index}
              id={line.index}
              item={item}
              onAddNewLine={() => onAddNewLine(i)}
              onChange={(val) => handleChange(i, val)}
              line={line}
              active={currentLineIndex === i}
              setActive={(outside) => {
                if (outside) {
                  setCurrentLineIndex()
                } else {
                  setCurrentLineIndex(i)
                }
              }}
              onChangeType={handleChangeType(i)}
              contentLength={contentLength}
            />
          ))}
        </Wrapper>
      </MathEssayInputContext.Provider>
    </div>
  )
}

MathEssayInput.propTypes = {
  textFormattingOptions: PropTypes.array,
  lines: PropTypes.array.isRequired,
  setLines: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  disableResponse: PropTypes.bool,
}

MathEssayInput.defaultProps = {
  disableResponse: false,
  textFormattingOptions: [],
  uiStyle: {},
}

export default MathEssayInput
