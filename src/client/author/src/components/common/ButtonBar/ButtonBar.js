import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Button } from 'antd';
import {
  IconSave,
  IconPreview,
  IconPencilEdit
} from '@edulastic/icons';
import { white } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { withWindowSizes } from '@edulastic/common';
import { compose } from 'redux';

import {
  Container,
  RightSide,
  HeadIcon
} from './styled_components';

class ButtonBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'edit'
    };
  }

  handleMenuClick = (e) => {
    const { onChangeView } = this.props;
    onChangeView(e.key);
    this.setState({ current: e.key });
  };

  render() {
    const { current } = this.state;
    const { onSave } = this.props;
    return (
      <React.Fragment>
        <Container>
          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            onClick={this.handleMenuClick}
            style={{ marginLeft: 80 }}
          >
            <Menu.Item key="edit">
              <HeadIcon>
                <IconPencilEdit color={white} width={18} />
              </HeadIcon>
              EDIT
            </Menu.Item>
            <Menu.Item key="preview">
              <HeadIcon>
                <IconPreview color={white} width={18} />
              </HeadIcon>
              PREVIEW
            </Menu.Item>
          </Menu>
          <RightSide>
            <Button onClick={onSave}>
              <HeadIcon>
                <IconSave color={white} width={18} />
              </HeadIcon>
              SAVE
            </Button>
          </RightSide>
        </Container>
      </React.Fragment>
    );
  }
}

ButtonBar.propTypes = {
  onChangeView: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  // saving: PropTypes.bool,
};

ButtonBar.defaultProps = {
  // saving: false,
};

const enhance = compose(
  withWindowSizes,
  withNamespaces('author')
);

export default enhance(ButtonBar);
