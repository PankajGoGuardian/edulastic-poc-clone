import { Collapse, Tooltip } from 'antd'
import { IconSectionsCalculator } from '@edulastic/icons'
import { isArray } from 'lodash'
import React, { useState } from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { darkGrey5 } from '@edulastic/colors'
import { SortableGroupItem, SortableSingleItem } from './SortableItem'
import { InfoDiv, Text, Count, GroupCollapse } from './styled'
import PassageConfirmationModal from '../../../PassageConfirmationModal/PassageConfirmationModal'
import { compose } from 'redux'
import { connect } from 'react-redux'

const { Panel } = Collapse

const rightContent = (
  group,
  hasSections = false,
  isDynamicTest,
  isEditable,
  refreshGroupItems,
  itemGroupIndex
) => {
  const {
    deliverItemsCount,
    items,
    settings,
    deliveryType,
    itemsDefaultMaxScore,
    type,
  } = group

  const refreshSection = (e) => {
    e.stopPropagation()
    refreshGroupItems(itemGroupIndex)
  }

  return (
    <>
      {/* 
        when any calc is selected for a section, the calc Icon and tooltip 
        will be displayed. Add a condition hasSections for the same. 
      */}
      <EduIf condition={type === ITEM_GROUP_TYPES.AUTOSELECT && isEditable}>
        <InfoDiv>
          <Tooltip
            title="Replaces current items with a new set."
          >
            <span onClick={refreshSection}>
              <IconReloadCircle />
            </span>
          </Tooltip>
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
          isDynamicTest &&
          deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
        }
      >
        <InfoDiv>
          <Text>TOTAL POINTS</Text>
          <Count>{deliverItemsCount * (itemsDefaultMaxScore || 1)}</Count>
        </InfoDiv>
      </EduIf>
    </>
  )
}

const ReviewSection = ({
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
  setShowAutoSelectScoreChangeModal,
  isDynamicTest,
  refreshGroupItems,
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

  const renderItem = (item, index, group) => {

    const {
      _id: groupId,
      deliveryType,
    } = (group || {});

    const enableScoreEditingForEntireSection = 
      isDynamicTest && deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM && isEditable;

      const openScoreEditPopup = () => {
        setShowAutoSelectScoreChangeModal(groupId)
      }

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
          removeItem={handleDelete(item)}
          onSortEnd={onSortGroup(index)}
          lockToContainerEdges
          lockOffset={['10%', '10%']}
          setShowAutoSelectScoreChangeModal={enableScoreEditingForEntireSection ? openScoreEditPopup : undefined}
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
        setShowAutoSelectScoreChangeModal={enableScoreEditingForEntireSection ? openScoreEditPopup : undefined}
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
          {itemGroups.map((group, index) => (
            <Panel
              header={<span dataCy={group.groupName}>{group.groupName}</span>}
              key={index}
              extra={rightContent(
                group,
                hasSections,
                isDynamicTest,
                isEditable,
                refreshGroupItems,
                index
              )}
            >
              {items.map((item, _index) => {
                // EV-38941: here item can be an object or array of objects
                if (isArray(item)) {
                  const currentGroupItems = (item || []).filter(
                    (_item) => _item.groupId === group._id
                  )
                  if (currentGroupItems?.length) {
                    return renderItem(currentGroupItems, _index, group)
                  }
                  return null
                }
                if (item.groupId == group._id) {
                  return renderItem(item, _index, group)
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

const enhance = compose(
  SortableContainer,
  connect((state) => ({
    isDynamicTest: isDynamicTestSelector(state),
  }))
)

export default enhance(ReviewSection)
