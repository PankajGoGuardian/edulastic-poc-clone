import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../styled/Subtitle";
import { WidgetFRInput } from "../../../styled/Widget";
import QuestionTextArea from "../../QuestionTextArea";

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
            <WidgetFRInput>
              <QuestionTextArea
                toolbarId="annotationTitle"
                toolbarSize="SM"
                value={title}
                onChange={value => this.handleInputChange("title", value)}
              />
            </WidgetFRInput>
          </Col>
          <Col md={12}>
            <Label>Label top</Label>
            <WidgetFRInput>
              <QuestionTextArea
                toolbarId="annotationLabelTop"
                toolbarSize="SM"
                value={labelTop}
                onChange={value => this.handleInputChange("labelTop", value)}
              />
            </WidgetFRInput>
          </Col>
        </Row>

        <Row gutter={60}>
          <Col md={12}>
            <Label>Label left</Label>
            <WidgetFRInput>
              <QuestionTextArea
                toolbarId="annotationLabelLeft"
                toolbarSize="SM"
                value={labelLeft}
                onChange={value => this.handleInputChange("labelLeft", value)}
              />
            </WidgetFRInput>
          </Col>
          <Col md={12}>
            <Label>Label right</Label>
            <WidgetFRInput>
              <QuestionTextArea
                toolbarId="annotationLabelRight"
                toolbarSize="SM"
                value={labelRight}
                onChange={value => this.handleInputChange("labelRight", value)}
              />
            </WidgetFRInput>
          </Col>
        </Row>

        <Row gutter={60}>
          <Col md={12}>
            <Label>Label bottom</Label>
            <WidgetFRInput>
              <QuestionTextArea
                toolbarId="annotationLabelBottom"
                toolbarSize="SM"
                value={labelBottom}
                onChange={value => this.handleInputChange("labelBottom", value)}
              />
            </WidgetFRInput>
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
