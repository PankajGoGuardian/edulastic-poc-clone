import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from '@edulastic/localization';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { mobileWidth } from '@edulastic/colors';
import { Progress, Paper, withWindowSizes } from '@edulastic/common';
import { cloneDeep } from 'lodash';
import { Layout } from 'antd';
import { changeViewAction, changePreviewAction } from '../../actions/view';
import { checkAnswerAction, showAnswerAction } from '../../actions/testItem';
import {
  getItemDetailByIdAction,
  updateItemDetailByIdAction,
  setItemDetailDataAction,
  updateItemDetailDimensionAction,
  deleteWidgetAction,
  updateTabTitleAction,
  useTabsAction
} from '../../actions/itemDetail';
import {
  getItemDetailLoadingSelector,
  getItemDetailRowsSelector,
  getItemDetailSelector,
  getItemDetailUpdatingSelector,
  getItemDetailDimensionTypeSelector
} from '../../selectors/itemDetail';
import ItemDetailRow from './ItemDetailRow';
import { ButtonBar, SecondHeadBar } from '../common';
import SourceModal from '../QuestionEditor/SourceModal';
import ItemHeader from './ItemHeader';
import SettingsBar from './SettingsBar/SettingsBar';
import TestItemPreview from '../../../../assessment/src/components/TestItemPreview/TestItemPreview';
import TestItemMetadata from '../../../../assessment/src/components/TestItemMetadata';

class ItemDetail extends Component {
  state = {
    showModal: false,
    showSettings: false,
    view: 'edit',
    previewTab: 'clear'
  };

  componentDidMount() {
    const { getItemDetailById, match } = this.props;
    getItemDetailById(match.params.id, { data: true, validation: true });
  }

  getSizes = (type) => {
    switch (type) {
      case '100-100':
        return {
          left: '100%',
          right: '100%'
        };
      case '30-70':
        return {
          left: '30%',
          right: '70%'
        };
      case '70-30':
        return {
          left: '70%',
          right: '30%'
        };
      case '50-50':
        return {
          left: '50%',
          right: '50%'
        };
      case '40-60':
        return {
          left: '40%',
          right: '60%'
        };
      case '60-40':
        return {
          left: '60%',
          right: '40%'
        };
      default:
        return {
          left: '100%',
          right: '100%'
        };
    }
  };

  handleChangeView = (view) => {
    this.setState({
      view
    });
  };

  handleShowSource = () => {
    this.setState({ showModal: true });
  };

  handleShowSettings = () => {
    this.setState({
      showSettings: true
    });
  };

  handleAdd = ({ rowIndex, tabIndex }) => {
    const { match, history, t } = this.props;
    history.push({
      pathname: `/author/items/${match.params.id}/pickup-questiontype`,
      state: {
        backText: t('component.itemDetail.backText'),
        backUrl: match.url,
        rowIndex,
        tabIndex,
        testItemId: match.params._id
      }
    });
  };

  handleCancelSettings = () => {
    this.setState({
      showSettings: false
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
      showModal: false
    });
  };

  handleSave = () => {
    const { updateItemDetailById, match, item } = this.props;
    updateItemDetailById(match.params.id, item);
  };

  handleEditWidget = (widget) => {
    const { match, history, t } = this.props;

    history.push({
      pathname: `/author/questions/${widget.reference}`,
      state: {
        backText: t('component.itemDetail.backText'),
        backUrl: match.url
      }
    });
  };

  handleDeleteWidget = i => (widgetIndex) => {
    const { deleteWidget } = this.props;
    deleteWidget(i, widgetIndex);
  };

  handleVerticalDividerChange = () => {
    const { item, setItemDetailData } = this.props;
    const newItem = cloneDeep(item);

    newItem.verticalDivider = !newItem.verticalDivider;
    setItemDetailData(newItem);
  };

  handleScrollingChange = () => {
    const { item, setItemDetailData } = this.props;
    const newItem = cloneDeep(item);

    newItem.scrolling = !newItem.scrolling;
    setItemDetailData(newItem);
  };

  handleChangePreviewTab = (previewTab) => {
    const { checkAnswer, showAnswer, changePreview } = this.props;

    if (previewTab === 'check') {
      checkAnswer();
    }
    if (previewTab === 'show') {
      showAnswer();
    }

    changePreview(previewTab);

    this.setState({
      previewTab
    });
  };

  renderPreview = () => {
    const { rows, item, evaluation, preview } = this.props;

    switch (preview) {
      case 'clear':
        return (
          <Content>
            <TestItemPreview
              cols={rows}
              previewTab="clear"
              verticalDivider={item.verticalDivider}
              scrolling={item.scrolling}
              style={{ width: '100%' }}
            />
          </Content>
        );
      case 'check':
        return (
          <Content>
            <TestItemPreview
              cols={rows}
              previewTab="check"
              verticalDivider={item.verticalDivider}
              scrolling={item.scrolling}
              evaluation={evaluation}
              style={{ width: '100%' }}
            />
          </Content>
        );
      case 'show':
        return (
          <Content>
            <TestItemPreview
              cols={rows}
              previewTab="show"
              verticalDivider={item.verticalDivider}
              scrolling={item.scrolling}
              style={{ width: '100%' }}
            />
          </Content>
        );
      default:
        return null;
    }
  };

  renderMetadata = () => (
    <Content>
      <TestItemMetadata />
    </Content>
  );

  render() {
    const { showModal, showSettings } = this.state;
    const {
      t,
      match,
      rows,
      loading,
      item,
      updating,
      type,
      updateTabTitle,
      useTabs,
      changePreview,
      windowWidth
    } = this.props;

    const { view, previewTab } = this.state;

    return (
      <Layout>
        {showModal && item && (
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
            onVerticalDividerChange={this.handleVerticalDividerChange}
            onScrollingChange={this.handleScrollingChange}
            verticalDivider={item.verticalDivider}
            scrolling={item.scrolling}
          />
        )}
        <ItemHeader
          showIcon
          title={t('component.itemDetail.itemDetail')}
          reference={match.params._id}
          windowWidth={windowWidth}
        >
          <ButtonBar
            onShowSource={this.handleShowSource}
            onShowSettings={this.handleShowSettings}
            onChangeView={this.handleChangeView}
            changePreview={changePreview}
            changePreviewTab={this.handleChangePreviewTab}
            onSave={this.handleSave}
            saving={updating}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        {
          windowWidth > 468 && (
            <SecondHeadBar
              onShowSource={this.handleShowSource}
              onShowSettings={this.handleShowSettings}
              onChangeView={this.handleChangeView}
              changePreview={changePreview}
              changePreviewTab={this.handleChangePreviewTab}
              onSave={this.handleSave}
              saving={updating}
              view={view}
              previewTab={previewTab}
            />)
        }
        {view === 'edit' && (
          <ItemDetailWrapper>
            {loading && <Progress />}
            {rows &&
              !!rows.length &&
              rows.map((row, i) => (
                <ItemDetailRow
                  key={i}
                  row={row}
                  rowIndex={i}
                  count={rows.length}
                  onAdd={this.handleAdd}
                  windowWidth={windowWidth}
                  onDeleteWidget={this.handleDeleteWidget(i)}
                  onEditWidget={this.handleEditWidget}
                  onEditTabTitle={(tabIndex, value) =>
                    updateTabTitle({ rowIndex: i, tabIndex, value })
                  }
                />
              ))}
          </ItemDetailWrapper>
        )}
        {view === 'preview' && this.renderPreview()}
        {view === 'metadata' && this.renderMetadata()}
      </Layout>
    );
  }
}

ItemDetail.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  getItemDetailById: PropTypes.func.isRequired,
  rows: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object,
  preview: PropTypes.string.isRequired,
  updateItemDetailById: PropTypes.func.isRequired,
  setItemDetailData: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  updateDimension: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  deleteWidget: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  updateTabTitle: PropTypes.func.isRequired,
  useTabs: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  showAnswer: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  changePreview: PropTypes.func.isRequired,
  evaluation: PropTypes.isRequired
};

ItemDetail.defaultProps = {
  rows: [],
  item: null
};

const enhance = compose(
  withWindowSizes,
  withNamespaces('author'),
  connect(
    state => ({
      rows: getItemDetailRowsSelector(state),
      loading: getItemDetailLoadingSelector(state),
      item: getItemDetailSelector(state),
      updating: getItemDetailUpdatingSelector(state),
      type: getItemDetailDimensionTypeSelector(state),
      evaluation: state.evluation,
      preview: state.view.preview
    }),
    {
      changeView: changeViewAction,
      changePreview: changePreviewAction,
      showAnswer: showAnswerAction,
      checkAnswer: checkAnswerAction,
      getItemDetailById: getItemDetailByIdAction,
      updateItemDetailById: updateItemDetailByIdAction,
      setItemDetailData: setItemDetailDataAction,
      updateDimension: updateItemDetailDimensionAction,
      deleteWidget: deleteWidgetAction,
      updateTabTitle: updateTabTitleAction,
      useTabs: useTabsAction
    }
  )
);

export default enhance(ItemDetail);

const Content = styled(Paper)`
  display: flex;
  margin: 0px 40px 50px 40px;
  flex-wrap: nowrap;
  padding: 0;
  position: relative;

  @media (max-width: ${mobileWidth}) {
    margin: 50px 25px;
  }
`;

const ItemDetailWrapper = styled.div`
  display: flex;
  padding: 0px 40px;
  flex-wrap: nowrap;
  width: 100%;

  @media (max-width: ${mobileWidth}) {
    margin-top: 50px;
    padding: 0px 25px;
  }
`;
