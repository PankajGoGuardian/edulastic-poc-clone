import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Button } from 'antd';
import {
  IconEye,
  IconSave,
  IconCheck,
  IconSource,
  IconPreview,
  IconSettings,
  IconEraseText,
  IconPencilEdit,
} from '@edulastic/icons';
import { white, blue, darkBlue } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { withWindowSizes } from '@edulastic/common';
import { compose } from 'redux';

import { Container, RightSide, PreviewBar, HeadIcon } from './styled_components';
import { ButtonLink } from '..';

class ButtonBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'edit',
    };
  }

  handleMenuClick = (e) => {
    const { onChangeView } = this.props;
    onChangeView(e.key);
    this.setState({ current: e.key });
  }

  render() {
    const { current } = this.state;
    const {
      t,
      view,
      onSave,
      previewTab,
      onShowSource,
      onShowSettings,
      changePreviewTab,
    } = this.props;
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
        {view === 'edit' && (
          <PreviewBar
            style={{
              position: 'absolute',
              marginTop: 25,
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Button>
              <ButtonLink
                onClick={onShowSource}
                color="primary"
                icon={<IconSource color={blue} />}
              >
                {t('component.questioneditor.buttonbar.source')}
              </ButtonLink>
            </Button>
            <Button
              onClick={onShowSettings}
            >
              <ButtonLink
                color="primary"
                icon={<IconSettings color={blue} />}
              >
                {t('component.questioneditor.buttonbar.layout')}
              </ButtonLink>
            </Button>
          </PreviewBar>
        )}
        {view === 'preview' && (
          <PreviewBar
            style={{
              position: 'absolute',
              marginTop: 25,
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Button>
              <ButtonLink
                onClick={() => changePreviewTab('check')}
                color="primary"
                icon={<IconCheck color={blue} />}
              >
                {t('component.questioneditor.buttonbar.checkanswer')}
              </ButtonLink>
            </Button>
            <Button
              onClick={() => changePreviewTab('show')}
            >
              <ButtonLink
                color="primary"
                icon={<IconEye color={blue} hoverColor={darkBlue} />}
              >
                {t('component.questioneditor.buttonbar.showanswers')}
              </ButtonLink>
            </Button>
            <Button>
              <ButtonLink
                onClick={() => changePreviewTab('clear')}
                color="primary"
                active={previewTab === 'clear'}
                icon={<IconEraseText color={blue} />}
              >
                {t('component.questioneditor.buttonbar.clear')}
              </ButtonLink>
            </Button>
          </PreviewBar>
        )}
      </React.Fragment>
    );
  }
}

ButtonBar.propTypes = {
  onChangeView: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  onShowSource: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  // saving: PropTypes.bool,
};

ButtonBar.defaultProps = {
  // saving: false,
};

const enhance = compose(
  withWindowSizes,
  withNamespaces('author'),
);

export default enhance(ButtonBar);
