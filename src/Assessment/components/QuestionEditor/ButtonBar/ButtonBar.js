import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  FaPencilAlt, FaSearch, FaEye, FaCog, FaSave, FaCode, FaQuestion,
} from 'react-icons/fa';

import Button from '../../common/Button';
import { translate } from '../../../utilities/localization';

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
    </Container>
    {view === 'preview' && (
      <Container>
        <StyledButton>
          <Button
            onClick={() => changePreviewTab('check')}
            color={previewTab === 'check' ? 'primary' : 'default'}
            icon={<FaEye />}
          >
            {translate('component.questioneditor.buttonbar.checkanswer')}
          </Button>
        </StyledButton>
        <StyledButton>
          <Button
            onClick={() => changePreviewTab('show')}
            color={previewTab === 'show' ? 'primary' : 'default'}
            icon={<FaEye />}
          >
            {translate('component.questioneditor.buttonbar.showanswers')}
          </Button>
        </StyledButton>
        <StyledButton>
          <Button
            onClick={() => changePreviewTab('clear')}
            color={previewTab === 'clear' ? 'primary' : 'default'}
          >
            {translate('component.questioneditor.buttonbar.clear')}
          </Button>
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

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 25px;
`;

const StyledButton = styled.div`
  margin-right: 10px;
`;
