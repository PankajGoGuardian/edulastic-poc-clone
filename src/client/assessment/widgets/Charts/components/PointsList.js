import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { Checkbox, Select } from "antd";

import { FlexContainer } from "@edulastic/common";

import withAddButton from "../../../components/HOC/withAddButton";
import UiInputGroup from "./UiInputGroup";
import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";
import { IconTrash } from "../styled";
import { SHOW_ALWAYS, SHOW_BY_HOVER, HIDDEN } from "../const";

class PointsList extends Component {
  getHoverSettings = () => {
    const { t } = this.props;
    return [
      { label: t("component.chart.labelOptions.showAlways"), value: SHOW_ALWAYS },
      { label: t("component.chart.labelOptions.showByHover"), value: SHOW_BY_HOVER },
      { label: t("component.chart.labelOptions.hidden"), value: HIDDEN }
    ];
  };

  render() {
    const {
      points,
      handleChange,
      handleDelete,
      t,
      fillSections,
      cleanSections,
      showLabelVisibilitySetting
    } = this.props;

    return (
      <Fragment>
        {points.map((dot, index) => (
          <Question
            section="main"
            label={`${t("component.chart.point")} ${index + 1}`}
            fillSections={fillSections}
            cleanSections={cleanSections}
          >
            <FlexContainer justifyContent="space-between">
              <Subtitle>{`${t("component.chart.point")} ${index + 1}`}</Subtitle>
              <IconTrash onClick={() => handleDelete(index)} />
            </FlexContainer>
            <UiInputGroup
              onChange={handleChange(index)}
              firstInputType="text"
              secondInputType="number"
              firstFieldValue={dot.x}
              secondFieldValue={dot.y}
              t={t}
            />
            <Checkbox
              checked={!dot.notInteractive}
              onChange={() => handleChange(index)("interactive", !dot.notInteractive)}
            >
              {t("component.chart.interactive")}
            </Checkbox>
            {showLabelVisibilitySetting && (
              <Select
                value={dot.labelVisibility || SHOW_ALWAYS}
                style={{ width: "150px" }}
                onSelect={value => handleChange(index)("labelVisibility", value)}
              >
                {this.getHoverSettings().map((setting, i) => (
                  <Select.Option key={`setting-${i}`} value={setting.value}>
                    {setting.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Question>
        ))}
      </Fragment>
    );
  }
}

PointsList.propTypes = {
  t: PropTypes.func.isRequired,
  points: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  showLabelVisibilitySetting: PropTypes.bool
};

PointsList.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  showLabelVisibilitySetting: false
};

export default withAddButton(PointsList);
