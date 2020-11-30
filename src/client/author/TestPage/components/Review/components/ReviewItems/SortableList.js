import { Collapse } from 'antd'
import { isArray } from 'lodash'
import React, { useState } from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { SortableGroupItem, SortableSingleItem } from './SortableItem'
import { InfoDiv, Text, Count, GroupCollapse } from './styled'
import PassageConfirmationModal from '../../../PassageConfirmationModal/PassageConfirmationModal'

const { Panel } = Collapse

const rightContent = (group) => {
  const { deliverItemsCount, items } = group
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
  )
}

export default SortableContainer(
  ({
    items,
    isEditable,
    itemGroups,
    isPublishers,
    userRole,
    isPowerPremiumAccount,
    showGroupsPanel,
    onSortGroup,
    removeSingle,
    removeMultiple,
    ...rest
  }) => {
    const [removalObj, setRemovalPassageItems] = useState()
    const handleDelete = (item) => (removalId) => {
      if (isArray(item)) {
        setRemovalPassageItems({ items: item.map((x) => x._id), removalId })
      } else {
        removeSingle(removalId)
      }
    }

    const handlePassageItemsConfirm = (value) => {
      if (value) {
        removeMultiple(removalObj.items)
      } else {
        removeSingle(removalObj.removalId)
      }
      setRemovalPassageItems(null)
    }

    const handleClosePassageConfirm = () => {
      setRemovalPassageItems(null)
    }

    return (
      <>
        {!!removalObj && (
          <PassageConfirmationModal
            removing
            visible={!!removalObj}
            closeModal={handleClosePassageConfirm}
            itemsCount={removalObj.items.length}
            handleResponse={handlePassageItemsConfirm}
          />
        )}
        {showGroupsPanel ? (
          <GroupCollapse defaultActiveKey={['0']} expandIconPosition="right">
            {itemGroups.map((group, count) => (
              <Panel
                header={group.groupName}
                key={count}
                extra={rightContent(group)}
              >
                {items.map(
                  (item, index) =>
                    item.main.groupId == group._id && (
                      <SortableSingleItem
                        key={`item-${index}`}
                        disabled={!isEditable}
                        isEditable={isEditable}
                        removeItem={handleDelete(item)}
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
          items.map((item, index) => {
            if (isArray(item)) {
              // when use index or item._id for a key, the SortableGroupItem was unmounted
              // so there was a page blinking bug, when drag and drop
              // for now, will use passageId for a key
              return (
                <SortableGroupItem
                  {...rest}
                  key={item[0].passageId}
                  disabled={!isEditable}
                  isEditable={isEditable}
                  items={item}
                  index={index}
                  removeItem={handleDelete(item)}
                  onSortEnd={onSortGroup(index)}
                  lockToContainerEdges
                  lockOffset={['10%', '10%']}
                />
              )
            }
            return (
              <SortableSingleItem
                {...rest}
                key={item._id}
                removeItem={handleDelete(item)}
                disabled={!isEditable}
                isEditable={isEditable}
                index={index}
                item={item}
              />
            )
          })
        )}
      </>
    )
  }
)
