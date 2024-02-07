import { Collapse, Tooltip } from 'antd'
import { IconRedo, IconSectionsCalculator } from '@edulastic/icons'
import { isArray } from 'lodash'
import React, { useState } from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { darkGrey5 } from '@edulastic/colors'
import { EduButton, EduIf } from '@edulastic/common'
import {
  ITEM_GROUP_DELIVERY_TYPES,
  ITEM_GROUP_TYPES,
} from '@edulastic/constants/const/test'
import { SortableGroupItem, SortableSingleItem } from './SortableItem'
import { InfoDiv, Text, Count, GroupCollapse } from './styled'
import PassageConfirmationModal from '../../../PassageConfirmationModal/PassageConfirmationModal'

const { Panel } = Collapse

const rightContent = (group, hasSections = false, refreshGroupItems) => {
  const {
    deliverItemsCount,
    items,
    settings,
    type,
    deliveryType,
    itemsDefaultMaxScore,
  } = group
  return (
    <>
      {/* 
        when any calc is selected for a section, the calc Icon and tooltip 
        will be displayed. Add a condition hasSections for the same. 
      */}
      <EduIf
        condition={
          type === ITEM_GROUP_TYPES.AUTOSELECT &&
          deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
        }
      >
        <InfoDiv>
          <EduButton
            onClick={(e) => {
              e.stopPropagation()
              refreshGroupItems()
            }}
          >
            <IconRedo />
          </EduButton>
        </InfoDiv>
      </EduIf>
      {hasSections && settings?.calcTypes?.length > 0 && (
        <Tooltip title={settings.calcTypes.join()}>
          <span>
            <IconSectionsCalculator width="30" height="44" color={darkGrey5} />
          </span>
        </Tooltip>
      )}
      <InfoDiv hasSections={hasSections} data-cy="sectionItemCount">
        <Text>TOTAL ITEMS</Text>
        <Count>{items.length}</Count>
      </InfoDiv>
      {!hasSections && (
        <InfoDiv>
          <Text>Item to Deliver</Text>
          <Count>{deliverItemsCount || items.length}</Count>
        </InfoDiv>
      )}
      <EduIf
        condition={
          type === ITEM_GROUP_TYPES.AUTOSELECT &&
          deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
        }
      >
        <InfoDiv>
          <Text>TOTAL POINTS</Text>
          <Count>
            {(deliverItemsCount || items.length) * (itemsDefaultMaxScore || 1)}
          </Count>
        </InfoDiv>
      </EduIf>
    </>
  )
}

export default SortableContainer(
  ({
    items,
    isEditable,
    itemGroups,
    refreshGroupItems,
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

    const renderItem = (item, index, groupId, itemsDefaultMaxScore) => {
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
            collection={groupId}
            groupId={groupId}
            showGroupsPanel={showGroupsPanel}
            itemsDefaultMaxScore={itemsDefaultMaxScore}
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
          collection={groupId}
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
                header={<span dataCy={group.groupName}>{group.groupName}</span>}
                key={count}
                extra={rightContent(group, hasSections, () =>
                  refreshGroupItems(count)
                )}
              >
                {items.map((item, index) => {
                  // EV-38941: here item can be an object or array of objects
                  if (isArray(item)) {
                    const currentGroupItems = (item || []).filter(
                      (_item) => _item.groupId === group._id
                    )
                    if (currentGroupItems?.length) {
                      return renderItem(
                        currentGroupItems,
                        index,
                        group._id,
                        group.itemsDefaultMaxScore
                      )
                    }
                    return null
                  }
                  if (item.groupId == group._id) {
                    return renderItem(
                      item,
                      index,
                      group._id,
                      group.itemsDefaultMaxScore
                    )
                  }
                  return null
                })}
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
