import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'

import { FlexContainer, QuestionNumberLabel } from '@edulastic/common'

import { Wrapper } from './styled/Wrapper'
import { QuestionNumberWrapper } from './styled/QuestionNumber'
import ProtractorImg from './assets/protractor.svg'
import Rule from './Rule'
import { CustomStyleBtn } from '../../styled/ButtonStyles'

const ProtractorView = ({ item, smallSize, showQuestionNumber }) => {
  const [show, setShow] = useState(false)

  const renderRule = () => {
    if (item.button && !show) {
      return null
    }
    return (
      <Rule
        smallSize={smallSize}
        showRotate={item.rotate}
        width={item.width}
        height={item.height}
      />
    )
  }

  return (
    <Wrapper smallSize={smallSize}>
      {item.button && (
        <CustomStyleBtn
          width="auto"
          onClick={() => setShow(!show)}
          size="large"
        >
          <FlexContainer>
            <img
              src={item.image ? item.image : ProtractorImg}
              alt=""
              height={16}
              style={{ marginRight: '10px' }}
            />
            <QuestionNumberWrapper>
              {showQuestionNumber && (
                <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>
              )}
              <span>{item.label}</span>
            </QuestionNumberWrapper>
          </FlexContainer>
        </CustomStyleBtn>
      )}
      {renderRule()}
    </Wrapper>
  )
}

ProtractorView.propTypes = {
  item: PropTypes.object.isRequired,
  smallSize: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
}

ProtractorView.defaultProps = {
  smallSize: false,
  showQuestionNumber: false,
}

export default memo(ProtractorView)
