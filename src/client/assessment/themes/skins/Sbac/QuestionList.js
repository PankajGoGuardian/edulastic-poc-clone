import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import { withKeyboard } from '@edulastic/common'
import { StyledDropdown, StyledIcon } from './styled'

const MenuItem = withKeyboard(Menu.Item)

const QuestionList = ({
  options = [],
  currentItem = 0,
  gotoQuestion,
  blockNavigationToAnsweredQuestions = false,
}) => {
  const handleQuestionCLick = (e) =>
    e && gotoQuestion(options[parseInt(e.key, 10)])

  const menu = (
    <Menu onClick={handleQuestionCLick}>
      <Menu.Item disabled>
        Select question <StyledIcon type="down" />
      </Menu.Item>
      {options.map((option) => (
        <MenuItem
          key={option}
          data-cy="questionSelectOptions"
          disabled={blockNavigationToAnsweredQuestions}
          onClick={() => {
            handleQuestionCLick({ key: option })
          }}
        >
          Question&nbsp;&nbsp;&nbsp;{`0${option + 1}`.slice(-2)}
        </MenuItem>
      ))}
    </Menu>
  )

  return (
    <StyledDropdown
      overlay={menu}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      trigger={['hover', 'click']}
    >
      <button
        type="button"
        className="ant-dropdown-link"
        onClick={(e) => e.preventDefault()}
        data-cy="options"
      >
        Question {`0${currentItem + 1}`.slice(-2)} <StyledIcon type="down" />
      </button>
    </StyledDropdown>
  )
}

QuestionList.propTypes = {
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  currentItem: PropTypes.number.isRequired,
  gotoQuestion: PropTypes.func.isRequired,
}

export default QuestionList
