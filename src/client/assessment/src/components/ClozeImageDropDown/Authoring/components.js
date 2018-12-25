
import styled from 'styled-components';
import { CustomQuillComponent } from '@edulastic/common';
import {
  Input,
  InputNumber,
  Select
} from 'antd';
import FlexView from '../common/FlexView';

export const TransparentBackInput = styled.input`
  background: transparent;
`;

export const ColorPickerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

export const ColorPickerContainer = styled.div`
  position: relative;
  top: 30px;
  left: -50px;
  width: 0;
  height: 0;
  z-index: 1000;
`;

export const ColorBox = styled.div`
  width: 40px;
  height: 40px;
  padding: 5px;
  border-radius: 5px;
  margin: 5px 10px;
  background: white;
  border: '1px solid #e6e6e6';
  background-color: ${props => props.background}
`;

export const FlexContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;

  & > div {
    display: flex;
  }
`;

export const SortableItems = styled(FlexContainer)`
  flex-flow: row wrap;
  padding: 0px;
`;

export const FormContainer = styled(FlexContainer)`
  background: #e6e6e63A;
  height: 67px;
  font-size: 13px;
  font-weight: 600;
  color: #434b5d;
  border-bottom: 1px solid #e6e6e6;
  border-radius: 10px 10px 0px 0px;
  overflow: hidden;
`;

export const ControlBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 120px;
  height: 100%;
  padding: 22px 10px;
  align-itmes: center;
  align-self: flex-start;
`;

export const PointerContainer = styled.div`
  position: relative;
  width: 100px;
  margin: 10px 0px;
`;

export const ControlButton = styled.button`
  width: 100px;
  height: 100px;
  white-space: normal;
  border-radius: 4px;
  border: none;
  outline: none;
  display: flex;
  background: transparent;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.36;
  color: #434b5d;
  cursor: pointer;

  &:not([disabled]) {
    background: white;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.06);
  }
`;

// This is reported by `no-useless-concat`.
export const ImageContainer = styled.div`
  position: relative;
  top: 0px; left: 0px;
  min-height: 400px;
  padding: 0px;
  width: ${props => (
    /* eslint-disable prefer-template */
    props.width ? (props.width + 'px') : '100%'
  )};
  height: 100%;
`;

export const PreviewImage = styled.img`
  width: 100%;
  user-select: none;
  pointer-event: non;
`;

export const CheckContainer = styled.div`
  position: absolute;
  left: 60px;
  bottom: 20px;
  align-self: flex-start;
`;

export const StyledCustomQuill = styled(CustomQuillComponent)`
  min-height: 134px;
  border-radius: 4px;
  border: 1px solid rgb(223, 223, 223);
  padding: 18px 33px;
`;


export const ImageWidthInput = styled(InputNumber)`
  height: 40px;
  padding: 5px;
  color: #434b5d;
  font-weight: 600;
`;

export const ImageAlterTextInput = styled(Input)`
  width: 220px;
`;

export const MaxRespCountInput = styled(InputNumber)`
  width: 100px;
  height: 40px;
  padding: 5px;
  color: #434b5d;
  font-weight: 600;
`;

export const PointerSelect = styled(Select)`
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  align-items: flex-end;
  cursor: pointer;
`;

export const ImageFlexView = styled(FlexView)`
  flex-direction: column;
  align-items: center;
  background: white;
  border-right: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  border-radius: 0px 0px 10px 0px;
  overflow: hidden;
  position: relative;
`;

export const AriaLabelEdit = styled.div`
  height: 40px;
  display: flex;

  & span {
    background: darkgray;
    padding: 4px;
  }
`;
