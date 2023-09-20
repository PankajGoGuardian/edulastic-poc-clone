import { Collapse, Tooltip } from 'antd'
import { IconSectionsCalculator } from '@edulastic/icons'
import { isArray } from 'lodash'
import React, { useState } from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { SortableGroupItem, SortableSingleItem } from './SortableItem'
import { InfoDiv, Text, Count, GroupCollapse } from './styled'
import PassageConfirmationModal from '../../../PassageConfirmationModal/PassageConfirmationModal'
import { REMAINING_SECTION_NAME } from '../../../../ducks'
import SectionControls from './SectionControls'

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
    </>
  )
}

const RemainingItems = ({
  remainingSection,
  renderItem,
  handleAddSections,
}) => (
  <div style={{ marginTop: '15px' }}>
    <p
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}
    >
      <b>Remaining Questions({remainingSection?.items?.length})</b>
      <SectionControls handleAddSections={handleAddSections} />
    </p>

    <div>
      {remainingSection?.items?.map((item, index) =>
        renderItem({ ...item, indx: index + 9 }, index, remainingSection._id)
      )}
    </div>
  </div>
)

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
    handleAddSections,
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
          <>
            <GroupCollapse
              defaultActiveKey={groupIndexWithoutRestrictedContent}
              expandIconPosition="right"
            >
              {itemGroups
                .filter(
                  (section) => section.groupName !== REMAINING_SECTION_NAME
                )
                .map((group, count) => (
                  <Panel
                    header={
                      <span dataCy={group.groupName}>{group.groupName}</span>
                    }
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
            <RemainingItems
              remainingSection={itemGroups.find(
                (section) => section.groupName === REMAINING_SECTION_NAME
              )}
              renderItem={renderItem}
              handleAddSections={handleAddSections}
            />
          </>
        ) : (
          items.map((item, index) => renderItem(item, index))
        )}
      </>
    )
  }
)
