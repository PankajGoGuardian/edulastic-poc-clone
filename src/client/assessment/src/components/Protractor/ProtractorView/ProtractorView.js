import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { EduButton, FlexContainer } from '@edulastic/common';
import styled from 'styled-components';

import Rule from './Rule';
import ProtractorImg from '../assets/protractor.svg';

const ProtractorView = ({ item, smallSize }) => {
  const [show, setShow] = useState(false);

  const renderRule = () => {
    if (item.button && !show) {
      return null;
    }
    return (
      <Rule
        smallSize={smallSize}
        showRotate={item.rotate}
        width={item.width}
        height={item.height}
      />
    );
  };

  return (
    <Wrapper smallSize={smallSize}>
      {item.button && (
        <EduButton onClick={() => setShow(!show)} size="large">
          <FlexContainer>
            <img src={item.image ? item.image : ProtractorImg} alt="" width={16} height={16} />
            <span>{item.label}</span>
          </FlexContainer>
        </EduButton>
      )}
      {renderRule()}
    </Wrapper>
  );
};

ProtractorView.propTypes = {
  item: PropTypes.object.isRequired,
  smallSize: PropTypes.bool
};

ProtractorView.defaultProps = {
  smallSize: false
};

export default memo(ProtractorView);

const Wrapper = styled.div`
  min-height: ${props => (props.smallSize ? 190 : 275)}px;
`;
