import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import SourceModal from './SourceModal';
import ButtonBar from './ButtonBar';
import OrderList from '../OrderList';
import { getQuestionsStateSelector } from '../../selectors/questionsOrderList';
import { setQuestionsStateAction } from '../../actions/questionsOrderList';
import { changePreviewTabAction } from '../../actions/preview';
import { getPreivewTabSelector } from '../../selectors/preview';
import { changeViewAction } from '../../actions/view';
import { getViewSelector } from '../../selectors/view';
import { Container } from './styled_components';
import { Paper } from '../../../../assessment/src/components/common';
import ItemHeader from '../../../../assessment/src/components/common/ItemHeader';
import { translate } from '../../../../assessment/src/utils/localization';

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
    const { questionsData, view, changePreviewTab, previewTab } = this.props;
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
        >
          <ButtonBar
            onShowSource={this.handleShowSource}
            onChangeView={this.handleChangeView}
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
  setQuestionsState: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  previewTab: PropTypes.string.isRequired,
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
      setQuestionsState: setQuestionsStateAction,
      changePreviewTab: changePreviewTabAction,
    },
  ),
);

export default enhance(QuestionEditor);
