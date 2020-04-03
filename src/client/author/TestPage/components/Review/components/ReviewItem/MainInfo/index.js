import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { helpers, WithMathFormula, FlexContainer } from "@edulastic/common";
import { Stimulus } from "./styled";
import { PointsInput } from "../styled";
import Actions from "../Actions";

class MainInfo extends React.Component {
  render() {
    const {
      data,
      index,
      handlePreview,
      isEditable,
      owner,
      onChangePoints,
      expandRow,
      onDelete,
      isScoringDisabled = false
    } = this.props;
    const newHtml = helpers.sanitizeForReview(data.stimulus) || "";
    return (
      <FlexContainer data-cy-item-index={index} data-cy={data.id} style={{ justifyContent: "space-between" }}>
        <Stimulus dangerouslySetInnerHTML={{ __html: newHtml }} onClick={() => handlePreview(data.id)} />
        <FlexContainer
          style={{ width: "200px" }}
          flexDirection="column"
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <FlexContainer flexDirection="row" style={{ margin: 0 }}>
            <Actions
              onPreview={() => handlePreview(data.id)}
              onCollapseExpandRow={expandRow}
              onDelete={onDelete}
              isEditable={isEditable}
            />
            <PointsInput
              size="large"
              type="number"
              disabled={!owner || !isEditable || isScoringDisabled}
              value={data.points}
              onChange={e => onChangePoints(data.id, +e.target.value)}
            />
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    );
  }
}

MainInfo.propTypes = {
  data: PropTypes.object.isRequired,
  handlePreview: PropTypes.func.isRequired
};

export default WithMathFormula(withRouter(MainInfo));
