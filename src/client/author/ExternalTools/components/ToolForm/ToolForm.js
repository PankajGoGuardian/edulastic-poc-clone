import React, { useState } from "react";
import { Row, Col, Icon, Select } from "antd";
import { StyledColRight, StyledRow, StyledListItem, StyledSelect, StyledLabel, StyledInput, FormItem } from "./styled";
import { EduButton } from "@edulastic/common";
import { has } from "lodash";

export const ToolForm = ({ data, deleteData, onChangeData, onSaveData }) => {
  const [active, setActive] = useState(!has(data, "_id"));
  const [isEditable, setIsEditable] = useState(!has(data, "_id"));

  const getPrivacyOptions = () => {
    return [
      <Select.Option value={1}>Do not send any user information</Select.Option>,
      <Select.Option value={2}>Only send name of the user who launches the tool</Select.Option>,
      <Select.Option value={3}>Only send Email/Username of user who launches the tool</Select.Option>,
      <Select.Option value={4}>Send Name and Email/Username of user who launches the tool</Select.Option>
    ];
  };

  const getConfigTypeOptions = () => {
    return [<Select.Option value="manual">Manual</Select.Option>, <Select.Option value="url">URL/XML</Select.Option>];
  };

  const getMatchByOptions = () => {
    return [<Select.Option value="domain">Domain</Select.Option>, <Select.Option value="url">URL</Select.Option>];
  };

  const setActiveOnEdit = () => {
    setIsEditable(true);
    setActive(true);
  };

  const onSave = () => {
    setIsEditable(false);
    setActive(false);
    onSaveData(data);
  };

  const onCloseItem = () => {
    if (active) {
      setIsEditable(false);
      setActive(false);
    } else {
      setActive(true);
    }
  };

  return (
    <StyledListItem>
      <div style={{ width: "100%" }}>
        <StyledRow style={{ height: "40px" }}>
          <Col span={12}>
            {isEditable ? (
              <StyledInput
                value={data.toolName}
                placeholder="Type the Tool Name"
                onChange={e => onChangeData("toolName", e.target.value)}
              />
            ) : (
              <h4 style={{ marginLeft: "10px" }}>{data.toolName}</h4>
            )}
          </Col>
          <StyledColRight span={12}>
            {!isEditable && <Icon type="edit" theme="filled" onClick={() => setActiveOnEdit()} />}
            <Icon type="delete" theme="filled" onClick={() => deleteData(data._id)} />
            <Icon type={active ? "up" : "down"} theme="outlined" onClick={() => onCloseItem()} />
          </StyledColRight>
        </StyledRow>
        {active ? (
          <div style={{ width: "50%", margin: "10px auto" }}>
            <Row>
              <Col span={24}>
                <FormItem>
                  <Col span={10}>
                    <StyledLabel>Consumer Key:</StyledLabel>
                  </Col>
                  <StyledInput
                    disabled={!isEditable}
                    value={data.settings.consumerKey}
                    onChange={e => onChangeData("settings.consumerKey", e.target.value)}
                  />
                </FormItem>
                <FormItem>
                  <Col span={10}>
                    <StyledLabel>Shared Secret:</StyledLabel>
                  </Col>
                  <StyledInput
                    disabled={!isEditable}
                    value={data.settings.sharedSecret}
                    onChange={e => onChangeData("settings.sharedSecret", e.target.value)}
                  />
                </FormItem>
                <FormItem>
                  <Col span={10}>
                    <StyledLabel>Privacy:</StyledLabel>
                  </Col>
                  <StyledSelect
                    disabled={!isEditable}
                    value={data.settings.privacy}
                    onChange={value => onChangeData("settings.privacy", value)}
                  >
                    {getPrivacyOptions()}
                  </StyledSelect>
                  {/* <StyledInput value={data.privacy} onChange={(e) => onChangeData("privacy", e.target.value)}/> */}
                </FormItem>
                <FormItem>
                  <Col span={10}>
                    <StyledLabel>Configuration Type:</StyledLabel>
                  </Col>
                  <StyledSelect
                    disabled={!isEditable}
                    value={data.settings.configurationType}
                    onChange={value => onChangeData("settings.configurationType", value)}
                  >
                    {getConfigTypeOptions()}
                  </StyledSelect>
                  {/* <StyledInput value={data.configurationType} onChange={(e) => onChangeData("configurationType", e.target.value)} /> */}
                </FormItem>
                <FormItem>
                  <Col span={10}>
                    <StyledLabel>Match By:</StyledLabel>
                  </Col>
                  <StyledSelect
                    disabled={!isEditable}
                    value={data.settings.matchBy}
                    onChange={value => onChangeData("settings.matchBy", value)}
                  >
                    {getMatchByOptions()}
                  </StyledSelect>
                  {/* <StyledInput value={data.matchBy} onChange={(e) => onChangeData("matchBy", e.target.value)} /> */}
                </FormItem>
                <FormItem>
                  <Col span={10}>
                    <StyledLabel>Domain/URL:</StyledLabel>
                  </Col>
                  <StyledInput
                    disabled={!isEditable}
                    value={data.settings.domain}
                    onChange={e => onChangeData("settings.domain", e.target.value)}
                  />
                </FormItem>
                <FormItem>
                  <Col span={10}>
                    <StyledLabel>Custom Parameters:</StyledLabel>
                  </Col>
                  <StyledInput
                    disabled={!isEditable}
                    value={data.settings.customParams}
                    onChange={e => onChangeData("settings.customParams", e.target.value)}
                  />
                </FormItem>
                {isEditable && (
                  <FormItem>
                    <Col style={{ display: "flex", justifyContent: "center" }} span={24}>
                      <EduButton height="40px" isGhost onClick={() => onSave()}>
                        SAVE
                      </EduButton>
                    </Col>
                  </FormItem>
                )}
              </Col>
            </Row>
          </div>
        ) : null}
      </div>
    </StyledListItem>
  );
};
