import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { changePreviewTabAction } from '../../actions/preview';
import { getPreivewTabSelector } from '../../selectors/preview';
import { changeViewAction } from '../../actions/view';
import { getViewSelector } from '../../selectors/view';
import { updateItemByIdAction } from '../../actions/items';
import { translate } from '../../utils/localization';
import { ButtonBar, ItemHeader, Container, PaddingDiv } from '../common';
import AddNew from './AddNew';
import { getItemSelector } from '../../selectors/items';

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
      this.setState({ reference: nextProps.item.id });
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
    if (item.id !== e.target.value) {
      updateItemById({ id: item._id, reference: e.target.value });
    }
  }

  onInputReference = (e) => {
    this.setState({ reference: e.target.value });
  }

  render() {
    const { view, changePreviewTab, previewTab } = this.props;
    const { reference } = this.state;
    return (
      <Container>
        <ItemHeader
          title={translate('component.itemAdd.itemlist')}
          link={{ url: '/author/items', text: translate('component.itemAdd.backToItemList') }}
          reference={reference}
          editReference={this.editReference}
          onChange={this.onInputReference}
        >
          <ButtonBar
            onChangeView={this.handleChangeView}
            onShowSource={this.handleShowSource}
            changePreviewTab={changePreviewTab}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        <PaddingDiv top={160}>
          <AddNew />
        </PaddingDiv>
      </Container>
    );
  }
}

ItemAdd.propTypes = {
  view: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  changeView: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  updateItemById: PropTypes.func.isRequired,
  previewTab: PropTypes.string.isRequired,
};

const enhance = compose(
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
