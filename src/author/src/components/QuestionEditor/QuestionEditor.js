import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from '@edulastic/localization';
import { Paper } from '@edulastic/common';

import SourceModal from './SourceModal';
import { changePreviewTabAction } from '../../actions/preview';
import { getPreivewTabSelector } from '../../selectors/preview';
import { getItemSelector } from '../../selectors/items';
import { changeViewAction } from '../../actions/view';
import { getViewSelector } from '../../selectors/view';
import { receiveItemByIdAction } from '../../actions/items';
import { Container } from './styled_components';
import { ButtonBar } from '../common';
import { setQuestionsStateAction } from '../../actions/questionsOrderList';
import { getQuestionsStateSelector } from '../../selectors/questionsOrderList';
import QuestionWrapper from '../../../../assessment/src/components/QuestionWrapper';
import ItemHeader from './ItemHeader';

const headerTitles = {
  mcq: 'MultipleChoice',
  orderList: 'Order List',
};

class QuestionEditor extends Component {
  state = {
    showModal: false,
    saveClicked: false,
  };

  componentWillMount() {
    const { match, receiveItemById } = this.props;
    if (match.params !== undefined) {
      receiveItemById(match.params.id);
    }
  }

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

  onSaveClicked = () => {
    this.setState({ saveClicked: true });
  };

  getQuestionType = () => {
    const { item } = this.props;
    if (item !== {} && item !== null) {
      const questionType = item.type;
      return questionType;
    }
  }

  render() {
    const {
      view,
      changePreviewTab,
      previewTab,
      questionsData,
      item,
      history,
    } = this.props;
    const itemId = item === null ? '' : item.id;
    const questionType = this.getQuestionType();
    const { showModal, saveClicked } = this.state;
    return (
      <Container>
        {showModal && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(questionsData, null, 4)}
          </SourceModal>
        )}
        <ItemHeader
          title={headerTitles[questionType]}
          link={{ url: history.location.state.backUrl, text: history.location.state.backText }}
          reference={itemId}
        >
          <ButtonBar
            onChangeView={this.handleChangeView}
            onShowSource={this.handleShowSource}
            changePreviewTab={changePreviewTab}
            onSave={this.onSaveClicked}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        <Paper>
          <QuestionWrapper
            type={questionType}
            view={view}
            key={questionType && view && saveClicked}
            data={item}
            saveClicked={saveClicked}
          />
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
  item: PropTypes.object,
  match: PropTypes.object,
  receiveItemById: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

QuestionEditor.defaultProps = {
  item: {},
  match: {},
};

const enhance = compose(
  withRouter,
  withNamespaces('author'),
  connect(
    state => ({
      questionsData: getQuestionsStateSelector(state),
      view: getViewSelector(state),
      previewTab: getPreivewTabSelector(state),
      item: getItemSelector(state),
    }),
    {
      changeView: changeViewAction,
      changePreviewTab: changePreviewTabAction,
      setQuestionsState: setQuestionsStateAction,
      receiveItemById: receiveItemByIdAction,
    },
  ),
);

export default enhance(QuestionEditor);
