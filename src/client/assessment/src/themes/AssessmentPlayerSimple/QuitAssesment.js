import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';

const QuitAssesment = ({ t }) => <Quit>{t('pagination.quit')}</Quit>;

QuitAssesment.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces('common')(QuitAssesment);

const Quit = styled.span`
  margin: 0px 42px !important;
  font-weight: bold;
  font-size: 14px;
  color: #ee1658;
  text-transform: uppercase;
`;
