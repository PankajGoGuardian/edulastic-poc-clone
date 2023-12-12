import { useEffect, useMemo } from 'react'
import { intersection, uniq } from 'lodash'

import { notification } from '@edulastic/common'

import { MAX_CHECKED_STANDARDS } from '../utils'

const useRowSelection = (
  domainsData,
  standardsData,
  selectedDomains,
  setSelectedDomains,
  selectedStandards,
  setSelectedStandards,
  setDomainKeyToExpand
) => {
  const domainRowSelection = useMemo(
    () => ({
      selectedRowKeys: selectedDomains,
      onSelect: ({ domainId, standards }) => {
        const standardIds = standards.map(({ standardId }) => standardId)
        const isInsertOp = !selectedDomains.includes(domainId)

        if (isInsertOp) {
          setSelectedDomains(uniq([...selectedDomains, domainId]))
          setSelectedStandards(uniq([...selectedStandards, ...standardIds]))
          setDomainKeyToExpand(domainId)
        } else {
          setSelectedDomains(selectedDomains.filter((key) => key !== domainId))
          setSelectedStandards(
            selectedStandards.filter(
              (standardId) => !standardIds.includes(standardId)
            )
          )
        }
      },
      onSelectAll: (flag) => {
        if (flag) {
          setSelectedDomains(domainsData.map(({ domainId }) => domainId))
          setSelectedStandards(
            domainsData
              .flatMap(({ standards }) => standards)
              .map(({ standardId }) => standardId)
          )
        } else {
          setSelectedDomains([])
          setSelectedStandards([])
        }
      },
      getCheckboxProps: ({ standards }) => {
        const standardIds = standards.map(({ standardId }) => standardId)
        const checkedStandards = selectedStandards.filter((s) =>
          standardIds.includes(s)
        )
        return {
          checked:
            checkedStandards.length &&
            checkedStandards.length === standardIds.length,
          indeterminate:
            checkedStandards.length &&
            checkedStandards.length < standardIds.length,
        }
      },
    }),
    [selectedDomains, selectedStandards, domainsData]
  )

  const setDomainWhenStandardIsSelected = (standardId, isInsertOp) => {
    const standard = standardsData.find(
      ({ standardId: _sId }) => _sId === standardId
    )
    if (standard) {
      const domainId = `${standard.domainId}`
      if (isInsertOp) {
        setSelectedDomains(uniq([...selectedDomains, domainId]))
      } else {
        const allStandardsInDomain = domainsData
          .find(({ domainId: _dId }) => _dId === domainId)
          .standards.map(({ standardId: _sId }) => _sId)
        const _selectedStandards = selectedStandards.filter(
          (key) => key !== standardId
        )
        const domainStandardsInSelection = intersection(
          allStandardsInDomain,
          _selectedStandards
        )
        if (!domainStandardsInSelection.length) {
          setSelectedDomains(selectedDomains.filter((key) => key !== domainId))
        }
      }
    }
  }

  const standardsRowSelection = useMemo(
    () => ({
      selectedRowKeys: selectedStandards,
      onSelect: ({ standardId, key }) => {
        standardId = standardId ?? key
        const isInsertOp = !selectedStandards.includes(standardId)
        setSelectedStandards(
          isInsertOp
            ? uniq([...selectedStandards, standardId])
            : selectedStandards.filter(
                (_standardId) => _standardId !== standardId
              )
        )
        setDomainWhenStandardIsSelected(standardId, isInsertOp)
      },
    }),
    [selectedStandards]
  )

  useEffect(() => {
    if (selectedStandards.length > MAX_CHECKED_STANDARDS) {
      notification({
        type: 'info',
        messageKey: 'maxCheckedStandardsMessage',
        destroyAll: true,
      })
    }
  }, [selectedStandards])

  return {
    domainRowSelection,
    standardsRowSelection,
    setDomainWhenStandardIsSelected,
  }
}

export default useRowSelection
