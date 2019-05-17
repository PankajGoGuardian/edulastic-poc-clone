import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Button } from "@edulastic/common";
import { Select } from "antd";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Subtitle } from "../../../styled/Subtitle";
import { SelectWrapper, AddToolBtnWrapper, ToolSelect } from "../common/styled_components";
import DeleteButton from "../common/DeleteButton";

class ControlsSettings extends Component {
  controls = [
    { label: "Undo", value: "undo" },
    { label: "Redo", value: "redo" },
    { label: "Reset", value: "reset" },
    { label: "Delete", value: "delete" }
  ];

  addTool = groupIndex => {
    const { controlbar, onChange } = this.props;
    const newTools = [...controlbar.controls];
    const areToolsArray = Array.isArray(controlbar.controls[groupIndex]);
    // const defaultOption = this.controls && this.controls[0] ? this.controls[0].value : "";
    const defaultOption = this.controls.filter(
      (control, index) => !controlbar.controls.some(elem => elem === control.value)
    )[0].value;

    if (controlbar.controls.length <= 3) {
      if (groupIndex !== undefined && areToolsArray) {
        newTools[groupIndex].push(defaultOption);
      } else {
        newTools.push(defaultOption);
      }

      onChange({
        ...toolbar,
        controls: newTools
      });
    }
  };

  deleteTool = (index, groupIndex) => {
    const { controlbar, onChange } = this.props;

    const newTools = [...controlbar.controls];
    const areToolsArray = Array.isArray(controlbar.controls[groupIndex]);

    if (groupIndex !== undefined && areToolsArray) {
      newTools[groupIndex].splice(index, 1);
    } else {
      newTools.splice(index, 1);
    }

    onChange({
      ...toolbar,
      controls: newTools
    });
  };

  handleSelect = (index, newItemVal, groupIndex) => {
    const { controlbar, onChange } = this.props;

    const newTools = [...controlbar.controls];

    if (groupIndex !== undefined) {
      newTools[groupIndex][index] = newItemVal;
    } else {
      newTools[index] = newItemVal;
    }

    onChange({
      ...toolbar,
      controls: newTools
    });
  };

  renderAddToolBtn = groupIndex => (
    <Row>
      <Button
        style={{
          minWidth: 227,
          minHeight: 40,
          marginRight: "0.7em",
          borderRadius: "4px"
        }}
        onClick={() => this.addTool(groupIndex)}
        color="primary"
        outlined
      >
        ADD TOOL
      </Button>
    </Row>
  );

  renderSingleToolsInDefaultGroup = () => {
    const { controlbar } = this.props;
    const countOfSingleTools = controlbar.controls.filter(t => !Array.isArray(t)).length;
    const filteredTools = this.controls.filter(
      (control, index) => !controlbar.controls.some(elem => elem === control.value)
    );

    return (
      <Col md={12}>
        {controlbar.controls.map((tool, i) =>
          !Array.isArray(tool) ? (
            <React.Fragment key={`${i}-${Math.random().toString(36)}`}>
              <ToolSelect>
                <Tool
                  value={tool}
                  options={filteredTools}
                  selectWidth="100%"
                  index={i}
                  countOfSingleTools={countOfSingleTools}
                  onDelete={this.deleteTool}
                  onChange={this.handleSelect}
                />
              </ToolSelect>
            </React.Fragment>
          ) : null
        )}

        {countOfSingleTools < 4 && <AddToolBtnWrapper>{this.renderAddToolBtn()}</AddToolBtnWrapper>}
      </Col>
    );
  };

  render() {
    return (
      <Fragment>
        <Subtitle>Controls</Subtitle>
        <Row gutter={60}>{this.renderSingleToolsInDefaultGroup()}</Row>
      </Fragment>
    );
  }
}

ControlsSettings.propTypes = {
  onChange: PropTypes.func.isRequired,
  controlbar: PropTypes.object.isRequired
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(ControlsSettings);

const Tool = props => {
  const { options, groupIndex, value, onChange, selectWidth, index, onDelete, deleteToolStyles } = props;

  const onSelectChange = val => {
    onChange(index, val, groupIndex);
  };

  return (
    <React.Fragment>
      <SelectWrapper>
        <Select
          data-cy="controlSelect"
          style={{ width: selectWidth || "70%", height: "40px" }}
          onChange={onSelectChange}
          options={options}
          value={value}
        >
          {options.map(option => (
            <Select.Option data-cy={option.value} key={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>

        <DeleteButton
          onDelete={() => {
            onDelete(index, groupIndex);
          }}
          deleteToolStyles={deleteToolStyles}
        />
      </SelectWrapper>
    </React.Fragment>
  );
};

Tool.propTypes = {
  options: PropTypes.array.isRequired,
  groupIndex: PropTypes.number,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  selectWidth: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  deleteToolStyles: PropTypes.object
};

Tool.defaultProps = {
  deleteToolStyles: {},
  groupIndex: undefined
  // isGroup: false
};
