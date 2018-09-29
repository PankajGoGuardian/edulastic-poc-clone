import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import FlexContainer from './FlexContainer';
import { secondaryTextColor, greenDark, green } from '../../utils/css';
import { IconChevronLeft } from './icons';
import TextField from './TextField';
import PaddingDiv from './PaddingDiv';
import { IconPensilEdit } from '../../../../assessment/src/components/common/icons';

const ItemHeader = ({ title, children, link, reference, editReference, onChange, hideIcon }) => (
  <React.Fragment>
    <FlexContainer alignItems="flex-start" style={{ marginBottom: 10 }}>
      <LeftSide>
        <TitleNav>
          <Title>{title}</Title>
        </TitleNav>
        {reference !== null && (
          <FlexContainer>
            <span style={{ color: greenDark }}>Reference</span>
            <TextField
              icon={!hideIcon && <IconPensilEdit color={greenDark} />}
              type="text"
              height="40px"
              value={reference}
              onChange={onChange}
              onBlur={editReference}
              style={{ background: '#f3f3f3', border: '1px solid #dfdfdf', marginLeft: 10 }}
            />
          </FlexContainer>
        )}
      </LeftSide>
      <RightSide>{children}</RightSide>
    </FlexContainer>
    <LeftSide>
      {link && (
        <Back to={link.url}>
          <IconChevronLeft color={greenDark} width={10} height={10} /> {link.text}
        </Back>
      )}
    </LeftSide>
    <PaddingDiv height={40} />
  </React.Fragment>
);

ItemHeader.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  link: PropTypes.any,
  reference: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editReference: PropTypes.func,
  onChange: PropTypes.func,
  hideIcon: PropTypes.bool,
};

ItemHeader.defaultProps = {
  children: null,
  title: '',
  link: null,
  reference: null,
  editReference: () => {},
  onChange: () => {},
  hideIcon: false,
};

export default ItemHeader;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
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
  color: ${secondaryTextColor};
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
  width: 200px;
`;
