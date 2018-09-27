import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import OrderList from '../OrderList';
import { changePreviewTabAction } from '../../actions/preview';
import { getPreivewTabSelector } from '../../selectors/preview';
import { changeViewAction } from '../../actions/view';
import { getViewSelector } from '../../selectors/view';
import { Container } from './styled_components';
import { Paper, ItemHeader } from '../../../../assessment/src/components/common';
import { translate } from '../../utils/localization';
import { ButtonBar } from '../common';

class QuestionEditor extends Component {
  state = {
    showModal: false,
  };

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
          link={{ url: '/author', text: translate('component.backToItemDetail') }}
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
          <OrderList view={view} />
        </Paper>
      </Container>
    );
  }
}

QuestionEditor.propTypes = {
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

export default enhance(QuestionEditor);
