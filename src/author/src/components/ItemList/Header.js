import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TextField } from '@edulastic/common';
import { IconSearch, IconPlus } from '@edulastic/icons';
import { blue, green, greenDarkSecondary, white } from '@edulastic/colors';

import { DashboardControlBtn } from '../common';
import { translate } from '../../utils/localization';

const Header = ({ onSearch, onCreate }) => (
  <Container>
    <Heading>{translate('component.itemlist.header.itemlist')}</Heading>
    <TextField
      onChange={e => onSearch(e.target.value)}
      height="50px"
      type="search"
      icon={<IconSearch color={blue} />}
      containerStyle={{ marginRight: 20 }}
    />
    <DashboardControlBtn
      save
      style={{ height: 50, width: 200, color: '#fff', margin: 0 }}
      onClick={onCreate}
    >
      <IconPlus
        color={greenDarkSecondary}
        left={20}
        width={14}
        height={14}
        hoverColor={white}
        backgroundColor={green}
      />
      <span>{translate('component.itemlist.header.create')}</span>
    </DashboardControlBtn>
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
  padding: 20px 0;
`;

const Heading = styled.h1`
  width: 200px;
  font-size: 22px;
`;
