import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd';
import { white } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { IconCheck, IconLightBulb, IconBookmark } from '@edulastic/icons';
import ButtonLink from './ButtonLink';

const TestButton = ({ t, checkAnwser }) => (
  <Container>
    <StyledButton onClick={checkAnwser}>
      <ButtonLink
        color="primary"
        icon={<IconCheck color={white} />}
        style={{ color: white }}
      >
        {t('common.test.checkanswer')}
      </ButtonLink>
    </StyledButton>
    <StyledButton>
      <ButtonLink
        color="primary"
        icon={<IconLightBulb color={white} />}
        style={{ color: white }}
      >
        {t('common.test.hint')}
      </ButtonLink>
    </StyledButton>
    <StyledButton>
      <ButtonLink
        color="primary"
        icon={<IconBookmark style={{ width: '10px !important' }} color={white} />}
        style={{ color: white }}
      >
        {t('common.test.bookmark')}
      </ButtonLink>
    </StyledButton>
  </Container>
);

TestButton.propTypes = {
  t: PropTypes.func.isRequired,
  checkAnwser: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces('student')
);

export default enhance(TestButton);

const Container = styled.div`
  margin-left: 60px;
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
  background: transparent;
  height: 24px;

  &:hover {
    background: transparent;
  }
`;
