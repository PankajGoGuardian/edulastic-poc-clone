import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import { Divider } from 'antd';

import { setQuestionDataAction } from '../../../../../author/src/actions/question';
import { getQuestionDataSelector } from '../../../../../author/src/selectors/question';
import O, { Block, Heading } from '../../common/Options';
import Layout from './Layout';
import AdditionalOptions from './AdditionalOptions';

const Options = ({ questionData, onChange, uiStyle, t, outerStyle }) => (
  <O outerStyle={outerStyle}>
    <Block>
      <Heading>{t('component.options.layout')}</Heading>
      <Layout
        questionData={questionData}
        onChange={onChange}
        uiStyle={uiStyle}
      />
      <Divider />
      <AdditionalOptions
        questionData={questionData}
        onChange={onChange}
        uiStyle={uiStyle}
      />
    </Block>
  </O>);

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
