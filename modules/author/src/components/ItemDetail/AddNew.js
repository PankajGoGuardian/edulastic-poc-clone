import React from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import { lightGrey, secondaryTextColor, greenDark } from '../../utils/css';

const AddNew = () => (
  <Container>
    <PlusWrapper>
      <FaPlus style={{ color: greenDark, fontSize: 40, marginBottom: 10 }} /> <Text>Add New</Text>
    </PlusWrapper>
  </Container>
);

export default AddNew;

const Container = styled.div`
  height: 205px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${lightGrey};
  border: solid 1px #e9e9e9;
  border-radius: 10px;
`;

const PlusWrapper = styled.div`
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Text = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${secondaryTextColor};
`;
