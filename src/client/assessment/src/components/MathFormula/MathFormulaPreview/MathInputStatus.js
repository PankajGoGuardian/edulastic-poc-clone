import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconCheck, IconClose } from '@edulastic/icons';
import { green, red } from '@edulastic/colors';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background: transparent;
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  position: absolute;
  top: 20px;
  right: 10px;
  display: flex;
`;

class MathInputStatus extends React.PureComponent {
  render() {
    const { valid } = this.props;
    return (
      <Wrapper>
        <Icon>
          {valid && <IconCheck color={green} width={16} height={16} />}
          {!valid && <IconClose color={red} width={16} height={16} />}
        </Icon>
      </Wrapper>
    );
  }
}

MathInputStatus.propTypes = {
  valid: PropTypes.bool
};

MathInputStatus.defaultProps = {
  valid: false
};

export default MathInputStatus;
