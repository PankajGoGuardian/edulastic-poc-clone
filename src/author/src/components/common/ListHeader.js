import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TextField, Button } from '@edulastic/common';
import { IconSearch, IconPlus } from '@edulastic/icons';
import { blue, greenDarkSecondary, white } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';

const ListHeader = ({ onSearch, onCreate, t, windowWidth, creating, title }) => (
  <Container>
    {windowWidth > 480 && <Heading>{title}</Heading>}
    <TextField
      onChange={e => onSearch(e.target.value)}
      height="50px"
      type="search"
      icon={<IconSearch color={blue} />}
      containerStyle={{ marginRight: 20 }}
    />
    <Button
      disabled={creating}
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

ListHeader.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  creating: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

const enhance = compose(withNamespaces('author'));

export default enhance(ListHeader);

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
