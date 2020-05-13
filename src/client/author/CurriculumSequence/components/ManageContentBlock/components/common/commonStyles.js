import styled from "styled-components";
import { Input } from "antd";
import { desktopWidth, white, title, lightGreySecondary } from "@edulastic/colors";

export const ModalHeader = styled.h3`
  font-size: 22px;
  font-weight: 600;
`;

export const ModalContent = styled.div`
  background: ${white};
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 15px 0px 20px 0px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin: auto;
  width: 420px;
  padding: 10px 20px 20px 0;
  .ant-btn {
    font-size: 10px;
    font-weight: 600;
    min-width: 100px;
    padding-left: 20px;
    padding-right: 20px;
    @media only screen and (max-width: ${desktopWidth}) {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
`;

export const Title = styled.div`
  margin: 4px 2px;
  text-transform: uppercase;
  color: ${title};
  font-weight: 500;
  font-size: 11px;
`;

export const StyledInput = styled(Input)`
  background: ${lightGreySecondary};
  width: "100%";
  height: 40px;
  background: #f8f8f8 0% 0% no-repeat padding-box;
  border: 1px solid #b9b9b9;
  border-radius: 2px;
  opacity: 1;

  &::placeholder {
    color: #6a737f;
  }
`;
