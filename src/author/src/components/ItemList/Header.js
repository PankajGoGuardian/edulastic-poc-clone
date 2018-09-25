import React from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';

import { TextField, Button } from '../common';
import { blue } from '../../utils/css';

const Header = ({ onSearch, onCreate }) => (
  <Container>
    <Heading>Item List</Heading>
    <TextField
      onChange={e => onSearch(e.target.value)}
      height="50px"
      type="search"
      icon={<FaSearch color={blue} />}
      style={{ marginRight: 20 }}
    />
    <Button color="success" icon={<FaPlus />} onClick={onCreate} style={{ height: 50, width: 150 }}>
      Create
    </Button>
  </Container>
);

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default Header;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Heading = styled.h1`
  width: 200px;
`;
