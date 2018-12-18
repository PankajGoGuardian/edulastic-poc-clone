import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  IconEye,
  IconCheck,
  IconSource,
  IconSettings,
  IconEraseText
} from '@edulastic/icons';
import { blue, darkBlue, white } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { clearAnswersAction } from '../../../../actions/answers';
import { Container, PreviewBar } from './styled_components';
import { ButtonLink } from '../../../common';

class SecondLevel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      option: false
    };
  }

  render() {
    const { option } = this.state;
    const {
      t,
      view,
      previewTab,
      onShowSource,
      onShowSettings,
      changePreviewTab,
      clearAnswers
    } = this.props;

    return (
      <Container type={option}>
        {view === 'edit' && (
          <PreviewBar
            style={{
              width: '100%',
              justifyContent: 'flex-end'
            }}
          >
            <Button onClick={onShowSource}>
              <ButtonLink
                color="primary"
                icon={<IconSource color={option ? white : blue} />}
                style={{ color: option ? white : blue }}
              >
                {t('component.questioneditor.buttonbar.source')}
              </ButtonLink>
            </Button>
            <Button onClick={onShowSettings}>
              <ButtonLink
                color="primary"
                icon={<IconSettings color={option ? white : blue} />}
                style={{ color: option ? white : blue }}
              >
                {t('component.questioneditor.buttonbar.layout')}
              </ButtonLink>
            </Button>
          </PreviewBar>
        )}
        {view === 'preview' && (
          <PreviewBar
            style={{
              width: '100%',
              justifyContent: 'flex-end'
            }}
          >
            <Button onClick={() => changePreviewTab('check')}>
              <ButtonLink
                color="primary"
                icon={<IconCheck color={option ? white : blue} />}
                style={{ color: option ? white : blue }}
              >
                {t('component.questioneditor.buttonbar.checkanswer')}
              </ButtonLink>
            </Button>
            <Button onClick={() => changePreviewTab('show')}>
              <ButtonLink
                color="primary"
                style={{ color: option ? white : blue }}
                icon={(
                  <IconEye
                    color={option ? white : blue}
                    hoverColor={darkBlue}
                  />
                )}
              >
                {t('component.questioneditor.buttonbar.showanswers')}
              </ButtonLink>
            </Button>
            <Button onClick={() => clearAnswers()}>
              <ButtonLink
                color="primary"
                active={previewTab === 'clear'}
                style={{ color: option ? white : blue }}
                icon={<IconEraseText color={option ? white : blue} />}
              >
                {t('component.questioneditor.buttonbar.clear')}
              </ButtonLink>
            </Button>
          </PreviewBar>
        )}
      </Container>
    );
  }
}

SecondLevel.propTypes = {
  changePreviewTab: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  onShowSource: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  clearAnswers: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces('author'),
  connect(
    null,
    { clearAnswers: clearAnswersAction }
  )
);

export default enhance(SecondLevel);
