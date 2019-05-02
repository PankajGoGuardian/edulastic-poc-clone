import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { blue, secondaryTextColor, titleColor, lightGreySecondary } from "@edulastic/colors";
import PropTypes from "prop-types";
import { FlexContainer } from "@edulastic/common";
import { Select } from "antd";
import { getStandardsListSelector, getAvailableCurriculumsSelector } from "../../../src/selectors/dictionaries";
import TestFiltersNav from "../../../src/components/common/TestFilters/TestFiltersNav";
import filterData from "./FilterData";

const TestListFilters = ({
  onChange,
  search,
  clearFilter,
  handleLabelSearch,
  filteredCurriculums,
  curriculumStandards,
  searchCurriculum,
  handleStandardSearch,
  filterMenuItems
}) => {
  const getFilters = () => {
    const { curriculumId } = search;
    const formattedCuriculums = filteredCurriculums.map(item => ({
      value: item._id,
      text: item.curriculum || item.name
    }));

    const formattedStandards = (curriculumStandards.elo || []).map(item => ({
      value: item._id,
      text: `${item.identifier} : ${item.description}`
    }));

    const standardsPlaceholder = !curriculumId.length
      ? "Available with Curriculum"
      : 'Type to Search, for example "k.cc"';

    return [
      ...filterData,
      {
        size: "large",
        title: "Curriculum",
        onChange: "curriculumId",
        data: [{ value: "", text: "All Curriculum" }, ...formattedCuriculums],
        optionFilterProp: "children",
        filterOption: searchCurriculum,
        showSearch: true
      },
      {
        onSearch: handleStandardSearch,
        size: "large",
        mode: "multiple",
        placeholder: standardsPlaceholder,
        title: "Standards",
        filterOption: false,
        disabled: !curriculumId.length,
        onChange: "standardIds",
        data: formattedStandards
      }
    ];
  };
  const mappedfilterData = getFilters();
  return (
    <Container>
      <FilerHeading justifyContent="space-between">
        <Title>FILTERS</Title>
        <ClearAll onClick={clearFilter}>CLEAR ALL</ClearAll>
      </FilerHeading>
      <TestFiltersNav items={filterMenuItems} onSelect={handleLabelSearch} search={search} />
      {mappedfilterData.map((filterItem, index) => (
        <React.Fragment key={index}>
          <SubTitle>{filterItem.title}</SubTitle>
          <Select
            showSearch={filterItem.showSearch}
            onSearch={filterItem.onSearch && filterItem.onSearch}
            mode={filterItem.mode}
            size={filterItem.size}
            placeholder={filterItem.placeholder}
            filterOption={filterItem.filterOption}
            optionFilterProp={filterItem.optionFilterProp}
            defaultValue={filterItem.mode === "multiple" ? undefined : filterItem.data[0].text}
            value={search[filterItem.onChange]}
            onChange={value => onChange(filterItem.onChange, value)}
            disabled={filterItem.disabled}
          >
            {filterItem.data.map(({ value, text }, index1) => (
              <Select.Option value={value} key={index1}>
                {text}
              </Select.Option>
            ))}
          </Select>
        </React.Fragment>
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
    filteredCurriculums: getAvailableCurriculumsSelector(state, search)
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
      fill: #00b0ff;
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

const ClearAll = styled.span`
  color: ${blue};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  :hover {
    color: ${blue};
  }
`;

const SubTitle = styled.div`
  margin: 12px 0 5px;
  color: ${secondaryTextColor};
  font-size: 13px;
  font-weight: 600;
`;
