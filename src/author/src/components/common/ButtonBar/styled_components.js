import styled from 'styled-components';
import { white, green } from '@edulastic/colors';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;

  .ant-menu-item {
    height: 62px;
    display: flex;
  }

  .ant-btn {
    height: 40px;
    width: 100px;
    border-radius: 4px;
    background-color: ${green};
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      font-size: 11px;
      font-weight: 600;
      color: ${white};
      letter-spacing: 0.2px;
    }
  }
  
  .ant-menu-horizontal {
    background: transparent;
    border-bottom: none;
    display: flex;
    flex: 1;
  }

  .ant-menu-item {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #e5e5e5;
    padding-top: 7px;
  }

  .ant-menu-item-active {
    letter-spacing: 0.2px !important;
    font-weight: 600 !important;
    color: ${white} !important;
    border-bottom: solid 4px #c9c9c9 !important;
  }

  .ant-menu-horizontal > .ant-menu-item-selected {
    background: #057fc1;
    border-bottom: solid 4px #c9c9c9;
    letter-spacing: 0.2px;
    font-weight: 600;
    color: ${white};
  }
`;

export const PreviewBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
  }
`;

export const StyledButton = styled.div`
  margin-right: 10px;
  margin-bottom: 10px;
`;

export const HeadIcon = styled.div`
  margin-top: 4px;
  margin-right: 10px;
`;

export const RightSide = styled.div`
`;
