import React, { useState, useEffect, useMemo } from "react";
import { useDrop } from "react-dnd";
import { message } from "antd";
import { groupBy } from "lodash";
import { ProgressBar, EduButton, FlexContainer } from "@edulastic/common";
import { IconUser } from "@edulastic/icons";
import { themeColorLighter, borderGrey } from "@edulastic/colors";
import {
  TableContainer,
  StyledTable,
  TableHeader,
  Tag,
  StyledSlider,
  TableSelect,
  ActivityDropConainer,
  StyledDescription
} from "./style";
import { ResouceIcon } from "../ResourceItem/index";
import Tags from "../../../src/components/common/Tags";

function ContentDropContainer({ children, ...props }) {
  const [{ isOver, contentType }, dropRef] = useDrop({
    accept: "item",
    collect: monitor => {
      return {
        isOver: !!monitor.isOver(),
        contentType: monitor.getItem()?.contentType
      };
    },
    drop: (item, monitor) => {
      const {
        parentTestId,
        type,
        masteryRange,
        addTestToDifferentiation,
        addResourceToDifferentiation,
        addSubResourceToTestInDiff
      } = props;
      if (props.dropType === "activity") {
        if (item.contentType === "test") {
          addTestToDifferentiation({
            type: type.toLowerCase(),
            testId: item.id,
            testStandards: item.standardIdentifiers || [],
            masteryRange,
            title: item.contentTitle,
            contentType: item.contentType
          });
        } else {
          addResourceToDifferentiation({
            type: type.toLowerCase(),
            contentId: item.id,
            masteryRange,
            contentTitle: item.contentTitle,
            contentType: item.contentType,
            contentUrl: item.contentUrl
          });
        }
      } else {
        addSubResourceToTestInDiff({
          type: type.toLowerCase(),
          contentId: item.id,
          masteryRange,
          contentTitle: item.contentTitle,
          contentType: item.contentType,
          contentUrl: item.contentUrl,
          parentTestId
        });
      }
    }
  });

  return (
    <ActivityDropConainer {...props} ref={dropRef} active={isOver}>
      {children}
    </ActivityDropConainer>
  );
}

function OuterDropContainer({ index, children }) {
  const [{ isOver, contentType }, dropRef] = useDrop({
    accept: "item",
    collect: monitor => {
      return {
        isOver: !!monitor.isOver(),
        contentType: monitor.getItem()?.contentType
      };
    }
  });

  const showSupportingResource = contentType != "test" && isOver;
  return (
    <div ref={dropRef}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { showNewActivity: isOver, showSupportingResource })
      )}
    </div>
  );
}

const InnerWorkTable = ({
  type,
  addRecommendations,
  selectedData,
  differentiationStudentList,
  data = [],
  isFetchingWork,
  workStatusData,
  addTestToDifferentiation,
  addResourceToDifferentiation,
  showNewActivity,
  addSubResourceToTestInDiff,
  setEmbeddedVideoPreviewModal,
  showResource
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [masteryRange, setMasteryRange] = useState([0, 10]);

  const isDisabledMasterySlider = useMemo(() => !!data.find(s => s.status === "ADDED"), [data]);
  const filteredStudentList = useMemo(
    () =>
      differentiationStudentList.filter(
        ({ performance }) => performance >= masteryRange[0] && performance <= masteryRange[1]
      ),
    [masteryRange, differentiationStudentList]
  );

  const handleSliderChange = value => {
    if (isDisabledMasterySlider) return;
    setMasteryRange(value);
  };

  useEffect(() => {
    if (type === "REVIEW") {
      handleSliderChange([0, 70]);
    } else if (type === "PRACTICE") {
      handleSliderChange([70, 90]);
    } else {
      handleSliderChange([90, 100]);
    }
  }, []);

  /** Drop handle to accept dropped items from manage content (yet to be implemented) */
  const [{ isOver, itemContentType }, drop] = useDrop({
    accept: "item",
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      itemContentType: monitor.getItem()?.contentType
    }),
    drop: (item = {}, monitor) => {
      if (selectedData?.assignmentId && selectedData?.classId && item.contentType === "test") {
        addTestToDifferentiation({
          type: type.toLowerCase(),
          testId: item.id,
          testStandards: item.standardIdentifiers || [],
          masteryRange,
          title: item.contentTitle
        });
      } else {
        addResourceToDifferentiation({
          type: type.toLowerCase(),
          contentId: item.id,
          masteryRange,
          contentTitle: item.contentTitle,
          contentType: item.contentType,
          contentUrl: item.contentUrl
        });
      }
    }
  });

  useEffect(() => {
    if (data[0]?.masteryRange) setMasteryRange(data[0].masteryRange);
  }, [data]);

  useEffect(() => {
    if (!isFetchingWork) {
      setSelectedRows([]);
    }
  }, [isFetchingWork]);

  const getProgressBar = percentage => {
    if (!percentage && percentage !== 0) return null;
    const dataObj = {
      trailColor: borderGrey,
      strokeColor: themeColorLighter,
      percent: percentage || 0,
      format: percent => `${percent}%`
    };

    const { trailColor, strokeColor, percent, format } = dataObj;
    return (
      <div style={{ width: "120px" }}>
        <ProgressBar
          data-cy="progressbar"
          strokeWidth={10}
          trailColor={trailColor}
          strokeColor={strokeColor}
          percent={percent}
          format={format}
        />
      </div>
    );
  };

  const getSlider = () => {
    if (type === "REVIEW") {
      return (
        <>
          <StyledSlider min={1} value={masteryRange[1]} onChange={value => handleSliderChange([0, value])} />
          <span>{`Below ${masteryRange[1]}%`}</span>
        </>
      );
    }
    if (type === "PRACTICE") {
      return (
        <>
          <StyledSlider range value={masteryRange} onChange={value => handleSliderChange(value)} />
          <span>{`Between ${masteryRange[0]}% and ${masteryRange[1]}%`}</span>
        </>
      );
    }
    if (type === "CHALLENGE") {
      return (
        <>
          <StyledSlider
            reverse
            value={100 - masteryRange[0]}
            onChange={value => handleSliderChange([100 - value, 100])}
            min={1}
            tipFormatter={value => `${100 - value}`}
          />
          <span>{`Above ${masteryRange[0]}%`}</span>
        </>
      );
    }
  };

  const handleRowSelect = selectionType => {
    if (selectionType === "UNSELECT") {
      setSelectedRows([]);
    } else {
      const keyArray = [];
      data.forEach((row, i) => {
        if (row.status === "RECOMMENDED") {
          keyArray.push(i);
        }
      });
      setSelectedRows(keyArray);
    }
  };

  const viewResource = data => {
    if (data.contentType === "lti_resource") showResource(data.contentId);
    if (data.contentType === "website_resource") window.open(data.contentUrl, "_blank");
    if (data.contentType === "video_resource")
      setEmbeddedVideoPreviewModal({ title: data.description, url: data.contentUrl });
  };

  const columns = [
    {
      title: () => (
        <TableSelect>
          <span data-cy="select-all" onClick={() => handleRowSelect("SELECT")}>
            Select All
          </span>
          <span data-cy="deselect-all" onClick={() => handleRowSelect("UNSELECT")}>
            Unselect All
          </span>
        </TableSelect>
      ),
      dataIndex: "standardIdentifier",
      key: "standardIdentifier",
      render: (s, record) => {
        return record.testId || record.contentId ? (
          record?.testStandards?.length ? (
            <Tags tags={record.testStandards} show={1} />
          ) : (
            <ResouceIcon type={record.contentType || "test"} />
          )
        ) : (
          <Tag marginRight="10px">{s}</Tag>
        );
      }
    },
    {
      title: "",
      dataIndex: "description",
      key: "description",
      align: "left",
      render: (s, record, index) => {
        const containerProps = { type, masteryRange, addResourceToDifferentiation, addTestToDifferentiation };
        return (
          <FlexContainer flexDirection="column" alignItems="flex-start">
            <StyledDescription clickable={record.contentId} onClick={() => record.contentId && viewResource(record)}>
              {record.description}
            </StyledDescription>
            {showNewActivity && itemContentType !== "test" && record.testId && (
              <ContentDropContainer
                dropType="subResource"
                {...containerProps}
                parentTestId={record.testId}
                addSubResourceToTestInDiff={addSubResourceToTestInDiff}
              >
                Supporting Resource
              </ContentDropContainer>
            )}

            {showNewActivity && (
              <ContentDropContainer dropType="activity" {...containerProps}>
                New Activity
              </ContentDropContainer>
            )}
          </FlexContainer>
        );
      }
    },

    {
      title: "AVG. Mastery",
      dataIndex: "averageMastery",
      key: "averageMastery",
      width: "150px",
      render: p => getProgressBar(p)
    },
    {
      title: "NOT STARTED",
      dataIndex: "notStartedCount",
      key: "notStartedCount",
      width: "130px",
      render: s => (s !== undefined ? `${s} Students` : null)
    },
    {
      title: "",
      key: "status",
      dataIndex: "status",
      width: "145px",
      align: "center",
      render: s => <Tag>{s}</Tag>
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: selectedRowKeys => {
      setSelectedRows(selectedRowKeys);
    },
    getCheckboxProps: record => ({
      disabled: record.status === "ADDED"
    })
  };

  const getResourceTitle = () => {
    if (type === "REVIEW") {
      return `Review #${workStatusData.length + 1} - ${selectedData.title}`;
    }
    if (type === "PRACTICE") {
      return `Practice #${workStatusData.length + 1} - ${selectedData.title}`;
    }
    if (type === "CHALLENGE") {
      return `Challenge #${workStatusData.length + 1} - ${selectedData.title}`;
    }
  };

  const handleAdd = () => {
    if (!selectedRows.length) return message.error("Please select atleast one standard to add.");
    if (!filteredStudentList.length)
      return message.error("Please select the mastery range which is having atleast 1 student.");

    const groups = groupBy(selectedRows.map(x => data[x]), x => (x.testId ? "tests" : "standards"));
    const recommendations = [];
    if (groups.standards) {
      const standardIdentifiers = groups.standards.map(x => x.standardIdentifier);
      const obj = {
        assignmentId: selectedData.assignmentId,
        groupId: selectedData.classId,
        standardIdentifiers,
        type,
        masteryRange: {
          min: masteryRange[0],
          max: masteryRange[1]
        },
        resourceTitle: getResourceTitle()
      };

      recommendations.push(obj);
    }

    if (groups.tests) {
      const testIds = groups.tests.map(x => x.testId);
      const obj = {
        assignmentId: selectedData.assignmentId,
        groupId: selectedData.classId,
        testIds,
        type,
        masteryRange: {
          min: masteryRange[0],
          max: masteryRange[1]
        },
        resourceTitle: getResourceTitle()
      };
      recommendations.push(obj);
    }

    if (recommendations.length) {
      addRecommendations(recommendations);
    }
  };

  return (
    <TableContainer h1ighlighted={isOver} data-cy={`table-${type}`}>
      <TableHeader>
        <span>{type === "REVIEW" ? "Review Work" : type === "PRACTICE" ? "Practice Work" : "Challenge Work"}</span>
        <span>
          <span>Mastery Range</span>
          <>{getSlider()}</>
        </span>
        <span>
          <IconUser data-cy="student" />
          &nbsp;&nbsp;{filteredStudentList.length}
        </span>
        <span>
          {/* Hiding the button for now
          
          <EduButton isGhost height="30px">
            Replace
          </EduButton> */}
          <EduButton data-cy={`addButton-${type}`} height="30px" onClick={handleAdd}>
            Add
          </EduButton>
        </span>
      </TableHeader>
      {!showNewActivity || data.length ? (
        <OuterDropContainer>
          <StyledTable
            columns={columns}
            rowSelection={rowSelection}
            dataSource={data}
            pagination={false}
            loading={isFetchingWork}
          />
        </OuterDropContainer>
      ) : null}
      {showNewActivity && !data.length && (
        <ActivityDropConainer height="195px" active={isOver} ref={drop}>
          Add New Activity
        </ActivityDropConainer>
      )}
    </TableContainer>
  );
};

const WorkTable = props => (
  <OuterDropContainer>
    <InnerWorkTable {...props} />
  </OuterDropContainer>
);

export default WorkTable;
