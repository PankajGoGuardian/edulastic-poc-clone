import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withNamespaces } from '@edulastic/localization';

import { setQuestionDataAction } from '../../../../author/src/actions/question';
import { getQuestionDataSelector } from '../../../../author/src/selectors/question';

import WidgetOptions from '../../../containers/WidgetOptions';
import { Block } from '../../../styled/WidgetOptions/Block';
import { Heading } from '../../../styled/WidgetOptions/Heading';

import Layout from './Layout';

const Options = ({ questionData, onChange, uiStyle, t, outerStyle }) => (
  <WidgetOptions outerStyle={outerStyle}>
    <Block>
      <Heading>{t('component.options.layout')}</Heading>
      <Layout questionData={questionData} onChange={onChange} uiStyle={uiStyle} />
    </Block>
  </WidgetOptions>
);

Options.propTypes = {
  questionData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired,
  outerStyle: PropTypes.object
};

Options.defaultProps = {
  outerStyle: {},
  uiStyle: {
    responsecontainerposition: 'bottom',
    fontsize: 'normal',
    stemnumeration: '',
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  }
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    state => ({
      questionData: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(Options);
