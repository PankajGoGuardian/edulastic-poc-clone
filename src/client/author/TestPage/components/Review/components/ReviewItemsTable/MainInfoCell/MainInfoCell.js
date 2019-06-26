import React from "react";
import PropTypes from "prop-types";
import { MoveLink } from "@edulastic/common";
import { withRouter } from "react-router-dom";
import { Stimulus } from "./styled";

class MainInfoCell extends React.Component {
  render() {
    const { data, handlePreview } = this.props;
    return (
      <div>
        <MoveLink onClick={() => handlePreview(data.id)}>{data.title}</MoveLink>
        <Stimulus dangerouslySetInnerHTML={{ __html: data.stimulus }} />
      </div>
    );
  }
}

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired
};

export default withRouter(MainInfoCell);
