import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { MoveLink } from "@edulastic/common";
import { getQuestionType } from "../../../../dataUtils";
import { LabelText, Label } from "../../../../ItemList/components/Item/styled";
class MainInfoCell extends React.Component {
  render() {
    const { data, previewItem } = this.props;
    const itemType = getQuestionType(data.item);
    return (
      <div className="fr-view">
        <MoveLink onClick={() => previewItem(data)}>{data.stimulus}</MoveLink>
        <TypeContainer>
          {itemType && (
            <Label>
              <LabelText>{itemType}</LabelText>
            </Label>
          )}
        </TypeContainer>
      </div>
    );
  }
}

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
  previewItem: PropTypes.func
};

export default withRouter(MainInfoCell);

const TypeContainer = styled.div`
  margin-top: 30px;
  display: flex;
  .ant-tag {
    background: rgba(0, 176, 255, 0.2);
    color: rgb(0, 131, 190);
  }
`;
