import { testItemsApi } from '@edulastic/api'
import { EduButton, notification, RadioBtn, RadioGrp } from '@edulastic/common'
import { test as testConstants } from '@edulastic/constants'
import { IconInfo, IconPencilEdit } from '@edulastic/icons'
import { lightRed2 } from '@edulastic/colors'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Collapse, Select, Tooltip, Spin } from 'antd'
import { intersection, isEmpty, keyBy, maxBy, pick, uniq, omit } from 'lodash'
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
  NewGroupAutoselect,
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
  SectionNameInput,
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
  currentGroupDetails,
  setCurrentGroupDetails,
  groupNotEdited,
  setGroupNotEdited,
  validateGroups,
  handleSaveTest,
}) => {
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
    const groupNamesFromTest = uniq(
      test.itemGroups
        .filter((g, i) => i !== currentGroupIndex)
        .map((g) => `${g.groupName || ''}`.toLowerCase())
    )
    if (!currentGroupDetails.groupName?.length) {
      notification({ messageKey: 'pleaseEnterGroupName' })
      return
    }
    if (
      groupNamesFromTest.includes(
        (currentGroupDetails.groupName || '').toLowerCase()
      )
    ) {
      notification({ messageKey: 'pleaseEnterUniqueGroupName' })
      return
    }
    // update the itemGroup corresponding to the current group being edited
    updateGroupData({
      updatedGroupData: currentGroupDetails,
      groupIndex: currentGroupIndex,
    })
    // switch to "Add Items" section
    const addItemsUrl = match.params?.id
      ? `/author/tests/tab/addItems/id/${match.params.id}`
      : '/author/tests/create/addItems'
    history.push(addItemsUrl)
  }

  const handleChange = (fieldName, value) => {
    let updatedGroupData = { ...currentGroupDetails }
    // set groupNotEdited for the first edit made to groups
    if (groupNotEdited) {
      setGroupNotEdited(false)
    }
    if (fieldName === 'type') {
      // for radio button, value is empty and data is toggled
      updatedGroupData =
        currentGroupDetails.type === ITEM_GROUP_TYPES.AUTOSELECT
          ? {
              ...currentGroupDetails,
              ...omit(NewGroup, ['index', 'groupName']),
            }
          : {
              ...currentGroupDetails,
              ...omit(NewGroupAutoselect, ['index', 'groupName']),
            }
    } else if (fieldName === 'deliverItemsCount') {
      if (value < 0) {
        notification({
          messageKey: 'totalItemsToBeDeliveredCannotBeLessThanZero',
        })
        return
      }
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
      // for radio button, value is empty and data is toggled
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
      ) {
        extraPick = ['deliverItemsCount']
      }
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
    // update current group being edited, test itemGroup will be synced on save
    setCurrentGroupDetails(updatedGroupData)
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
    } = currentGroupDetails

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
      if (confirmModalCategory === 'TYPE') {
        handleChange('type', '')
      } else if (confirmModalCategory === 'DELETE GROUP') {
        const groupToDelete = test.itemGroups[deleteGroupIndex]
        // deleteItemsGroup => deletes the group and updates the index for remaining
        deleteItemsGroup(groupToDelete.groupName)
        // removeTestItems => removes selected test items for the deleted group
        removeTestItems(groupToDelete.items.map((i) => i._id))
        // if the group being edited is deleted, reset the edit details
        if (currentGroupIndex === deleteGroupIndex) {
          setCurrentGroupIndex(null)
          setCurrentGroupDetails({})
        } else if (currentGroupIndex > deleteGroupIndex) {
          // if the edited group is positioned after the group being deleted
          // currentGroupIndex needs to be updated for the same by a factor of -1
          setCurrentGroupIndex(currentGroupIndex - 1)
        } else {
          // currentGroupIndex < deleteGroupIndex
          // no change required
        }
        setDeleteGroupIndex(null)
        // NOTE: test is not saved after this removal
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
    if (!validateGroups()) {
      return
    }
    if (test.itemGroups.length === 15) {
      notification({ type: 'warn', messageKey: 'cantCreateMoreThan15Groups' })
      return
    }
    const groupNamesFromTest = test.itemGroups.map((g) =>
      `${g.groupName || ''}`.toLowerCase()
    )
    const { index } = maxBy(test.itemGroups, 'index')
    let groupName = `SECTION ${index + 2}`
    for (
      let i = index + 3;
      groupNamesFromTest.includes(groupName.toLowerCase());
      i++
    ) {
      groupName = `SECTION ${i}`
    }
    const data = {
      ...NewGroupAutoselect,
      _id: nanoid(),
      groupName,
      index: index + 1,
    }
    addNewGroup(data)
    setActivePanels([...activePanels, (test.itemGroups.length + 1).toString()])
    // make the newly created section active
    setCurrentGroupIndex(test.itemGroups.length)
    setCurrentGroupDetails(data)
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
    const { collectionDetails } = currentGroupDetails
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
    const { standardDetails } = currentGroupDetails
    if (standardDetails) {
      const isDuplicate = checkDuplicateGroup(collectionId, standardDetails)
      if (isDuplicate) return
    }
    handleChange('collectionDetails', { _id, name, type })
  }

  const handleEditGroup = (e, itemGroup, index) => {
    if (activePanels.includes((index + 1).toString())) e.stopPropagation()
    setCurrentGroupDetails(itemGroup)
    setCurrentGroupIndex(index)
  }

  const validateGroup = (index) => {
    const {
      type,
      groupName = '',
      items,
      collectionDetails,
      standardDetails,
      deliveryType,
      deliverItemsCount,
    } = currentGroupDetails
    const groupNamesFromTest = uniq(
      test.itemGroups
        .filter((g, i) => i !== index)
        .map((g) => `${g.groupName || ''}`.toLowerCase())
    )
    if (!groupName.length) {
      notification({ messageKey: 'pleaseEnterGroupName' })
      return false
    }
    if (groupNamesFromTest.includes(groupName.toLowerCase())) {
      notification({ messageKey: 'pleaseEnterUniqueGroupName' })
      return false
    }
    if (type === ITEM_GROUP_TYPES.STATIC) {
      // validations for static item groups
      if (!items.length) {
        notification({
          messageKey: 'eachStaticGroupShouldContainAtleastOneItems',
        })
        return false
      }
      if (
        deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        !deliverItemsCount
      ) {
        notification({ messageKey: 'pleaseEnterTotalNumberOfItems' })
        return false
      }
      if (
        deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        items.length <= deliverItemsCount
      ) {
        notification({ type: 'warn', messageKey: 'totalItemsToBeDelivered' })
        return false
      }
    } else {
      // validations for autoselect item groups
      if (!collectionDetails || isEmpty(standardDetails?.standards)) {
        notification({
          messageKey: 'eachAutoselectGroupShouldHaveAStandardAndCollection',
        })
        return false
      }
      if (!deliverItemsCount) {
        notification({ messageKey: 'pleaseEnterTotalNumberOfItems' })
        return false
      }
    }
    return true
  }

  const saveGroupToTest = () => {
    const oldGroupData = test.itemGroups[currentGroupIndex]
    let updatedGroupData = { ...currentGroupDetails }
    if (currentGroupDetails.type === ITEM_GROUP_TYPES.AUTOSELECT) {
      removeTestItems(oldGroupData.items.map((i) => i._id))
      updatedGroupData = { ...updatedGroupData, items: [] }
    } else if (
      currentGroupDetails.type === ITEM_GROUP_TYPES.STATIC &&
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
    setCurrentGroupDetails({}, () => {
      // do after state has been updated.
      handleSaveTest()
    })
  }

  const handleSaveGroup = async (index) => {
    if (!validateGroup(index)) {
      return
    }
    if (currentGroupDetails.type === ITEM_GROUP_TYPES.STATIC) {
      return saveGroupToTest()
    }
    const optionalFields = {
      depthOfKnowledge: currentGroupDetails.dok,
      authorDifficulty: currentGroupDetails.difficulty,
      tags: currentGroupDetails.tags?.map((tag) => tag.tagName) || [],
    }
    Object.keys(optionalFields).forEach(
      (key) => optionalFields[key] === undefined && delete optionalFields[key]
    )
    const data = {
      limit: currentGroupDetails.deliverItemsCount,
      search: {
        collectionId: currentGroupDetails.collectionDetails._id,
        standardIds: currentGroupDetails.standardDetails.standards.map(
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
    await testItemsApi
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
    setCurrentGroupDetails({})
  }

  return (
    <Container>
      {fetchingItems && <Spin size="large" style={{ zIndex: 2000 }} />}
      {showConfirmModal && (
        <TypeConfirmModal
          visible={showConfirmModal}
          handleResponse={handleConfirmResponse}
          confirmModalCategory={confirmModalCategory}
          groupName={
            test.itemGroups?.[
              confirmModalCategory === 'TYPE'
                ? currentGroupIndex
                : deleteGroupIndex
            ]?.groupName
          }
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
              currentGroupDetails.type === ITEM_GROUP_TYPES.STATIC
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
                    {currentGroupIndex !== index ? (
                      <Label
                        fontWeight="600"
                        data-cy={`sectionName-${itemGroup.groupName}`}
                      >
                        {itemGroup.groupName}
                      </Label>
                    ) : (
                      <SectionNameInput
                        data-cy="sectionNameInput"
                        type="text"
                        placeholder="Provide a section name (upto 50 characters)"
                        maxLength={50}
                        value={
                          currentGroupIndex === index
                            ? currentGroupDetails.groupName
                            : itemGroup.groupName
                        }
                        onClick={(e) => {
                          // Stops the collapsible click event when clicked on input box
                          e.stopPropagation()
                        }}
                        onChange={(e) =>
                          handleChange('groupName', e.target.value)
                        }
                      />
                    )}
                    <div>
                      {currentGroupIndex !== index && (
                        <div
                          data-cy={`editSection-${itemGroup.groupName}`}
                          title="edit"
                          onClick={(e) => handleEditGroup(e, itemGroup, index)}
                        >
                          <IconPencilEdit />
                        </div>
                      )}
                      {test.itemGroups.length > 1 && (
                        <div
                          title="Delete"
                          data-cy={`deleteSection-${itemGroup.groupName}`}
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
                          ? currentGroupDetails.type
                          : itemGroup.type
                      }
                      onChange={() => handleTypeSelect(index)}
                      disabled={currentGroupIndex !== index}
                    >
                      <RadioBtn
                        data-cy={`autoSelect-${itemGroup.groupName}`}
                        defaultChecked
                        value={ITEM_GROUP_TYPES.AUTOSELECT}
                      >
                        <Tooltip
                          title={
                            <span>
                              Set the parameters for what you’d like to include
                              in this section, and <b>SmartBuild</b> will find
                              and add the items for you.
                            </span>
                          }
                        >
                          AUTO SELECT ITEMS BASED ON STANDARDS
                        </Tooltip>
                      </RadioBtn>
                      <Tooltip title="Choose the items you’d like to include yourself! Then indicate how many you’d like included in the final version of the assessment.">
                        <RadioBtn
                          value={ITEM_GROUP_TYPES.STATIC}
                          data-cy={`static-${itemGroup.groupName}`}
                        >
                          MANUAL SELECT ITEMS FROM ITEM BANK
                        </RadioBtn>
                      </Tooltip>
                    </RadioGrp>
                  </GroupField>
                  {(currentGroupIndex === index &&
                    currentGroupDetails.type === ITEM_GROUP_TYPES.STATIC) ||
                  (currentGroupIndex !== index &&
                    itemGroup.type === ITEM_GROUP_TYPES.STATIC) ? (
                    <GroupField>
                      <Label>Items *</Label>
                      <QuestionTagsWrapper>
                        <QuestionTagsContainer
                          data-cy={`item-container-${itemGroup.groupName}`}
                        >
                          {(currentGroupIndex === index
                            ? currentGroupDetails.items
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
                          disabled={currentGroupIndex !== index}
                          data-cy={`selectItemButton-${itemGroup.groupName}`}
                        >
                          Select Items
                        </EduButton>
                      </QuestionTagsWrapper>
                    </GroupField>
                  ) : (
                    <AutoSelectFields>
                      <SelectWrapper width="200px">
                        <Label>
                          Collection <span style={{ color: lightRed2 }}>*</span>
                        </Label>
                        <Select
                          data-cy={`collection-${itemGroup.groupName}`}
                          size="default"
                          placeholder="Select Collection"
                          onChange={(value) =>
                            handleCollectionChange(value, index)
                          }
                          value={
                            currentGroupIndex === index
                              ? currentGroupDetails.collectionDetails?._id
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
                      <SelectWrapper
                        width="200px"
                        data-cy={`selectStd-${itemGroup.groupName}`}
                      >
                        <Label>
                          Standards <span style={{ color: lightRed2 }}>*</span>
                        </Label>
                        <StandardsSelect
                          onChange={handleStandardsChange}
                          preventInput
                          standardDetails={
                            currentGroupIndex === index
                              ? currentGroupDetails.standardDetails
                              : itemGroup.standardDetails
                          }
                          disabled={currentGroupIndex !== index}
                        />
                      </SelectWrapper>
                      <SelectWrapper width="200px">
                        <Label>Depth of knowledge</Label>
                        <Select
                          data-cy={`selectDOK-${itemGroup.groupName}`}
                          placeholder="Select DOK"
                          size="default"
                          onSelect={(value) => handleChange('dok', value)}
                          value={
                            currentGroupIndex === index
                              ? currentGroupDetails.dok
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
                          data-cy={`selectDifficulty-${itemGroup.groupName}`}
                          size="default"
                          onSelect={(value) =>
                            handleChange('difficulty', value)
                          }
                          value={
                            currentGroupIndex === index
                              ? currentGroupDetails.difficulty
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
                          data-cy={`selectTags-${itemGroup.groupName}`}
                          size="default"
                          onChange={(value) => handleChange('tags', value)}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          value={
                            currentGroupIndex === index
                              ? currentGroupDetails.tags?.map(
                                  (tag) => tag._id
                                ) || []
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
                          ? currentGroupDetails.deliveryType
                          : itemGroup.deliveryType
                      }
                      onChange={(e) =>
                        handleChange('deliveryType', e.target.value)
                      }
                      disabled={currentGroupIndex !== index}
                    >
                      {((currentGroupIndex === index &&
                        currentGroupDetails.type === ITEM_GROUP_TYPES.STATIC) ||
                        (currentGroupIndex !== index &&
                          itemGroup.type === ITEM_GROUP_TYPES.STATIC)) && (
                        <>
                          <RadioBtn
                            data-cy={`check-deliver-all-${itemGroup.groupName}`}
                            defaultChecked
                            value={ITEM_GROUP_DELIVERY_TYPES.ALL}
                            vertical
                            mb="10px"
                          >
                            Deliver all Items in this Section
                          </RadioBtn>
                          <RadioBtn
                            data-cy={`check-deliver-bycount-${itemGroup.groupName}`}
                            defaultChecked={false}
                            value={
                              currentGroupIndex === index
                                ? editingDeliveryType
                                : currentDeliveryType
                            }
                            vertical
                          >
                            <ItemCountWrapperContainer
                              handleChange={handleChange}
                              currentGroupDetails={currentGroupDetails}
                              currentGroupIndex={currentGroupIndex}
                              index={index}
                              itemGroup={itemGroup}
                            />
                          </RadioBtn>
                          <RadioMessage marginLeft="27px">
                            Use this to deliver a specific number of randomly
                            picked question per Section.
                          </RadioMessage>
                        </>
                      )}
                    </RadioGrp>
                    {((currentGroupIndex === index &&
                      currentGroupDetails.type ===
                        ITEM_GROUP_TYPES.AUTOSELECT) ||
                      (currentGroupIndex !== index &&
                        itemGroup.type === ITEM_GROUP_TYPES.AUTOSELECT)) && (
                      <>
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
                            currentGroupDetails={currentGroupDetails}
                            currentGroupIndex={currentGroupIndex}
                            index={index}
                            itemGroup={itemGroup}
                            isRequired
                          />
                        </span>
                        <RadioMessage>
                          Use this to deliver a specific number of randomly
                          picked question per Section.
                        </RadioMessage>
                      </>
                    )}
                  </GroupField>
                  <GroupField style={{ display: 'flex' }} marginBottom="5px">
                    {currentGroupIndex === index && (
                      <>
                        <EduButton
                          loading={fetchingItems}
                          disabled={fetchingItems}
                          data-cy={`save-${itemGroup.groupName}`}
                          onClick={(e) => {
                            handleSaveGroup(index)
                            e.target.blur()
                          }}
                        >
                          Save
                        </EduButton>
                        <EduButton
                          data-cy={`cancel-${itemGroup.groupName}`}
                          isGhost
                          disabled={fetchingItems}
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
              data-cy="add-section"
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
