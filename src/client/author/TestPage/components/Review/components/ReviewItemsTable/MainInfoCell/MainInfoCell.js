import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { helpers, WithMathFormula } from "@edulastic/common";
import { Stimulus } from "./styled";
import { FlexContainer } from "../../../../../../../assessment/themes/common";
import { PointsLabel, PointsInput, PreviewButton } from "../../List/styled";

class MainInfoCell extends React.Component {
  render() {
    const { data, handlePreview, isEditable, owner, onChangePoints, index, setExpandedRows, isCollapse } = this.props;
    const newHtml = data.stimulus?.replace(/&nbsp;/g, "");

    return (
      <FlexContainer data-cy={data.id} style={{ justifyContent: "space-between" }}>
        <Stimulus
          isCollapse={isCollapse}
          onClick={() => setExpandedRows(index)}
          dangerouslySetInnerHTML={{ __html: newHtml }}
        />
        <FlexContainer
          style={{ width: "200px" }}
          flexDirection="column"
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <FlexContainer flexDirection="row" style={{ margin: 0 }}>
            <PreviewButton style={{ marginTop: "0px" }} data-cy="previewButton" onClick={() => handlePreview(data.id)}>
              Preview
            </PreviewButton>
            <PointsInput
              size="large"
              type="number"
              disabled={!owner || !isEditable}
              value={data.points}
              onChange={e => onChangePoints(data.id, +e.target.value)}
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
