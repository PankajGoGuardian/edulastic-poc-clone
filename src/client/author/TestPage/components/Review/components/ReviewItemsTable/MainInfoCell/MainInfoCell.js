import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { helpers, WithMathFormula } from "@edulastic/common";
import { Stimulus } from "./styled";

class MainInfoCell extends React.Component {
  render() {
    const { data, handlePreview } = this.props;
    const newHtml = helpers.sanitizeForReview(data.stimulus);
    return <Stimulus onClick={() => handlePreview(data.id)} dangerouslySetInnerHTML={{ __html: newHtml }} />;
  }
}

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
  handlePreview: PropTypes.func.isRequired
};

export default WithMathFormula(withRouter(MainInfoCell));
