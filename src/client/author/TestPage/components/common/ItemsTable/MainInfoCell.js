import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { MoveLink } from "@edulastic/common";

import ItemTypes from "../../../../ItemList/components/Item/ItemTypes";
import PreviewModal from "../../../../src/components/common/PreviewModal";
class MainInfoCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowPreviewModal: false
    };
  }

  previewItem = () => {
    this.setState({ isShowPreviewModal: true });
  };

  closeModal = () => {
    this.setState({ isShowPreviewModal: false });
  };

  render() {
    const { data, testId, showModal, addDuplicate } = this.props;
    const { isShowPreviewModal } = this.state;
    return (
      <div>
        <MoveLink onClick={() => this.previewItem()}>{data.stimulus}</MoveLink>
        <TypeContainer>
          <ItemTypes item={data.item} />
        </TypeContainer>
        <PreviewModal
          isVisible={isShowPreviewModal}
          testId={testId}
          page="addItems"
          addDuplicate={addDuplicate}
          showModal={showModal}
          onClose={this.closeModal}
          data={data}
        />
      </div>
    );
  }
}

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
  showModal: PropTypes.bool,
  addDuplicate: PropTypes.func
};

export default withRouter(MainInfoCell);

const TypeContainer = styled.div`
  margin-top: 31px;
  width: 30%;
  .ant-tag {
    background: rgba(0, 176, 255, 0.2);
    color: rgb(0, 131, 190);
  }
`;
