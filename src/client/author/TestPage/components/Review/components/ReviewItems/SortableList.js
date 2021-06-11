import { Collapse } from 'antd'
import { get, isArray } from 'lodash'
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
        removeMultiple(get(removalObj, 'items'))
      } else {
        removeSingle(get(removalObj, 'removalId'))
      }
      setRemovalPassageItems(null)
    }

    const handleClosePassageConfirm = () => {
      setRemovalPassageItems(null)
    }

    const renderItem = (item, index, groupId) => {
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
            groupId={groupId}
            showGroupsPanel={showGroupsPanel}
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
    }

    return (
      <>
        {!!removalObj && (
          <PassageConfirmationModal
            removing
            visible={!!removalObj}
            closeModal={handleClosePassageConfirm}
            itemsCount={get(removalObj, 'items', []).length}
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
                    item.groupId == group._id &&
                    renderItem(item, index, group._id)
                )}
              </Panel>
            ))}
          </GroupCollapse>
        ) : (
          items.map((item, index) => renderItem(item, index))
        )}
      </>
    )
  }
)
