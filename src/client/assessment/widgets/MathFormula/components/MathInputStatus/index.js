import React from 'react';
import PropTypes from 'prop-types';

import { IconCheck, IconClose } from '@edulastic/icons';
import { green, red } from '@edulastic/colors';

import { Wrapper } from './styled/Wrapper';
import { Icon } from './styled/Icon';

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
