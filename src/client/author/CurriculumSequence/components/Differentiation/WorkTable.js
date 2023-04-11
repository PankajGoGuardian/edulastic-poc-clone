import React, { useState, useEffect, useMemo } from 'react'
import { useDrop } from 'react-dnd'
import { Popover, Row, Col } from 'antd'
import { groupBy, compact, isEmpty, isUndefined } from 'lodash'
import { EduButton, FlexContainer, notification } from '@edulastic/common' //  ProgressBar,
import { IconClose, IconUser } from '@edulastic/icons'
// import { themeColorLighter, borderGrey } from "@edulastic/colors";
import {
  TableContainer,
  StyledTable,
  TableHeader,
  Tag,
  StyledSlider,
  TableSelect,
  ActivityDropConainer,
  StyledDescription,
  StudentName,
  CommonStudentResourcesContainer,
} from './style'
import { ResouceIcon } from '../ResourceItem/index'
import Tags from '../../../src/components/common/Tags'
import { SubResourceView } from '../PlaylistResourceRow'
import { InlineDelete } from '../PlaylistResourceRow/styled'

function ContentDropContainer({ children, ...props }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'item',
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType,
    }),
    drop: (item) => {
      const {
        type,
        masteryRange,
        addTestToDifferentiation,
        addDifferentiationResources,
      } = props
      if (props.dropType === 'activity' && item.contentType === 'test') {
        addTestToDifferentiation({
          type: type.toLowerCase(),
          testId: item.id,
          testStandards: item.standardIdentifiers || [],
          masteryRange,
          title: item.contentTitle,
          contentType: item.contentType,
        })
      } else if (props.dropType === 'TOP_LEVEL_STUDENT_RESOURCE') {
        addDifferentiationResources({
          type: type.toLowerCase(),
          contentId: item.id,
          contentTitle: item.contentTitle,
          contentType: item.contentType,
          contentUrl: item.contentUrl,
          contentSubType: 'STUDENT',
        })
      }
    },
  })

  return (
    <ActivityDropConainer {...props} ref={dropRef} active={isOver}>
      {children}
    </ActivityDropConainer>
  )
}

function OuterDropContainer({ children }) {
  const [{ isOver, contentType }, dropRef] = useDrop({
    accept: 'item',
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType,
    }),
  })

  const showSupportingResource = contentType != 'test' && isOver
  return (
    <div ref={dropRef}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          showNewActivity: isOver && contentType === 'test',
          showSupportingResource,
        })
      )}
    </div>
  )
}

const InnerWorkTable = ({
  type,
  setRecommendationsToAssign,
  toggleAssignModal,
  selectedData,
  differentiationResources,
  differentiationStudentList,
  data = [],
  isFetchingWork,
  workStatusData,
  addTestToDifferentiation,
  addResourceToDifferentiation,
  showNewActivity,
  showSupportingResource,
  setEmbeddedVideoPreviewModal,
  showResource,
  removeResourceFromDifferentiation,
  addDifferentiationResources,
  removeDifferentiationResources,
  selectedRows,
  setSelectedRows,
}) => {
  const [masteryRange, setMasteryRange] = useState([0, 10])
  const [activeHoverIndex, setActiveHoverIndex] = useState(null)

  const isDisabledMasterySlider = useMemo(
    () => !!data.find((s) => s.status === 'ADDED'),
    [data]
  )
  const filteredStudentList = useMemo(
    () =>
      differentiationStudentList.filter(
        ({ performance }) =>
          performance >= masteryRange[0] && performance <= masteryRange[1]
      ),
    [masteryRange, differentiationStudentList]
  )

  const handleSliderChange = (value) => {
    if (isDisabledMasterySlider) return
    setMasteryRange(value)
  }

  useEffect(() => {
    if (type === 'REVIEW') {
      handleSliderChange([0, 70])
    } else if (type === 'PRACTICE') {
      handleSliderChange([70, 90])
    } else {
      handleSliderChange([90, 100])
    }
  }, [])

  /** Drop handle to accept dropped items from manage content (yet to be implemented) */
  const [{ isOver }, drop] = useDrop({
    accept: 'item',
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    drop: (item = {}) => {
      if (
        selectedData?.assignmentId &&
        selectedData?.classId &&
        item.contentType === 'test'
      ) {
        addTestToDifferentiation({
          type: type.toLowerCase(),
          testId: item.id,
          testStandards: item.standardIdentifiers || [],
          masteryRange,
          title: item.contentTitle,
        })
      } else {
        addResourceToDifferentiation({
          type: type.toLowerCase(),
          contentId: item.id,
          masteryRange,
          contentTitle: item.contentTitle,
          contentType: item.contentType,
          contentUrl: item.contentUrl,
        })
      }
    },
  })

  useEffect(() => {
    if (data[0]?.masteryRange) setMasteryRange(data[0].masteryRange)
  }, [data])

  // const getProgressBar = percentage => {
  //   if (!percentage && percentage !== 0) return null;
  //   const dataObj = {
  //     trailColor: borderGrey,
  //     strokeColor: themeColorLighter,
  //     percent: percentage || 0,
  //     format: percent => `${percent}%`
  //   };

  //   const { trailColor, strokeColor, percent, format } = dataObj;
  //   return (
  //     <div style={{ width: "120px" }}>
  //       <ProgressBar
  //         data-cy="progressbar"
  //         strokeWidth={10}
  //         trailColor={trailColor}
  //         strokeColor={strokeColor}
  //         percent={percent}
  //         format={format}
  //       />
  //     </div>
  //   );
  // };

  const getSlider = () => {
    if (type === 'REVIEW') {
      return (
        <>
          <StyledSlider
            min={1}
            value={masteryRange[1]}
            onChange={(value) => handleSliderChange([0, value])}
          />
          <span>{`Below ${masteryRange[1]}%`}</span>
        </>
      )
    }
    if (type === 'PRACTICE') {
      return (
        <>
          <StyledSlider
            range
            value={masteryRange}
            onChange={(value) => handleSliderChange(value)}
          />
          <span>{`Between ${masteryRange[0]}% and ${masteryRange[1]}%`}</span>
        </>
      )
    }
    if (type === 'CHALLENGE') {
      return (
        <>
          <StyledSlider
            reverse
            value={100 - masteryRange[0]}
            onChange={(value) => handleSliderChange([100 - value, 100])}
            min={1}
            tipFormatter={(value) => `${100 - value}`}
          />
          <span>{`Above ${masteryRange[0]}%`}</span>
        </>
      )
    }
  }

  const handleRowSelect = (selectionType) => {
    if (selectionType === 'UNSELECT') {
      setSelectedRows({ ...selectedRows, [type]: [] })
    } else {
      const keyArray = [...Array(data.length).keys()]
      setSelectedRows({ ...selectedRows, [type]: keyArray })
    }
  }

  const viewResource = (_data) => {
    if (_data.contentType === 'lti_resource') showResource(_data.contentId)
    if (_data.contentType === 'website_resource')
      window.open(_data.contentUrl, '_blank')
    if (_data.contentType === 'video_resource')
      setEmbeddedVideoPreviewModal({
        title: _data.description,
        url: _data.contentUrl,
      })
  }

  const columns = [
    {
      title: () => (
        <TableSelect>
          <span data-cy="select-all" onClick={() => handleRowSelect('SELECT')}>
            Select All
          </span>
          <span
            data-cy="deselect-all"
            onClick={() => handleRowSelect('UNSELECT')}
          >
            Unselect All
          </span>
        </TableSelect>
      ),
      dataIndex: 'standardIdentifier',
      key: 'standardIdentifier',
      render: (s, record) => {
        const isTest = !!record.testId

        if (isTest) {
          return <Tags tags={['Custom Test']} />
        }

        return record.testId || record.contentId ? (
          record?.testStandards?.length ? (
            <Tags tags={record.testStandards} show={1} />
          ) : (
            <ResouceIcon type={record.contentType || 'test'} />
          )
        ) : (
          <Tag marginRight="10px">{s}</Tag>
        )
      },
    },
    {
      title: '',
      dataIndex: 'description',
      key: 'description',
      align: 'left',
      render: (s, record, index) => {
        const containerProps = {
          type,
          masteryRange,
          addTestToDifferentiation,
        }
        return (
          <FlexContainer flexDirection="column" alignItems="flex-start">
            <StyledDescription
              clickable={record.contentId}
              onClick={() => record.contentId && viewResource(record)}
            >
              {record.description}
            </StyledDescription>
            <div
              data-cy={`${type}-testDropContainer`}
              style={{ width: '100%' }}
            >
              {showNewActivity && activeHoverIndex === index && (
                <ContentDropContainer
                  data-cy={`${type}-newActivityDropContainer`}
                  dropType="activity"
                  {...containerProps}
                >
                  New Activity
                </ContentDropContainer>
              )}
            </div>
          </FlexContainer>
        )
      },
    },
    // {
    //   title: "AVG. Mastery",
    //   dataIndex: "averageMastery",
    //   key: "averageMastery",
    //   width: "150px",
    //   render: p => getProgressBar(p)
    // },
    {
      title: 'STARTED',
      dataIndex: 'notStartedCount',
      key: 'notStartedCount',
      width: '130px',
      render: (s) => {
        if (isUndefined(s) || !filteredStudentList?.length) {
          return null
        }

        return `${Math.ceil(
          ((filteredStudentList.length - s) / filteredStudentList.length) * 100
        )}%`
      },
    },
    {
      title: '',
      key: 'status',
      dataIndex: 'status',
      width: '145px',
      align: 'center',
      render: (s, record) => {
        // For tests, if not already assigned, don't show the status.
        if (!!record.testId && s !== 'ADDED') {
          return null
        }

        return <Tag>{s === 'ADDED' ? 'ASSIGNED' : s}</Tag>
      },
    },
    {
      title: '',
      key: 'action-delete',
      dataIndex: 'delete',
      width: '40px',
      align: 'center',
      render: (_, _record) =>
        _record.testId &&
        _record.status === 'RECOMMENDED' && (
          <InlineDelete
            data-cy="delete-test"
            title="Delete Test"
            onClick={() =>
              removeResourceFromDifferentiation({
                ..._record,
                type: type?.toLowerCase(),
              })
            }
          >
            <IconClose />
          </InlineDelete>
        ),
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows[type],
    onChange: (selectedRowKeys) => {
      setSelectedRows({ ...selectedRows, [type]: selectedRowKeys })
    },
  }

  const getResourceTitle = () => {
    if (type === 'REVIEW') {
      return `Review Work #${workStatusData.length + 1} - ${selectedData.title}`
    }
    if (type === 'PRACTICE') {
      return `Practice Work #${workStatusData.length + 1} - ${
        selectedData.title
      }`
    }
    if (type === 'CHALLENGE') {
      return `Challenge Work #${workStatusData.length + 1} - ${
        selectedData.title
      }`
    }
  }

  const handleAdd = () => {
    if (!selectedRows[type].length)
      return notification({
        messageKey: 'pleaseSelectAtleastOneStandardToAdd',
      })
    if (!filteredStudentList.length)
      return notification({ messageKey: 'pleaseSelectMastery' })

    const recommendations = []
    const selectedRowsData = selectedRows[type].map((x) => data[x])
    const groupByResources = groupBy(selectedRowsData, ({ resources }) =>
      (resources || [])
        ?.map((x) => x.contentId)
        .sort()
        .join(',')
    )
    for (const key of Object.keys(groupByResources)) {
      const rowsData = groupByResources[key]
      const groups = groupBy(rowsData, (x) =>
        x.testId ? 'tests' : 'standards'
      )
      if (groups.standards) {
        const standardIdentifiers = groups.standards.map(
          (x) => x.standardIdentifier
        )
        const skillIdentifiers = compact(
          groups.standards.map((x) => x.skillIdentifier)
        )
        const obj = {
          assignmentId: selectedData.assignmentId,
          groupId: selectedData.classId,
          standardIdentifiers,
          type,
          masteryRange: {
            min: masteryRange[0],
            max: masteryRange[1],
          },
          resourceTitle: getResourceTitle(),
          ...(rowsData[0]?.resources?.length
            ? { resources: rowsData[0]?.resources }
            : {}),
          resources: differentiationResources?.[type.toLowerCase()] || [],
        }
        if (!isEmpty(skillIdentifiers)) {
          obj.skillIdentifiers = skillIdentifiers
        }
        recommendations.push(obj)
      }

      if (groups.tests) {
        const testIds = groups.tests.map((x) => x.testId)
        const obj = {
          assignmentId: selectedData.assignmentId,
          groupId: selectedData.classId,
          testIds,
          type,
          masteryRange: {
            min: masteryRange[0],
            max: masteryRange[1],
          },
          resourceTitle: getResourceTitle(),
          ...(rowsData[0]?.resources?.length
            ? { resources: rowsData[0]?.resources }
            : {}),
          resources: differentiationResources?.[type.toLowerCase()] || [],
        }
        recommendations.push(obj)
      }
    }

    setRecommendationsToAssign({
      recommendations,
    })
    toggleAssignModal(true)
  }

  const studentList = (
    <FlexContainer flexDirection="column">
      {filteredStudentList.map((s) => (
        <StudentName>{s.userFullName}</StudentName>
      ))}
    </FlexContainer>
  )

  const userCountComponent = (count) => (
    <FlexContainer data-cy="studentCount">
      <IconUser data-cy="student" />
      &nbsp;&nbsp;{count}
    </FlexContainer>
  )

  const userCount = (count, content) =>
    count > 0 ? (
      <Popover content={content} placement="bottom">
        {userCountComponent(count)}
      </Popover>
    ) : (
      userCountComponent(count)
    )

  return (
    <TableContainer h1ighlighted={isOver} data-cy={`table-${type}`}>
      <TableHeader>
        <span>
          {type === 'REVIEW'
            ? 'Review Work'
            : type === 'PRACTICE'
            ? 'Practice Work'
            : 'Challenge Work'}
        </span>
        <span>
          <span>Mastery Range</span>
          <>{getSlider()}</>
        </span>
        <span>{userCount(filteredStudentList.length, studentList)}</span>
        <span>
          {/* Hiding the button for now
          
          <EduButton isGhost height="30px">
            Replace
          </EduButton> */}
          <EduButton
            data-cy={`addButton-${type}`}
            height="30px"
            onClick={handleAdd}
          >
            Assign
          </EduButton>
        </span>
      </TableHeader>
      <CommonStudentResourcesContainer>
        <SubResourceView
          data={{
            resources: differentiationResources?.[type.toLowerCase()] || [],
          }}
          mode="embedded"
          showResource={showResource}
          setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
          removeSubResource={removeDifferentiationResources}
          type={type.toLowerCase()}
          inDiffrentiation
          isCommonStudentResources
        />
        {showSupportingResource && (
          <Row gutter={16} align="middle">
            <Col md={8}>
              <ContentDropContainer
                dropType="TOP_LEVEL_STUDENT_RESOURCE"
                type={type}
                addDifferentiationResources={addDifferentiationResources}
                data-cy={`${type}-studentResourceDropContainer`}
              >
                Student Resource
              </ContentDropContainer>
            </Col>
          </Row>
        )}
      </CommonStudentResourcesContainer>

      {!showNewActivity || data.length ? (
        <StyledTable
          columns={columns}
          rowSelection={rowSelection}
          dataSource={data}
          pagination={false}
          loading={isFetchingWork}
          onRow={(record, rowIndex) => ({
            onDragOver: () => setActiveHoverIndex(rowIndex),
          })}
        />
      ) : null}
      {showNewActivity && !data.length && (
        <ActivityDropConainer
          data-cy={`${type}-activityDropContainer`}
          height="195px"
          active={isOver}
          ref={drop}
        >
          New Activity
        </ActivityDropConainer>
      )}
    </TableContainer>
  )
}

const WorkTable = (props) => (
  <OuterDropContainer>
    <InnerWorkTable {...props} />
  </OuterDropContainer>
)

export default WorkTable
