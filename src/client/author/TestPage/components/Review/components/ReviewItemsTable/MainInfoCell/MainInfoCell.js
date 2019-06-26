import React from "react";
import PropTypes from "prop-types";
import { MoveLink } from "@edulastic/common";
import { withRouter } from "react-router-dom";
import { Stimulus } from "./styled";
import PreviewModal from "../../../../../../src/components/common/PreviewModal";

class MainInfoCell extends React.Component {
  state = {
    isShowPreviewModal: false
  };

  onPreviewModalChange = () => {
    this.setState(prev => ({
      isShowPreviewModal: !prev.isShowPreviewModal
    }));
  };

  render() {
    const { data, owner } = this.props;
    const { isShowPreviewModal } = this.state;
    return (
      <div>
        <Stimulus onClick={this.onPreviewModalChange} dangerouslySetInnerHTML={{ __html: data.stimulus }} />
        <PreviewModal
          isVisible={isShowPreviewModal}
          onClose={this.onPreviewModalChange}
          data={data}
          page="review"
          owner={owner}
        />
      </div>
    );
  }
}

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired
};

export default withRouter(MainInfoCell);
