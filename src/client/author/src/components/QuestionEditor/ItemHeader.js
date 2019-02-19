import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { IconChevronLeft, IconPencilEdit } from '@edulastic/icons';
import { FlexContainer, TextField } from '@edulastic/common';
import {
  greenDark,
  mobileWidth,
  darkBlue,
  white,
  blue,
  darkBlueSecondary
} from '@edulastic/colors';
import HeaderWrapper from '../../mainContent/headerWrapper';
import { toggleSideBarAction } from '../../actions/togglemenu';

const ItemHeader = ({
  title,
  children,
  link,
  reference,
  editReference,
  onChange,
  hideIcon,
  toggleSideBar
}) => (
  <Container>
    <ExtraFlex alignItems="center" style={{ flex: 1 }}>
      <LeftSide>
        <ToggleButton onClick={toggleSideBar}>
          <i className="fa fa-bars" />
        </ToggleButton>
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
    </ExtraFlex>
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
  hideIcon: PropTypes.bool,
  toggleSideBar: PropTypes.func.isRequired
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

export default connect(
  null,
  { toggleSideBar: toggleSideBarAction }
)(ItemHeader);

const Container = styled(HeaderWrapper)`
  background: ${darkBlue};
  padding: 0px 40px;
  height: 62px;
  display: flex;
  align-items: center;
  background: ${darkBlueSecondary};

  @media (max-width: ${mobileWidth}) {
    margin-bottom: 20px;
    margin-top: 20px;
    height: 100px;
  }
`;

const ExtraFlex = styled(FlexContainer)`
  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
    margin-top: 20px;
  }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: ${mobileWidth}) {
    padding-bottom: 15px;
    padding-top: 8px;
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
  @media (max-width: ${mobileWidth}) {
    font-size: 18px;
  }
`;

const ToggleButton = styled.div`
  color: #fff;
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
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
  display: flex;
  width: 200px;
`;
