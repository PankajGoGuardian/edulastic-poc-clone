import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Button } from 'antd';
import {
  IconSave,
  IconSource,
  IconPreview,
  IconSettings,
  IconPencilEdit,
  IconEye,
  IconCheck,
  IconEraseText,
  IconMetadata
} from '@edulastic/icons';
import { white } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { withWindowSizes } from '@edulastic/common';
import { compose } from 'redux';

import { ButtonLink } from '..';
import {
  Container,
  RightSide,
  HeadIcon,
  MobileContainer,
  MobileFirstContainer,
  MobileSecondContainer,
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

  optionHandler = (key) => {
    const { onChangeView } = this.props;
    onChangeView(key);
    this.setState({ current: key });
  };

  render() {
    const { current } = this.state;
    const {
      t,
      onSave,
      onShowSource,
      onShowSettings,
      windowWidth,
      changePreviewTab
    } = this.props;
    return (
      <React.Fragment>
        {
          windowWidth > 468 ? (
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
                <Menu.Item key="metadata">
                  <HeadIcon>
                    <IconMetadata color={white} width={18} />
                  </HeadIcon>
                  METADATA
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
          )
            :
            (
              <MobileContainer>
                <MobileFirstContainer>
                  <Button onClick={() => this.optionHandler('edit')}>
                    <HeadIcon>
                      <IconPencilEdit color={white} width={18} />
                    </HeadIcon>
                  </Button>
                  <Button onClick={() => this.optionHandler('preview')}>
                    <HeadIcon>
                      <IconPreview color={white} width={18} />
                    </HeadIcon>
                  </Button>
                  <Button onClick={onSave}>
                    <HeadIcon>
                      <IconSave color={white} width={18} />
                    </HeadIcon>
                  </Button>
                  <Button onClick={onShowSource}>
                    <HeadIcon>
                      <IconSource color={white} width={18} />
                    </HeadIcon>
                  </Button>
                  <Button onClick={onShowSettings}>
                    <HeadIcon>
                      <IconSettings color={white} width={24} />
                    </HeadIcon>
                  </Button>
                </MobileFirstContainer>
                {
                  current === 'preview' && (
                    <MobileSecondContainer>
                      <Button
                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                        onClick={() => changePreviewTab('check')}
                      >
                        <ButtonLink
                          color="primary"
                          icon={<IconCheck color={white} />}
                          style={{ color: white }}
                        >
                          {t('component.questioneditor.buttonbar.checkanswer')}
                        </ButtonLink>
                      </Button>
                      <Button
                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                        onClick={() => changePreviewTab('show')}
                      >
                        <ButtonLink
                          color="primary"
                          style={{ color: white }}
                          icon={<IconEye color={white} />}
                        >
                          {t('component.questioneditor.buttonbar.showanswers')}
                        </ButtonLink>
                      </Button>
                      <Button
                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                        onClick={() => changePreviewTab('clear')}
                      >
                        <ButtonLink
                          color="primary"
                          style={{ color: white }}
                          icon={<IconEraseText color={white} />}
                        >
                          {t('component.questioneditor.buttonbar.clear')}
                        </ButtonLink>
                      </Button>
                    </MobileSecondContainer>
                  )
                }
              </MobileContainer>
            )
        }
      </React.Fragment>
    );
  }
}

ButtonBar.propTypes = {
  onChangeView: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  onShowSource: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
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
