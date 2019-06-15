import { Row, Rate, Button } from "antd";
import styled from "styled-components";

export const Greencard = styled.div`
  background: linear-gradient(to right, #4cd43b, #0eb08d);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.8rem;
  border-top: 2px solid #0eb08d;
  box-shadow: 0 -5px 5px -4px #0eb08d;
  cursor: pointer;
`;

export const Infocard = styled.div`
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.7);
  text-align: center !important;
  padding: 1rem !important;
`;

export const InfoCardIconWrapper = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

export const RateWrapper = styled(Rate)`
  font-size: 14px;
  text-align: end !important;
  display: block;
  line-height: 2rem;
`;

export const ButtonWrapper = styled(Button)`
  padding: 0.3rem;
  background: #f30c80;
  border: 4px 4px 4px 4px;
  color: white;
  box-shadow: 0 2px 4;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;
