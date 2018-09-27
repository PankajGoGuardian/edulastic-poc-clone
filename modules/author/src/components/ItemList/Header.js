import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { TextField, Button } from '../common';
import { translate } from '../../utils/localization';
import { IconSearch, IconPlus } from '../../../../assessment/src/components/common/icons';
import { blue, greenDarkSecondary } from '../../../../assessment/src/utils/css';

const Header = ({ onSearch, onCreate }) => (
  <Container>
    <Heading>{translate('component.itemlist.header.itemlist')}</Heading>
    <TextField
      onChange={e => onSearch(e.target.value)}
      height="50px"
      type="search"
      icon={<IconSearch color={blue} />}
      style={{ marginRight: 20 }}
    />
    <Button
      color="success"
      icon={<IconPlus color={greenDarkSecondary} />}
      onClick={onCreate}
      style={{ height: 50, width: 150 }}
    >
      {translate('component.itemlist.header.create')}
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
