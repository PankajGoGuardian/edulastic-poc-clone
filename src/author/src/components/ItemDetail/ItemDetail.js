import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from '@edulastic/localization';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Preloader, Paper } from '@edulastic/common';
import { Container, ButtonBar } from '../common';
import SourceModal from '../QuestionEditor/SourceModal';
import ItemHeader from '../QuestionEditor/ItemHeader';
import { changeViewAction } from '../../actions/view';
import { changePreviewTabAction } from '../../actions/preview';
import { getPreivewTabSelector } from '../../../../assessment/src/components/MultipleChoice/selectors/preview';
import SettingsBar from './SettingsBar/SettingsBar';
import {
  getItemDetailByIdAction,
  updateItemDetailByIdAction,
  setItemDetailDataAction,
  updateItemDetailDimensionAction,
  deleteWidgetAction,
  updateTabTitleAction,
  useTabsAction,
} from '../../actions/itemDetail';
import {
  getItemDetailLoadingSelector,
  getItemDetailRowsSelector,
  getItemDetailSelector,
  getItemDetailUpdatingSelector,
  getItemDetailDimensionTypeSelector,
} from '../../selectors/itemDetail';
import ItemDetailRow from './ItemDetailRow';
import TestItemPreview from '../../../../assessment/src/components/TestItemPreview/TestItemPreview';

class ItemDetail extends Component {
  state = {
    showModal: false,
    showSettings: false,
    view: 'edit',
  };

  componentDidMount() {
    const { getItemDetailById, match } = this.props;
    getItemDetailById(match.params.id, { data: true });
  }

  getSizes = (type) => {
    switch (type) {
      case '100-100':
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

  handleChangeView = (view) => {
    this.setState({
      view,
    });
  };

  handleShowSource = () => {
    this.setState({ showModal: true });
  };

  handleShowSettings = () => {
    this.setState({
      showSettings: true,
    });
  };

  handleAdd = () => {
    const { match, history, t } = this.props;
    history.push({
      pathname: `/author/items/${match.params.id}/pickup-questiontype`,
      state: {
        backText: t('component.itemDetail.backText'),
        backUrl: match.path,
      },
    });
  };

  handleCancelSettings = () => {
    this.setState({
      showSettings: false,
    });
  };

  handleApplySettings = ({ type }) => {
    const { updateDimension } = this.props;
    const { left, right } = this.getSizes(type);

    updateDimension(left, right);
  };

  handleApplySource = (data) => {
    const { setItemDetailData } = this.props;

    try {
      setItemDetailData(JSON.parse(data));
      this.handleHideSource();
    } catch (err) {
      console.error(err);
    }
  };

  handleHideSource = () => {
    this.setState({
      showModal: false,
    });
  };

  handleSave = () => {
    const { updateItemDetailById, match, item } = this.props;

    updateItemDetailById(match.params.id, item);
  };

  handleEditWidget = (widget) => {
    const { match, history, t } = this.props;

    history.push({
      pathname: `/author/items/${widget.reference}`,
      state: {
        backText: t('component.itemDetail.backText'),
        backUrl: match.path,
      },
    });
  };

  render() {
    const { showModal, showSettings } = this.state;
    const {
      t,
      changePreviewTab,
      previewTab,
      match,
      rows,
      loading,
      item,
      updating,
      type,
      deleteWidget,
      updateTabTitle,
      useTabs,
    } = this.props;

    const { view } = this.state;

    return (
      <Container>
        {showModal &&
          item && (
            <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
              {JSON.stringify(item, null, 4)}
            </SourceModal>
        )}
        {showSettings && (
          <SettingsBar
            type={type}
            onCancel={this.handleCancelSettings}
            onApply={this.handleApplySettings}
            useTabs={useTabs}
            useTabsLeft={!!rows[0].tabs.length}
            useTabsRight={!!(!!rows[1] && !!rows[1].tabs.length)}
          />
        )}
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
            onSave={this.handleSave}
            saving={updating}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        {view === 'edit' && (
          <Content>
            {loading && <Preloader />}
            {rows &&
              !!rows.length &&
              rows.map((row, i) => (
                <ItemDetailRow
                  key={i}
                  row={row}
                  onAdd={this.handleAdd}
                  onDeleteWidget={widgetIndex => deleteWidget(i, widgetIndex)}
                  onEditWidget={this.handleEditWidget}
                  onEditTabTitle={(tabIndex, value) =>
                    updateTabTitle({ rowIndex: i, tabIndex, value })
                  }
                />
              ))}
          </Content>
        )}
        {view === 'preview' && <TestItemPreview cols={rows} />}
      </Container>
    );
  }
}

ItemDetail.propTypes = {
  t: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  previewTab: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  getItemDetailById: PropTypes.func.isRequired,
  rows: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object,
  updateItemDetailById: PropTypes.func.isRequired,
  setItemDetailData: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  updateDimension: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  deleteWidget: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  updateTabTitle: PropTypes.func.isRequired,
  useTabs: PropTypes.func.isRequired,
};

ItemDetail.defaultProps = {
  rows: [],
  item: null,
};

const enhance = compose(
  withNamespaces('author'),
  connect(
    state => ({
      previewTab: getPreivewTabSelector(state),
      rows: getItemDetailRowsSelector(state),
      loading: getItemDetailLoadingSelector(state),
      item: getItemDetailSelector(state),
      updating: getItemDetailUpdatingSelector(state),
      type: getItemDetailDimensionTypeSelector(state),
    }),
    {
      changeView: changeViewAction,
      changePreviewTab: changePreviewTabAction,
      getItemDetailById: getItemDetailByIdAction,
      updateItemDetailById: updateItemDetailByIdAction,
      setItemDetailData: setItemDetailDataAction,
      updateDimension: updateItemDetailDimensionAction,
      deleteWidget: deleteWidgetAction,
      updateTabTitle: updateTabTitleAction,
      useTabs: useTabsAction,
    },
  ),
);

export default enhance(ItemDetail);

const Content = styled(Paper)`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
`;
