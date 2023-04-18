import { Popover, Typography } from 'antd'
import React, { useState } from 'react'
import {
  GlobalStyle,
  StyledIconCaretDown,
  StyledIconClose,
  StyledMenu,
  StyledMenuItem,
  StyledMenuItemTitle,
  StyledText,
} from './styled'

const ActionButton = ({ options, children, onAction }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  const content = (
    <>
      <StyledMenu onClick={onAction}>
        <StyledMenuItemTitle key="-1">
          <Typography.Text>{children}</Typography.Text>
        </StyledMenuItemTitle>
        {options?.map(({ key, label }, index) => {
          return (
            <StyledMenuItem $last={index === options.length - 1} key={key}>
              {label}
            </StyledMenuItem>
          )
        })}
      </StyledMenu>
      <StyledIconClose onClick={toggleVisible} height={8} width={8} />
    </>
  )
  return (
    <>
      <GlobalStyle />
      <Popover
        visible={visible}
        overlayClassName="no-padding-popover"
        content={content}
        placement="left"
        onVisibleChange={toggleVisible}
        trigger={['click']}
      >
        <StyledText onClick={toggleVisible}>{children}</StyledText>
      </Popover>
      <StyledIconCaretDown height={6} width={6} />
    </>
  )
}

export default ActionButton
