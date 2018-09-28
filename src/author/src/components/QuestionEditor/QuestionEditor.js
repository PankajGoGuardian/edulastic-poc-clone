import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Paper, ItemHeader } from '@edulastic/common';

import SourceModal from './SourceModal';
import OrderList from '../OrderList';
import { changePreviewTabAction } from '../../actions/preview';
import { getPreivewTabSelector } from '../../selectors/preview';
import { changeViewAction } from '../../actions/view';
import { getViewSelector } from '../../selectors/view';
import { Container } from './styled_components';
import { translate } from '../../utils/localization';
import { ButtonBar } from '../common';
import { setQuestionsStateAction } from '../../actions/questionsOrderList';
import { getQuestionsStateSelector } from '../../selectors/questionsOrderList';

class QuestionEditor extends Component {
  state = {
    showModal: false,
  };

  handleChangeView = (view) => {
    const { changeView } = this.props;
    changeView(view);
  };

  handleShowSource = () => {
    this.setState({ showModal: true });
  };

  handleHideSource = () => {
    this.setState({ showModal: false });
  };

  handleApplySource = (json) => {
    const { setQuestionsState } = this.props;
    try {
      const state = JSON.parse(json);
      setQuestionsState(state);
      this.handleHideSource();
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { view, changePreviewTab, previewTab, questionsData } = this.props;
    const { showModal } = this.state;

    return (
      <Container>
        {showModal && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(questionsData, null, 4)}
          </SourceModal>
        )}
        <ItemHeader
          title={translate('component.orderList')}
          link={{ url: '/author', text: translate('component.backToItemDetail') }}
          reference="1234567890"
        >
          <ButtonBar
            onChangeView={this.handleChangeView}
            onShowSource={this.handleShowSource}
            changePreviewTab={changePreviewTab}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        <Paper>
          <OrderList view={view} />
        </Paper>
      </Container>
    );
  }
}

QuestionEditor.propTypes = {
  questionsData: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  changeView: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  previewTab: PropTypes.string.isRequired,
  setQuestionsState: PropTypes.func.isRequired,
};

const enhance = compose(
  connect(
    state => ({
      questionsData: getQuestionsStateSelector(state),
      view: getViewSelector(state),
      previewTab: getPreivewTabSelector(state),
    }),
    {
      changeView: changeViewAction,
      changePreviewTab: changePreviewTabAction,
      setQuestionsState: setQuestionsStateAction,
    },
  ),
);

export default enhance(QuestionEditor);
