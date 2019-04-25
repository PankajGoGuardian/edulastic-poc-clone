import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { MoveLink, FlexContainer } from "@edulastic/common";
import { greenDark, white, grey } from "@edulastic/colors";

import Tags from "../../../../src/components/common/Tags";
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
    const { data, testId } = this.props;
    const { isShowPreviewModal } = this.state;

    return (
      <div>
        <MoveLink onClick={() => this.previewItem()}>{data.title}</MoveLink>
        <STIMULUS dangerouslySetInnerHTML={{ __html: data.stimulus }} />
        <TypeContainer>
          {data.standards && !!data.standards.length && (
            <FlexContainer>
              <Tags
                tags={data.standards}
                labelStyle={{
                  color: greenDark,
                  background: "#d1f9eb",
                  border: "none"
                }}
              />
            </FlexContainer>
          )}
        </TypeContainer>
        <PreviewModal
          isVisible={isShowPreviewModal}
          testId={testId}
          page="addItems"
          onClose={this.closeModal}
          data={data}
        />
      </div>
    );
  }
}

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired
};

export default withRouter(MainInfoCell);

const STIMULUS = styled.div`
  font-size: 13px;
  color: #444444;
  margin-top: 3px;
`;

const TypeContainer = styled.div`
  margin-top: 31px;

  .ant-tag {
    background: rgba(0, 176, 255, 0.2);
    color: rgb(0, 131, 190);
  }
`;
