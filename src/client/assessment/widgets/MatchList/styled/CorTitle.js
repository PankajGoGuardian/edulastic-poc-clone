import styled from "styled-components";

export const CorTitle = styled.div`
  font-weight: ${props => props.theme.widgets.matchList.corTitleFontWeight};
  text-transform: uppercase;
  min-height: 40px;
  border-radius: 4px;
  width: calc(50% - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  margin-right: 44px;
`;
