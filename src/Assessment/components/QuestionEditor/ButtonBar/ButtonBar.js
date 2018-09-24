import React from 'react';
import PropTypes from 'prop-types';
import {
  FaPencilAlt,
  FaSearch,
  FaEye,
  FaCog,
  FaSave,
  FaCode,
  FaQuestion,
  FaCheck,
  FaEraser,
} from 'react-icons/fa';

import { translate } from '../../../utilities/localization';
import { Container, StyledButton } from './styled_components';
import { Button, ButtonLink, SelectButton } from '../../common';

const ButtonBar = ({
  onChangeView, onShowSource, view, changePreviewTab, previewTab,
}) => (
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
        <Button onClick={() => {}} icon={<FaQuestion />}>
          {translate('component.questioneditor.buttonbar.help')}
        </Button>
      </StyledButton>
      <StyledButton>
        <Button
          onClick={() => onChangeView('edit')}
          icon={<FaPencilAlt />}
          color={view === 'edit' ? 'primary' : 'default'}
        >
          {translate('component.questioneditor.buttonbar.edit')}
        </Button>
      </StyledButton>
      <StyledButton>
        <Button
          onClick={() => onChangeView('preview')}
          icon={<FaSearch />}
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
          Settings
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
            icon={<FaEye />}
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
