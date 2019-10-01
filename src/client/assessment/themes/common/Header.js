import styled from "styled-components";

const Header = styled.div`
  width: 100%;
  height: 62px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: ${({ LCBPreviewModal }) => (LCBPreviewModal ? "fixed" : "absolute")};
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.header.headerBgColor};
  z-index: 50;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px 26px 5px 26px;
    height: 104px;
  }
`;

export default Header;
