import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
`;

export const Title = styled.div`
  font-size: 11px;
  font-weight: 600;
  line-height: 11px;
  color: #aaafb5;
  text-transform: uppercase;
  margin-bottom: 6px;
  white-space: nowrap;
`;

export const Value = styled.div`
  font-size: 14px;
  line-height: 14px;
  font-weight: bold;
  color: #30404f;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
