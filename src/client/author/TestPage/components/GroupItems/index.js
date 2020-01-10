import React, { useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { last } from "lodash";
import { withRouter } from "react-router-dom";
import {
  Container,
  BreadcrumbContainer,
  Heading,
  ContentBody,
  CreateGroupWrapper,
  GroupField,
  Label,
  RadioGroup,
  ItemCountWrapper,
  AddGroupButton,
  RadioMessage,
  SelectItemsButton,
  QuestionTagsWrapper,
  QuestionTagsContainer,
  SelectWrapper,
  AutoSelectFields,
  DoneButton,
  Footer,
  ItemTag
} from "./styled";
import { Checkbox, Input, Radio, Select, Collapse } from "antd";
import Breadcrumb from "../../../src/components/Breadcrumb";
import { updateGroupDataAction, addNewGroupAction } from "../../ducks";
import { themeColor } from "@edulastic/colors";

const GroupItems = ({ groupIndex = 1, switchToAddItems, match, test, updateGroupData, addNewGroup }) => {
  const { Panel } = Collapse;

  const deafultGroupData = {
    type: "STATIC",
    groupName: `Group ${groupIndex}`,
    items: [],
    deliveryType: "ALL",
    deliverItemsCount: 1
  };

  const breadcrumbData = [
    {
      title: "TESTS LIBRARY",
      to: "/author/tests"
    },
    {
      title: "ADD ITEMS",
      to: match.path,
      onClick: switchToAddItems
    },
    {
      title: "QUESTION DELIVERY GROUPS",
      to: ""
    }
  ];

  const handleChange = (fieldName, value, groupIndex) => {
    let updatedGroupData = { ...test.itemGroups[groupIndex] };
    if (fieldName === "type") {
      updatedGroupData = { ...updatedGroupData, type: value ? "AUTOSELECT" : "STATIC" };
    } else {
      updatedGroupData = {
        ...updatedGroupData,
        [fieldName]: value
      };
    }
    updateGroupData({ updatedGroupData, groupIndex });
  };

  const handleAddGroup = () => {
    const groupName = `Group ${parseInt(last(test.itemGroups).groupName.split(" ")[1]) + 1}`;
    const data = {
      ...deafultGroupData,
      groupName
    };
    addNewGroup(data);
  };

  return (
    <Container>
      <BreadcrumbContainer>
        <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
      </BreadcrumbContainer>
      <CreateGroupWrapper>
        <Heading>Advanced Items selection options</Heading>
        <Collapse accordion bordered={false} defaultActiveKey="1">
          {test.itemGroups.map((itemGroup, index) => (
            <Panel header={[<Label fontWeight="600">{itemGroup.groupName}</Label>]} key={index + 1}>
              <ContentBody>
                <GroupField>
                  <Checkbox
                    checked={itemGroup.type === "AUTOSELECT"}
                    //disabled={true}
                    onChange={e => handleChange("type", e.target.checked, index)}
                  >
                    AUTO SELECT ITEMS BASED ON STANDARDS
                  </Checkbox>
                </GroupField>
                {itemGroup.type === "STATIC" ? (
                  <GroupField>
                    <Label>Items</Label>
                    <QuestionTagsWrapper>
                      <QuestionTagsContainer>
                        {itemGroup.items
                          .map(({ _id }) => _id.substring(_id.length, _id.length - 6))
                          .map(id => (
                            <ItemTag>{id}</ItemTag>
                          ))}
                      </QuestionTagsContainer>
                      <SelectItemsButton onClick={switchToAddItems}>Select Items</SelectItemsButton>
                    </QuestionTagsWrapper>
                  </GroupField>
                ) : (
                  <AutoSelectFields>
                    <SelectWrapper width="197px">
                      <Label>Collection</Label>
                      <Select />
                    </SelectWrapper>
                    <SelectWrapper width="247px">
                      <Label>Standards</Label>
                      <Select />
                    </SelectWrapper>
                    <SelectWrapper width="175px">
                      <Label>Depth of knowledge</Label>
                      <Select />
                    </SelectWrapper>
                    <SelectWrapper width="114px">
                      <Label>Tags</Label>
                      <Select />
                    </SelectWrapper>
                    <SelectWrapper width="150px">
                      <Label>Difficulty</Label>
                      <Select />
                    </SelectWrapper>
                    <SelectWrapper width="80px">
                      <Label>Count</Label>
                      <Input />
                    </SelectWrapper>
                  </AutoSelectFields>
                )}
                <GroupField>
                  <RadioGroup
                    name="radiogroup"
                    value={itemGroup.deliveryType}
                    onChange={e => handleChange("deliveryType", e.target.value, index)}
                  >
                    <Radio defaultChecked value="ALL">
                      Deliver all Items in this section
                    </Radio>
                    <RadioMessage>
                      Use this option to deliver a specific number of randomly picked question per section.
                    </RadioMessage>
                    <Radio defaultChecked={false} value="LIMITED">
                      <ItemCountWrapper>
                        <span>Deliver a total of </span>
                        <Input
                          type="number"
                          disabled={itemGroup.deliveryType === "ALL"}
                          min={1}
                          value={itemGroup.deliverItemsCount}
                          onChange={e => handleChange("deliverItemsCount", e.target.value, index)}
                          max={itemGroup.items.length}
                        />
                        <span>
                          {" "}
                          Items out of <span style={{ color: themeColor }}>{itemGroup.items.length}</span> Items in this
                          section.
                        </span>
                      </ItemCountWrapper>
                    </Radio>
                  </RadioGroup>
                </GroupField>
              </ContentBody>
            </Panel>
          ))}
        </Collapse>
        <GroupField>
          <AddGroupButton onClick={handleAddGroup}>Add Group</AddGroupButton>
        </GroupField>
        <Footer>
          <DoneButton onClick={switchToAddItems}>Done</DoneButton>
        </Footer>
      </CreateGroupWrapper>
    </Container>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({}),
    { updateGroupData: updateGroupDataAction, addNewGroup: addNewGroupAction }
  )
);

export default enhance(GroupItems);
