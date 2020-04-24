import React, { Component } from "react";
import { red, greyThemeDark2 } from "@edulastic/colors";
import { FroalaEditor } from "@edulastic/common";
import { IconTrashAlt } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import { Container } from "./styled/Container";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";

class Annotation extends Component {
  render() {
    const { removeAnnotation, updateAnnotation, index, value } = this.props;
    return (
      <Row gutter={12} center>
        <Col span={22}>
          {/* overFlow is hidden by default */}
          <Container overflow="unset">
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
          </Container>
        </Col>
        <Col span={2}>
          <IconTrashAlt
            onClick={() => removeAnnotation(index)}
            color={greyThemeDark2}
            hoverColor={red}
            width={16}
            height={16}
          />
        </Col>
      </Row>
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
