import { testItemsApi } from "@edulastic/api";
import { CheckboxLabel, EduCheckBox, RadioBtn, RadioGrp } from "@edulastic/common";
import { test as testConstants } from "@edulastic/constants";
import { IconPencilEdit } from "@edulastic/icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, Icon, Input, message, Select } from "antd";
import { isEqual, keyBy, maxBy, pick } from "lodash";
import nanoid from "nanoid";
import React, { useEffect, useState } from "react";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import StandardsModal from "../../../../assessment/containers/QuestionMetadata/StandardsModal";
import { getDefaultInterests } from "../../../dataUtils";
import { getDictCurriculumsAction, getDictStandardsForCurriculumAction } from "../../../src/actions/dictionaries";
import Breadcrumb from "../../../src/components/Breadcrumb";
import {
  getCurriculumsListSelector,
  getDictionariesAlignmentsSelector,
  getStandardsListSelector,
  standardsSelector
} from "../../../src/selectors/dictionaries";
import {
  getCollectionsSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  getInterestedCurriculumsSelector
} from "../../../src/selectors/user";
import {
  addNewGroupAction,
  deleteItemsGroupAction,
  getAllTagsAction,
  getAllTagsSelector,
  getStaticGroupItemIds,
  getTestEntitySelector,
  NewGroup,
  setTestDataAction,
  updateGroupDataAction
} from "../../ducks";
import { removeTestItemsAction } from "../AddItems/ducks";
import selectsData from "../common/selectsData";
import {
  AddGroupButton,
  AutoSelectFields,
  BreadcrumbContainer,
  BrowseButton,
  Container,
  ContentBody,
  CreateGroupWrapper,
  DoneButton,
  Footer,
  GroupField,
  Heading,
  ItemCountWrapper,
  ItemTag,
  Label,
  PanelHeading,
  QuestionTagsContainer,
  QuestionTagsWrapper,
  RadioMessage,
  SaveButton,
  SelectItemsButton,
  SelectWrapper,
  StandardNameSection
} from "./styled";
import TypeConfirmModal from "./TypeConfirmModal";

const { ITEM_GROUP_TYPES, ITEM_GROUP_DELIVERY_TYPES } = testConstants;

const GroupItems = ({
  t,
  match,
  updateGroupData,
  addNewGroup,
  getAllTags,
  allTagsData,
  collections,
  getCurriculums,
  curriculumStandards,
  getCurriculumStandards,
  curriculumStandardsLoading,
  curriculums,
  alignment,
  removeTestItems,
  deleteItemsGroup,
  test,
  setTestData,
  history,
  interestedGrades,
  interestedSubjects,
  interestedCurriculums: [firstCurriculum]
}) => {
  const { Panel } = Collapse;

  const [editGroupDetail, setEditGroupDetails] = useState({});
  const [showStandardModal, setShowStandardModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchProps, setSearchProps] = useState({ id: "", grades: [], searchStr: "" });
  const [currentGroupIndex, setCurrentGroupIndex] = useState(null);
  const [confirmModalCategory, setConfirmModalCategory] = useState(null);
  const [fetchingItems, setFetchingItems] = useState(false);
  const [deleteGroupIndex, setDeleteGroupIndex] = useState(null);
  const [activePanels, setActivePanels] = useState([]);
  const {
    subject = interestedSubjects?.[0] || "",
    grades = interestedGrades || [],
    curriculumId = firstCurriculum?.subject === interestedSubjects?.[0] ? firstCurriculum?._id : ""
  } = getDefaultInterests();

  const goBackUrl = match.params?.id
    ? `/author/tests/tab/addItems/id/${match.params.id}`
    : "/author/tests/create/addItems";

  const breadcrumbData = [
    {
      title: "TESTS LIBRARY",
      to: "/author/tests"
    },
    {
      title: "ADD ITEMS",
      to: goBackUrl
    },
    {
      title: "QUESTION DELIVERY GROUPS",
      to: ""
    }
  ];

  const switchToAddItems = () => {
    return history.push(goBackUrl);
  };
  const collectionData = collections.map(o => ({ text: o.name, value: o._id }));

  useEffect(() => {
    setActivePanels(test.itemGroups.map((_, i) => (i + 1).toString()));
    if (curriculums.length === 0) {
      getCurriculums();
    }
    getAllTags({ type: "testitem" });

    searchCurriculumStandards({ id: curriculumId, grades, searchStr: "" });
  }, []);

  const handleChange = (fieldName, value) => {
    let updatedGroupData = { ...editGroupDetail };
    if (fieldName === "type") {
      updatedGroupData = {
        ...updatedGroupData,
        items: [],
        type: updatedGroupData.type === ITEM_GROUP_TYPES.STATIC ? ITEM_GROUP_TYPES.AUTOSELECT : ITEM_GROUP_TYPES.STATIC,
        deliveryType:
          updatedGroupData.type === ITEM_GROUP_TYPES.STATIC
            ? ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM
            : ITEM_GROUP_DELIVERY_TYPES.ALL
      };
    } else if (fieldName === "deliverItemsCount") {
      if (updatedGroupData.type === ITEM_GROUP_TYPES.STATIC && value >= updatedGroupData.items.length) {
        return message.error("Total items to be delivered should be lesser than the number of items selected.", 3);
      }
      if (updatedGroupData.type === ITEM_GROUP_TYPES.AUTOSELECT && value > 100) {
        return message.error("Total Items to be delivered cannot be more than 100");
      }
      updatedGroupData = {
        ...updatedGroupData,
        [fieldName]: value
      };
    } else if (fieldName === "deliveryType") {
      if (
        updatedGroupData.type === ITEM_GROUP_TYPES.STATIC &&
        value === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        updatedGroupData.items.length < 2
      ) {
        return message.error("Please select atleast 2 items to manually give the items delivery count.", 3);
      }
      updatedGroupData = {
        ...updatedGroupData,
        [fieldName]: value
      };
    } else if (fieldName === "tags") {
      const allTagsKeyById = keyBy(allTagsData, "_id");
      updatedGroupData = {
        ...updatedGroupData,
        [fieldName]: value.map(tagId => allTagsKeyById[tagId])
      };
    } else {
      updatedGroupData = {
        ...updatedGroupData,
        [fieldName]: value
      };
    }

    if (updatedGroupData.type === ITEM_GROUP_TYPES.STATIC) {
      let extraPick = [];
      if (
        [ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM, ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM].includes(
          updatedGroupData.deliveryType
        )
      )
        extraPick = ["deliverItemsCount"];
      updatedGroupData = pick(updatedGroupData, [
        "type",
        "groupName",
        "items",
        "deliveryType",
        "index",
        "_id",
        ...extraPick
      ]);
    }
    setEditGroupDetails(updatedGroupData);
  };

  const handleTypeSelect = groupIndex => {
    let showModal = false;
    const { type, items, collectionDetails, standardDetails, dok, tags, difficulty } = editGroupDetail;

    if (type === ITEM_GROUP_TYPES.STATIC && items.length > 0) {
      showModal = true;
    } else if (
      type === ITEM_GROUP_TYPES.AUTOSELECT &&
      (collectionDetails || standardDetails || dok || tags?.length || difficulty)
    ) {
      showModal = true;
    }
    if (showModal) {
      setConfirmModalCategory("TYPE");
      setShowConfirmModal(true);
      return setCurrentGroupIndex(groupIndex);
    }
    return handleChange("type", "");
  };

  const handleConfirmResponse = value => {
    if (value === "YES") {
      if (confirmModalCategory === "TYPE") handleChange("type", "");
      else {
        const currentGroup = test.itemGroups[deleteGroupIndex];
        deleteItemsGroup(currentGroup.groupName);
        removeTestItems(currentGroup.items.map(i => i._id));
        setDeleteGroupIndex(null);
      }
    }
    setConfirmModalCategory(null);
    setShowConfirmModal(false);
  };

  const handleDeleteGroup = (e, index) => {
    e.stopPropagation();
    setDeleteGroupIndex(index);
    setConfirmModalCategory("DELETE GROUP");
    setShowConfirmModal(true);
  };

  const handleAddGroup = () => {
    if (test.itemGroups.length === 15) {
      return message.warning("Cannot create more than 15 groups");
    }
    const { index } = maxBy(test.itemGroups, "index");
    const data = {
      ...NewGroup,
      _id: nanoid(),
      groupName: `Group ${index + 2}`,
      index: index + 1
    };
    addNewGroup(data);
    setActivePanels([...activePanels, (test.itemGroups.length + 1).toString()]);
  };

  const checkDuplicateGroup = (collectionId, standardId) => {
    const duplicateGroup = test.itemGroups.find(
      (g, index) =>
        index !== currentGroupIndex &&
        g.collectionDetails?._id === collectionId &&
        g.standardDetails?.standardId === standardId
    );
    if (duplicateGroup) {
      message.warning(`The combination already exists in ${duplicateGroup.groupName}`);
      return true;
    }
    return false;
  };

  const handleApply = data => {
    if (!data?.eloStandards?.length) {
      return message.warn("Please select a standard before applying");
    }
    const { subject, eloStandards } = data;
    const grades = data.grades.length ? data.grades : eloStandards[0]?.grades || [];
    const { curriculumId, _id: standardId, tloId: domainId, identifier } = eloStandards[0];
    const standardDetails = {
      subject,
      grades,
      curriculumId,
      standardId,
      domainId,
      identifier
    };
    setShowStandardModal(false);
    const { collectionDetails } = editGroupDetail;
    if (collectionDetails && checkDuplicateGroup(collectionDetails._id, standardId)) return;
    handleChange("standardDetails", standardDetails);
  };

  const handleCollectionChange = (collectionId, index) => {
    const { value: _id, text: name } = collectionData.find(d => d.value === collectionId);
    const { standardDetails } = editGroupDetail;
    if (standardDetails) {
      const isDuplicate = checkDuplicateGroup(collectionId, standardDetails.standardId);
      if (isDuplicate) return;
    }
    handleChange("collectionDetails", { _id, name });
  };

  const searchCurriculumStandards = searchObject => {
    if (!isEqual(searchProps, searchObject)) {
      setSearchProps(searchObject);
      getCurriculumStandards(searchObject.id, searchObject.grades, searchObject.searchStr);
    }
  };

  const validateGroups = () => {
    if (currentGroupIndex !== null) {
      return message.error("Please save the changes made to the group first.");
    }
    let staticGroups = [];
    let autoSelectGroups = [];
    let isValid = true;

    test.itemGroups.forEach(group => {
      if (group.type === ITEM_GROUP_TYPES.STATIC) staticGroups.push(group);
      else autoSelectGroups.push(group);
    });

    for (let i = 0; i < staticGroups.length; i++) {
      const { items, deliveryType, deliverItemsCount } = staticGroups[i];
      if (items.length === 0) {
        message.error("Each Static group should contain at least 1 test item.");
        isValid = false;
        break;
      }
      if (deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM && !deliverItemsCount) {
        message.error("Please enter the total number of items to be delivered.");
        isValid = false;
        break;
      }
    }

    for (let i = 0; i < autoSelectGroups.length; i++) {
      const { collectionDetails, standardDetails, deliverItemsCount } = autoSelectGroups[i];
      if (!collectionDetails || !standardDetails) {
        message.error("Each Autoselect group should have a standard and a collection.");
        isValid = false;
        break;
      }
      if (!deliverItemsCount) {
        message.error("Please enter the total number of items to be delivered.");
        isValid = false;
        break;
      }
    }

    if (isValid) {
      switchToAddItems();
    }
  };

  const handleEditGroup = (e, itemGroup, index) => {
    if (activePanels.includes((index + 1).toString())) e.stopPropagation();
    setEditGroupDetails(itemGroup);
    setCurrentGroupIndex(index);
  };

  const validateGroup = () => {
    let isValid = true;
    if (editGroupDetail.type === ITEM_GROUP_TYPES.STATIC) {
      const { deliveryType, deliverItemsCount } = editGroupDetail;
      if (deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM && !deliverItemsCount) {
        message.error("Please enter the total number of items to be delivered.");
        isValid = false;
      }
    } else {
      const { collectionDetails, standardDetails, deliverItemsCount } = editGroupDetail;
      if (!collectionDetails || !standardDetails) {
        message.error("Each Autoselect group should have a standard and a collection.");
        isValid = false;
      }
      if (isValid && !deliverItemsCount) {
        message.error("Please enter the total number of items to be delivered.");
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSaveGroup = async () => {
    if (!validateGroup()) {
      return;
    }
    if (editGroupDetail.type === ITEM_GROUP_TYPES.STATIC) {
      return saveGroupToTest();
    }

    const optionalFields = {
      depthOfKnowledge: editGroupDetail.dok,
      authorDifficulty: editGroupDetail.difficulty,
      tags: editGroupDetail.tags?.map(tag => tag.tagName) || []
    };
    Object.keys(optionalFields).forEach(key => optionalFields[key] === undefined && delete optionalFields[key]);
    const data = {
      limit: editGroupDetail.deliverItemsCount,
      search: {
        collectionId: editGroupDetail.collectionDetails._id,
        standardId: editGroupDetail.standardDetails.standardId,
        ...optionalFields
      }
    };
    if (data.limit > 100) {
      return message.error("Maximum 100 question can be selected to deliver.");
    }
    setFetchingItems(true);

    const allStaticGroupItemIds = getStaticGroupItemIds(test);
    testItemsApi
      .getAutoSelectedItems({ ...data, search: { ...data.search, nInItemIds: allStaticGroupItemIds } })
      .then(res => {
        const { items, total } = res;
        if (items.length === 0) {
          return message.error("No test items found for current combination of filters.");
        }
        if (total < data.limit) {
          return message.error(`Maximum items should not exceed ${total}`);
        }
        const testItems = items.map(i => ({ ...i, autoselectedItem: true }));
        saveGroupToTest(testItems);
      })
      .catch(err => {
        message.error(err.message || "Failed to fetch test items");
      });
    setFetchingItems(false);
  };

  const saveGroupToTest = items => {
    const oldGroupData = test.itemGroups[currentGroupIndex];
    let updatedGroupData = { ...editGroupDetail };
    if (editGroupDetail.type === ITEM_GROUP_TYPES.AUTOSELECT) {
      removeTestItems(oldGroupData.items.map(i => i._id));
      updatedGroupData = { ...updatedGroupData, items };
    } else if (editGroupDetail.type === ITEM_GROUP_TYPES.STATIC && oldGroupData.type === ITEM_GROUP_TYPES.AUTOSELECT) {
      updatedGroupData = { ...updatedGroupData, items: [] };
    }
    if (
      updatedGroupData.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
      updatedGroupData.items.some(item => item.itemLevelScoring === false)
    ) {
      return message.warn("All items inside LIMITED delivery type group should have item level scoring.");
    }
    const disableAnswerOnPaper =
      updatedGroupData.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM ||
      updatedGroupData.type === ITEM_GROUP_TYPES.AUTOSELECT;
    if (test.answerOnPaper && disableAnswerOnPaper) {
      setTestData({ answerOnPaper: false });
      message.warn("Answer on paper is not supported for AUTOSELECT groups or group with LIMITED delivery type");
    }
    updateGroupData({ updatedGroupData, groupIndex: currentGroupIndex });
    setCurrentGroupIndex(null);
    setEditGroupDetails({});
    setFetchingItems(false);
  };

  const handleCancel = () => {
    setCurrentGroupIndex(null);
    setEditGroupDetails({});
  };

  return (
    <Container>
      {showStandardModal && (
        <StandardsModal
          t={t}
          subject={subject}
          grades={grades}
          standards={[]}
          standard={{
            curriculum: curriculums.find(item => item._id === parseInt(curriculumId))?.curriculum || "",
            id: parseInt(curriculumId) || ""
          }}
          visible={showStandardModal}
          curriculums={curriculums}
          onApply={handleApply}
          onCancel={() => setShowStandardModal(false)}
          curriculumStandardsELO={curriculumStandards.elo}
          curriculumStandardsTLO={curriculumStandards.tlo}
          getCurriculumStandards={searchCurriculumStandards}
          curriculumStandardsLoading={curriculumStandardsLoading}
          singleSelect
        />
      )}
      {showConfirmModal && (
        <TypeConfirmModal
          visible={showConfirmModal}
          handleResponse={handleConfirmResponse}
          confirmModalCategory={confirmModalCategory}
          groupName={test.itemGroups[currentGroupIndex]?.groupName}
        />
      )}
      <BreadcrumbContainer>
        <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
      </BreadcrumbContainer>
      <CreateGroupWrapper>
        <Heading>
          Question Delivery Groups&nbsp;&nbsp;
          <FontAwesomeIcon icon={faQuestionCircle} aria-hidden="true" />
        </Heading>
        <Collapse activeKey={activePanels} onChange={panels => setActivePanels(panels)}>
          {test.itemGroups.map((itemGroup, index) => {
            const editingDeliveryType =
              editGroupDetail.type === ITEM_GROUP_TYPES.STATIC
                ? ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
                : ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM;
            const currentDeliveryType =
              itemGroup.type === ITEM_GROUP_TYPES.STATIC
                ? ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
                : ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM;
            return (
              <Panel
                header={[
                  <PanelHeading>
                    <Label fontWeight="600">{itemGroup.groupName}</Label>
                    <div>
                      {currentGroupIndex !== index && (
                        <div title="Edit" onClick={e => handleEditGroup(e, itemGroup, index)}>
                          <IconPencilEdit />
                        </div>
                      )}
                      {test.itemGroups.length > 1 && (
                        <div title="Delete" onClick={e => handleDeleteGroup(e, index)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </div>
                      )}
                    </div>
                  </PanelHeading>
                ]}
                key={index + 1}
              >
                <ContentBody data-cy={`group-${itemGroup.groupName}`}>
                  <GroupField>
                    <CheckboxLabel
                      checked={
                        currentGroupIndex === index
                          ? editGroupDetail.type === ITEM_GROUP_TYPES.AUTOSELECT
                          : itemGroup.type === ITEM_GROUP_TYPES.AUTOSELECT
                      }
                      data-cy={`autoselect-${itemGroup.groupName}`}
                      disabled={currentGroupIndex !== index}
                      onChange={e => handleTypeSelect(index)}
                    >
                      AUTO SELECT ITEMS BASED ON STANDARDS
                    </CheckboxLabel>
                  </GroupField>
                  {(currentGroupIndex === index && editGroupDetail.type === ITEM_GROUP_TYPES.STATIC) ||
                  (currentGroupIndex !== index && itemGroup.type === ITEM_GROUP_TYPES.STATIC) ? (
                    <GroupField>
                      <Label>Items</Label>
                      <QuestionTagsWrapper>
                        <QuestionTagsContainer data-cy={`item-container-${itemGroup.groupName}`}>
                          {(currentGroupIndex === index ? editGroupDetail.items : itemGroup.items)
                            .map(({ _id }) => _id.substring(_id.length, _id.length - 6))
                            .map(id => (
                              <ItemTag>{id}</ItemTag>
                            ))}
                        </QuestionTagsContainer>
                        <SelectItemsButton onClick={switchToAddItems}>Select Items</SelectItemsButton>
                      </QuestionTagsWrapper>
                    </GroupField>
                  ) : (
                    <AutoSelectFields>
                      <SelectWrapper width="200px">
                        <Label>Collection</Label>
                        <Select
                          data-cy={`collection-${itemGroup.groupName}`}
                          size="default"
                          placeholder="Select Collection"
                          onChange={value => handleCollectionChange(value, index)}
                          value={
                            currentGroupIndex === index
                              ? editGroupDetail.collectionDetails?._id
                              : itemGroup.collectionDetails?._id
                          }
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          disabled={currentGroupIndex !== index}
                        >
                          {collectionData.map(el => (
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
                        <Label>Standards</Label>
                        {(currentGroupIndex === index && editGroupDetail.standardDetails) ||
                        (currentGroupIndex !== index && itemGroup.standardDetails) ? (
                          <StandardNameSection>
                            <span>
                              {currentGroupIndex === index
                                ? editGroupDetail.standardDetails.identifier
                                : itemGroup.standardDetails.identifier}
                            </span>
                            <span
                              onClick={() => {
                                if (currentGroupIndex === index) handleChange("standardDetails", "");
                              }}
                            >
                              <Icon type="close" />
                            </span>
                          </StandardNameSection>
                        ) : (
                          <BrowseButton
                            data-cy={`standard-${itemGroup.groupName}`}
                            onClick={() => {
                              if (currentGroupIndex === index) {
                                setShowStandardModal(true);
                                setCurrentGroupIndex(index);
                              }
                            }}
                          >
                            Browse
                          </BrowseButton>
                        )}
                      </SelectWrapper>
                      <SelectWrapper width="200px">
                        <Label>Depth of knowledge</Label>
                        <Select
                          data-cy="selectDOK"
                          placeholder="Select DOK"
                          size="default"
                          onSelect={value => handleChange("dok", value)}
                          value={currentGroupIndex === index ? editGroupDetail.dok : itemGroup.dok}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          disabled={currentGroupIndex !== index}
                        >
                          {selectsData.allDepthOfKnowledge.map((el, index) => (
                            <Select.Option
                              key={el.value}
                              value={el.value}
                              data-cy={`${itemGroup.groupName} ${el.text}`}
                            >
                              {`${index > 0 ? index : ""} ${el.text}`}
                            </Select.Option>
                          ))}
                        </Select>
                      </SelectWrapper>
                      <SelectWrapper width="200px">
                        <Label>Tags</Label>
                        <Select
                          mode="multiple"
                          data-cy="selectTags"
                          size="default"
                          onChange={value => handleChange("tags", value)}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          value={
                            currentGroupIndex === index
                              ? editGroupDetail.tags?.map(tag => tag._id) || []
                              : itemGroup.tags?.map(tag => tag._id) || []
                          }
                          disabled={currentGroupIndex !== index}
                        >
                          {allTagsData.map(el => (
                            <Select.Option key={el._id} value={el._id} data-cy={`${itemGroup.groupName} ${el.tagName}`}>
                              {el.tagName}
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
                          onSelect={value => handleChange("difficulty", value)}
                          value={currentGroupIndex === index ? editGroupDetail.difficulty : itemGroup.difficulty}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          disabled={currentGroupIndex !== index}
                        >
                          {selectsData.allAuthorDifficulty.map(el => (
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
                    </AutoSelectFields>
                  )}
                  <GroupField>
                    <RadioGrp
                      name="radiogroup"
                      value={currentGroupIndex === index ? editGroupDetail.deliveryType : itemGroup.deliveryType}
                      onChange={e => handleChange("deliveryType", e.target.value)}
                      disabled={currentGroupIndex !== index}
                    >
                      {((currentGroupIndex === index && editGroupDetail.type === ITEM_GROUP_TYPES.STATIC) ||
                        (currentGroupIndex !== index && itemGroup.type === ITEM_GROUP_TYPES.STATIC)) && (
                        <>
                          <RadioBtn
                            data-cy={`check-deliver-all-${itemGroup.groupName}`}
                            defaultChecked
                            value={ITEM_GROUP_DELIVERY_TYPES.ALL}
                          >
                            Deliver all Items in this Group
                          </RadioBtn>

                          <RadioMessage>
                            Use this option to deliver a specific number of randomly picked question per Group.
                          </RadioMessage>
                        </>
                      )}
                      <RadioBtn
                        data-cy={`check-deliver-bycount-${itemGroup.groupName}`}
                        defaultChecked={false}
                        value={currentGroupIndex === index ? editingDeliveryType : currentDeliveryType}
                      >
                        <ItemCountWrapper>
                          <span>Deliver a total of </span>
                          <Input
                            data-cy={`input-deliver-bycount-${itemGroup.groupName}`}
                            type="number"
                            disabled={
                              (editGroupDetail.deliveryType === ITEM_GROUP_DELIVERY_TYPES.ALL &&
                                currentGroupIndex === index) ||
                              currentGroupIndex !== index
                            }
                            min={0}
                            value={
                              currentGroupIndex === index
                                ? editGroupDetail.deliverItemsCount || ""
                                : itemGroup.deliverItemsCount || ""
                            }
                            onChange={e => handleChange("deliverItemsCount", parseFloat(e.target.value))}
                            max={editGroupDetail.type === ITEM_GROUP_TYPES.STATIC ? itemGroup.items.length : 100}
                          />
                          <span> Item(s)</span>
                        </ItemCountWrapper>
                      </RadioBtn>
                    </RadioGrp>
                  </GroupField>
                  <GroupField marginBottom="5px">
                    {currentGroupIndex === index && (
                      <>
                        <SaveButton
                          loading={fetchingItems}
                          data-cy={`save-${itemGroup.groupName}`}
                          onClick={e => {
                            handleSaveGroup();
                            e.target.blur();
                          }}
                        >
                          Save
                        </SaveButton>
                        <SaveButton
                          loading={fetchingItems}
                          onClick={e => {
                            handleCancel();
                            e.target.blur();
                          }}
                        >
                          Cancel
                        </SaveButton>
                      </>
                    )}
                  </GroupField>
                </ContentBody>
              </Panel>
            );
          })}
        </Collapse>
        <GroupField>
          {currentGroupIndex === null && (
            <AddGroupButton data-cy="add-group" onClick={handleAddGroup}>
              Add Group
            </AddGroupButton>
          )}
        </GroupField>
        <Footer>
          <DoneButton data-cy="done" onClick={validateGroups}>
            Done
          </DoneButton>
        </Footer>
      </CreateGroupWrapper>
    </Container>
  );
};

const enhance = compose(
  withNamespaces("assessment"),
  withRouter,
  connect(
    state => ({
      allTagsData: getAllTagsSelector(state, "testitem"),
      collections: getCollectionsSelector(state),
      curriculumStandards: getStandardsListSelector(state),
      curriculumStandardsLoading: standardsSelector(state).loading,
      curriculums: getCurriculumsListSelector(state),
      alignment: getDictionariesAlignmentsSelector(state),
      test: getTestEntitySelector(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state)
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      updateGroupData: updateGroupDataAction,
      addNewGroup: addNewGroupAction,
      getAllTags: getAllTagsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      removeTestItems: removeTestItemsAction,
      deleteItemsGroup: deleteItemsGroupAction,
      setTestData: setTestDataAction
    }
  )
);

export default enhance(GroupItems);
