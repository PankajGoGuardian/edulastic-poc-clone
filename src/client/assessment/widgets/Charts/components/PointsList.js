import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Checkbox } from "antd";

import { FlexContainer } from "@edulastic/common";

import withAddButton from "../../../components/HOC/withAddButton";
import UiInputGroup from "./UiInputGroup";
import { Widget } from "../../../styled/Widget";
import { Subtitle } from "../../../styled/Subtitle";
import { IconTrash } from "../styled";

class PointsList extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.chart.points"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { points, handleChange, handleDelete, t } = this.props;

    return (
      <Fragment>
        {points.map((dot, index) => (
          <Widget>
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
          </Widget>
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
