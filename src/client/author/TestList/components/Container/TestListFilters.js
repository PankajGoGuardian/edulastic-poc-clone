import { grey, themeColor, titleColor } from "@edulastic/colors";
import { FieldLabel, FlexContainer, SelectInputStyled } from "@edulastic/common";
import { roleuser, test as testsConstants, libraryFilters, folderTypes } from "@edulastic/constants";
import { IconExpandBox } from "@edulastic/icons";
import { Select } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getCurrentDistrictUsersAction, getCurrentDistrictUsersSelector } from "../../../../student/Login/ducks";
import StandardsSearchModal from "../../../ItemList/components/Search/StandardsSearchModal";
import TestFiltersNav from "../../../src/components/common/TestFilters/TestFiltersNav";
import Folders from "../../../src/components/Folders";
import { getFormattedCurriculumsSelector, getStandardsListSelector } from "../../../src/selectors/dictionaries";
import {
  getCollectionsSelector,
  getUserFeatures,
  getUserOrgId,
  getUserRole,
  isDistrictUserSelector,
  isOrganizationDistrictSelector
} from "../../../src/selectors/user";
import { getAllTagsSelector } from "../../../TestPage/ducks";
import { removeTestFromCartAction } from "../../ducks";
import filterData from "./FilterData";

const filtersTitle = ["Grades", "Subject", "Status"];
const TestListFilters = ({
  isPlaylist,
  onChange,
  search,
  clearFilter,
  handleLabelSearch,
  formattedCuriculums,
  curriculumStandards,
  collections,
  allTagsData = [],
  allPlaylistsTagsData = [],
  searchFilterOption,
  filterMenuItems,
  userFeatures,
  districtId,
  currentDistrictUsers,
  removeTestFromCart,
  getCurrentDistrictUsers,
  userRole,
  isOrgUser,
  isDistrictUser
}) => {
  const [showModal, setShowModal] = useState(false);
  const isPublishers = !!(userFeatures.isPublisherAuthor || userFeatures.isCurator);

  useEffect(() => {
    if (userFeatures.isCurator && !currentDistrictUsers?.length) {
      getCurrentDistrictUsers(districtId);
    }
  }, []);

  const collectionDefaultFilter = useMemo(() => {
    if (userRole === roleuser.EDULASTIC_CURATOR) {
      return testsConstants.collectionDefaultFilter.filter(
        c => !["SCHOOL", "DISTRICT", "PUBLIC", "INDIVIDUAL"].includes(c.value)
      );
    }
    return testsConstants.collectionDefaultFilter;
  }, [testsConstants.collectionDefaultFilter, userRole]);

  const getAuthoredByFilterData = () => {
    if (!userFeatures.isCurator) return [];

    return [
      {
        mode: "multiple",
        title: "Authored By",
        placeholder: "All Authors",
        size: "large",
        filterOption: searchFilterOption,
        data: [
          ...(currentDistrictUsers || []).map(o => ({
            value: o._id,
            text: `${o.firstName} ${o.lastName}`
          }))
        ],
        onChange: "authoredByIds"
      }
    ];
  };

  const { filter } = search;
  const getFilters = () => {
    let filterData1 = [];
    if (isPlaylist) {
      const filterTitles = ["Grades", "Subject"];
      const showStatusFilter =
        ((userFeatures.isPublisherAuthor || isOrgUser || isDistrictUser) && filter !== filterMenuItems[0].filter) ||
        userFeatures.isCurator;
      if (showStatusFilter) {
        filterTitles.push("Status");
      }
      filterData1 = filterData.filter(o => filterTitles.includes(o.title));
      if (filter === libraryFilters.SMART_FILTERS.FAVORITES) {
        return filterData1;
      }
      return [
        ...filterData1,
        {
          mode: "multiple",
          title: "Collections",
          placeholder: "All Collections",
          size: "large",
          filterOption: searchFilterOption,
          optionFilterProp: "children",
          data: [
            ...collectionDefaultFilter.filter(c => c.value),
            ...collections.map(o => ({ value: o._id, text: o.name }))
          ],
          onChange: "collections"
        },
        {
          mode: "multiple",
          size: "large",
          title: "Tags",
          placeholder: "Please select",
          onChange: "tags",
          filterOption: searchFilterOption,
          data: allPlaylistsTagsData.map(o => ({ value: o._id, text: o.tagName }))
        },
        ...getAuthoredByFilterData()
      ];
    }

    const { curriculumId = "", subject = [] } = search;
    const formattedStandards = (curriculumStandards.elo || []).map(item => ({
      value: item._id,
      text: item.identifier
    }));

    const isStandardsDisabled = !(curriculumStandards.elo && curriculumStandards.elo.length > 0) || !curriculumId;
    const showStatusFilter =
      ((userFeatures.isPublisherAuthor || isOrgUser || isDistrictUser) && filter !== filterMenuItems[0].filter) ||
      userFeatures.isCurator;

    let filtersTitles = [...filtersTitle];
    if (!showStatusFilter) {
      filtersTitles = filtersTitles.filter(f => f !== "Status");
    }
    filterData1 = filterData.filter(o => filtersTitles.includes(o.title));

    if (filter === libraryFilters.SMART_FILTERS.FAVORITES) {
      return filterData1;
    }
    let curriculumsList = [];
    if (subject.length) curriculumsList = [...formattedCuriculums];
    filterData1.splice(
      2,
      0,
      ...[
        {
          size: "large",
          title: "Standard set",
          onChange: "curriculumId",
          data: [{ value: "", text: "All Standard set" }, ...curriculumsList],
          optionFilterProp: "children",
          filterOption: searchFilterOption,
          showSearch: true
        },
        {
          size: "large",
          mode: "multiple",
          placeholder: "All Standards",
          title: "Standards",
          disabled: isStandardsDisabled,
          onChange: "standardIds",
          optionFilterProp: "children",
          data: formattedStandards,
          filterOption: searchFilterOption,
          showSearch: true,
          isStandardSelect: true
        },
        {
          mode: "multiple",
          title: "Collections",
          placeholder: "All Collections",
          size: "large",
          filterOption: searchFilterOption,
          optionFilterProp: "children",
          data: [
            ...collectionDefaultFilter.filter(c => c.value),
            ...collections.map(o => ({ value: o._id, text: o.name }))
          ],
          onChange: "collections"
        }
      ]
    );
    filterData1 = [
      ...filterData1,
      ...getAuthoredByFilterData(),
      {
        mode: "multiple",
        size: "large",
        title: "Tags",
        placeholder: "Please select",
        onChange: "tags",
        filterOption: searchFilterOption,
        data: allTagsData.map(o => ({ value: o._id, text: o.tagName }))
      }
    ];
    return filterData1;
  };
  const handleApply = standardIds => {
    onChange("standardIds", standardIds);
  };

  const handleSetShowModal = () => {
    if (!search.curriculumId || !curriculumStandards.elo.length) return;
    setShowModal(true);
  };

  let mappedfilterData = getFilters();
  if (isPublishers) {
    const filtersToBeMoved = mappedfilterData.filter(f => ["Status", "Authored By"].includes(f.title));
    mappedfilterData = [
      ...filtersToBeMoved,
      ...mappedfilterData.filter(f => !["Status", "Authored By"].includes(f.title))
    ];
  }
  const selectedCurriculam = formattedCuriculums?.find(({ value }) => value === search?.curriculumId);

  const handleStandardsAlert = ({ title, disabled }) => {
    if (title === "Standards" && disabled) {
      return "Select Grades, Subject and Standard Set before selecting Standards";
    }
    return "";
  };

  const handleSelectFolder = folderId => {
    onChange("folderId", folderId);
  };

  const isFolderSearch = filter === libraryFilters.SMART_FILTERS.FOLDERS;

  return (
    <Container>
      {showModal && (
        <StandardsSearchModal
          setShowModal={setShowModal}
          showModal={showModal}
          standardIds={search.standardIds}
          handleApply={handleApply}
          selectedCurriculam={selectedCurriculam}
        />
      )}
      <FilerHeading justifyContent="space-between">
        <Title>FILTERS</Title>
        <ClearAll data-cy="clearAll" onClick={clearFilter}>
          CLEAR ALL
        </ClearAll>
      </FilerHeading>
      <TestFiltersNav
        items={userRole === roleuser.EDULASTIC_CURATOR ? [filterMenuItems[0]] : filterMenuItems}
        onSelect={handleLabelSearch}
        search={search}
      />
      {!isFolderSearch &&
        mappedfilterData.map((filterItem, index) => {
          if (filterItem.title === "Authored By" && search.filter === "AUTHORED_BY_ME") return null;
          return (
            <>
              <FilterItemWrapper key={index} title={handleStandardsAlert(filterItem)}>
                {filterItem.isStandardSelect && (
                  <IconExpandBoxWrapper className={filterItem.disabled && "disabled"}>
                    <IconExpandBox onClick={handleSetShowModal} />
                  </IconExpandBoxWrapper>
                )}
                <FieldLabel>{filterItem.title}</FieldLabel>
                <SelectStyled
                  data-cy={filterItem.title}
                  showSearch={filterItem.showSearch}
                  onSearch={filterItem.onSearch && filterItem.onSearch}
                  mode={filterItem.mode}
                  size={filterItem.size}
                  placeholder={filterItem.placeholder}
                  filterOption={filterItem.filterOption}
                  optionFilterProp={filterItem.optionFilterProp}
                  defaultValue={
                    filterItem.mode === "multiple" ? undefined : filterItem.data[0] && filterItem.data[0].value
                  }
                  value={search[filterItem.onChange]}
                  onChange={value => onChange(filterItem.onChange, value)}
                  disabled={filterItem.disabled}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  margin="0px 0px 15px"
                >
                  {filterItem.data.map(({ value, text, disabled }, index1) => (
                    <Select.Option value={value} key={index1} disabled={disabled}>
                      {text}
                    </Select.Option>
                  ))}
                  {isPublishers &&
                    filterItem.title === "Status" &&
                    filterItem.publisherOptions.map(({ value, text }) => (
                      <Select.Option value={value} key={value}>
                        {text}
                      </Select.Option>
                    ))}
                </SelectStyled>
              </FilterItemWrapper>
            </>
          );
        })}
      <Folders
        onSelectFolder={handleSelectFolder}
        folderType={folderTypes.TEST}
        isActive={isFolderSearch}
        removeItemFromCart={removeTestFromCart}
      />
    </Container>
  );
};

TestListFilters.propTypes = {
  onChange: PropTypes.func,
  clearFilter: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired
};

TestListFilters.defaultProps = {
  onChange: () => null
};

export default connect(
  (state, { search = {} }) => ({
    curriculumStandards: getStandardsListSelector(state),
    collections: getCollectionsSelector(state),
    allTagsData: getAllTagsSelector(state, "test"),
    allPlaylistsTagsData: getAllTagsSelector(state, "playlist"),
    formattedCuriculums: getFormattedCurriculumsSelector(state, search),
    userFeatures: getUserFeatures(state),
    districtId: getUserOrgId(state),
    currentDistrictUsers: getCurrentDistrictUsersSelector(state),
    userRole: getUserRole(state),
    isOrgUser: isOrganizationDistrictSelector(state),
    isDistrictUser: isDistrictUserSelector(state)
  }),
  {
    getCurrentDistrictUsers: getCurrentDistrictUsersAction,
    removeTestFromCart: removeTestFromCartAction
  }
)(TestListFilters);

const Container = styled.div`
  padding: 27px 0;

  @media (min-width: 993px) {
    padding-right: 35px;
  }
`;

const FilerHeading = styled(FlexContainer)`
  margin-bottom: 10px;
`;

const Title = styled.span`
  color: ${titleColor};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;

export const FilterItemWrapper = styled.div`
  position: relative;
`;

const ClearAll = styled.span`
  color: ${themeColor};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  :hover {
    color: ${themeColor};
  }
`;

const IconExpandBoxWrapper = styled.div`
  right: 10px;
  position: absolute;
  bottom: 21px;
  z-index: 1;
  cursor: pointer;
  &.disabled {
    svg path {
      fill: ${grey};
    }
  }
`;

const SelectStyled = styled(SelectInputStyled)`
  .ant-select-selection__placeholder {
    padding-right: 18px;
  }

  .ant-select-selection {
    cursor: pointer !important;
  }
`;
