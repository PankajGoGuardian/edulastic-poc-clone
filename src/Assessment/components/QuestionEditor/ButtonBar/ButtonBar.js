import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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

import { Button, ButtonLink, SelectButton } from '../../common';

const ButtonBar = ({ onChangeView, onShowSource, view, changePreviewTab, previewTab }) => (
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
            Check Answer
          </ButtonLink>
        </StyledButton>
        <StyledButton>
          <ButtonLink
            onClick={() => changePreviewTab('show')}
            color="primary"
            active={previewTab === 'show'}
            icon={<FaEye />}
          >
            Show Answers
          </ButtonLink>
        </StyledButton>
        <StyledButton>
          <ButtonLink
            onClick={() => changePreviewTab('clear')}
            color="primary"
            active={previewTab === 'clear'}
            icon={<FaEraser />}
          >
            Clear
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

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 25px;
`;

const StyledButton = styled.div`
  margin-right: 10px;
`;
