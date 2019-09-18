import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { Checkbox, Select } from "antd";

import { FlexContainer } from "@edulastic/common";

import withAddButton from "../../../components/HOC/withAddButton";
import UiInputGroup from "./UiInputGroup";
import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";
import { IconTrash } from "../styled";

class PointsList extends Component {
  hoverSettings = [
    { label: "Show always", value: "showAlways" },
    { label: "Show by hover", value: "onlyByHover" },
    { label: "Hidden", value: "hidden" }
  ];

  render() {
    const { points, handleChange, handleDelete, t, fillSections, cleanSections, onlyByHoverSetting } = this.props;

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
            {onlyByHoverSetting && (
              <Select
                value={dot.hoverSetting || "showAlways"}
                style={{ width: "150px" }}
                onSelect={value => handleChange(index)("hoverSetting", value)}
              >
                {this.hoverSettings.map((setting, index) => (
                  <Select.Option key={`setting-${index}`} value={setting.value}>
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
  cleanSections: PropTypes.func
};

PointsList.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withAddButton(PointsList);
