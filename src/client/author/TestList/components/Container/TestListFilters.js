import { grey, themeColor, titleColor } from "@edulastic/colors";
import { FieldLabel, FlexContainer, SelectInputStyled } from "@edulastic/common";
import { roleuser, test as testsConstants, libraryFilters } from "@edulastic/constants";
import { IconExpandBox } from "@edulastic/icons";
import { Select } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getCurrentDistrictUsersAction, getCurrentDistrictUsersSelector } from "../../../../student/Login/ducks";
import StandardsSearchModal from "../../../ItemList/components/Search/StandardsSearchModal";
import TestFiltersNav from "../../../src/components/common/TestFilters/TestFiltersNav";
import { getFormattedCurriculumsSelector, getStandardsListSelector } from "../../../src/selectors/dictionaries";
import { getCollectionsSelector, getUserFeatures, getUserOrgId, getUserRole } from "../../../src/selectors/user";
import { getAllTagsSelector } from "../../../TestPage/ducks";
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
  getCurrentDistrictUsers,
  userRole
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

  const getFilters = () => {
    let filterData1 = [];
    const { filter } = search;
    if (isPlaylist) {
      const filterTitles = ["Grades", "Subject"];
      const showStatusFilter =
        (userFeatures.isPublisherAuthor && filter !== filterMenuItems[0].filter) || userFeatures.isCurator;
      if (showStatusFilter && filter !== libraryFilters.SMART_FILTERS.FAVORITES) {
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

    const { curriculumId = "", subject = "" } = search;
    const formattedStandards = (curriculumStandards.elo || []).map(item => ({
      value: item._id,
      text: item.identifier
    }));

    const isStandardsDisabled = !(curriculumStandards.elo && curriculumStandards.elo.length > 0) || !curriculumId;
    filterData1 = filterData.filter(o => filtersTitle.includes(o.title));
    const showStatusFilter =
      (userFeatures.isPublisherAuthor && filter !== filterMenuItems[0].filter) || userFeatures.isCurator;
    if (!showStatusFilter || filter === libraryFilters.SMART_FILTERS.FAVORITES) {
      filterData1 = filterData1.filter(o => o.title !== "Status");
    }
    if (filter === libraryFilters.SMART_FILTERS.FAVORITES) {
      return filterData1;
    }
    let curriculumsList = [];
    if (subject) curriculumsList = [...formattedCuriculums];
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
    setShowModal(false);
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
  return (
    <Container>
      {showModal ? (
        <StandardsSearchModal
          setShowModal={setShowModal}
          showModal={showModal}
          standardIds={search.standardIds}
          handleApply={handleApply}
        />
      ) : (
        ""
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
      {mappedfilterData.map((filterItem, index) => {
        if (filterItem.title === "Authored By" && search.filter === "AUTHORED_BY_ME") return null;
        return (
          <>
            <FilterItemWrapper key={index}>
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
    userRole: getUserRole(state)
  }),
  {
    getCurrentDistrictUsers: getCurrentDistrictUsersAction
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
    cursor: not-allowed;
    svg path {
      fill: ${grey};
    }
  }
`;

const SelectStyled = styled(SelectInputStyled)`
  .ant-select-selection__placeholder {
    padding-right: 18px;
  }
`;
