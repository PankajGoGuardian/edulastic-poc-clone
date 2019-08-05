import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { helpers, WithMathFormula } from "@edulastic/common";
import { Stimulus } from "./styled";
import { FlexContainer } from "../../../../../../../assessment/themes/common";
import { PointsLabel, PointsInput, PreviewButton } from "../../List/styled";

class MainInfoCell extends React.Component {
  render() {
    const { data, handlePreview, isEditable, owner, onChangePoints } = this.props;
    const newHtml = helpers.sanitizeForReview(data.stimulus);
    return (
      <FlexContainer style={{ justifyContent: "space-between" }}>
        <Stimulus onClick={() => handlePreview(data.id)} dangerouslySetInnerHTML={{ __html: newHtml }} />
        <FlexContainer
          style={{ width: "200px" }}
          flexDirection="column"
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <FlexContainer flexDirection="column" style={{ margin: 0 }}>
            <PointsInput
              size="large"
              type="number"
              disabled={!owner || !isEditable}
              value={data.points}
              onChange={e => onChangePoints(metaInfoData.id, +e.target.value)}
            />
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    );
  }
}

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
  handlePreview: PropTypes.func.isRequired
};

export default WithMathFormula(withRouter(MainInfoCell));
