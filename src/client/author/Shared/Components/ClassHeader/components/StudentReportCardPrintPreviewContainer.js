import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import qs from "qs";
import { get, keyBy } from "lodash";
import { StudentReportCardPrintPreview } from "./StudentReportCardPrintPreview";
import { receiveTestActivitydAction } from "../../../../../author/src/actions/classBoard";

const StudentReportCardPrintPreviewContainer = props => {
  const { location, entities, receiveTestActivitydAction } = props;

  const groupId = props.match.params.classId;
  const assignmentId = props.match.params.assignmentId;

  const query = useMemo(() => {
    let str = location.search.substring(1);
    const query = qs.parse(str);
    Object.keys(query.columnsFlags).map(item => {
      if (query.columnsFlags[item] === "true") {
        query.columnsFlags[item] = true;
      } else if (query.columnsFlags[item] === "false") {
        query.columnsFlags[item] = false;
      }
    });
    return query;
  }, []);

  useEffect(() => {
    receiveTestActivitydAction(assignmentId, groupId);
  }, []);

  return entities.length ? (
    <StudentReportCardPrintPreview
      visible={true}
      columnsFlags={query.columnsFlags}
      groupId={groupId}
      selectedStudentsKeys={query.selectedStudentsKeys}
      mode="pdf"
    />
  ) : null;
};

export default connect(
  state => ({
    entities: get(state, ["author_classboard_testActivity", "entities"], [])
  }),
  {
    receiveTestActivitydAction: receiveTestActivitydAction
  }
)(StudentReportCardPrintPreviewContainer);
