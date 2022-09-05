import styled from 'styled-components'

export const FilterWrapper = styled.div`
  background: ${(props) => props.theme.manageDistrict?.filterDivBgcolor};
  border-radius: ${(props) => props.theme.manageDistrict?.filterDivBorderRadius};
  padding: ${(props) => (props.showFilters ? '10px 10px 0px' : '0px 10px')};
  height: ${(props) => (props.showFilters ? 'auto' : '0px')};
  overflow: hidden;
  transition: 0.2s;
`
