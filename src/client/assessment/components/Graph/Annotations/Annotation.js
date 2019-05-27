import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { FroalaEditor } from "@edulastic/common";
import { IconTrash } from "@edulastic/icons";
import { Header, FroalaInput } from "./styled/styled_components";

class Annotation extends Component {
  render() {
    const { removeAnnotation, updateAnnotation, index, value } = this.props;

    return (
      <div>
        <Header>
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
          <IconTrash onClick={() => removeAnnotation(index)} />
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
