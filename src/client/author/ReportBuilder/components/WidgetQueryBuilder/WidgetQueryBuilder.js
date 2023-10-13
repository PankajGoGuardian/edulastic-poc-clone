import React, { useMemo, useState } from 'react'
import { Row, Col, Divider } from 'antd'
import styled from 'styled-components'
import MemberGroup from '../MemberGroup'
import FilterGroup from '../FilterGroup'
import TimeGroup from '../TimeGroup'

const ControlsRow = styled(Row)`
  background: #ffffff;
  margin-bottom: 12px;
  padding: 18px 28px 10px 28px;
`

const StyledDivider = styled(Divider)`
  margin: 0 12px;
  height: 4.5em;
  top: 0.5em;
  background: #f4f5f6;
`

const HorizontalDivider = styled(Divider)`
  padding: 0;
  margin: 0;
  background: #f4f5f6;
`

const DEFAULT_QUERY = {
  facts: [],
  dimensions: [],
  segments: [],
  timeDimensions: [],
  filters: [],
  order: [],
  source: '',
  total: true,
}

// TODO create custom hooks inside `./hooks` to reduce component size
export const WidgetQueryBuilder = ({
  value: valueFromProps,
  defaultValue,
  dataSources = [],
  onChange,
}) => {
  const isControlled = typeof valueFromProps !== 'undefined'
  const hasDefaultValue = typeof defaultValue !== 'undefined'

  /** @type {ReturnType<typeof useState<typeof DEFAULT_QUERY>>} */
  const [internalValue, setInternalValue] = useState(
    hasDefaultValue ? { ...DEFAULT_QUERY, ...defaultValue } : DEFAULT_QUERY
  )
  const value = useMemo(
    () =>
      isControlled ? { ...DEFAULT_QUERY, ...valueFromProps } : internalValue,
    [isControlled, valueFromProps, internalValue]
  )

  const handleChange = (_value) => {
    if (onChange) onChange(_value)
    if (!isControlled) setInternalValue(_value)
  }

  const {
    selectedDatasources,
    factsOptions,
    dimensionsOptions,
    segmentsOptions,
    timeDimensionsOptions,
    filtersOptions,
    facts,
    dimensions,
    segments,
    timeDimensions,
    filters,
    orderFields,
  } = useMemo(() => {
    const selectedDatasource = dataSources.find((ds) => ds._id === value.source)
    const result = {
      selectedDatasources: selectedDatasource ? [selectedDatasource] : [],
      factsOptions: selectedDatasource?.sourceSchema.facts || [],
      dimensionsOptions: selectedDatasource?.sourceSchema.dimensions || [],
      segmentsOptions: selectedDatasource?.sourceSchema.segments || [],
    }
    Object.assign(result, {
      timeDimensionsOptions: [
        ...result.factsOptions,
        ...result.dimensionsOptions,
      ].filter((m) => m.type === 'time'),
      filtersOptions: [...result.factsOptions, ...result.dimensionsOptions],
    })
    Object.assign(result, {
      facts: value.facts.flatMap((n) => {
        const member = result.factsOptions.find((m) => m.name === n)
        return member ? [member] : []
      }),
      dimensions: value.dimensions.flatMap((n) => {
        const member = result.dimensionsOptions.find((m) => m.name === n)
        return member ? [member] : []
      }),
      segments: value.segments.flatMap((n) => {
        const member = result.segmentsOptions.find((m) => m.name === n)
        return member ? [member] : []
      }),
      timeDimensions: value.timeDimensions.flatMap((n) => {
        const member = result.timeDimensionsOptions.find((m) => m.name === n)
        return member ? [member] : []
      }),
      filters: value.filters.flatMap((filter) => {
        const member = result.filtersOptions.find(
          (m) => filter.member === m.name
        )
        return member ? [{ ...filter, dimension: member }] : []
      }),
      orderFields: result.filtersOptions.filter((m) =>
        value.order?.some((of) => of[0] === m.name)
      ),
    })

    return result
  }, [dataSources, value])

  const handleDatasourceChange = (d) =>
    handleChange({ ...value, source: d[0]?._id })

  const getMemberChangeHandler = (memberType, options) => {
    const flatOptions = options.map((o) => o.name)
    return (members) => {
      handleChange({
        ...value,
        [memberType]: flatOptions.filter((opt) =>
          members.some((m) => m.name === opt)
        ),
      })
    }
  }
  const handleFiltersChange = (newFilters) => {
    handleChange({
      ...value,
      filters: newFilters.map((m) => ({
        member: m.dimension.name,
        operator: m.operator,
        values: m.values,
      })),
    })
  }
  const handleOrderChange = (_orderFields) => {
    handleChange({
      ...value,
      order: _orderFields.map((m) => [m.name, 'asc']),
    })
  }

  const shouldFilterBeVisible = value.facts.length || value.dimensions.length

  return (
    <ControlsRow type="flex" justify="space-around" align="top" key="1">
      <Col span={24}>
        <Row type="flex" align="top" style={{ paddingBottom: 23 }}>
          <MemberGroup
            title="Data Source"
            members={selectedDatasources}
            availableMembers={dataSources}
            addMemberName="Data source"
            updateMethods={handleDatasourceChange}
          />
          <StyledDivider type="vertical" />
          <MemberGroup
            title="Measures"
            members={facts}
            availableMembers={factsOptions}
            addMemberName="Measure"
            updateMethods={getMemberChangeHandler('facts', factsOptions)}
            multiple
          />
          <StyledDivider type="vertical" />
          <MemberGroup
            title="Dimensions"
            members={dimensions}
            availableMembers={dimensionsOptions}
            addMemberName="Dimension"
            updateMethods={getMemberChangeHandler(
              'dimensions',
              dimensionsOptions
            )}
            multiple
          />
          <StyledDivider type="vertical" />
          <MemberGroup
            title="Segments"
            members={segments}
            availableMembers={segmentsOptions}
            addMemberName="Segment"
            updateMethods={getMemberChangeHandler('segments', segmentsOptions)}
            multiple
          />
          <StyledDivider type="vertical" />
          <MemberGroup
            title="Order"
            members={orderFields}
            availableMembers={filtersOptions}
            addMemberName="Order"
            updateMethods={handleOrderChange}
            multiple
          />
          <StyledDivider type="vertical" />
          <TimeGroup
            title="Time"
            members={timeDimensions}
            availableMembers={timeDimensionsOptions}
            addMemberName="Time"
            updateMethods={getMemberChangeHandler(
              'timeDimensions',
              timeDimensionsOptions
            )}
            multiple
          />
        </Row>
        {!!shouldFilterBeVisible && (
          <>
            <HorizontalDivider />
            <Row
              type="flex"
              justify="space-around"
              align="top"
              gutter={24}
              style={{ marginTop: 10 }}
            >
              <Col span={24}>
                <FilterGroup
                  members={filters}
                  availableMembers={filtersOptions}
                  addMemberName="Filter"
                  updateMethods={handleFiltersChange}
                />
              </Col>
            </Row>
          </>
        )}
      </Col>
    </ControlsRow>
  )
}
