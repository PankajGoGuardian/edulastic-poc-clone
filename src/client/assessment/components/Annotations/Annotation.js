import React, { Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { FroalaEditor } from "@edulastic/common";
import { IconTrashAlt } from "@edulastic/icons";
import { greenDark, red } from "@edulastic/colors";

import { Header, FroalaInput, Container } from "./styled/styled_components";
import { Row } from "antd";

const DeleteButton = ({ onDelete, deleteToolStyles }) => (
  <Container style={deleteToolStyles}>
    <IconTrashAlt onClick={onDelete} color="#878A91" hoverColor={red} width={16} height={16} />
  </Container>
);

DeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
  deleteToolStyles: PropTypes.object
};

DeleteButton.defaultProps = {
  deleteToolStyles: {}
};

class Annotation extends Component {
  render() {
    const { removeAnnotation, updateAnnotation, index, value } = this.props;
    return (
      <div>
        <Row style={{ marginBottom: "15px", textTransform: "none" }} type={"flex"} justify={"space-between"}>
          <FroalaInput pl={"0px"}>
            <FroalaEditor
              value={value}
              onChange={val => updateAnnotation(val, index)}
              toolbarInline
              toolbarVisibleWithoutSelection
              config={{
                placeholder: "Edit your content"
              }}
            />
          </FroalaInput>
          <DeleteButton onDelete={() => removeAnnotation(index)} />
        </Row>
      </div>
    );
  }
}

Annotation.propTypes = {
  index: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  updateAnnotation: PropTypes.func.isRequired,
  removeAnnotation: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(Annotation);
