import React from 'react'
import styled from 'styled-components'
import { Modal } from 'antd'
import {
  title,
  mediumDesktopExactWidth,
  white,
  titleColor,
} from '@edulastic/colors'

/**
 * @param {import('antd/lib/modal').ModalProps} param0
 */
const CustomModalStyled = ({ children, ...props }) => (
  <StyledModal {...props}>{children}</StyledModal>
)

export default CustomModalStyled

const StyledModal = styled(Modal)`
  min-width: ${(props) => (props.modalWidth ? props.modalWidth : '600px')};
  top: ${(props) => (props.top ? props.top : '100px')};
  .ant-modal-content {
    background: ${(props) => (props.bgColor ? props.bgColor : white)};
    padding: ${(props) => props.padding || '25px 45px'};
    border-radius: ${(props) => props.borderRadius};
    .ant-modal-close {
      color: ${(props) => props.closeIconColor || title};
      top: ${(props) => props.closeTopAlign || '10px'};
      right: ${(props) => props.closeRightAlign || '30px'};
      svg {
        width: 24px;
        height: 24px;
      }
    }
    .ant-modal-header {
      padding: 0px;
      background: transparent;
      border: none;
      .ant-modal-title {
        font-size: ${(props) =>
          props.titleFontSize ? props.titleFontSize : '16px'};
        color: ${title};
        font-weight: 700;
        @media (min-width: ${mediumDesktopExactWidth}) {
          font-size: 22px;
        }
      }
    }
    .ant-modal-body {
      display: ${(props) => (props.centerContent ? 'flex' : 'block')};
      align-items: center;
      background: transparent;
      padding: ${(props) =>
        props.bodyPadding ? props.bodyPadding : '25px 0px'};

      & > h4 {
        color: ${title};
        font-size: 14px;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        color: ${titleColor};
        font-weight: 600;
        width: 100%;
        margin-bottom: 10px;
        &.label {
          font-size: 11px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
      }
    }
    .ant-modal-footer {
      border: none;
      display: flex;
      justify-content: center;
      padding: 0px;
    }
  }
`
