import styled from 'styled-components'

import { Paper } from '@edulastic/common'
import { grey, secondaryTextColor, themeColorLight } from '@edulastic/colors'

export const PaperCreate = styled(Paper)`
  border-radius: 5px;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 450px;
  text-align: center;

  .ant-btn {
    width: 225px;
    text-transform: uppercase;
    font-size: 11px;
    min-height: 40px;
    background: ${themeColorLight};
    border: none;
    border-radius: 4px;
  }
`

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${grey};
  margin-top: 30px;
  margin-bottom: 30px;
`

export const DesriptionBottom = styled.p`
  font-size: ${(props) => props.theme.standardFont};
  padding: 0 23px;
  font-weight: 600;
  color: ${secondaryTextColor};
`

export const FlashQuiz = styled.div`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.largeFontSize};
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  padding-left: 10px;
  span {
    color: ${(props) => props.theme.tagTextColor};
  }
  &::after {
    content: 'beta';
    background: #f25c54;
    font-size: 10px;
    color: white;
    padding: 2px 8px;
    border-radius: 20px;
    position: relative;
    right: -5px;
    top: -10px;
  }
`
