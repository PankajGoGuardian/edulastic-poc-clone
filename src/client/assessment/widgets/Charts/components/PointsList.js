import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";
import { IconTrash } from "../styled";
import { SHOW_ALWAYS, SHOW_BY_HOVER, HIDDEN } from "../const";
import { FRACTION_FORMATS } from "../../../constants/constantsForQuestions";
import { Row, ColoredRow, StyledTextField, ColumnLabel, RowLabel, Col } from "../../../styled/Grid";

import { CustomInput } from "./Input";
import { SelectInputStyled } from "../../../styled/InputStyles";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";

class PointsList extends Component {
  getHoverSettings = () => {
    const { t } = this.props;
    return [
      { label: t("component.chart.labelOptions.showAlways"), value: SHOW_ALWAYS },
      { label: t("component.chart.labelOptions.showByHover"), value: SHOW_BY_HOVER },
      { label: t("component.chart.labelOptions.hidden"), value: HIDDEN }
    ];
  };

  getFractionFormatSettings = () => {
    const { t } = this.props;
    return [
      {
        label: t("component.options.fractionFormatOptions.decimal"),
        value: FRACTION_FORMATS.decimal
      },
      {
        label: t("component.options.fractionFormatOptions.fraction"),
        value: FRACTION_FORMATS.fraction
      },
      {
        label: t("component.options.fractionFormatOptions.mixedFraction"),
        value: FRACTION_FORMATS.mixedFraction
      }
    ];
  };

  render() {
    const {
      points,
      onAdd,
      handleChange,
      handleDelete,
      t,
      fillSections,
      cleanSections,
      showFractionFormatSetting,
      item
    } = this.props;
    const isShowFractionField = showFractionFormatSetting;
    return (
      <Question
        section="main"
        label={`${t("component.chart.categories")}`}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.chart.categories")}`)}>
          {t("component.chart.categories")}
        </Subtitle>

        <Row gutter={isShowFractionField ? 10 : 30}>
          <Col md={isShowFractionField ? 3 : 5} />
          <Col md={4}>
            <ColumnLabel>{t("component.chart.label")}</ColumnLabel>
          </Col>
          <Col md={4}>
            <ColumnLabel>{t("component.chart.initialValue")}</ColumnLabel>
          </Col>
          <Col md={4}>
            <ColumnLabel>{t("component.chart.showAlways")}</ColumnLabel>
          </Col>
          {showFractionFormatSetting && (
            <Col md={4}>
              <ColumnLabel>{t("component.options.fractionFormat")}</ColumnLabel>
            </Col>
          )}
          <Col md={isShowFractionField ? 3 : 4}>
            <ColumnLabel>{t("component.chart.interactive")}</ColumnLabel>
          </Col>
          <Col md={isShowFractionField ? 2 : 3} />
        </Row>

        {points.map((dot, index) => (
          <Fragment key={`points-${index}`}>
            <ColoredRow gutter={isShowFractionField ? 10 : 30}>
              <Col md={isShowFractionField ? 3 : 5}>
                <RowLabel>{`${t("component.chart.point")} ${index + 1}`}</RowLabel>
              </Col>
              <Col md={4}>
                <StyledTextField
                  type="text"
                  value={dot.x}
                  onChange={e => handleChange(index)("label", e.target.value)}
                  disabled={false}
                />
              </Col>
              <Col md={4}>
                <CustomInput index={index} type="number" value={dot.y} handleChange={handleChange} />
              </Col>
              <Col md={4}>
                <SelectInputStyled
                  height="32px"
                  value={dot.labelVisibility || SHOW_ALWAYS}
                  onSelect={value => handleChange(index)("labelVisibility", value)}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {this.getHoverSettings().map((setting, i) => (
                    <SelectInputStyled.Option key={`setting-${i}`} value={setting.value}>
                      {setting.label}
                    </SelectInputStyled.Option>
                  ))}
                </SelectInputStyled>
              </Col>
              {showFractionFormatSetting && (
                <Col md={4}>
                  <SelectInputStyled
                    height="32px"
                    value={dot.labelFractionFormat || FRACTION_FORMATS.decimal}
                    onSelect={value => handleChange(index)("labelFractionFormat", value)}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {this.getFractionFormatSettings().map((setting, i) => (
                      <SelectInputStyled.Option key={`setting-${i}`} value={setting.value}>
                        {setting.label}
                      </SelectInputStyled.Option>
                    ))}
                  </SelectInputStyled>
                </Col>
              )}
              <Col md={isShowFractionField ? 3 : 4}>
                <CheckboxLabel
                  checked={!dot.notInteractive}
                  onChange={() => handleChange(index)("interactive", !dot.notInteractive)}
                />
              </Col>
              <Col md={isShowFractionField ? 2 : 3}>
                <IconTrash onClick={() => handleDelete(index)} />
              </Col>
            </ColoredRow>
          </Fragment>
        ))}

        <CustomStyleBtn data-cy="addButton" onClick={onAdd}>
          {t("component.chart.addPoint")}
        </CustomStyleBtn>
      </Question>
    );
  }
}

PointsList.propTypes = {
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  points: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  showFractionFormatSetting: PropTypes.bool
};

PointsList.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  showFractionFormatSetting: false
};

export default withNamespaces("assessment")(PointsList);
