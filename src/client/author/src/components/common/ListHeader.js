import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Affix } from 'antd';
import { Button } from '@edulastic/common';
import { IconPlus } from '@edulastic/icons';
import {
  greenDarkSecondary,
  darkBlueSecondary,
  white
} from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';

const ListHeader = ({ onCreate, t, title }) => (
  <HeaderWrapper>
    <Affix className="fixed-header" style={{ position: 'fixed', top: 0, right: 0 }}>
      <Container>
        <Heading>{title}</Heading>
        <CreateButton
          onClick={onCreate}
          color="success"
          icon={
            <IconPlus color={greenDarkSecondary} style={{ position: 'relative' }} left={-25} width={14} height={14} hoverColor={white} />
          }
        >
          {t('component.itemlist.header.create')}
        </CreateButton>
      </Container>
    </Affix>
  </HeaderWrapper>
);

ListHeader.propTypes = {
  onCreate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

const enhance = compose(withNamespaces('author'));

export default enhance(ListHeader);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color:  ${darkBlueSecondary};
  padding: 0px 15px;
  height: 62px;
  z-index: 1;
`;

const CreateButton = styled(Button)`
  height: 40px;
  color: #fff;
  margin: 0;
`;

const HeaderWrapper = styled.div`
  padding-top: 62px;
  margin-bottom: 10px;
`;

const Heading = styled.h1`
  width: 97px;
  color: ${white};
  font-size: 22px;
  font-weight: bold;
`;
