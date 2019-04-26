import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import { Select, TextField, Checkbox } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { cloneDeep } from "lodash";

import { AddNewChoiceBtn } from "../../../../styled/AddNewChoiceBtn";
import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";

import { Container } from "./styled/Container";
import { Delete } from "./styled/Delete";
import { Widget } from "../../../../styled/Widget";
import { Subtitle } from "../../../../styled/Subtitle";

class Layout extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.layout"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { onChange, uiStyle, t } = this.props;

    const changeUiStyle = (prop, value) => {
      onChange("ui_style", {
        ...uiStyle,
        [prop]: value
      });
    };

    const changeIndividualUiStyle = (prop, value, index) => {
      const newStyles = cloneDeep(uiStyle);
      newStyles.responsecontainerindividuals[index][prop] = value;
      onChange("ui_style", newStyles);
    };

    const addIndividual = () => {
      const { responsecontainerindividuals } = uiStyle;
      responsecontainerindividuals.push({
        widthpx: 0,
        heightpx: 0,
        wordwrap: false
      });
      onChange("ui_style", {
        ...uiStyle,
        responsecontainerindividuals
      });
    };

    const removeIndividual = index => {
      const { responsecontainerindividuals } = uiStyle;
      responsecontainerindividuals.splice(index, 1);
      onChange("ui_style", {
        ...uiStyle,
        responsecontainerindividuals
      });
    };

    return (
      <Widget>
        <Subtitle>{t("component.options.layout")}</Subtitle>
        <Row>
          <Col md={6}>
            <Label>{t("component.options.responsecontainerposition")}</Label>
            <Select
              style={{ width: "80%" }}
              onChange={val => changeUiStyle("responsecontainerposition", val)}
              options={[
                { value: "top", label: t("component.options.top") },
                { value: "bottom", label: t("component.options.bottom") },
                { value: "right", label: t("component.options.right") },
                { value: "left", label: t("component.options.left") }
              ]}
              value={uiStyle.responsecontainerposition}
            />
          </Col>
          <Col md={6}>
            <Label>{t("component.options.stemNumerationReviewOnly")}</Label>
            <Select
              style={{ width: "80%" }}
              onChange={val => changeUiStyle("stemnumeration", val)}
              options={[
                { value: "numerical", label: t("component.options.numerical") },
                {
                  value: "uppercase",
                  label: t("component.options.uppercasealphabet")
                },
                {
                  value: "lowercase",
                  label: t("component.options.lowercasealphabet")
                }
              ]}
              value={uiStyle.stemnumeration}
            />
          </Col>
          <Col md={6}>
            <Label>{t("component.options.fontSize")}</Label>
            <Select
              style={{ width: "80%" }}
              onChange={fontsize => changeUiStyle("fontsize", fontsize)}
              options={[
                { value: "small", label: t("component.options.small") },
                { value: "normal", label: t("component.options.normal") },
                { value: "large", label: t("component.options.large") },
                { value: "xlarge", label: t("component.options.extraLarge") },
                { value: "xxlarge", label: t("component.options.huge") }
              ]}
              value={uiStyle.fontsize}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Label>{t("component.options.responsecontainerglobal")}</Label>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Label>{t("component.options.widthpx")}</Label>
            <TextField
              type="number"
              disabled={false}
              containerStyle={{ width: 350 }}
              onChange={e => changeUiStyle("widthpx", +e.target.value)}
              value={uiStyle.widthpx}
            />
          </Col>
          <Col md={6}>
            <Label>{t("component.options.heightpx")}</Label>
            <TextField
              type="number"
              disabled={false}
              containerStyle={{ width: 350 }}
              onChange={e => changeUiStyle("heightpx", +e.target.value)}
              value={uiStyle.heightpx}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Checkbox
              onChange={() => changeUiStyle("wordwrap", !uiStyle.wordwrap)}
              label={t("component.options.wordwrap")}
              checked={uiStyle.wordwrap}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Label>{t("component.options.responsecontainerindividuals")}</Label>
          </Col>
        </Row>
        {uiStyle.responsecontainerindividuals.map((responsecontainerindividual, index) => (
          <Container key={index}>
            <Delete onClick={() => removeIndividual(index)}>X</Delete>
            <div>
              <Col md={12}>
                <Label>{`${t("component.options.responsecontainerindividual")} ${index + 1}`}</Label>
              </Col>
            </div>
            <Row>
              <Col md={6}>
                <Label>{t("component.options.widthpx")}</Label>
                <TextField
                  type="number"
                  disabled={false}
                  containerStyle={{ width: 350 }}
                  onChange={e => changeIndividualUiStyle("widthpx", +e.target.value, index)}
                  value={responsecontainerindividual.widthpx}
                />
              </Col>
              <Col md={6}>
                <Label>{t("component.options.heightpx")}</Label>
                <TextField
                  type="number"
                  disabled={false}
                  containerStyle={{ width: 350 }}
                  onChange={e => changeIndividualUiStyle("heightpx", +e.target.value, index)}
                  value={responsecontainerindividual.heightpx}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Checkbox
                  onChange={() => changeIndividualUiStyle("wordwrap", !responsecontainerindividual.wordwrap, index)}
                  label={t("component.options.wordwrap")}
                  checked={responsecontainerindividual.wordwrap}
                />
              </Col>
            </Row>
          </Container>
        ))}
        <Row>
          <Col md={12}>
            <AddNewChoiceBtn onClick={() => addIndividual()}>{t("component.options.add")}</AddNewChoiceBtn>
          </Col>
        </Row>
      </Widget>
    );
  }
}

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Layout.defaultProps = {
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  fillSections: () => {},
  cleanSections: () => {}
};

export default React.memo(withNamespaces("assessment")(Layout));
