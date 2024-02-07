import React, { useMemo } from 'react'
import { Spin } from 'antd'
import produce from 'immer'
import { flatten, isArray, omit } from 'lodash'
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
  removeSingle,
  removeMultiple,
  onCompleteMoveItem,
  // moveTestItems,
  setSelected,
  selected,
  questions,
  getContainer,
  isPublishers,
  isFetchingAutoselectItems = false,
  userRole,
  blur,
  isPowerPremiumAccount,
  showGroupsPanel,
  isTestsUpdated,
  orgCollections,
  userId,
  hasSections,
  refreshGroupItems,
  setShowAutoSelectScoreChangeModal,
  setCurrentGroupIndex,
}) => {
  const container = getContainer()
  if (!container) return null

  const handleCheckboxChange = (itemId, checked) => {
    if (checked) {
      setSelected([...selected, itemId])
    } else {
      const newSelected = selected.filter((id) => id !== itemId)
      setSelected(newSelected)
    }
  }

  const itemsWithIndex = useMemo(() => {
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

    return reIndexItems(items)
  }, [items])

  const moveSingleItems = ({ oldIndex, newIndex }) => {
    const updatedItems = flatten(
      produce(itemsWithIndex, (draft) => {
        const [removed] = draft.splice(oldIndex, 1)
        draft.splice(newIndex, 0, removed)
      })
    ).map((x) => omit(x, ['indx', 'selected']))
    onCompleteMoveItem(updatedItems)
  }

  const moveGroupItems = (groupIndex) => ({ oldIndex, newIndex }) => {
    const updatedItems = flatten(
      produce(itemsWithIndex, (draft) => {
        const [removed] = draft[groupIndex].splice(oldIndex, 1)
        draft[groupIndex].splice(newIndex, 0, removed)
      })
    ).map((x) => omit(x, ['indx', 'selected']))
    onCompleteMoveItem(updatedItems)
  }

  return (
    <StyledSpinnerContainer>
      <Spin spinning={isFetchingAutoselectItems}>
        <SortableList
          items={itemsWithIndex}
          useDragHandle
          passagesKeyed={passagesKeyed}
          onChangePoints={onChangePoints}
          blur={blur}
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
          removeSingle={removeSingle}
          removeMultiple={removeMultiple}
          getContainer={getContainer}
          itemGroups={itemGroups}
          refreshGroupItems={refreshGroupItems}
          isPublishers={isPublishers}
          userRole={userRole}
          isPowerPremiumAccount={isPowerPremiumAccount}
          showGroupsPanel={showGroupsPanel}
          scoring={scoring}
          userFeatures={userFeatures}
          standards={standards}
          isTestsUpdated={isTestsUpdated}
          orgCollections={orgCollections}
          userId={userId}
          hasSections={hasSections}
          setShowAutoSelectScoreChangeModal={setShowAutoSelectScoreChangeModal}
          setCurrentGroupIndex={setCurrentGroupIndex}
        />
      </Spin>
    </StyledSpinnerContainer>
  )
}

export default ReviewItems
