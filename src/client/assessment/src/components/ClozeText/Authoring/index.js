import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PaddingDiv, CustomQuillComponent } from '@edulastic/common';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from '@edulastic/localization';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import 'react-quill/dist/quill.snow.css';

import Subtitle from '../common/Sutitle';
import { setQuestionDataAction } from '../../../../../author/src/actions/question';

const defaultTemplateMarkup = '<p>"It\'s all clear" he</p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p>Have you the </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p> and the bags? <br /> Great Scott!!! Jump, archie, jump, and I\'ll swing for it</p>';

class ClozeTextAuthoring extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
  };

  getNewItem() {
    const { item } = this.props;
    return cloneDeep(item);
  }

  onChangeQuesiton = (html) => {
    const stimulus = html;
    const { item, setQuestionData } = this.props;
    setQuestionData({ ...item, stimulus });
  };

  onChangeMarkUp = (html) => {
    const templateMarkUp = html;
    const { item, setQuestionData } = this.props;
    setQuestionData({ ...item, templateMarkUp });
  }

  render() {
    const { t, item } = this.props;
    return (
      <div>
        <PaddingDiv bottom={20}>
          <Subtitle>{t('component.clozeText.composequestion')}</Subtitle>
          <CustomQuillComponent
            toolbarId="stimulus"
            wrappedRef={(instance) => { this.stimulus = instance; }}
            placeholder={t('component.clozeText.thisisstem')}
            onChange={this.onChangeQuesiton}
            showResponseBtn={false}
            value={item.stimulus}
          />
          <Subtitle>{t('component.clozeText.templatemarkup')}</Subtitle>
          <CustomQuillComponent
            toolbarId="templatemarkup"
            wrappedRef={(instance) => { this.templatemarkup = instance; }}
            placeholder={t('component.clozeText.templatemarkupplaceholder')}
            onChange={this.onChangeMarkUp}
            showResponseBtn
            value={item.templateMarkUp || defaultTemplateMarkup}
          />
        </PaddingDiv>
      </div>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  connect(
    null,
    { setQuestionData: setQuestionDataAction },
  ),
);

export default enhance(ClozeTextAuthoring);
