import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import FlexContainer from './FlexContainer';
import { secondaryTextColor, greenDark, green } from '../../utils/css';
import { IconChevronLeft } from './icons';

const ItemHeader = ({ title, children, link }) => (
  <FlexContainer alignItems="flex-start" style={{ marginBottom: 20 }}>
    <LeftSide>
      <Title>{title}</Title>
      {link && (
        <Back to={link.url}>
          <IconChevronLeft color={greenDark} width={10} height={10} /> {link.text}
        </Back>
      )}
    </LeftSide>
    <RightSide>{children}</RightSide>
  </FlexContainer>
);

ItemHeader.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any,
  link: PropTypes.any,
};

ItemHeader.defaultProps = {
  children: null,
  link: null,
};

export default ItemHeader;

const LeftSide = styled.div`
  min-width: 30%;
`;

const RightSide = styled.div`
  min-width: 70%;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.36;
  color: ${secondaryTextColor};
  margin-bottom: 15px;
`;

const Back = styled(Link)`
  color: ${greenDark};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;

  :hover {
    color: ${green};
  }
`;
