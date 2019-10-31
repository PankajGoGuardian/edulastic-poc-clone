import styled, { css } from "styled-components";

const HeaderMenuMobile = css`
  padding-left: 30px;
  margin-top: 0px;
`;
const HeaderMainMenu = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    ${props => props.skinb === "true" && HeaderMenuMobile}
  }
`;

export default HeaderMainMenu;
