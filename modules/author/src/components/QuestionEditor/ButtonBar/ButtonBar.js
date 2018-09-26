import React from 'react';
import PropTypes from 'prop-types';
import { FaCog, FaSave, FaCode, FaCheck, FaEraser } from 'react-icons/fa';

import { translate } from '../../../utils/localization';
import { Container, StyledButton } from './styled_components';
import { Button, ButtonLink, SelectButton } from '../../../../../assessment/src/components/common';
import {
  IconPensilEdit,
  IconEye,
  IconSearch,
  IconQuestion,
} from '../../../../../assessment/src/components/common/icons';
import { white, blue, darkBlue, textColor } from '../../../../../assessment/src/utils/css';

const ButtonBar = ({ onChangeView, onShowSource, view, changePreviewTab, previewTab }) => (
  <React.Fragment>
    <Container>
      {view === 'edit' && (
        <StyledButton>
          <Button onClick={onShowSource} icon={<FaCode />}>
            {translate('component.questioneditor.buttonbar.source')}
          </Button>
        </StyledButton>
      )}
      <StyledButton>
        <Button onClick={() => {}} icon={<FaCog />}>
          {translate('component.questioneditor.buttonbar.settings')}
        </Button>
      </StyledButton>
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
          icon={<IconSearch color={view === 'preview' ? white : textColor} />}
          color={view === 'preview' ? 'primary' : 'default'}
        >
          {translate('component.questioneditor.buttonbar.preview')}
        </Button>
      </StyledButton>
      <StyledButton>
        <Button onClick={() => {}} icon={<FaSave />} color="success">
          {translate('component.questioneditor.buttonbar.save')}
        </Button>
      </StyledButton>
      <StyledButton>
        <SelectButton
          onSelect={value => console.log(value)}
          icon={<FaCog />}
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
            icon={<FaCheck />}
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
            icon={<FaEraser />}
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
  onShowSource: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
};

export default ButtonBar;
