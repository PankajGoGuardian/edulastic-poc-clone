import { smallDesktopWidth } from '@edulastic/colors'
import styled from 'styled-components'

export const StyledTestName = styled.div`
  max-width: 55%;
  width: fit-content;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  @media (max-width: ${smallDesktopWidth}) {
    max-width: 100%;
    width: 100%;
  }
`
export const StyledStudentNameContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 40%;
  min-width: 200px;
  justify-content: flex-end;
  @media (max-width: ${smallDesktopWidth}) {
    justify-content: flex-start;
    max-width: 100%;
    width: 100%;
    margin-top: 15px;
    margin-left: -3px;
  }
`
export const StyledStudentName = styled.div`
  color: #9501db;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 25px);
  width: fit-content;
  font-weight: 600;
`
