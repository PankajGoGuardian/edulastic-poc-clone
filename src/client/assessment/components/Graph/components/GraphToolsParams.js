import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "@edulastic/common";
import { Select } from "antd";
import { ToolSubTitle, SelectWrapper, AddToolBtnWrapper, ToolSelect } from "../common/styled_components";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import DeleteButton from "../common/DeleteButton";

class GraphToolsParams extends Component {
  addTool = groupIndex => {
    const { toolbar, onChange, options } = this.props;
    const newTools = [...toolbar.tools];
    const areToolsArray = Array.isArray(toolbar.tools[groupIndex]);
    const defaultOption = options && options[0] ? options[0].value : "";

    if (groupIndex !== undefined && areToolsArray) {
      newTools[groupIndex].push(defaultOption);
    } else {
      newTools.push(defaultOption);
    }

    onChange({
      ...toolbar,
      tools: newTools
    });
  };

  addGroup = () => {
    const { toolbar, onChange } = this.props;
    onChange({
      ...toolbar,
      tools: [...toolbar.tools, []]
    });
  };

  deleteTool = (index, groupIndex) => {
    const { toolbar, onChange } = this.props;

    const newTools = [...toolbar.tools];
    const areToolsArray = Array.isArray(toolbar.tools[groupIndex]);

    if (groupIndex !== undefined && areToolsArray) {
      newTools[groupIndex].splice(index, 1);
    } else {
      newTools.splice(index, 1);
    }

    onChange({
      ...toolbar,
      tools: newTools
    });
  };

  deleteGroup = groupIndex => {
    const { toolbar, onChange } = this.props;

    const newTools = [...toolbar.tools];
    newTools.splice(groupIndex, 1);

    onChange({
      ...toolbar,
      tools: newTools
    });
  };

  handleSelect = (index, newItemVal, groupIndex) => {
    const { toolbar, onChange } = this.props;

    const newTools = [...toolbar.tools];

    if (groupIndex !== undefined) {
      newTools[groupIndex][index] = newItemVal;
    } else {
      newTools[index] = newItemVal;
    }

    onChange({
      ...toolbar,
      tools: newTools
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
    const { options, toolbar } = this.props;
    const countOfSingleTools = toolbar.tools.filter(t => !Array.isArray(t)).length;

    return (
      <Col md={12} marginBottom="40px">
        <ToolSubTitle data-cy="toolSubTitle">Default Group</ToolSubTitle>
        {toolbar.tools.map((tool, i) =>
          !Array.isArray(tool) ? (
            <React.Fragment key={`${i}-${Math.random().toString(36)}`}>
              <ToolSelect>
                <Tool
                  value={tool}
                  options={options}
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

        <AddToolBtnWrapper>{this.renderAddToolBtn()}</AddToolBtnWrapper>
      </Col>
    );
  };

  renderAddGroupBtn = () => (
    <Row>
      <Button
        style={{
          minWidth: 227,
          minHeight: 40,
          marginRight: "0.7em",
          borderRadius: "4px"
        }}
        onClick={this.addGroup}
        color="primary"
        variant="extendedFab"
      >
        ADD NEW GROUP
      </Button>
    </Row>
  );

  getToolGroups = () => {
    const {
      toolbar: { tools }
    } = this.props;
    const areToolsExist = tools && tools.length;
    const toolGroups =
      areToolsExist &&
      tools
        .map((tool, i) => {
          if (Array.isArray(tool)) {
            return {
              tools: [...tool],
              id: i
            };
          }
          return null;
        })
        .filter(tool => tool !== null);

    return toolGroups && toolGroups.length > 0 ? toolGroups : [];
  };

  renderGroupTools = () => {
    const { options } = this.props;
    const toolGroups = this.getToolGroups();

    return (
      <React.Fragment>
        {toolGroups.map((toolGroup, i) => (
          <Col md={12} marginBottom="40px" key={`${i}-${Math.random().toString(36)}`}>
            <ToolSubTitle data-cy="toolSubTitle">
              {`Group ${i + 1}`}
              <DeleteButton
                width="18px"
                height="18px"
                marginLeft="10px"
                deleteToolStyles={{ width: 18, height: 18, marginLeft: 10 }}
                onDelete={() => {
                  this.deleteGroup(toolGroup.id);
                }}
              />
            </ToolSubTitle>

            {toolGroup.tools.map((innerTool, innerIndex) => (
              <React.Fragment key={`${i}-${innerIndex}-${Math.random().toString(36)}`}>
                <ToolSelect>
                  <Tool
                    countOfSingleTools={toolGroup.tools.length}
                    value={innerTool}
                    options={options}
                    selectWidth="100%"
                    index={innerIndex}
                    isGroup
                    groupIndex={toolGroup.id}
                    onDelete={this.deleteTool}
                    onChange={this.handleSelect}
                  />
                </ToolSelect>
              </React.Fragment>
            ))}

            <AddToolBtnWrapper>{this.renderAddToolBtn(toolGroup.id)}</AddToolBtnWrapper>
          </Col>
        ))}
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Row gutter={60}>
          {this.renderSingleToolsInDefaultGroup()}
          {this.renderGroupTools()}
        </Row>

        <Row gutter={60}>
          <Col marginBottom="0px" md={24}>
            {this.renderAddGroupBtn()}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

GraphToolsParams.propTypes = {
  toolbar: PropTypes.object,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

GraphToolsParams.defaultProps = {
  toolbar: {
    default_tool: "",
    tools: [],
    options: []
  }
};

const Tool = props => {
  const {
    countOfSingleTools,
    options,
    isGroup,
    groupIndex,
    value,
    onChange,
    selectWidth,
    index,
    onDelete,
    deleteToolStyles
  } = props;

  const isNeedToShowDeleteButton = () => countOfSingleTools > 1 || isGroup;

  const onSelectChange = val => {
    onChange(index, val, groupIndex);
  };

  return (
    <React.Fragment>
      <SelectWrapper>
        <Select
          data-cy="graphToolSelect"
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

        {isNeedToShowDeleteButton() && (
          <DeleteButton
            onDelete={() => {
              onDelete(index, groupIndex);
            }}
            deleteToolStyles={deleteToolStyles}
          />
        )}
      </SelectWrapper>
    </React.Fragment>
  );
};

Tool.propTypes = {
  countOfSingleTools: PropTypes.number.isRequired,
  options: PropTypes.array.isRequired,
  isGroup: PropTypes.bool,
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
  groupIndex: undefined,
  isGroup: false
};

export default GraphToolsParams;
