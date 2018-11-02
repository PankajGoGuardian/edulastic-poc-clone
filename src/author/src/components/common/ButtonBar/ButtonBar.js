import React from 'react';
import PropTypes from 'prop-types';
import { FaCode } from 'react-icons/fa';
import {
  IconPensilEdit,
  IconEye,
  IconQuestion,
  IconSave,
  IconSettings,
  IconEraseText,
  IconCheck,
  IconPreview,
} from '@edulastic/icons';
import { white, blue, darkBlue, textColor } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { withWindowSizes, Button } from '@edulastic/common';
import { compose } from 'redux';

import { Container, StyledButton } from './styled_components';
import { ButtonLink } from '..';

const ButtonBar = ({
  onChangeView,
  view,
  changePreviewTab,
  previewTab,
  onShowSource,
  onShowSettings,
  onSave,
  saving,
  t,
  windowWidth,
}) => {
  const iTablet = windowWidth <= 768;
  const buttonStyles = iTablet ? { minWidth: 50 } : {};

  return (
    <React.Fragment>
      <Container>
        <StyledButton>
          <Button
            style={buttonStyles}
            onClick={() => {}}
            icon={<IconQuestion color={textColor} width={12} />}
          >
            {!iTablet && t('component.questioneditor.buttonbar.help')}
          </Button>
        </StyledButton>
        <StyledButton>
          <Button
            style={buttonStyles}
            onClick={() => onChangeView('edit')}
            icon={(
              <IconPensilEdit
                color={view === 'edit' ? white : textColor}
                width={14}
              />
)}
            color={view === 'edit' ? 'primary' : 'default'}
          >
            {!iTablet && t('component.questioneditor.buttonbar.edit')}
          </Button>
        </StyledButton>
        <StyledButton>
          <Button
            style={buttonStyles}
            onClick={() => onChangeView('preview')}
            icon={(
              <IconPreview
                color={view === 'preview' ? white : textColor}
                width={18}
              />
)}
            color={view === 'preview' ? 'primary' : 'default'}
          >
            {!iTablet && t('component.questioneditor.buttonbar.preview')}
          </Button>
        </StyledButton>
        <StyledButton>
          <Button
            disabled={saving}
            style={buttonStyles}
            onClick={onSave}
            icon={<IconSave color={white} width={16} />}
            color="success"
          >
            {!iTablet && t('component.questioneditor.buttonbar.save')}
          </Button>
        </StyledButton>
        <StyledButton>
          <Button onClick={onShowSource} style={{ minWidth: 85 }}>
            <FaCode style={{ width: 16, height: 16 }} />
          </Button>
        </StyledButton>
        <StyledButton>
          <Button onClick={onShowSettings} style={{ minWidth: 85 }}>
            <IconSettings color={textColor} />
          </Button>
        </StyledButton>
      </Container>
      {view === 'preview' && (
        <Container
          style={{
            position: 'absolute',
            marginTop: 20,
            width: '100%',
            justifyContent: 'flex-end',
          }}
        >
          <StyledButton>
            <ButtonLink
              onClick={() => changePreviewTab('check')}
              color="primary"
              icon={<IconCheck color={blue} />}
            >
              {t('component.questioneditor.buttonbar.checkanswer')}
            </ButtonLink>
          </StyledButton>
          <StyledButton>
            <ButtonLink
              onClick={() => changePreviewTab('show')}
              color="primary"
              icon={<IconEye color={blue} hoverColor={darkBlue} />}
            >
              {t('component.questioneditor.buttonbar.showanswers')}
            </ButtonLink>
          </StyledButton>
          <StyledButton>
            <ButtonLink
              onClick={() => changePreviewTab('clear')}
              color="primary"
              active={previewTab === 'clear'}
              icon={<IconEraseText color={blue} />}
            >
              {t('component.questioneditor.buttonbar.clear')}
            </ButtonLink>
          </StyledButton>
        </Container>
      )}
    </React.Fragment>
  );
};

ButtonBar.propTypes = {
  onChangeView: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  onShowSource: PropTypes.func.isRequired,
  onShowSettings: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  saving: PropTypes.bool,
};

ButtonBar.defaultProps = {
  onShowSettings: () => {},
  saving: false,
};

const enhance = compose(
  withWindowSizes,
  withNamespaces('author'),
);

export default enhance(ButtonBar);
