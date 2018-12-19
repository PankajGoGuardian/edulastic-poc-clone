import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Affix } from 'antd';
import { Button } from '@edulastic/common';
import { IconPlus } from '@edulastic/icons';
import {
  mobileWidth,
  greenDarkSecondary,
  darkBlueSecondary,
  white
} from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';

const ListHeader = ({ onCreate, t, windowWidth, title }) => (
  <Affix>
    <Container>
      <Heading>{title}</Heading>
      <Button
        // disabled={creating}
        style={{
          height: windowWidth > 768 ? 50 : 40,
          minWidth: 151.9,
          color: '#fff',
          margin: 0
        }}
        onClick={onCreate}
        color="success"
        icon={(
          <IconPlus
            color={greenDarkSecondary}
            style={{ position: 'relative' }}
            left={-25}
            width={14}
            height={14}
            hoverColor={white}
          />
)}
      >
        {t('component.itemlist.header.create')}
      </Button>
    </Container>
  </Affix>
);

ListHeader.propTypes = {
  onCreate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};

const enhance = compose(withNamespaces('author'));

export default enhance(ListHeader);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color:  ${darkBlueSecondary};
  padding: 0px 40px 0px 46px;
  height: 89px;
  z-index: 1;

  @media (max-width: ${mobileWidth}) {
    height: 61px;
    padding 0px 26px 0px 26px;
  }
`;

const Heading = styled.h1`
  width: 97px;
  color: ${white};
  font-size: 22px;
  font-weight: bold;
`;
