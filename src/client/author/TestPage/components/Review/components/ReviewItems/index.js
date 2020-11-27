import React, { useMemo } from 'react'
import { Spin } from 'antd'
import produce from 'immer'
import { flatten, groupBy, isArray, omit } from 'lodash'
import SortableList from './SortableList'
import { StyledSpinnerContainer } from './styled'

const ReviewItems = ({
  items,
  itemGroups,
  standards,
  userFeatures,
  isEditable,
  isCollapse,
  passagesKeyed,
  isSmallSize,
  rows,
  scoring,
  owner,
  onChangePoints,
  handlePreview,
  removeTestItem,
  onCompleteMoveItem,
  // moveTestItems,
  setSelected,
  selected,
  questions,
  getContainer,
  isPublishers,
  isFetchingAutoselectItems = false,
  userRole,
  isPowerPremiumAccount,
  showGroupsPanel,
}) => {
  const container = getContainer()
  if (!container) return null

  const handleCheckboxChange = (index, checked) => {
    if (checked) {
      setSelected([...selected, index])
    } else {
      const newSelected = selected.filter((item) => item !== index)
      setSelected(newSelected)
    }
  }

  const groupedItems = useMemo(() => {
    const groupByPassageId = groupBy(items, 'passageId')
    const _items = items
      .map((item) => {
        if (!item.passageId) {
          return item
        }
        const grouped = groupByPassageId[item.passageId]
        delete groupByPassageId[item.passageId]

        if (grouped && grouped.length <= 1) {
          return item
        }

        return grouped
      })
      .filter((x) => !!x)

    let indx = 0
    const reIndexItems = (ite) => {
      return ite.map((x) => {
        if (isArray(x)) {
          return reIndexItems(x)
        }
        indx++
        return { ...x, indx }
      })
    }

    return reIndexItems(_items)
  }, [items])

  const moveSingleItems = ({ oldIndex, newIndex }) => {
    const updatedItems = flatten(
      produce(groupedItems, (draft) => {
        const [removed] = draft.splice(oldIndex, 1)
        draft.splice(newIndex, 0, removed)
      })
    ).map((x) => omit(x, ['indx', 'selected']))
    onCompleteMoveItem(updatedItems)
  }

  const moveGroupItems = (groupIndex) => ({ oldIndex, newIndex }) => {
    const updatedItems = flatten(
      produce(groupedItems, (draft) => {
        const [removed] = draft[groupIndex].splice(oldIndex, 1)
        draft[groupIndex].splice(newIndex, 0, removed)
      })
    ).map((x) => omit(x, ['indx', 'selected']))
    onCompleteMoveItem(updatedItems)
  }

  return (
    <>
      <SortableList
        items={groupedItems}
        useDragHandle
        passagesKeyed={passagesKeyed}
        onChangePoints={onChangePoints}
        handlePreview={handlePreview}
        isEditable={isEditable}
        isCollapse={isCollapse}
        mobile={!isSmallSize}
        owner={owner}
        onSortEnd={moveSingleItems}
        onSortGroup={moveGroupItems}
        lockToContainerEdges
        lockOffset={['10%', '10%']}
        onSelect={handleCheckboxChange}
        selected={selected}
        questions={questions}
        rows={rows}
        removeItem={removeTestItem}
        getContainer={getContainer}
        itemGroups={itemGroups}
        isPublishers={isPublishers}
        userRole={userRole}
        isPowerPremiumAccount={isPowerPremiumAccount}
        showGroupsPanel={showGroupsPanel}
        scoring={scoring}
        userFeatures={userFeatures}
        standards={standards}
      />

      {isFetchingAutoselectItems && (
        <StyledSpinnerContainer>
          <Spin />
        </StyledSpinnerContainer>
      )}
    </>
  )
}

export default ReviewItems
