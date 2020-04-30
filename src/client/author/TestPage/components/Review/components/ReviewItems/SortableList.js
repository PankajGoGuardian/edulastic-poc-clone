import { Collapse } from "antd";
import React from "react";
import { SortableContainer } from "react-sortable-hoc";
import SortableItem from "./SortableItem";
import { InfoDiv, Text, Count, GroupCollapse } from "./styled";

const { Panel } = Collapse;

const rightContent = group => {
  const totalItems = group.items.length;
  return (
    <InfoDiv>
      <Text>TOTAL ITEMS</Text>
      <Count>{totalItems}</Count>
    </InfoDiv>
  );
};

export default SortableContainer(({ items, isEditable, itemGroups, isPublishers, ...rest }) => {
  return (
    <div>
      {isPublishers ? (
        <GroupCollapse defaultActiveKey={["0"]} expandIconPosition="right">
          {itemGroups.map((group, count) => (
            <Panel header={`Group ${count + 1}: ${group.groupName}`} key={count} extra={rightContent(group)}>
              {items.map(
                (item, index) =>
                  item.main.groupId == group._id && (
                    <SortableItem
                      key={`item-${index}`}
                      disabled={!isEditable}
                      isEditable={isEditable}
                      index={index}
                      item={item}
                      {...rest}
                    />
                  )
              )}
            </Panel>
          ))}
        </GroupCollapse>
      ) : (
        items.map((item, index) => (
          <SortableItem
            key={`item-${index}`}
            disabled={!isEditable}
            isEditable={isEditable}
            index={index}
            item={item}
            {...rest}
          />
        ))
      )}
    </div>
  );
});
