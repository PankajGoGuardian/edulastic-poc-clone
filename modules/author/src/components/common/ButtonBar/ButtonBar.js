import React from 'react';
import PropTypes from 'prop-types';

import { translate } from '../../../utils/localization';
import { Container, StyledButton } from './styled_components';
import { Button, ButtonLink, SelectButton } from '../../common';
import {
  IconPensilEdit,
  IconEye,
  IconQuestion,
  IconSave,
  IconSettings,
  IconEraseText,
  IconCheck,
  IconPreview,
} from '../../../../../assessment/src/components/common/icons';
import { white, blue, darkBlue, textColor } from '../../../../../assessment/src/utils/css';

const ButtonBar = ({ onChangeView, view, changePreviewTab, previewTab }) => (
  <React.Fragment>
    <Container>
      <StyledButton>
        <Button onClick={() => {}} icon={<IconQuestion color={textColor} />}>
          {translate('component.questioneditor.buttonbar.help')}
        </Button>
      </StyledButton>
      <StyledButton>
        <Button
          onClick={() => onChangeView('edit')}
          icon={<IconPensilEdit color={view === 'edit' ? white : textColor} />}
          color={view === 'edit' ? 'primary' : 'default'}
        >
          {translate('component.questioneditor.buttonbar.edit')}
        </Button>
      </StyledButton>
      <StyledButton>
        <Button
          onClick={() => onChangeView('preview')}
          icon={<IconPreview color={view === 'preview' ? white : textColor} />}
          color={view === 'preview' ? 'primary' : 'default'}
        >
          {translate('component.questioneditor.buttonbar.preview')}
        </Button>
      </StyledButton>
      <StyledButton>
        <Button onClick={() => {}} icon={<IconSave color={white} />} color="success">
          {translate('component.questioneditor.buttonbar.save')}
        </Button>
      </StyledButton>
      <StyledButton>
        <SelectButton
          onSelect={value => console.log(value)}
          icon={<IconSettings color={textColor} />}
          options={[{ value: 'first', label: 'First' }, { value: 'second', label: 'Second' }]}
        >
          {translate('component.questioneditor.buttonbar.settings')}
        </SelectButton>
      </StyledButton>
    </Container>
    {view === 'preview' && (
      <Container>
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
};

export default ButtonBar;
