import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import FlexContainer from './FlexContainer';
import { secondaryTextColor, greenDark, green } from '../../utils/css';
import { IconChevronLeft } from './icons';
import TextField from './index';

const ItemHeader = ({ title, children, link, reference }) => (
  <FlexContainer alignItems="flex-start" style={{ marginBottom: 20 }}>
    <LeftSide>
      <TitleNav>
        <Title>{title}</Title>
        {link && (
          <Back to={link.url}>
            <IconChevronLeft color={greenDark} width={10} height={10} /> {link.text}
          </Back>
        )}
      </TitleNav>
      {reference && (
        <FlexContainer>
          <span style={{ color: greenDark }}>Reference</span>
          <TextField
            type="text"
            height="40px"
            value={reference}
            onChange={() => {}}
            style={{ background: '#f3f3f3', border: '1px solid #dfdfdf' }}
          />
        </FlexContainer>
      )}
    </LeftSide>
    <RightSide>{children}</RightSide>
  </FlexContainer>
);

ItemHeader.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any,
  link: PropTypes.any,
  reference: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ItemHeader.defaultProps = {
  children: null,
  link: null,
  reference: null,
};

export default ItemHeader;

const LeftSide = styled.div`
  min-width: 30%;
  display: flex;
  align-items: flex-start;
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

const TitleNav = styled.div`
  margin-right: 40px;
`;
