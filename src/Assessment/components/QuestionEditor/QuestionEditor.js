import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';

import SourceModal from './SourceModal';
import ButtonBar from './ButtonBar';
import Paper from '../UI/Paper';
import OrderList from '../OrderList';
import { grey } from '../../utilities/css';
import { getQuestionsStateSelector, setQuestionsStateAction } from '../../../ducks/questionsOrderList';
import { getPreivewTabSelector, changePreviewTabAction } from '../../../ducks/preview';
import { getViewSelector, changeViewAction } from '../../../ducks/view';

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
    const {
      questionsData, view, changePreviewTab, previewTab,
    } = this.props;
    const { showModal } = this.state;

    return (
      <Container>
        {showModal && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(questionsData, null, 4)}
          </SourceModal>
        )}

        <ButtonBar
          onShowSource={this.handleShowSource}
          onChangeView={this.handleChangeView}
          changePreviewTab={changePreviewTab}
          view={view}
          previewTab={previewTab}
        />
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

const Container = styled.div`
  padding: 25px 40px;
  background: ${grey};
`;
