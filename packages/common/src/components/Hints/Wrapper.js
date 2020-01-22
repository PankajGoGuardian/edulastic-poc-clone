import styled from "styled-components";

export default styled.div`
  background: #eeeeef;
  border-radius: 10px;
  padding: 8px 24px 24px;
  margin: ${({ margin }) => margin};
  .ant-tabs-bar {
    border-bottom: 1px solid #ccc;
  }
`;
