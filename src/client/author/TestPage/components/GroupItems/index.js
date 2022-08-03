import { testItemsApi } from '@edulastic/api'
import { EduButton, notification, RadioBtn, RadioGrp } from '@edulastic/common'
import { test as testConstants } from '@edulastic/constants'
import { IconInfo, IconPencilEdit } from '@edulastic/icons'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Collapse, Select, Tooltip } from 'antd'
import { intersection, isEmpty, keyBy, maxBy, pick } from 'lodash'
import nanoid from 'nanoid'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import StandardsSelect from '../../../../assessment/containers/QuestionMetadata/StandardsSelect'
import Breadcrumb from '../../../src/components/Breadcrumb'
import { getCollectionsSelector } from '../../../src/selectors/user'
import {
  addNewGroupAction,
  deleteItemsGroupAction,
  getAllTagsAction,
  getAllTagsSelector,
  getStaticGroupItemIds,
  getTestEntitySelector,
  NewGroup,
  setTestDataAction,
  updateGroupDataAction,
} from '../../ducks'
import { removeTestItemsAction } from '../AddItems/ducks'
import selectsData from '../common/selectsData'
import {
  AutoSelectFields,
  BreadcrumbContainer,
  Container,
  ContentBody,
  CreateGroupWrapper,
  GroupField,
  Heading,
  ItemTag,
  Label,
  PanelHeading,
  QuestionTagsContainer,
  QuestionTagsWrapper,
  RadioMessage,
  SelectWrapper,
  PanelStyled,
} from './styled'
import TypeConfirmModal from './TypeConfirmModal'
import ItemCountWrapperContainer from './ItemCountWrapperContainer'

const { ITEM_GROUP_TYPES, ITEM_GROUP_DELIVERY_TYPES } = testConstants

const GroupItems = ({
  match,
  updateGroupData,
  addNewGroup,
  getAllTags,
  allTagsData,
  collections,
  removeTestItems,
  deleteItemsGroup,
  test,
  setTestData,
  history,
  currentGroupIndex,
  setCurrentGroupIndex,
}) => {
  const [editGroupDetail, setEditGroupDetails] = useState({})
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmModalCategory, setConfirmModalCategory] = useState(null)
  const [fetchingItems, setFetchingItems] = useState(false)
  const [deleteGroupIndex, setDeleteGroupIndex] = useState(null)
  const [activePanels, setActivePanels] = useState([])

  const breadcrumbData = [
    {
      title: 'TESTS',
      to: '/author/tests',
    },
    {
      title: 'ADD SECTIONS',
      to: '',
    },
  ]

  const collectionData = collections.map((o) => ({
    text: o.name,
    value: o._id,
    type: o.type,
  }))

  useEffect(() => {
    setActivePanels(test.itemGroups.map((_, i) => (i + 1).toString()))
    getAllTags({ type: 'testitem' })
  }, [])

  const handleSelectItems = () => {
    // validate if no section is being edited
    if (currentGroupIndex !== null) {
      notification({
        messageKey: 'pleaseSaveTheChangesMadeToGroupFirst',
      })
    } else {
      const addItemsUrl = match.params?.id
        ? `/author/tests/tab/addItems/id/${match.params.id}`
        : '/author/tests/create/addItems'
      history.push(addItemsUrl)
    }
  }

  const handleChange = (fieldName, value) => {
    let updatedGroupData = { ...editGroupDetail }
    if (fieldName === 'type') {
      updatedGroupData = {
        ...updatedGroupData,
        items: [],
        type:
          updatedGroupData.type === ITEM_GROUP_TYPES.STATIC
            ? ITEM_GROUP_TYPES.AUTOSELECT
            : ITEM_GROUP_TYPES.STATIC,
        deliveryType:
          updatedGroupData.type === ITEM_GROUP_TYPES.STATIC
            ? ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM
            : ITEM_GROUP_DELIVERY_TYPES.ALL,
      }
    } else if (fieldName === 'deliverItemsCount') {
      if (
        updatedGroupData.type === ITEM_GROUP_TYPES.STATIC &&
        value >= updatedGroupData.items.length
      ) {
        notification({ messageKey: 'totalItemsToBeDelivered' })
        return
      }
      if (
        updatedGroupData.type === ITEM_GROUP_TYPES.AUTOSELECT &&
        value > 100
      ) {
        notification({
          messageKey: 'totalItemsToBeDeliveredCannotBeMOreThan100',
        })
        return
      }
      updatedGroupData = {
        ...updatedGroupData,
        [fieldName]: value,
      }
    } else if (fieldName === 'deliveryType') {
      if (
        updatedGroupData.type === ITEM_GROUP_TYPES.STATIC &&
        value === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        updatedGroupData.items.length < 2
      ) {
        notification({ messageKey: 'pleaseSelectAtleastTwoItems' })
        return
      }
      updatedGroupData = {
        ...updatedGroupData,
        [fieldName]: value,
      }
    } else if (fieldName === 'tags') {
      const allTagsKeyById = keyBy(allTagsData, '_id')
      updatedGroupData = {
        ...updatedGroupData,
        [fieldName]: value.map((tagId) => allTagsKeyById[tagId]),
      }
    } else {
      updatedGroupData = {
        ...updatedGroupData,
        [fieldName]: value,
      }
    }

    if (updatedGroupData.type === ITEM_GROUP_TYPES.STATIC) {
      let extraPick = []
      if (
        [
          ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM,
          ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM,
        ].includes(updatedGroupData.deliveryType)
      )
        extraPick = ['deliverItemsCount']
      updatedGroupData = pick(updatedGroupData, [
        'type',
        'groupName',
        'items',
        'deliveryType',
        'index',
        '_id',
        ...extraPick,
      ])
    }
    setEditGroupDetails(updatedGroupData)
  }

  const handleTypeSelect = (groupIndex) => {
    let showModal = false
    const {
      type,
      items,
      collectionDetails,
      standardDetails,
      dok,
      tags,
      difficulty,
    } = editGroupDetail

    if (type === ITEM_GROUP_TYPES.STATIC && items.length > 0) {
      showModal = true
    } else if (
      type === ITEM_GROUP_TYPES.AUTOSELECT &&
      (collectionDetails ||
        standardDetails ||
        dok ||
        tags?.length ||
        difficulty)
    ) {
      showModal = true
    }
    if (showModal) {
      setConfirmModalCategory('TYPE')
      setShowConfirmModal(true)
      return setCurrentGroupIndex(groupIndex)
    }
    return handleChange('type', '')
  }

  const handleConfirmResponse = (value) => {
    if (value === 'YES') {
      if (confirmModalCategory === 'TYPE') handleChange('type', '')
      else {
        const currentGroup = test.itemGroups[deleteGroupIndex]
        deleteItemsGroup(currentGroup.groupName)
        removeTestItems(currentGroup.items.map((i) => i._id))
        setDeleteGroupIndex(null)
      }
    }
    setConfirmModalCategory(null)
    setShowConfirmModal(false)
  }

  const handleDeleteGroup = (e, index) => {
    e.stopPropagation()
    setDeleteGroupIndex(index)
    setConfirmModalCategory('DELETE GROUP')
    setShowConfirmModal(true)
  }

  const handleAddGroup = () => {
    if (test.itemGroups.length === 15) {
      notification({ type: 'warn', messageKey: 'cantCreateMoreThan15Groups' })
      return
    }
    const { index } = maxBy(test.itemGroups, 'index')
    const data = {
      ...NewGroup,
      _id: nanoid(),
      groupName: `SECTION ${index + 2}`,
      index: index + 1,
    }
    addNewGroup(data)
    setActivePanels([...activePanels, (test.itemGroups.length + 1).toString()])
  }

  const checkDuplicateGroup = (collectionId, standardDetails) => {
    const duplicateGroup = test.itemGroups.find(
      (g, index) =>
        index !== currentGroupIndex &&
        g.collectionDetails?._id === collectionId &&
        intersection(
          standardDetails.standards.map((std) => std.standardId),
          g.standardDetails?.standards.map((std) => std.standardId)
        ).length
    )
    if (duplicateGroup) {
      notification({
        type: 'warn',
        msg: `The combination already exists in ${duplicateGroup.groupName}`,
      })
      return true
    }
    return false
  }

  const handleStandardsChange = (standardDetails) => {
    const { collectionDetails } = editGroupDetail
    if (
      collectionDetails &&
      standardDetails &&
      checkDuplicateGroup(collectionDetails._id, standardDetails)
    )
      return
    handleChange('standardDetails', standardDetails)
  }

  const handleCollectionChange = (collectionId) => {
    const { value: _id, text: name, type } = collectionData.find(
      (d) => d.value === collectionId
    )
    const { standardDetails } = editGroupDetail
    if (standardDetails) {
      const isDuplicate = checkDuplicateGroup(collectionId, standardDetails)
      if (isDuplicate) return
    }
    handleChange('collectionDetails', { _id, name, type })
  }

  const handleEditGroup = (e, itemGroup, index) => {
    if (activePanels.includes((index + 1).toString())) e.stopPropagation()
    setEditGroupDetails(itemGroup)
    setCurrentGroupIndex(index)
  }

  const validateGroup = () => {
    let isValid = true
    if (editGroupDetail.type === ITEM_GROUP_TYPES.STATIC) {
      const { deliveryType, deliverItemsCount } = editGroupDetail
      if (
        deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        !deliverItemsCount
      ) {
        notification({ messageKey: 'pleaseEnterTotalNumberOfItems' })
        isValid = false
      }
    } else {
      const {
        collectionDetails,
        standardDetails,
        deliverItemsCount,
      } = editGroupDetail
      if (!collectionDetails || isEmpty(standardDetails?.standards)) {
        notification({
          messageKey: 'eachAutoselectGroupShouldHaveAStandardAndCollection',
        })
        isValid = false
      }
      if (isValid && !deliverItemsCount) {
        notification({ messageKey: 'pleaseEnterTotalNumberOfItems' })
        isValid = false
      }
    }
    return isValid
  }

  const saveGroupToTest = () => {
    const oldGroupData = test.itemGroups[currentGroupIndex]
    let updatedGroupData = { ...editGroupDetail }
    if (editGroupDetail.type === ITEM_GROUP_TYPES.AUTOSELECT) {
      removeTestItems(oldGroupData.items.map((i) => i._id))
      updatedGroupData = { ...updatedGroupData, items: [] }
    } else if (
      editGroupDetail.type === ITEM_GROUP_TYPES.STATIC &&
      oldGroupData.type === ITEM_GROUP_TYPES.AUTOSELECT
    ) {
      updatedGroupData = { ...updatedGroupData, items: [] }
    }
    if (
      updatedGroupData.deliveryType ===
        ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
      updatedGroupData.items.some((item) => item.itemLevelScoring === false)
    ) {
      notification({ type: 'warn', messageKey: 'allItemsInsideLimited' })
      return
    }
    const disableAnswerOnPaper =
      updatedGroupData.deliveryType ===
        ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM ||
      updatedGroupData.type === ITEM_GROUP_TYPES.AUTOSELECT
    if (test.answerOnPaper && disableAnswerOnPaper) {
      setTestData({ answerOnPaper: false })
      notification({
        type: 'warn',
        messageKey: 'answerOnPaperIsNotSupportedForAutoselecteGroup',
      })
    }
    updateGroupData({ updatedGroupData, groupIndex: currentGroupIndex })
    setCurrentGroupIndex(null)
    setEditGroupDetails({})
    setFetchingItems(false)
  }

  const handleSaveGroup = async () => {
    if (!validateGroup()) {
      return
    }
    if (editGroupDetail.type === ITEM_GROUP_TYPES.STATIC) {
      return saveGroupToTest()
    }
    const optionalFields = {
      depthOfKnowledge: editGroupDetail.dok,
      authorDifficulty: editGroupDetail.difficulty,
      tags: editGroupDetail.tags?.map((tag) => tag.tagName) || [],
    }
    Object.keys(optionalFields).forEach(
      (key) => optionalFields[key] === undefined && delete optionalFields[key]
    )
    const data = {
      limit: editGroupDetail.deliverItemsCount,
      search: {
        collectionId: editGroupDetail.collectionDetails._id,
        standardIds: editGroupDetail.standardDetails.standards.map(
          (std) => std.standardId
        ),
        ...optionalFields,
      },
    }
    if (data.limit > 100) {
      notification({ messageKey: 'maximum100Questions' })
      return
    }
    setFetchingItems(true)

    const allStaticGroupItemIds = getStaticGroupItemIds(test)
    testItemsApi
      .getAutoSelectedItems({
        ...data,
        search: { ...data.search, nInItemIds: allStaticGroupItemIds },
      })
      .then((res) => {
        const { items, total } = res
        if (items.length === 0) {
          notification({ messageKey: 'noItemsFoundForCurrentCombination' })
          return
        }
        if (total < data.limit) {
          return notification({
            msg: `There are only ${total} items that meet the search criteria`,
          })
        }
        saveGroupToTest()
      })
      .catch((err) => {
        notification({ msg: err.message || 'Failed to fetch test items' })
      })
    setFetchingItems(false)
  }

  const handleCancel = () => {
    setCurrentGroupIndex(null)
    setEditGroupDetails({})
  }

  return (
    <Container>
      {showConfirmModal && (
        <TypeConfirmModal
          visible={showConfirmModal}
          handleResponse={handleConfirmResponse}
          confirmModalCategory={confirmModalCategory}
          groupName={test.itemGroups[currentGroupIndex]?.groupName}
        />
      )}
      <BreadcrumbContainer>
        <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
      </BreadcrumbContainer>
      <CreateGroupWrapper>
        <Heading>
          ITEM DELIVERY SECTIONS&nbsp;
          <Tooltip title="Within each section, select specific instructions for what you want included. You can have one section or create multiple sections.">
            <IconInfo />
          </Tooltip>
        </Heading>
        <Collapse
          activeKey={activePanels}
          onChange={(panels) => setActivePanels(panels)}
        >
          {test.itemGroups.map((itemGroup, index) => {
            const editingDeliveryType =
              editGroupDetail.type === ITEM_GROUP_TYPES.STATIC
                ? ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
                : ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM
            const currentDeliveryType =
              itemGroup.type === ITEM_GROUP_TYPES.STATIC
                ? ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
                : ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM
            return (
              <PanelStyled
                header={[
                  <PanelHeading>
                    <Label fontWeight="600">{itemGroup.groupName}</Label>
                    <div>
                      {currentGroupIndex !== index && (
                        <div
                          title="Edit"
                          onClick={(e) => handleEditGroup(e, itemGroup, index)}
                        >
                          <IconPencilEdit />
                        </div>
                      )}
                      {test.itemGroups.length > 1 && (
                        <div
                          title="Delete"
                          onClick={(e) => handleDeleteGroup(e, index)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </div>
                      )}
                    </div>
                  </PanelHeading>,
                ]}
                key={index + 1}
              >
                <ContentBody data-cy={`group-${itemGroup.groupName}`}>
                  <GroupField>
                    <RadioGrp
                      name="radiogroup"
                      value={
                        currentGroupIndex === index
                          ? editGroupDetail.type
                          : itemGroup.type
                      }
                      onChange={() => handleTypeSelect(index)}
                      disabled={currentGroupIndex !== index}
                    >
                      <RadioBtn
                        data-cy={`check-group-type-${itemGroup.groupName}`}
                        defaultChecked={false}
                        value={ITEM_GROUP_TYPES.AUTOSELECT}
                      >
                        <Tooltip title="Set the parameters for what you’d like to include in this section, and we will find and add the items for you.">
                          AUTO SELECT ITEMS BASED ON STANDARDS
                        </Tooltip>
                      </RadioBtn>
                      <Tooltip title="Choose the items you’d like to include yourself! Then indicate how many you’d like included in the final version of the assessment.">
                        <RadioBtn
                          defaultChecked
                          value={ITEM_GROUP_TYPES.STATIC}
                        >
                          MANUAL SELECT ITEMS FROM ITEM BANK
                        </RadioBtn>
                      </Tooltip>
                    </RadioGrp>
                  </GroupField>
                  {(currentGroupIndex === index &&
                    editGroupDetail.type === ITEM_GROUP_TYPES.STATIC) ||
                  (currentGroupIndex !== index &&
                    itemGroup.type === ITEM_GROUP_TYPES.STATIC) ? (
                    <GroupField>
                      <Label>Items *</Label>
                      <QuestionTagsWrapper>
                        <QuestionTagsContainer
                          data-cy={`item-container-${itemGroup.groupName}`}
                        >
                          {(currentGroupIndex === index
                            ? editGroupDetail.items
                            : itemGroup.items
                          )
                            .map(({ _id }) =>
                              _id.substring(_id.length, _id.length - 6)
                            )
                            .map((id) => (
                              <ItemTag>{id}</ItemTag>
                            ))}
                        </QuestionTagsContainer>
                        <EduButton
                          height="40px"
                          isGhost
                          onClick={handleSelectItems}
                        >
                          Select Items
                        </EduButton>
                      </QuestionTagsWrapper>
                    </GroupField>
                  ) : (
                    <AutoSelectFields>
                      <SelectWrapper width="200px">
                        <Label>Collection *</Label>
                        <Select
                          data-cy={`collection-${itemGroup.groupName}`}
                          size="default"
                          placeholder="Select Collection"
                          onChange={(value) =>
                            handleCollectionChange(value, index)
                          }
                          value={
                            currentGroupIndex === index
                              ? editGroupDetail.collectionDetails?._id
                              : itemGroup.collectionDetails?._id
                          }
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode
                          }
                          disabled={currentGroupIndex !== index}
                        >
                          {collectionData.map((el) => (
                            <Select.Option
                              key={el.value}
                              value={el.value}
                              data-cy={`${itemGroup.groupName} ${el.text}`}
                            >
                              {el.text}
                            </Select.Option>
                          ))}
                        </Select>
                      </SelectWrapper>
                      <SelectWrapper width="200px">
                        <Label>Standards *</Label>
                        <StandardsSelect
                          onChange={handleStandardsChange}
                          preventInput
                          standardDetails={
                            currentGroupIndex === index
                              ? editGroupDetail.standardDetails
                              : itemGroup.standardDetails
                          }
                          disabled={currentGroupIndex !== index}
                        />
                      </SelectWrapper>
                      <SelectWrapper width="200px">
                        <Label>Depth of knowledge</Label>
                        <Select
                          data-cy="selectDOK"
                          placeholder="Select DOK"
                          size="default"
                          onSelect={(value) => handleChange('dok', value)}
                          value={
                            currentGroupIndex === index
                              ? editGroupDetail.dok
                              : itemGroup.dok
                          }
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode
                          }
                          disabled={currentGroupIndex !== index}
                        >
                          {selectsData.allDepthOfKnowledge.map((el, _index) => (
                            <Select.Option
                              key={el.value}
                              value={el.value}
                              data-cy={`${itemGroup.groupName} ${el.text}`}
                            >
                              {`${_index > 0 ? _index : ''} ${el.text}`}
                            </Select.Option>
                          ))}
                        </Select>
                      </SelectWrapper>
                      <SelectWrapper width="200px">
                        <Label>Difficulty</Label>
                        <Select
                          placeholder="Select one"
                          data-cy="selectDifficulty"
                          size="default"
                          onSelect={(value) =>
                            handleChange('difficulty', value)
                          }
                          value={
                            currentGroupIndex === index
                              ? editGroupDetail.difficulty
                              : itemGroup.difficulty
                          }
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode
                          }
                          disabled={currentGroupIndex !== index}
                        >
                          {selectsData.allAuthorDifficulty.map((el) => (
                            <Select.Option
                              key={el.value}
                              value={el.value}
                              data-cy={`${itemGroup.groupName} ${el.text}`}
                            >
                              {el.text}
                            </Select.Option>
                          ))}
                        </Select>
                      </SelectWrapper>
                      <SelectWrapper width="200px">
                        <Label>Tags</Label>
                        <Select
                          showArrow
                          mode="multiple"
                          data-cy="selectTags"
                          size="default"
                          onChange={(value) => handleChange('tags', value)}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          value={
                            currentGroupIndex === index
                              ? editGroupDetail.tags?.map((tag) => tag._id) ||
                                []
                              : itemGroup.tags?.map((tag) => tag._id) || []
                          }
                          disabled={currentGroupIndex !== index}
                        >
                          {allTagsData.map((el) => (
                            <Select.Option
                              key={el._id}
                              value={el._id}
                              data-cy={`${itemGroup.groupName} ${el.tagName}`}
                            >
                              {el.tagName}
                            </Select.Option>
                          ))}
                        </Select>
                      </SelectWrapper>
                    </AutoSelectFields>
                  )}
                  <GroupField>
                    <RadioGrp
                      name="radiogroup"
                      value={
                        currentGroupIndex === index
                          ? editGroupDetail.deliveryType
                          : itemGroup.deliveryType
                      }
                      onChange={(e) =>
                        handleChange('deliveryType', e.target.value)
                      }
                      disabled={currentGroupIndex !== index}
                    >
                      {((currentGroupIndex === index &&
                        editGroupDetail.type === ITEM_GROUP_TYPES.STATIC) ||
                        (currentGroupIndex !== index &&
                          itemGroup.type === ITEM_GROUP_TYPES.STATIC)) && (
                        <>
                          <RadioBtn
                            data-cy={`check-deliver-all-${itemGroup.groupName}`}
                            defaultChecked
                            value={ITEM_GROUP_DELIVERY_TYPES.ALL}
                          >
                            Deliver all Items in this Section
                          </RadioBtn>

                          <RadioMessage>
                            Use this option to deliver a specific number of
                            randomly picked question per Section.
                          </RadioMessage>

                          <RadioBtn
                            data-cy={`check-deliver-bycount-${itemGroup.groupName}`}
                            defaultChecked={false}
                            value={
                              currentGroupIndex === index
                                ? editingDeliveryType
                                : currentDeliveryType
                            }
                          >
                            <ItemCountWrapperContainer
                              handleChange={handleChange}
                              editGroupDetail={editGroupDetail}
                              currentGroupIndex={currentGroupIndex}
                              index={index}
                              itemGroup={itemGroup}
                            />
                          </RadioBtn>
                        </>
                      )}
                    </RadioGrp>
                    {((currentGroupIndex === index &&
                      editGroupDetail.type === ITEM_GROUP_TYPES.AUTOSELECT) ||
                      (currentGroupIndex !== index &&
                        itemGroup.type === ITEM_GROUP_TYPES.AUTOSELECT)) && (
                      <span
                        data-cy={`check-deliver-bycount-${itemGroup.groupName}`}
                        value={
                          currentGroupIndex === index
                            ? editingDeliveryType
                            : currentDeliveryType
                        }
                        style={{ disabled: true }}
                      >
                        <ItemCountWrapperContainer
                          handleChange={handleChange}
                          editGroupDetail={editGroupDetail}
                          currentGroupIndex={currentGroupIndex}
                          index={index}
                          itemGroup={itemGroup}
                          isRequired
                        />
                      </span>
                    )}
                  </GroupField>
                  <GroupField style={{ display: 'flex' }} marginBottom="5px">
                    {currentGroupIndex === index && (
                      <>
                        <EduButton
                          loading={fetchingItems}
                          data-cy={`save-${itemGroup.groupName}`}
                          onClick={(e) => {
                            handleSaveGroup()
                            e.target.blur()
                          }}
                        >
                          Save
                        </EduButton>
                        <EduButton
                          isGhost
                          loading={fetchingItems}
                          onClick={(e) => {
                            handleCancel()
                            e.target.blur()
                          }}
                        >
                          Cancel
                        </EduButton>
                      </>
                    )}
                  </GroupField>
                </ContentBody>
              </PanelStyled>
            )
          })}
        </Collapse>
        <GroupField style={{ marginTop: '15px', marginLeft: '45%' }}>
          {currentGroupIndex === null && (
            <button
              type="button"
              data-cy="add-group"
              onClick={handleAddGroup}
              style={{
                paddingBlock: '12px',
                borderRadius: '7px',
                borderColor: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} aria-hidden="true" />
              &nbsp;&nbsp;&nbsp;&nbsp;ADD SECTION
            </button>
          )}
        </GroupField>
      </CreateGroupWrapper>
    </Container>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      allTagsData: getAllTagsSelector(state, 'testitem'),
      collections: getCollectionsSelector(state),
      test: getTestEntitySelector(state),
    }),
    {
      updateGroupData: updateGroupDataAction,
      addNewGroup: addNewGroupAction,
      getAllTags: getAllTagsAction,
      removeTestItems: removeTestItemsAction,
      deleteItemsGroup: deleteItemsGroupAction,
      setTestData: setTestDataAction,
    }
  )
)

export default enhance(GroupItems)
