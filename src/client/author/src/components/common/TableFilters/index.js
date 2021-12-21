// components
import {
  EduButton,
  SearchInputStyled,
  SelectInputStyled,
} from '@edulastic/common'
import { Select } from 'antd'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { compose } from 'redux'
import {
  StyledCol,
  StyledRow,
} from '../../../../../admin/Common/StyledComponents/settingsContent'
import { FilterWrapper } from './styled'

const { Option } = Select

const TableFiltersView = ({
  t,
  showFilters = false,
  filtersData = [],
  filterStrDD = [],
  filterRef = [],
  firstColData = [],
  handleFilterColumn = () => {},
  handleFilterValue = () => {},
  handleFilterText = () => {},
  handleSearchFilter = () => {},
  handleBlurFilterText = () => {},
  handleStatusValue = () => {},
  handleAddFilter = () => {},
  handleRemoveFilter = () => {},
}) => {
  return (
    <FilterWrapper showFilters={showFilters}>
      {filtersData.map((item, i) => {
        const { filtersColumn, filtersValue, filterStr, filterAdded } = item
        const isFilterTextDisable = filtersColumn === '' || filtersValue === ''
        const isAddFilterDisable =
          filtersColumn === '' ||
          filtersValue === '' ||
          filterStr === '' ||
          !filterAdded

        return (
          <StyledRow mb="5px" gutter={20} key={i}>
            <StyledCol span={6}>
              <SelectInputStyled
                placeholder={t('common.selectcolumn')}
                onChange={(e) => handleFilterColumn(e, i)}
                value={filtersColumn || undefined}
                height="32px"
              >
                <Option value="other" disabled>
                  {t('common.selectcolumn')}
                </Option>
                {firstColData.map((x) => (
                  <Option value={x.toLowerCase()}>{x}</Option>
                ))}
              </SelectInputStyled>
            </StyledCol>
            <StyledCol span={6}>
              <SelectInputStyled
                placeholder={t('common.selectvalue')}
                onChange={(e) => handleFilterValue(e, i)}
                value={filtersValue || undefined}
                height="32px"
              >
                <Option value="" disabled>
                  {t('common.selectvalue')}
                </Option>
                <Option value="eq">{t('common.equals')}</Option>
                {!filterStrDD[filtersColumn] ? (
                  <Option value="cont">{t('common.contains')}</Option>
                ) : null}
              </SelectInputStyled>
            </StyledCol>
            <StyledCol span={6}>
              {!filterStrDD[filtersColumn] ? (
                <SearchInputStyled
                  placeholder={t('common.entertext')}
                  onChange={(e) => handleFilterText(e, i)}
                  onSearch={(v, e) => handleSearchFilter(v, e, i)}
                  onBlur={(e) => handleBlurFilterText(e, i)}
                  value={filterStr || undefined}
                  disabled={isFilterTextDisable}
                  ref={filterRef[i]}
                  height="32px"
                />
              ) : (
                <SelectInputStyled
                  placeholder={filterStrDD[filtersColumn].placeholder}
                  onChange={(v) => handleStatusValue(v, i)}
                  value={filterStr || undefined}
                  height="32px"
                >
                  {filterStrDD[filtersColumn].list.map((x) => (
                    <Option key={x.title} value={x.value} disabled={x.disabled}>
                      {x.title}
                    </Option>
                  ))}
                </SelectInputStyled>
              )}
            </StyledCol>
            <StyledCol span={6} style={{ display: 'flex' }}>
              {i < 2 && (
                <EduButton
                  height="32px"
                  width="50%"
                  type="primary"
                  onClick={(e) => handleAddFilter(e, i)}
                  disabled={isAddFilterDisable || i < filtersData.length - 1}
                >
                  {t('common.addfilter')}
                </EduButton>
              )}
              {((filtersData.length === 1 && filtersData[0].filterAdded) ||
                filtersData.length > 1) && (
                <EduButton
                  height="32px"
                  width="50%"
                  type="primary"
                  onClick={(e) => handleRemoveFilter(e, i)}
                >
                  {t('common.removefilter')}
                </EduButton>
              )}
            </StyledCol>
          </StyledRow>
        )
      })}
    </FilterWrapper>
  )
}

const enhance = compose(withNamespaces('manageDistrict'))

export default enhance(TableFiltersView)
