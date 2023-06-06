import { grey, themeColor, titleColor } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import {
  roleuser,
  test as testsConstants,
  libraryFilters,
  folderTypes,
} from '@edulastic/constants'
import { IconExpandBox } from '@edulastic/icons'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { get, isEqual, keyBy } from 'lodash'
import {
  getCurrentDistrictUsersAction,
  getCurrentDistrictUsersSelector,
} from '../../../../student/Login/ducks'
import StandardsSearchModal from '../../../ItemList/components/Search/StandardsSearchModal'
import TestFiltersNav from '../../../src/components/common/TestFilters/TestFiltersNav'
import Folders from '../../../src/components/Folders'
import {
  getFormattedCurriculumsSelector,
  getStandardsListSelector,
} from '../../../src/selectors/dictionaries'
import {
  canAccessPublicContentSelector,
  getCollectionsSelector,
  getUserFeatures,
  getUserOrgId,
  getUserRole,
  isDistrictUserSelector,
  isOrganizationDistrictSelector,
} from '../../../src/selectors/user'
import { removeTestFromCartAction } from '../../ducks'
import filterData from './FilterData'
import FiltersSidebar from './FiltersSidebar'
import { getDictStandardsForCurriculumAction } from '../../../src/actions/dictionaries'

const { FILTER_KEYS } = libraryFilters

const filtersTitle = ['Grades', 'Subject', 'Status']
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
  filterMenuItems,
  userFeatures,
  districtId,
  currentDistrictUsers,
  removeTestFromCart,
  getCurrentDistrictUsers,
  userRole,
  isOrgUser,
  isDistrictUser,
  isSingaporeMath,
  elosByTloId,
  getCurriculumStandards,
  canAccessPublicContent,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [searchProps, setSearchProps] = useState({
    id: '',
    grades: [],
    searchStr: '',
  })
  const [filteredCollections, setFilteredCollections] = useState(collections)
  const isPublishers = !!(
    userFeatures.isPublisherAuthor || userFeatures.isCurator
  )

  useEffect(() => {
    if (userFeatures.isCurator && !currentDistrictUsers?.length) {
      getCurrentDistrictUsers(districtId)
    }
  }, [])
  useEffect(() => {
    const tempCollections = collections
    collections.forEach((item, index) => {
      if (isSingaporeMath && item?.name?.toLowerCase()?.includes('engage ny')) {
        tempCollections.splice(index, 1)
        setFilteredCollections(tempCollections)
      }
    })
  }, [isSingaporeMath, collections])

  const collectionDefaultFilter = useMemo(() => {
    if (userRole === roleuser.EDULASTIC_CURATOR) {
      return testsConstants.collectionDefaultFilter.filter(
        (c) => !['SCHOOL', 'DISTRICT', 'PUBLIC', 'INDIVIDUAL'].includes(c.value)
      )
    }
    return canAccessPublicContent
      ? testsConstants.collectionDefaultFilter.concat(
          testsConstants.collectionPublicFilter
        )
      : testsConstants.collectionDefaultFilter
  }, [testsConstants.collectionDefaultFilter, userRole, canAccessPublicContent])

  const getAuthoredByFilterData = useCallback(() => {
    if (!userFeatures.isCurator) return []

    return [
      {
        mode: 'multiple',
        title: 'Authored By',
        placeholder: 'All Authors',
        size: 'large',
        filterOption: searchFilterOption,
        data: [
          ...(currentDistrictUsers || []).map((o) => ({
            value: o._id,
            text: `${o.firstName} ${o.lastName}`,
          })),
        ],
        onChange: 'authoredByIds',
      },
    ]
  }, [userFeatures.isCurator, searchFilterOption, currentDistrictUsers])

  const { filter } = search
  const getFilters = useCallback(() => {
    let filterData1 = []
    if (isPlaylist) {
      const filterTitles = ['Grades', 'Subject']
      const showStatusFilter =
        ((userFeatures.isPublisherAuthor || isOrgUser || isDistrictUser) &&
          filter !== filterMenuItems[0].filter) ||
        userFeatures.isCurator
      if (showStatusFilter) {
        filterTitles.push('Status')
      }
      filterData1 = filterData.filter((o) => filterTitles.includes(o.title))
      if (filter === libraryFilters.SMART_FILTERS.FAVORITES) {
        return filterData1
      }
      return [
        ...filterData1,
        {
          mode: 'multiple',
          title: 'Collections',
          placeholder: 'All Collections',
          size: 'large',
          filterOption: searchFilterOption,
          optionFilterProp: 'children',
          data: [
            ...collectionDefaultFilter.filter((c) => c.value),
            ...filteredCollections.map((o) => ({ value: o._id, text: o.name })),
          ],
          onChange: 'collections',
        },
        {
          mode: 'multiple',
          size: 'large',
          title: 'Tags',
          placeholder: 'Please select',
          onChange: 'tags',
          tagTypes: ['playlist'],
          useElasticSearch: true,
        },
        ...getAuthoredByFilterData(),
      ]
    }

    const { curriculumId = '', subject = [], standardIds = [] } = search
    const dropDownElosById = keyBy(curriculumStandards.elo, '_id')
    const standardsNotInDropdown = standardIds.filter(
      (item) => !dropDownElosById[item._id]
    )
    const _curriculumStandards = {
      ...curriculumStandards,
      elo: [...curriculumStandards.elo, ...standardsNotInDropdown],
    }
    const formattedStandards = (_curriculumStandards.elo || []).map((item) => ({
      value: item._id,
      text: item.identifier,
    }))

    const handleSearchStandard = (searchStr = '') => {
      const { grades = [], curriculumId: selectedCurriculumId } = search || {}
      const searchObject = { id: selectedCurriculumId, grades, searchStr }
      if (!isEqual(searchProps, searchObject)) {
        setSearchProps(searchObject)
        getCurriculumStandards(selectedCurriculumId, grades, searchStr)
      }
    }
    const showStatusFilter =
      ((userFeatures.isPublisherAuthor || isOrgUser || isDistrictUser) &&
        filter !== filterMenuItems[0].filter) ||
      userFeatures.isCurator

    let filtersTitles = [...filtersTitle]
    if (!showStatusFilter) {
      filtersTitles = filtersTitles.filter((f) => f !== 'Status')
    }
    filterData1 = filterData.filter((o) => filtersTitles.includes(o.title))

    if (filter === libraryFilters.SMART_FILTERS.FAVORITES) {
      return filterData1
    }
    let curriculumsList = []
    if (subject.length) curriculumsList = [...formattedCuriculums]
    filterData1.splice(
      2,
      0,
      ...[
        {
          size: 'large',
          title: 'Standard set',
          onChange: 'curriculumId',
          data: [{ value: '', text: 'All Standard set' }, ...curriculumsList],
          optionFilterProp: 'children',
          filterOption: searchFilterOption,
          showSearch: true,
        },
        {
          size: 'large',
          mode: 'multiple',
          placeholder: 'All Standards',
          title: 'Standards',
          disabled: !curriculumId,
          onChange: FILTER_KEYS.STANDARD_IDS,
          optionFilterProp: 'children',
          data: formattedStandards,
          filterOption: false,
          onSearch: handleSearchStandard,
          onFocus: handleSearchStandard,
          showSearch: true,
          isStandardSelect: true,
          handleShowBrowseModal: () => {
            setShowModal(true)
          },
        },
        {
          mode: 'multiple',
          title: 'Collections',
          placeholder: 'All Collections',
          size: 'large',
          filterOption: searchFilterOption,
          optionFilterProp: 'children',
          data: [
            ...collectionDefaultFilter.filter((c) => c.value),
            ...filteredCollections.map((o) => ({ value: o._id, text: o.name })),
          ],
          onChange: 'collections',
        },
      ]
    )
    filterData1 = [
      ...filterData1,
      ...getAuthoredByFilterData(),
      {
        mode: 'multiple',
        size: 'large',
        title: 'Tags',
        placeholder: 'Please select',
        onChange: 'tags',
        tagTypes: ['test'],
        useElasticSearch: true,
      },
    ]
    return filterData1
  }, [
    collectionDefaultFilter,
    curriculumStandards.elo,
    filter,
    filterData,
    filteredCollections,
    filterMenuItems[0].filter,
    filtersTitle,
    formattedCuriculums,
    getAuthoredByFilterData,
    isDistrictUser,
    isOrgUser,
    isPlaylist,
    libraryFilters.SMART_FILTERS.FAVORITES,
    search.curriculumId,
    search.subject,
    searchFilterOption,
    userFeatures.isCurator,
    userFeatures.isPublisherAuthor,
  ])

  const handleApply = (_standardIds) => {
    const dropDownElos = curriculumStandards.elo
    const cachedElos = Object.values(elosByTloId).flat()
    const _elosById = keyBy(
      [...search.standardIds, ...dropDownElos, ...cachedElos],
      '_id'
    )
    const values = _standardIds.map((item) => ({
      _id: item,
      identifier: _elosById[item].identifier,
    }))
    onChange(FILTER_KEYS.STANDARD_IDS, values)
  }

  const handleSetShowModal = () => {
    if (!search.curriculumId) return
    setShowModal(true)
  }

  const mappedfilterData = useMemo(() => {
    let _mappedfilterData = getFilters()
    if (isPublishers) {
      const filtersToBeMoved = _mappedfilterData.filter((f) =>
        ['Status', 'Authored By'].includes(f.title)
      )
      _mappedfilterData = [
        ...filtersToBeMoved,
        ..._mappedfilterData.filter(
          (f) => !['Status', 'Authored By'].includes(f.title)
        ),
      ]
    }
    return _mappedfilterData
  }, [isPublishers, getFilters])

  const selectedCurriculam = formattedCuriculums?.find(
    ({ value }) => value === search?.curriculumId
  )

  const handleStandardsAlert = ({ title, disabled }) => {
    if (title === 'Standards' && disabled) {
      return 'Select Grades, Subject and Standard Set before selecting Standards'
    }
    return ''
  }

  const handleSelectFolder = (folderId) => {
    onChange('folderId', folderId)
  }

  const isFolderSearch = filter === libraryFilters.SMART_FILTERS.FOLDERS

  const isDA = userRole === roleuser.DISTRICT_ADMIN

  return (
    <Container>
      {showModal && (
        <StandardsSearchModal
          setShowModal={setShowModal}
          showModal={showModal}
          standardIds={search.standardIds.map((item) => item._id)}
          standards={search.standardIds}
          handleApply={handleApply}
          selectedCurriculam={selectedCurriculam}
          grades={search.grades}
        />
      )}
      <FilerHeading justifyContent="space-between">
        <Title>FILTERS</Title>
        <ClearAll data-cy="clearAll" onClick={clearFilter}>
          CLEAR ALL
        </ClearAll>
      </FilerHeading>
      <TestFiltersNav
        items={
          userRole === roleuser.EDULASTIC_CURATOR
            ? [filterMenuItems[0]]
            : filterMenuItems
        }
        onSelect={handleLabelSearch}
        search={search}
      />
      {!isFolderSearch &&
        mappedfilterData.map((filterItem, index) => {
          if (
            filterItem.title === 'Authored By' &&
            search.filter === 'AUTHORED_BY_ME'
          )
            return null
          return (
            <>
              <FilterItemWrapper
                key={index}
                title={handleStandardsAlert(filterItem)}
              >
                {filterItem.isStandardSelect && (
                  <IconExpandBoxWrapper
                    className={filterItem.disabled && 'disabled'}
                  >
                    <IconExpandBox onClick={handleSetShowModal} />
                  </IconExpandBoxWrapper>
                )}
                <FiltersSidebar
                  filterItem={filterItem}
                  onChange={(key, value) => {
                    if (key === FILTER_KEYS.STANDARD_IDS) {
                      const _elosById = keyBy(
                        [...curriculumStandards.elo, ...search.standardIds],
                        '_id'
                      )
                      const values = value.map((item) => ({
                        _id: item,
                        identifier: _elosById[item].identifier,
                      }))
                      return onChange(key, values)
                    }
                    onChange(key, value)
                  }}
                  search={search}
                  isDA={isDA}
                />
              </FilterItemWrapper>
            </>
          )
        })}
      <Folders
        onSelectFolder={handleSelectFolder}
        folderType={folderTypes.TEST}
        isActive={isFolderSearch}
        removeItemFromCart={removeTestFromCart}
      />
    </Container>
  )
}

TestListFilters.propTypes = {
  onChange: PropTypes.func,
  clearFilter: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired,
}

TestListFilters.defaultProps = {
  onChange: () => null,
}

export default connect(
  (state, { search = {} }) => ({
    curriculumStandards: getStandardsListSelector(state),
    collections: getCollectionsSelector(state),
    formattedCuriculums: getFormattedCurriculumsSelector(state, search),
    userFeatures: getUserFeatures(state),
    districtId: getUserOrgId(state),
    currentDistrictUsers: getCurrentDistrictUsersSelector(state),
    userRole: getUserRole(state),
    isOrgUser: isOrganizationDistrictSelector(state),
    isDistrictUser: isDistrictUserSelector(state),
    elosByTloId: get(state, 'dictionaries.elosByTloId', {}),
    canAccessPublicContent: canAccessPublicContentSelector(state),
  }),
  {
    getCurrentDistrictUsers: getCurrentDistrictUsersAction,
    removeTestFromCart: removeTestFromCartAction,
    getCurriculumStandards: getDictStandardsForCurriculumAction,
  }
)(TestListFilters)

const Container = styled.div`
  padding: 27px 0;

  @media (min-width: 993px) {
    padding-right: 35px;
  }
`

const FilerHeading = styled(FlexContainer)`
  margin-bottom: 10px;
`

const Title = styled.span`
  color: ${titleColor};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
`

export const FilterItemWrapper = styled.div`
  position: relative;
`

const ClearAll = styled.span`
  color: ${themeColor};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  :hover {
    color: ${themeColor};
  }
`

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
`
