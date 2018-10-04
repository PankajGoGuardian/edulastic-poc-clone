import React from 'react';
import PropTypes from 'prop-types';
import { FaCode, FaCog } from 'react-icons/fa';
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
import { ButtonLink, SelectButton } from '..';

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
            icon={<IconPensilEdit color={view === 'edit' ? white : textColor} width={14} />}
            color={view === 'edit' ? 'primary' : 'default'}
          >
            {!iTablet && t('component.questioneditor.buttonbar.edit')}
          </Button>
        </StyledButton>
        <StyledButton>
          <Button
            style={buttonStyles}
            onClick={() => onChangeView('preview')}
            icon={<IconPreview color={view === 'preview' ? white : textColor} width={18} />}
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
          <SelectButton
            style={{ width: iTablet ? 100 : 130 }}
            onSelect={(value) => {
              if (value === 'source') {
                onShowSource();
              }
              if (value === 'settings') {
                onShowSettings();
              }
            }}
            icon={<IconSettings color={textColor} />}
            options={[
              {
                value: 'source',
                label: 'Source',
                icon: <FaCode style={{ width: 16, height: 16 }} />,
              },
              {
                value: 'settings',
                label: 'Settings',
                icon: <FaCog style={{ width: 16, height: 16 }} />,
              },
            ]}
          >
            {t('component.questioneditor.buttonbar.settings')}
          </SelectButton>
        </StyledButton>
      </Container>
      {view === 'preview' && (
        <Container
          style={{ position: 'absolute', marginTop: 20, width: '100%', justifyContent: 'flex-end' }}
        >
          <StyledButton>
            <ButtonLink
              onClick={() => changePreviewTab('check')}
              color="primary"
              active={previewTab === 'check'}
              icon={<IconCheck color={previewTab === 'check' ? darkBlue : blue} />}
            >
              {t('component.questioneditor.buttonbar.checkanswer')}
            </ButtonLink>
          </StyledButton>
          <StyledButton>
            <ButtonLink
              onClick={() => changePreviewTab('show')}
              color="primary"
              active={previewTab === 'show'}
              icon={
                <IconEye color={previewTab === 'show' ? darkBlue : blue} hoverColor={darkBlue} />
              }
            >
              {t('component.questioneditor.buttonbar.showanswers')}
            </ButtonLink>
          </StyledButton>
          <StyledButton>
            <ButtonLink
              onClick={() => changePreviewTab('clear')}
              color="primary"
              active={previewTab === 'clear'}
              icon={<IconEraseText color={previewTab === 'clear' ? darkBlue : blue} />}
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
  onShowSettings: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  saving: PropTypes.bool.isRequired,
};

const enhance = compose(
  withWindowSizes,
  withNamespaces('author'),
);

export default enhance(ButtonBar);
