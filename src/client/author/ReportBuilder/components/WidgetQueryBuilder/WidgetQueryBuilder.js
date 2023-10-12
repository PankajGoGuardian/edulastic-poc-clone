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
  source: '',
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
      facts: result.factsOptions.filter((m) => value.facts.includes(m.name)),
      dimensions: result.dimensionsOptions.filter((m) =>
        value.dimensions.includes(m.name)
      ),
      segments: result.segmentsOptions.filter((m) =>
        value.segments.includes(m.name)
      ),
      timeDimensions: result.timeDimensionsOptions.filter((m) =>
        value.timeDimensions.includes(m.name)
      ),
      filters: result.filtersOptions.flatMap((member) => {
        const filter = value.filters.find((f) => f.member === member.name)
        return filter ? [{ ...filter, dimension: member }] : []
      }),
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
