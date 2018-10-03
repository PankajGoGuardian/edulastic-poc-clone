import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from '@edulastic/localization';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Preloader } from '@edulastic/common';
import { Container, ButtonBar } from '../common';
import SourceModal from '../QuestionEditor/SourceModal';
import ItemHeader from '../QuestionEditor/ItemHeader';
import { changeViewAction } from '../../actions/view';
import { changePreviewTabAction } from '../../actions/preview';
import { getViewSelector } from '../../selectors/view';
import { getPreivewTabSelector } from '../../../../assessment/src/components/MultipleChoice/selectors/preview';
import Left from './Left';
import Right from './Right';
import SettingsBar from './SettingsBar/SettingsBar';
import { getItemDetailByIdAction } from '../../actions/itemDetail';
import { getItemDetailSelector, getItemDetailLoadingSelector } from '../../selectors/itemDetail';

class ItemDetail extends Component {
  state = {
    showModal: false,
    showSettings: false,
    layout: 'single',
  };

  componentDidMount() {
    const { getItemDetailById, match } = this.props;
    getItemDetailById(match.params.id);
  }

  getSizes = () => {
    const { layout } = this.state;

    switch (layout) {
      case 'single':
        return {
          left: '100%',
          right: '100%',
        };
      case '30-70':
        return {
          left: '30%',
          right: '70%',
        };
      case '70-30':
        return {
          left: '70%',
          right: '30%',
        };
      case '50-50':
        return {
          left: '50%',
          right: '50%',
        };
      case '40-60':
        return {
          left: '40%',
          right: '60%',
        };
      case '60-40':
        return {
          left: '60%',
          right: '40%',
        };
      default:
        return {
          left: '100%',
          right: '100%',
        };
    }
  };

  handleChangeView = () => {};

  handleShowSource = () => {};

  handleShowSettings = () => {
    this.setState({
      showSettings: true,
    });
  };

  handleAdd = () => {};

  handleCancel = () => {
    this.setState({
      showSettings: false,
    });
  };

  handleApply = ({ type }) => {
    this.setState({
      layout: type,
    });
    this.handleCancel();
  };

  render() {
    const questionsData = {};
    const { showModal, showSettings } = this.state;
    const { t, changePreviewTab, previewTab, view, match, item, loading } = this.props;
    const { left, right } = this.getSizes();

    return (
      <Container>
        {showModal && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(questionsData, null, 4)}
          </SourceModal>
        )}
        {showSettings && <SettingsBar onCancel={this.handleCancel} onApply={this.handleApply} />}
        <ItemHeader
          showIcon
          title={t('component.itemDetail.itemDetail')}
          link={{ url: '/author/items', text: t('component.itemDetail.backToItemList') }}
          reference={match.params.id}
          editReference={this.editReference}
          onChange={this.onInputReference}
        >
          <ButtonBar
            onShowSource={this.handleShowSource}
            onShowSettings={this.handleShowSettings}
            onChangeView={this.handleChangeView}
            changePreviewTab={changePreviewTab}
            onSave={() => {}}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        <Content>
          <div style={{ width: left }}>
            {loading && <Preloader />}
            {item && <Left item={item} />}
          </div>
          <div style={{ width: right }}>
            <Right onAdd={this.handleAdd} />
          </div>
        </Content>
      </Container>
    );
  }
}

ItemDetail.propTypes = {
  t: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  getItemDetailById: PropTypes.func.isRequired,
  item: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};

ItemDetail.defaultProps = {
  item: null,
};

const enhance = compose(
  withNamespaces('author'),
  connect(
    state => ({
      view: getViewSelector(state),
      previewTab: getPreivewTabSelector(state),
      item: getItemDetailSelector(state),
      loading: getItemDetailLoadingSelector(state),
    }),
    {
      changeView: changeViewAction,
      changePreviewTab: changePreviewTabAction,
      getItemDetailById: getItemDetailByIdAction,
    },
  ),
);

export default enhance(ItemDetail);

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
