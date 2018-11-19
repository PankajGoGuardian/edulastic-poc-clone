import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexContainer } from '@edulastic/common';
import { mobileWidth, darkBlueSecondary, white } from '@edulastic/colors';
import Breadcrumb from '../Breadcrumb';

const Header = ({ title }) => (
  <React.Fragment>
    <Container>
      <FlexContainer alignItems="flex-start">
        <Title>{title}</Title>
      </FlexContainer>
      <Breadcrumb data={['ITEM LIST', 'ADD NEW', 'SELECT A QUESTION TYPE']} />
    </Container>
  </React.Fragment>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 70px;
  background: ${darkBlueSecondary};
  padding: 0px 40px;
  height: 62px;

  @media (max-width: ${mobileWidth}) {
    margin-bottom: 30px;
  }
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  color: ${white};
`;
