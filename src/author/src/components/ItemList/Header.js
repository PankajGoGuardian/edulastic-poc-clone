import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TextField, Button } from '@edulastic/common';
import { IconSearch, IconPlus } from '@edulastic/icons';
import { blue, greenDarkSecondary, white } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';

const Header = ({ onSearch, onCreate, t, windowWidth }) => (
  <Container>
    {windowWidth > 480 && <Heading>{t('component.itemlist.header.itemlist')}</Heading>}
    <TextField
      onChange={e => onSearch(e.target.value)}
      height="50px"
      type="search"
      icon={<IconSearch color={blue} />}
      containerStyle={{ marginRight: 20 }}
    />
    <Button
      style={{
        height: 50,
        minWidth: windowWidth > 768 ? 200 : 55,
        color: '#fff',
        margin: 0,
      }}
      onClick={onCreate}
      color="success"
      icon={
        <IconPlus color={greenDarkSecondary} left={20} width={14} height={14} hoverColor={white} />
      }
    >
      {windowWidth > 768 && t('component.itemlist.header.create')}
    </Button>
  </Container>
);

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const enhance = compose(withNamespaces('author'));

export default enhance(Header);

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
