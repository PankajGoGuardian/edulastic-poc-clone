import React from 'react'
import styled, { css } from 'styled-components'
import {
  greyThemeLighter,
  themeColorBlue,
  greyThemeLight,
  white,
} from '@edulastic/colors'
import { Checkbox } from 'antd'

export const CheckBoxGrp = styled(Checkbox.Group)`
  ${({ mode }) => css`
    display: ${mode === 'vertical' ? 'flex' : ''};
    flex-direction: ${mode === 'vertical' ? 'column' : ''};
    gap: ${mode === 'vertical' ? '18px' : ''};
  `}
`

export const CheckboxStyle = styled(Checkbox)`
  width: ${({ width }) => width || 'unset'};
  font-size: ${(props) => props.theme.widgetOptions?.labelFontSize};
  font-weight: ${(props) => props.theme.widgetOptions?.labelFontWeight};
  letter-spacing: -0.4px;
  text-align: left;
  color: ${(props) => props.theme.widgetOptions?.labelColor};
  text-transform: ${(props) => props.textTransform || 'uppercase'};
  margin-bottom: ${({ mb }) => mb || '0px'};
  margin-left: ${({ ml }) => ml || '0px'};
  margin-top: ${({ mt }) => mt || '0px'};
  &.ant-checkbox-wrapper {
    & + .ant-checkbox-wrapper {
      margin-left: 0px;
    }
    .ant-checkbox {
      & + span {
        font-size: ${(props) => props.labelFontSize || '12px'};
        padding: ${(props) => props.labelPadding || '0px 10px'};
        font-weight: ${(props) => props.labelFontWeight};
        color: ${(props) => props.labelColor};
      }
      .ant-checkbox-inner {
        border-color: ${greyThemeLight};
        background: ${greyThemeLighter};
        width: ${({ size }) => size || '18px'};
        height: ${({ size }) => size || '18px'};
        &:after {
          left: 28%;
        }
      }
      &.ant-checkbox-indeterminate .ant-checkbox-inner {
        &:after {
          left: 50%;
          background: ${themeColorBlue};
        }
      }
      &.ant-checkbox-checked {
        &:after {
          border-color: ${themeColorBlue};
        }
        .ant-checkbox-inner {
          border-color: ${themeColorBlue};
          background: ${themeColorBlue};
        }
      }
      &.ant-checkbox-disabled {
        &:after {
          border-color: ${greyThemeLight};
        }
        .ant-checkbox-inner {
          border-color: ${greyThemeLight};
          background: ${greyThemeLight};
        }
      }
      &.ant-checkbox-checked {
        &.ant-checkbox-disabled {
          .ant-checkbox-inner {
            &:after {
              border-color: ${white};
            }
          }
        }
      }
    }
  }
`

const CheckboxLabel = ({ children, ...props }) => (
  <CheckboxStyle {...props}>{children}</CheckboxStyle>
)

export default CheckboxLabel
