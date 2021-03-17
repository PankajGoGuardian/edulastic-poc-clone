/* eslint-disable no-unused-vars */
import React from 'react'
import {
  CustomModalStyled,
  EduButton,
  FieldLabel,
  SelectInputStyled,
} from '@edulastic/common'
import { FILTERS } from '../ManageContentBlock/ducks'
import SELECT_DATA from '../../../TestPage/components/common/selectsData'
import { Title, FlexRow } from './styled'
import ResourcesFiltersModal from './ResourcesFiltersModal'

const PlaylistTestBoxFilter = (props) => {
  const {
    isVisible,
    onCancel,
    collectionsList = [],
    status = '',
    onStatusChange,
    grades = [],
    standards = [],
    allStandards = [],
    onStandardsChange,
    curriculum = '',
    allCurriculum = [],
    onCurriculumChange,
    onGradesChange,
    subject = '',
    onSubjectChange,
    collection = '',
    onCollectionChange,
    authoredList = [],
    filter,
    onFilterChange,
    authoredBy,
    onAuthorChange,
    handleApplyFilters,
    searchResourceBy,
  } = props

  const { allGrades, allSubjects, allStatus } = SELECT_DATA

  const Footer = [
    <EduButton
      data-cy="cancelPlaylistContentFilter"
      isGhost
      width="210px"
      height="38px"
      onClick={onCancel}
    >
      No, Cancel
    </EduButton>,
    <EduButton
      data-cy="proceedPlaylistContentFilter"
      width="210px"
      height="38px"
      onClick={handleApplyFilters}
    >
      Search
    </EduButton>,
  ]

  return (
    <CustomModalStyled
      title="Filter"
      visible={isVisible}
      onCancel={onCancel}
      footer={Footer}
      modalWidth="520px"
      centered
    >
      {searchResourceBy === 'resources' ? (
        <ResourcesFiltersModal
          subject={subject}
          onSubjectChange={onSubjectChange}
          allSubjects={allSubjects}
          curriculum={curriculum}
          onCurriculumChange={onCurriculumChange}
          allCurriculum={allCurriculum}
          standards={standards}
          onStandardsChange={onStandardsChange}
          allStandards={allStandards}
        />
      ) : (
        <>
          <FlexRow>
            <FieldLabel>type</FieldLabel>
            <SelectInputStyled
              dropdownClassName="playlist-content-box"
              data-cy="content-type"
              placeholder="Select Filter Type"
              value={filter}
              onChange={onFilterChange}
              height="36px"
            >
              {FILTERS.map(({ text, filter: _filter }) => (
                <SelectInputStyled.Option key={_filter} value={_filter}>
                  {text}
                </SelectInputStyled.Option>
              ))}
            </SelectInputStyled>
          </FlexRow>

          <FlexRow>
            <FieldLabel>status</FieldLabel>
            <SelectInputStyled
              dropdownClassName="playlist-content-box"
              data-cy="content-status"
              placeholder="Select Status"
              value={status}
              onChange={onStatusChange}
              height="36px"
            >
              {allStatus.map(({ text, value }) => (
                <SelectInputStyled.Option key={value} value={value}>
                  {text}
                </SelectInputStyled.Option>
              ))}
            </SelectInputStyled>
          </FlexRow>

          <FlexRow>
            <FieldLabel>authored by</FieldLabel>
            <SelectInputStyled
              dropdownClassName="playlist-content-box"
              data-cy="content-authored"
              placeholder="Select Authored"
              value={authoredBy || undefined}
              onChange={onAuthorChange}
              height="36px"
            >
              {authoredList.map(({ text, value }) => (
                <SelectInputStyled.Option key={value} value={value}>
                  {text}
                </SelectInputStyled.Option>
              ))}
            </SelectInputStyled>
          </FlexRow>

          <FlexRow>
            <FieldLabel>grade</FieldLabel>
            <SelectInputStyled
              dropdownClassName="playlist-content-box"
              data-cy="content-grade"
              mode="multiple"
              placeholder="Select Grades"
              value={grades}
              onChange={onGradesChange}
              height="36px"
            >
              {allGrades?.map(({ text, value }) => (
                <SelectInputStyled.Option key={value} value={value}>
                  {text}
                </SelectInputStyled.Option>
              ))}
            </SelectInputStyled>
          </FlexRow>

          <FlexRow>
            <FieldLabel>subject</FieldLabel>
            <SelectInputStyled
              dropdownClassName="playlist-content-box"
              data-cy="content-subject"
              placeholder="Select Subject"
              value={subject}
              onChange={onSubjectChange}
              height="36px"
            >
              {allSubjects.map(({ text, value }) => (
                <SelectInputStyled.Option key={value} value={value}>
                  {text}
                </SelectInputStyled.Option>
              ))}
            </SelectInputStyled>
          </FlexRow>

          <FlexRow>
            <FieldLabel>collection</FieldLabel>
            <SelectInputStyled
              dropdownClassName="playlist-content-box"
              data-cy="content-collection"
              placeholder="Select Collection"
              value={collection || undefined}
              onChange={onCollectionChange}
              height="36px"
            >
              {collectionsList.map(({ text, value }) => (
                <SelectInputStyled.Option key={value} value={value}>
                  {text}
                </SelectInputStyled.Option>
              ))}
            </SelectInputStyled>
          </FlexRow>
        </>
      )}
    </CustomModalStyled>
  )
}

export default PlaylistTestBoxFilter
