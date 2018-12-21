import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { IconChevronLeft, IconPencilEdit } from '@edulastic/icons';
import { FlexContainer, TextField } from '@edulastic/common';
import {
  greenDark,
  tabletWidth,
  mobileWidth,
  darkBlue,
  white,
  blue,
  darkBlueSecondary
} from '@edulastic/colors';
import HeaderWrapper from '../../mainContent/headerWrapper';

const ItemHeader = ({
  title,
  children,
  link,
  reference,
  editReference,
  onChange,
  hideIcon
}) => (
  <Container>
    <FlexContainer alignItems="center" style={{ flex: 1 }}>
      <LeftSide>
        <TitleNav>
          <Title>{title}</Title>
        </TitleNav>
        {reference !== null && (
          <FlexContainer>
            <span style={{ color: white }}>Reference</span>
            <TextField
              icon={!hideIcon && <IconPencilEdit color={greenDark} />}
              type="text"
              height="40px"
              value={reference}
              onChange={onChange}
              onBlur={editReference}
              style={{ background: '#f3f3f3', marginLeft: 10, width: 290 }}
            />
          </FlexContainer>
        )}
      </LeftSide>
      <RightSide>{children}</RightSide>
    </FlexContainer>
    <LeftSide>
      {link && (
        <Back to={link.url}>
          <IconChevronLeft color={white} width={10} height={10} /> {link.text}
        </Back>
      )}
    </LeftSide>
  </Container>
);

ItemHeader.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  link: PropTypes.any,
  reference: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editReference: PropTypes.func,
  onChange: PropTypes.func,
  hideIcon: PropTypes.bool
};

ItemHeader.defaultProps = {
  children: null,
  title: '',
  link: null,
  reference: null,
  editReference: () => {},
  onChange: () => {},
  hideIcon: false
};

export default ItemHeader;

const Container = styled(HeaderWrapper)`
  background: ${darkBlue};
  padding: 0px 40px;
  height: 62px;
  display: flex;
  align-items: center;
  background: ${darkBlueSecondary};

  @media (max-width: ${mobileWidth}) {
    margin-bottom: 30px;
  }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${tabletWidth}) {
    display: none;
    height: 0;
  }
`;

const RightSide = styled.div`
  text-align: right;
  flex: 1;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.36;
  color: ${white};
`;

const Back = styled(Link)`
  color: ${white};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;

  :hover {
    color: ${blue};
  }
`;

const TitleNav = styled.div`
  width: 200px;
`;
