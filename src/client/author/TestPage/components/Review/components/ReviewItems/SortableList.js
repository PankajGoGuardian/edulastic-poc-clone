import { Collapse, Tooltip } from 'antd'
import { IconSectionsCalculator } from '@edulastic/icons'
import { isArray } from 'lodash'
import React, { useState } from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { SortableGroupItem, SortableSingleItem } from './SortableItem'
import { InfoDiv, Text, Count, GroupCollapse } from './styled'
import PassageConfirmationModal from '../../../PassageConfirmationModal/PassageConfirmationModal'

const { Panel } = Collapse

const rightContent = (group, hasSections = false) => {
  const { deliverItemsCount, items, settings } = group
  return (
    <>
      {/* 
        when any calc is selected for a section, the calc Icon and tooltip 
        will be displayed. Add a condition hasSections for the same. 
      */}
      {hasSections && settings?.calcTypes?.length > 0 && (
        <Tooltip title={settings.calcTypes.join()}>
          <span>
            <IconSectionsCalculator width="30" height="44" />
          </span>
        </Tooltip>
      )}
      <InfoDiv hasSections={hasSections}>
        <Text>TOTAL ITEMS</Text>
        <Count>{items.length}</Count>
      </InfoDiv>
      {!hasSections && (
        <InfoDiv>
          <Text>Item to Deliver</Text>
          <Count>{deliverItemsCount || items.length}</Count>
        </InfoDiv>
      )}
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
    hasSections,
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
          isPublishers={isPublishers}
        />
      )
    }

    const groupIndexWithoutRestrictedContent = []
    for (const [groupIndex, group] of Object.entries(itemGroups)) {
      if (!group.premiumContentRestriction) {
        groupIndexWithoutRestrictedContent.push(groupIndex)
        break
      }
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
          <GroupCollapse
            defaultActiveKey={groupIndexWithoutRestrictedContent}
            expandIconPosition="right"
          >
            {itemGroups.map((group, count) => (
              <Panel
                header={group.groupName}
                key={count}
                extra={rightContent(group, hasSections)}
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
