import React from 'react'
import Radio from "antd/es/Radio";
import styled from 'styled-components'
import { darkBlue } from '@edulastic/colors'
import { getStemNumeration } from '../../utils/helpers'

const QuestionOptions = ({ options = [], style = {} }) => {
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  }
  const radioGroupStyle = {
    minWidth: '200px',
    border: '2px solid lightgrey',
    borderRadius: '4px',
    padding: '10px',
  }

  if (!options.length) {
    return null
  }

  return (
    <div className="__prevent-page-break">
      <div
        style={{ ...style, display: 'flex', flexWrap: 'wrap' }}
        className="__print-question-option"
      >
        {options.map((option, i) => (
          <div style={{ display: 'flex' }}>
            <StyledOptionTitle>
              {getStemNumeration('lowercase', i)}
            </StyledOptionTitle>
            <Radio.Group style={radioGroupStyle}>
              {option.map((item) => (
                <Radio style={radioStyle} value={item}>
                  {item}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        ))}
      </div>
    </div>
  )
}

const StyledOptionTitle = styled.div`
  font-size: 17px;
  color: ${darkBlue};
  margin-top: -8px;
  margin-right: 6px;
  margin-left: 12px;
  font-weight: bold;
`

export default QuestionOptions
