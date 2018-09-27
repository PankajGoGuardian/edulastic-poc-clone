import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { changePreviewTabAction } from '../../actions/preview';
import { getPreivewTabSelector } from '../../selectors/preview';
import { changeViewAction } from '../../actions/view';
import { getViewSelector } from '../../selectors/view';
import { Paper, ItemHeader } from '../../../../assessment/src/components/common';
import { translate } from '../../utils/localization';
import { ButtonBar, Container } from '../common';
import AddNew from './AddNew';

class ItemAdd extends Component {
  handleChangeView = (view) => {
    const { changeView } = this.props;
    changeView(view);
  };

  render() {
    const { view, changePreviewTab, previewTab } = this.props;

    return (
      <Container>
        <ItemHeader
          title={translate('component.orderList')}
          link={{ url: '/author/items', text: translate('component.itemAdd.backToItemList') }}
          reference="1234567890"
        >
          <ButtonBar
            onChangeView={this.handleChangeView}
            changePreviewTab={changePreviewTab}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        <Paper>
          <AddNew />
        </Paper>
      </Container>
    );
  }
}

ItemAdd.propTypes = {
  view: PropTypes.string.isRequired,
  changeView: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  previewTab: PropTypes.string.isRequired,
};

const enhance = compose(
  connect(
    state => ({
      view: getViewSelector(state),
      previewTab: getPreivewTabSelector(state),
    }),
    {
      changeView: changeViewAction,
      changePreviewTab: changePreviewTabAction,
    },
  ),
);

export default enhance(ItemAdd);
