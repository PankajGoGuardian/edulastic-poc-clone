import { Collapse } from "antd";
import React from "react";
import { SortableContainer } from "react-sortable-hoc";
import { roleuser } from "@edulastic/constants";
import SortableItem from "./SortableItem";
import { InfoDiv, Text, Count, GroupCollapse } from "./styled";

const { Panel } = Collapse;

const rightContent = group => {
  const { deliverItemsCount, items } = group;
  return (
    <>
      <InfoDiv>
        <Text>TOTAL ITEMS</Text>
        <Count>{items.length}</Count>
      </InfoDiv>
      <InfoDiv>
        <Text>Item to Deliver</Text>
        <Count>{deliverItemsCount || items.length}</Count>
      </InfoDiv>
    </>
  );
};

export default SortableContainer(
  ({ items, isEditable, itemGroups, isPublishers, userRole, isPowerPremiumAccount, ...rest }) => {
    const showGroups =
      isPublishers ||
      ([roleuser.DISTRICT_ADMIN, roleuser.SCHOOL_ADMIN, roleuser.TEACHER].includes(userRole) && isPowerPremiumAccount);
    return (
      <div>
        {showGroups ? (
          <GroupCollapse defaultActiveKey={["0"]} expandIconPosition="right">
            {itemGroups.map((group, count) => (
              <Panel header={group.groupName} key={count} extra={rightContent(group)}>
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
  }
);
