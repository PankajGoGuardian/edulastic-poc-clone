import styled from 'styled-components'
import { lightBlue, white, themeColor } from '@edulastic/colors'

export const CreateClassDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${themeColor};
  color: ${white};
  width: 207px;
  height: 40px;
  padding: 10px 0px;
  border-radius: 4px;
  & > svg {
    fill: ${white};
    width: 19.81px;
    height: 19.81px;
  }
  & > p {
    text-transform: uppercase;
    font-size: 12px;
  }
`
export const SyncClassDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${lightBlue};
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  & > p {
    color: ${themeColor};
    text-transform: uppercase;
    padding-left: 10px;
    font-size: 12px;
  }
  & > svg {
    width: 19.81px;
    height: 19.81px;
  }
`
export const CreateCardBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  border: 2px dashed ${themeColor};
  border-radius: 10px;
  height: 257px;
  width: 311px;
`
