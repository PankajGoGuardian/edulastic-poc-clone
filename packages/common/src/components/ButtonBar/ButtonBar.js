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

import { translate } from '../../../utils/localization';
import { Container, StyledButton } from './styled_components';
import { Button, ButtonLink, SelectButton } from '..';

const ButtonBar = ({ onChangeView, view, changePreviewTab, previewTab, onShowSource, onSave }) => (
  <React.Fragment>
    <Container>
      <StyledButton>
        <Button onClick={() => {}} icon={<IconQuestion color={textColor} width={12} />}>
          {translate('component.questioneditor.buttonbar.help')}
        </Button>
      </StyledButton>
      <StyledButton>
        <Button
          onClick={() => onChangeView('edit')}
          icon={<IconPensilEdit color={view === 'edit' ? white : textColor} width={14} />}
          color={view === 'edit' ? 'primary' : 'default'}
        >
          {translate('component.questioneditor.buttonbar.edit')}
        </Button>
      </StyledButton>
      <StyledButton>
        <Button
          onClick={() => onChangeView('preview')}
          icon={<IconPreview color={view === 'preview' ? white : textColor} width={18} />}
          color={view === 'preview' ? 'primary' : 'default'}
        >
          {translate('component.questioneditor.buttonbar.preview')}
        </Button>
      </StyledButton>
      <StyledButton>
        <Button onClick={onSave} icon={<IconSave color={white} width={16} />} color="success">
          {translate('component.questioneditor.buttonbar.save')}
        </Button>
      </StyledButton>
      <StyledButton>
        <SelectButton
          style={{ width: 130 }}
          onSelect={(value) => {
            if (value === 'source') {
              onShowSource();
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
          {translate('component.questioneditor.buttonbar.settings')}
        </SelectButton>
      </StyledButton>
    </Container>
    {view === 'preview' && (
      <Container style={{ position: 'absolute', marginTop: 20, width: '100%', justifyContent: 'flex-end' }}>
        <StyledButton>
          <ButtonLink
            onClick={() => changePreviewTab('check')}
            color="primary"
            active={previewTab === 'check'}
            icon={<IconCheck color={previewTab === 'check' ? darkBlue : blue} />}
          >
            {translate('component.questioneditor.buttonbar.checkanswer')}
          </ButtonLink>
        </StyledButton>
        <StyledButton>
          <ButtonLink
            onClick={() => changePreviewTab('show')}
            color="primary"
            active={previewTab === 'show'}
            icon={<IconEye color={previewTab === 'show' ? darkBlue : blue} hoverColor={darkBlue} />}
          >
            {translate('component.questioneditor.buttonbar.showanswers')}
          </ButtonLink>
        </StyledButton>
        <StyledButton>
          <ButtonLink
            onClick={() => changePreviewTab('clear')}
            color="primary"
            active={previewTab === 'clear'}
            icon={<IconEraseText color={previewTab === 'clear' ? darkBlue : blue} />}
          >
            {translate('component.questioneditor.buttonbar.clear')}
          </ButtonLink>
        </StyledButton>
      </Container>
    )}
  </React.Fragment>
);

ButtonBar.propTypes = {
  onChangeView: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  onShowSource: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ButtonBar;
