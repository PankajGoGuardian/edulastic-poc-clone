import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import Modal from "react-responsive-modal";
import { white, greyish, labelGrey, fadedGrey } from "@edulastic/colors";

const ModalStyles = {
  minWidth: 750,
  borderRadius: "5px",
  "background-color": greyish,
  padding: "30px"
};

const AddBulkTestModal = props => {
  const { isVisible, modulesList, onClose, handleBulkTestAdded } = props;

  const onModuleClick = index => {
    handleBulkTestAdded(index);
    onClose();
  };

  return (
    <Modal styles={{ modal: ModalStyles }} open={isVisible} onClose={onClose} center>
      <HeadingWrapper>
        <Title>Module</Title>
      </HeadingWrapper>
      <ModuleWrapper>
        {modulesList &&
          modulesList.map(({ title }, index) => (
            <ModuleList onClick={e => onModuleClick(index)}>
              <SubTitleWrapper>Module {index + 1}:</SubTitleWrapper> <TitleWrapper>{title}</TitleWrapper>
            </ModuleList>
          ))}
      </ModuleWrapper>
    </Modal>
  );
};

AddBulkTestModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleTestAdded: PropTypes.func.isRequired,
  modulesList: PropTypes.array.isRequired
};

export default AddBulkTestModal;

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 0px 10px;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const TitleWrapper = styled.span`
  font-weight: bold;
  width: 80%;
  margin-left: 12px;
`;

const ModuleWrapper = styled.ul`
  margin: 0;
  padding: 0px;
  list-style: none;
  border-radius: 5px;
  overflow: hidden;
`;

const ModuleList = styled.li`
  width: 100%;
  padding: 10px 15px;
  cursor: pointer;
  background-color: ${white};
  border-bottom: 1px solid ${fadedGrey};
  margin: 6px 0;
  font-size: 16px;
  &:hover {
    background-color: ${fadedGrey};
  }
  border-radius: 6px;
`;

const SubTitleWrapper = styled.span`
  width: 20%;
  color: ${labelGrey};
`;
