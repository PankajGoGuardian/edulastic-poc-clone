import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { PaddingDiv } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

import { changePreviewTabAction } from '../../actions/preview';
import { getPreivewTabSelector } from '../../selectors/preview';
import { changeViewAction } from '../../actions/view';
import { getViewSelector } from '../../selectors/view';
import { updateItemByIdAction } from '../../actions/items';
import { ButtonBar, Container } from '../common';
import AddNew from './AddNew';
import { getItemSelector } from '../../selectors/items';
import SourceModal from '../QuestionEditor/SourceModal';
import ItemHeader from '../QuestionEditor/ItemHeader';

class ItemAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reference: '',
      showModal: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('props changed', nextProps);
    if (nextProps.item !== null) {
      this.setState({ reference: nextProps.item._id });
    }
  }

  handleChangeView = (view) => {
    const { changeView } = this.props;
    changeView(view);
  };

  handleChangeView = (view) => {
    const { changeView } = this.props;
    changeView(view);
  };

  handleShowSource = () => {
    const { showModal } = this.state;
    console.log(showModal);
    this.setState({ showModal: true });
  };

  editReference = (e) => {
    const { item, updateItemById } = this.props;
    if (item._id !== e.target.value) {
      updateItemById({ id: item._id, reference: e.target.value });
    }
  };

  onInputReference = (e) => {
    this.setState({ reference: e.target.value });
  };

  moveNew = () => {
    const { history, item } = this.props;
    history.push(`/author/items/${item._id}/pickup-questiontype`);
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
    const { view, changePreviewTab, previewTab, questionsData, t } = this.props;
    const { showModal, reference } = this.state;

    return (
      <Container>
        {showModal && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(questionsData, null, 4)}
          </SourceModal>
        )}
        <ItemHeader
          showIcon
          title={t('component.itemAdd.itemlist')}
          link={{ url: '/author/items', text: t('component.itemAdd.backToItemList') }}
          reference={reference}
          editReference={this.editReference}
          onChange={this.onInputReference}
        >
          <ButtonBar
            onShowSource={this.handleShowSource}
            onChangeView={this.handleChangeView}
            changePreviewTab={changePreviewTab}
            onSave={() => {}}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        <PaddingDiv top={160}>
          <AddNew moveNew={this.moveNew} />
        </PaddingDiv>
      </Container>
    );
  }
}

ItemAdd.propTypes = {
  questionsData: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  item: PropTypes.object,
  changeView: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  updateItemById: PropTypes.func.isRequired,
  previewTab: PropTypes.string.isRequired,
  setQuestionsState: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

ItemAdd.defaultProps = {
  item: {},
};

const enhance = compose(
  withNamespaces('author'),
  connect(
    state => ({
      view: getViewSelector(state),
      item: getItemSelector(state),
      previewTab: getPreivewTabSelector(state),
    }),
    {
      changeView: changeViewAction,
      changePreviewTab: changePreviewTabAction,
      updateItemById: updateItemByIdAction,
    },
  ),
);

export default enhance(ItemAdd);
