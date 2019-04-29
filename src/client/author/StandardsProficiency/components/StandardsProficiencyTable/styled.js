import styled from "styled-components";
import { Select, Button, Radio, Input } from "antd";
const RadioGroup = Radio.Group;

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  th {
    border: none !important;
  }

  .ant-table-wrapper {
    width: 100%;
  }

  input {
    border: 1px solid #d9d9d9;
  }
`;

export const TopDiv = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 20px
	align-items: center;
`;

export const InfoDiv = styled.div`
  display: column;
`;

export const StyledH3 = styled.h3``;

export const StyledDescription = styled.p``;

export const StyledButton = styled.a`
  margin-right: 20px;
  font-size: 20px;
`;

export const SaveButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SaveAlert = styled.p`
  color: #f9ac59;
  text-align: right;
  margin-right: 20px;
  line-height: 32px;
`;

export const StyledAddButton = styled(Button)`
  align-self: flex-end;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const StyledMasterDiv = styled.div``;

export const StyledUl = styled.ul`
  padding-left: 24px;
`;

export const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  flex-direction: column;

  .ant-radio-wrapper {
    margin-bottom: 5px;
  }
`;

export const StyledAverageRadioDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledLabel = styled.label`
  margin-right: 5px;
`;

export const StyledAverageInput = styled(Input)`
  width: 80px;
  min-width: 80px;
  margin-top: -3px;
`;

export const StyledScoreDiv = styled.div`
  display: flex;
  align-items: center;
  padding-left: 12px;

  .anticon-down {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.25);
    margin-left: 5px;
    margin-right: 4px;
  }
`;
