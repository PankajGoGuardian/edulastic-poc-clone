import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import { IconChevronLeft } from '@edulastic/icons';
import { secondaryTextColor, greenDark, green } from '@edulastic/colors';

import { Title, Back } from '../common';

const Header = ({ title, link }) => (
  <React.Fragment>
    <FlexContainer alignItems="flex-start" style={{ marginBottom: 10 }}>
      <Title textcolor={secondaryTextColor} hovercolor={green}>{title}</Title>
    </FlexContainer>
    <FlexContainer>
      {link && (
        <Back to={link.url} textcolor={greenDark} hovercolor={green}>
          <IconChevronLeft color={greenDark} width={10} height={10} /> {link.text}
        </Back>
      )}
    </FlexContainer>
  </React.Fragment>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.object.isRequired,
};

export default Header;
