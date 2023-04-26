import styled from 'styled-components'
import { themeColor, greyThemeDark4, lightSkyBlue } from '@edulastic/colors'
import PerfectScrollbar from 'react-perfect-scrollbar'

export const Menu = styled.div`
  position: fixed;
  width: 230px;
  padding: 30px 0px;
  height: 100%;
`
export const StlyedListItem = styled.li`
  cursor: pointer;
  .nav-section-label {
    border-left: 2px solid ${lightSkyBlue};
  }
  &:last-of-type {
    .nav-section-label {
      border-left: none;
      padding-bottom: 0px;
    }
    .nav-list-item-pointer-container {
      left: -6px;
    }
  }
`

export const StyledSectionLabel = styled.div`
  display: flex;
  border-left: 1px solid ${greyThemeDark4};
  padding-bottom: 40px;
`

export const StyledLabelContainer = styled.div`
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ isActive }) => (isActive ? themeColor : greyThemeDark4)};
  padding-left: 25px;
  position: relative;
  text-transform: uppercase;
  top: -3px;
`

export const StyledListPointer = styled.div`
  height: 13px;
  width: 13px;
  border-radius: 50px;
  background: ${({ isActive }) => (isActive ? themeColor : lightSkyBlue)};
`
export const StyledListPointerContainer = styled.div`
  position: relative;
  left: -7px;
`

export const StyledList = styled.ul`
  list-style: none;
  padding-left: 0px;
  padding: 15px 0px;
`

export const ScrollbarContainer = styled(PerfectScrollbar)`
  padding-left: 10px;
`
