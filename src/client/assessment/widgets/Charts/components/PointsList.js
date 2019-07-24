import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";

import { FlexContainer } from "@edulastic/common";

import withAddButton from "../../../components/HOC/withAddButton";
import UiInputGroup from "./UiInputGroup";
import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";
import { IconTrash } from "../styled";

class PointsList extends Component {
  render() {
    const { points, handleChange, handleDelete, t, fillSections, cleanSections } = this.props;

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
