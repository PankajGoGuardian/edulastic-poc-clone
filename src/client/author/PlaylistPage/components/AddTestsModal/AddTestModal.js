import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import styled from "styled-components";
import Modal from "react-responsive-modal";
import { withRouter } from "react-router-dom";
import { white, inputBorder, lightGreySecondary, blueButton } from "@edulastic/colors";
import { Block } from "../../../TestPage/components/Setting/components/MainSetting/styled";

const ModalStyles = {
  minWidth: 750,
  borderRadius: "5px",
  "background-color": lightGreySecondary,
  padding: "30px"
};

class AddTestModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flag: false,
      moduleName: "New Module"
    };
  }

  componentWillReceiveProps(nextProps) {
    const { flag } = this.state;
    const { isVisible } = nextProps;
    if (isVisible && !flag) {
      this.setState({ flag: true });
    }
  }

  closeModal = () => {
    const { onClose } = this.props;
    this.setState({ flag: false });
    onClose();
  };

  onModuleClick = index => {
    const { handleTestAdded } = this.props;
    handleTestAdded(index);
    this.closeModal();
  };

  render() {
    const { isVisible, modulesList } = this.props;
    return (
      <Modal styles={{ modal: ModalStyles }} open={isVisible} onClose={this.closeModal} center>
        <HeadingWrapper>
          <Title>Add </Title>
        </HeadingWrapper>
        {modulesList &&
          modulesList.map(({ title }, index) => (
            <ModuleWrapper onClick={e => this.onModuleClick(index)}>
              <SubTitleWrapper>Module {index + 1}:</SubTitleWrapper> <TitleWrapper>{title}</TitleWrapper>
            </ModuleWrapper>
          ))}
      </Modal>
    );
  }
}

AddTestModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  handleTestAdded: PropTypes.func.isRequired,
  modulesList: PropTypes.array.isRequired,
  item: PropTypes.object
};

const enhance = compose(withRouter);

export default enhance(AddTestModal);

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const TitleWrapper = styled.span`
  font-weight: bold;
  width: 80%;
`;

const ModuleWrapper = styled.div`
  margin-bottom: 5px;
  border: ${inputBorder} solid 1px;
  width: 100%;
  padding: 15px 30px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${white};

  :hover {
    border: ${blueButton} solid 1px;
  }
`;

const SubTitleWrapper = styled.span`
  width: 20%;
`;
