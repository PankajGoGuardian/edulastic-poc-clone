import { Switch } from 'antd'
import styled from 'styled-components'
import { themeColorBlue, white } from '@edulastic/colors'

export const EduSwitchStyled = styled(Switch)`
  &.ant-switch {
    background: rgba(0, 0, 0, 0.25);
    position: relative;
    min-width: ${(props) => props.width || '40'}px !important;
    .ant-switch-inner {
      &:after {
        content: ${({ switchTextYesNo }) =>
          switchTextYesNo ? "'NO'" : "'OFF'"};
        font-size: 9px;
        color: #606060;
        position: absolute;
        font-weight: bold;
        top: 50%;
        right: 5px;
        transform: translateY(-50%);
      }
    }
    &.ant-switch-checked {
      background: ${themeColorBlue};
      .ant-switch-inner {
        &:after {
          content: ${({ switchTextYesNo }) =>
            switchTextYesNo ? "'YES'" : "'ON'"};
          color: ${white};
          top: 50%;
          right: auto;
          left: 5px;
          transform: translateY(-50%);
        }
      }
    }
  }
`
