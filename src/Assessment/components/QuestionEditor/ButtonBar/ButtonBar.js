import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  FaPencilAlt, FaSearch, FaEye, FaCog, FaSave, FaCode, FaQuestion,
} from 'react-icons/fa';

import Button from '../../UI/Button';

const ButtonBar = ({
  onChangeView, onShowSource, view, changePreviewTab, previewTab,
}) => (
  <React.Fragment>
    <Container>
      {view === 'edit' && (
        <StyledButton>
          <Button onClick={onShowSource} icon={<FaCode />}>
            Source
          </Button>
        </StyledButton>
      )}
      <StyledButton>
        <Button onClick={() => {}} icon={<FaCog />}>
          Settings
        </Button>
      </StyledButton>
      <StyledButton>
        <Button onClick={() => {}} icon={<FaQuestion />}>
          Help
        </Button>
      </StyledButton>
      <StyledButton>
        <Button
          onClick={() => onChangeView('edit')}
          icon={<FaPencilAlt />}
          color={view === 'edit' ? 'primary' : 'default'}
        >
          Edit
        </Button>
      </StyledButton>
      <StyledButton>
        <Button
          onClick={() => onChangeView('preview')}
          icon={<FaSearch />}
          color={view === 'preview' ? 'primary' : 'default'}
        >
          Preview
        </Button>
      </StyledButton>
      <StyledButton>
        <Button onClick={() => {}} icon={<FaSave />} color="success">
          Save
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
            Check Answer
          </Button>
        </StyledButton>
        <StyledButton>
          <Button
            onClick={() => changePreviewTab('show')}
            color={previewTab === 'show' ? 'primary' : 'default'}
            icon={<FaEye />}
          >
            Show Answers
          </Button>
        </StyledButton>
        <StyledButton>
          <Button
            onClick={() => changePreviewTab('clear')}
            color={previewTab === 'clear' ? 'primary' : 'default'}
            icon={<FaEye />}
          >
            Clear
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
