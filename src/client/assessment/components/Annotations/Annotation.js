import { red, greyThemeDark2 } from "@edulastic/colors";
import { FroalaEditor } from "@edulastic/common";
import { IconTrashAlt } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { Row } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Container, FroalaInput } from "./styled/styled_components";

const DeleteButton = ({ onDelete, deleteToolStyles }) => (
  <Container style={deleteToolStyles}>
    <IconTrashAlt onClick={onDelete} color={greyThemeDark2} hoverColor={red} width={16} height={16} />
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
        <Row style={{ marginBottom: "15px", textTransform: "none" }} type="flex" justify="space-between">
          <FroalaInput pl="0px">
            <FroalaEditor
              value={value}
              onChange={val => updateAnnotation(val, index)}
              toolbarInline
              toolbarVisibleWithoutSelection
              config={{
                placeholder: "Edit your content"
              }}
              toolbarId={`froala-editor-annotations-${index}`}
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
