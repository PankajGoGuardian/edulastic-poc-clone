import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { FroalaEditor } from "@edulastic/common";
import { IconTrashAlt } from "@edulastic/icons";
import { greenDark, red } from "@edulastic/colors";
import { Header, FroalaInput } from "./styled/styled_components";
import { Container } from "../common/styled_components";

const DeleteButton = ({ onDelete, deleteToolStyles }) => (
  <Container style={deleteToolStyles}>
    <IconTrashAlt onClick={onDelete} color={greenDark} hoverColor={red} width={16} height={16} />
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
        <Header style={{ textTransform: "none" }}>
          <FroalaInput>
            <FroalaEditor
              value={value}
              onChange={val => updateAnnotation(val, index)}
              toolbarInline
              toolbarVisibleWithoutSelection
              config={{
                placeholderText: "Edit your content"
              }}
            />
          </FroalaInput>
          {/* <IconTrashAlt onClick={() => removeAnnotation(index)} />
           */}
          <DeleteButton onDelete={() => removeAnnotation(index)} />
        </Header>
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
