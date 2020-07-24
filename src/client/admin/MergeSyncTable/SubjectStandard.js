import React, { useEffect } from "react";
import { Select } from "antd";
import { IconAddItems, IconTrash } from "@edulastic/icons";

import { Table, Button } from "../Common/StyledComponents";
import { LIST_CLEVER_SUBJECTS, DISABLE_SUBMIT_TITLE } from "../Data";
import CancelApplyActions from "./CancelApplyActions";

const { Column } = Table;
const { Option } = Select;

export default function SubjectStandard({
  subStandardMapping,
  fetchCurriculumDataAction,
  updateSubjectAction,
  updateEdulasticSubjectAction,
  updateEdulasticStandardAction,
  addSubjectStandardRowAction,
  orgId,
  orgType,
  updateSubjectStdMapAction,
  deleteSubjectStdMapAction,
  disableFields,
  isClasslink
}) {
  const { rows, subjectStandardMap, curriculum } = subStandardMapping;
  const cancelApplyButtonProps = disableFields
    ? { disabled: disableFields, title: DISABLE_SUBMIT_TITLE } :
    {};

  useEffect(() => {
    fetchCurriculumDataAction();
  }, []);

  function renderEdulasticStandardSet(item) {
    const {subject} = item;
    const edulasticSubject = subjectStandardMap[subject]
      ? subjectStandardMap[subject].subject
      : "";
    const edulasticStandard = subjectStandardMap[subject]
      ? subjectStandardMap[subject].standard
      : "";

    const { [edulasticSubject]: edulasticSubjects = { list: [] } } = curriculum;
    return (
      <Select
        showSearch
        style={{ width: "100%" }}
        value={edulasticStandard}
        onChange={value => updateEdulasticStandardAction({ subject, value })}
      >
        {edulasticSubjects.list.map(curriculumItem => (
          <Option title={curriculumItem} key={curriculumItem} value={curriculumItem}>
            {curriculumItem}
          </Option>
        ))}
      </Select>
    );
  }

  function renderEdulasticSubject(item) {
    const {subject} = item;
    const edulasticSubject = subjectStandardMap[subject]
      ? subjectStandardMap[subject].subject
      : "";

    return (
      <Select
        showSearch
        style={{ width: "100%" }}
        value={edulasticSubject}
        onChange={value => updateEdulasticSubjectAction({ subject, value })}
      >
        {Object.keys(curriculum).map((eachSubject) => (
          <Option
            title={eachSubject}
            key={eachSubject}
            value={eachSubject}
          >
            {eachSubject}
          </Option>
        ))}
      </Select>
    );
  }

  // TODO: add classlink subject list
  function renderSubject(item, _, index) {
    return (
      <Select
        showSearch
        style={{ width: "100%" }}
        value={item.subject}
        onChange={value => updateSubjectAction({ index, value, prevValue: item.subject })}
      >
        {
        // isClasslink ? [] :
        LIST_CLEVER_SUBJECTS.map(subject => (
          <Option
            title={subject}
            key={subject}
            value={subject}
            disabled={!!subjectStandardMap[subject]}
          >
            {subject}
          </Option>
        ))}
      </Select>
    );
  }

  return (
    <>
      <Table bordered rowKey={record => record.subject} dataSource={rows} pagination={false}>
        <Column
          title={`${isClasslink ? 'Classlink' : 'Clever'} Subject`}
          key="subject"
          render={renderSubject}
        />
        <Column title="Edulastic Subject" key="edulasticSubject" render={renderEdulasticSubject} />
        <Column title="Edulastic Standard Set" key="edulasticStandardSet" render={renderEdulasticStandardSet} />
        <Column
          title={
            <Button title="Add a row" aria-label="Add a Row" onClick={addSubjectStandardRowAction} noStyle>
              <IconAddItems />
            </Button>
          }
          key="addDeleteRow"
          render={(item, _, index) => (
            <Button
              title={`Delete ${item.subject}`}
              aria-label={`Delete ${item.subject}`}
              onClick={() => deleteSubjectStdMapAction({ ...item, index })}
              noStyle
            >
              <IconTrash />
            </Button>
          )}
        />
      </Table>
      <CancelApplyActions
        {...cancelApplyButtonProps}
        onApplyAction={() =>
          updateSubjectStdMapAction({
            orgId,
            orgType,
            subjectStandardMap,
            isClasslink
          })
        }
      />
    </>
  );
}
