import React from 'react'
import styled from 'styled-components'
import { Modal } from 'antd'
import {
  title,
  mediumDesktopExactWidth,
  white,
  titleColor,
} from '@edulastic/colors'

const CustomModalStyled = ({ children, ...props }) => (
  <StyledModal {...props}>{children}</StyledModal>
)

export default CustomModalStyled

const StyledModal = styled(Modal)`
  min-width: ${(props) =>
    props.modalWidth ? props.modalWidth : props.fullscreen ? '100%' : '600px'};
  padding-bottom: ${(props) => (props.fullscreen ? '0px' : '24px')};
  top: ${(props) =>
    props.top ? props.top : props.fullscreen ? '0px' : '100px'};
  .ant-modal-content {
    background: ${white};
    border-radius: ${(props) => (props.fullscreen ? '0px' : '4px')};
    min-height: ${(props) => (props.fullscreen ? '100vh' : 'auto')};
    padding: ${(props) => props.padding || '25px 45px'};
    .ant-modal-close {
      color: ${title};
      top: 10px;
      right: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
    .ant-modal-header {
      padding: 0px;
      background: transparent;
      border: none;
      .ant-modal-title {
        font-size: 16px;
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
