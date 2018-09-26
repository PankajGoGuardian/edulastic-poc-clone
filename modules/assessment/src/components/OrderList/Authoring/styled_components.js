import TextareaAutosize from 'react-autosize-textarea';
import styled from 'styled-components';
import { grey } from '../utils/css';

export const Container = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
flex-wrap: nowrap;
margin-bottom: 10px;
`;

export const StyledTextarea = styled(TextareaAutosize)`
resize: none;
width: calc(100% - 50px);
border: none;
height: 100%;
border: 1px solid ${grey};
border-top-right-radius: 10px;
border-bottom-right-radius: 10px;
min-height: 50px;
padding: 15px;
`;

export const StyledDragHandle = styled.div`
width: 50px;
flex: 1;
border-top: 1px solid ${grey};
border-bottom: 1px solid ${grey};
border-left: 1px solid ${grey};
border-top-left-radius: 10px;
border-bottom-left-radius: 10px;
`;

export const Item = styled.div`
width: 100%;
display: flex;
align-items: stretch;
margin-right: 15px;
`;
