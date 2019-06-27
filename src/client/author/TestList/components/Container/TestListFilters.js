import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { themeColor, secondaryTextColor, titleColor, lightGreySecondary } from "@edulastic/colors";
import PropTypes from "prop-types";
import { FlexContainer } from "@edulastic/common";
import { Select } from "antd";
import { getStandardsListSelector, getFormattedCurriculumsSelector } from "../../../src/selectors/dictionaries";
import TestFiltersNav from "../../../src/components/common/TestFilters/TestFiltersNav";
import filterData from "./FilterData";
import { getCollectionsSelector } from "../../../src/selectors/user";
import StandardsSearchModal from "../../../ItemList/components/Search/StandardsSearchModal";
import { test as testsConstants } from "@edulastic/constants";

const filtersTitle = ["Grades", "Subject", "Status", "Tags"];
const TestListFilters = ({
  isPlaylist,
  onChange,
  search,
  clearFilter,
  handleLabelSearch,
  formattedCuriculums,
  curriculumStandards,
  collections,
  searchFilterOption,
  filterMenuItems
}) => {
  const [showModal, setShowModal] = useState(false);
  const getFilters = () => {
    let filterData1 = [];
    const { filter } = search;
    if (isPlaylist) {
      const filterTitles = ["Grades", "Subject"];
      if (filter !== filterMenuItems[0].filter) {
        filterTitles.push("Status");
      }
      filterData1 = filterData.filter(o => filterTitles.includes(o.title));
      return [
        ...filterData1,
        {
          title: "Collections",
          placeholder: "Select Collection",
          size: "large",
          data: [...testsConstants.collectionDefaultFilter, ...collections.map(o => ({ value: o._id, text: o.title }))],
          onChange: "collectionName"
        }
      ];
    }

    const { curriculumId = "", subject = "" } = search;
    const formattedStandards = (curriculumStandards.elo || []).map(item => ({
      value: item._id,
      text: item.identifier
    }));

    const standardsPlaceholder = !curriculumId.length
      ? "Available with Curriculum"
      : 'Type to Search, for example "k.cc"';

    filterData1 = filterData.filter(o => filtersTitle.includes(o.title));
    if (filter === filterMenuItems[0].filter) {
      filterData1 = filterData1.filter(o => o.title !== "Status");
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
          placeholder: standardsPlaceholder,
          title: "Standards",
          filterOption: false,
          disabled: !curriculumId.length || !formattedStandards.length,
          onChange: "standardIds",
          optionFilterProp: "children",
          data: formattedStandards,
          filterOption: searchFilterOption,
          showSearch: true,
          isStandardSelect: true
        },
        {
          title: "Collections",
          placeholder: "Select Collection",
          size: "large",
          data: [...testsConstants.collectionDefaultFilter, ...collections.map(o => ({ value: o._id, text: o.title }))],
          onChange: "collectionName"
        }
      ]
    );
    return filterData1;
  };
  const handleApply = standardIds => {
    onChange("standardIds", standardIds);
    setShowModal(false);
  };

  const handleSetShowModal = () => {
    if (!search.curriculumId.length || !curriculumStandards.elo.length) return;
    setShowModal(true);
  };

  const mappedfilterData = getFilters();
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
        <ClearAll onClick={clearFilter}>CLEAR ALL</ClearAll>
      </FilerHeading>
      <TestFiltersNav items={filterMenuItems} onSelect={handleLabelSearch} search={search} />
      {mappedfilterData.map((filterItem, index) => (
        <FilterItemWrapper key={index}>
          {filterItem.isStandardSelect ? (
            <IconExpandStandards className="fa fa-expand" aria-hidden="true" onClick={handleSetShowModal} />
          ) : (
            ""
          )}
          <SubTitle>{filterItem.title}</SubTitle>
          <Select
            showSearch={filterItem.showSearch}
            onSearch={filterItem.onSearch && filterItem.onSearch}
            mode={filterItem.mode}
            size={filterItem.size}
            placeholder={filterItem.placeholder}
            filterOption={filterItem.filterOption}
            optionFilterProp={filterItem.optionFilterProp}
            defaultValue={filterItem.mode === "multiple" ? undefined : filterItem.data[0] && filterItem.data[0].text}
            value={search[filterItem.onChange]}
            onChange={value => onChange(filterItem.onChange, value)}
            disabled={filterItem.disabled}
          >
            {filterItem.data.map(({ value, text, disabled }, index1) => (
              <Select.Option value={value} key={index1} disabled={disabled}>
                {text}
              </Select.Option>
            ))}
          </Select>
        </FilterItemWrapper>
      ))}
    </Container>
  );
};

TestListFilters.propTypes = {
  onChange: PropTypes.func,
  clearFilter: PropTypes.func.isRequired,
  style: PropTypes.object,
  search: PropTypes.object.isRequired,
  filterData: PropTypes.array
};

TestListFilters.defaultProps = {
  filterData: [],
  style: {},
  onChange: () => null
};

export default connect(
  (state, { search = {} }) => ({
    curriculumStandards: getStandardsListSelector(state),
    collections: getCollectionsSelector(state),
    formattedCuriculums: getFormattedCurriculumsSelector(state, search)
  }),
  {}
)(TestListFilters);

const Container = styled.div`
  padding: 27px 0;

  .ant-select {
    width: 100%;
    min-width: 100%;
  }

  .ant-select-selection {
    background: ${lightGreySecondary};
  }

  .ant-select-lg {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
    .ant-select-selection--multiple {
      .ant-select-selection__rendered {
        li.ant-select-selection__choice {
          height: 24px;
          line-height: 24px;
          margin-top: 7px;
        }
      }
    }
  }

  .ant-select-selection__choice {
    border-radius: 5px;
    border: solid 1px #c8e8f6;
    background-color: #c8e8f6;
    height: 23.5px;
  }

  .ant-select-selection__choice__content {
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.2px;
    color: #0083be;
    opacity: 1;
  }

  .ant-select-remove-icon {
    svg {
      fill: #0083be;
    }
  }

  .ant-select-arrow-icon {
    font-size: 14px;
    svg {
      fill: ${themeColor};
    }
  }

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
  color: #00ad50;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  :hover {
    color: #00ad50;
  }
`;

const SubTitle = styled.div`
  margin: 12px 0 5px;
  color: ${secondaryTextColor};
  font-size: 13px;
  font-weight: 600;
`;

const IconExpandStandards = styled.span`
  right: 10px;
  position: absolute;
  bottom: 14px;
  z-index: 1;
  cursor: pointer;
`;
