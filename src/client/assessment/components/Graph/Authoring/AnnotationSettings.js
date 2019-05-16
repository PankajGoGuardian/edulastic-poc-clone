import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../styled/Subtitle";
import QuillInput from "../common/QuillInput";

class AnnotationSettings extends Component {
  handleInputChange = (name, value) => {
    const { annotation, setAnnotation } = this.props;
    if (value === "<p><br></p>") {
      value = "";
    }
    setAnnotation({ ...annotation, [name]: value });
  };

  render() {
    const { t, annotation } = this.props;
    const { title, labelTop, labelBottom, labelLeft, labelRight } = annotation;

    return (
      <Fragment>
        <Subtitle>Annotation</Subtitle>
        <Row gutter={60}>
          <Col md={12}>
            <Label>Title</Label>
            <QuillInput value={title} onChange={value => this.handleInputChange("title", value)} toolbarId="title" />
          </Col>
          <Col md={12}>
            <Label>Label top</Label>
            <QuillInput
              value={labelTop}
              onChange={value => this.handleInputChange("labelTop", value)}
              toolbarId="labelTop"
            />
          </Col>
        </Row>

        <Row gutter={60}>
          <Col md={12}>
            <Label>Label left</Label>
            <QuillInput
              value={labelLeft}
              onChange={value => this.handleInputChange("labelLeft", value)}
              toolbarId="labelLeft"
            />
          </Col>
          <Col md={12}>
            <Label>Label right</Label>
            <QuillInput
              value={labelRight}
              onChange={value => this.handleInputChange("labelRight", value)}
              toolbarId="labelRight"
            />
          </Col>
        </Row>

        <Row gutter={60}>
          <Col md={12}>
            <Label>Label bottom</Label>
            <QuillInput
              value={labelBottom}
              onChange={value => this.handleInputChange("labelBottom", value)}
              toolbarId="labelBottom"
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

AnnotationSettings.propTypes = {
  t: PropTypes.func.isRequired,
  annotation: PropTypes.object,
  setAnnotation: PropTypes.func.isRequired
};

AnnotationSettings.defaultProps = {
  annotation: {
    title: "",
    labelTop: "",
    labelBottom: "",
    labelLeft: "",
    labelRight: ""
  }
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(AnnotationSettings);
