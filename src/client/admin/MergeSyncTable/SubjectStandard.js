import React, { useEffect } from "react";
import { Select } from "antd";
import { Table } from "../Common/StyledComponents";
import { LIST_CLEVER_SUBJECTS, DISABLE_SUBMIT_TITLE } from "../Data";
import { IconAddItems, IconTrash } from "@edulastic/icons";
import { Button } from "../Common/StyledComponents";
import CancelApplyActions from "./CancelApplyActions";

const { Column } = Table;
const { Option } = Select;

export default function SubjectStandard({
  subStandardMapping,
  fetchCurriculumDataAction,
  updateCleverSubjectAction,
  updateEdulasticSubjectAction,
  updateEdulasticStandardAction,
  addSubjectStandardRowAction,
  orgId,
  orgType,
  updateSubjectStdMapAction,
  deleteSubjectStdMapAction,
  disableFields
}) {
  const { rows, cleverSubjectStandardMap, curriculum } = subStandardMapping;
  const cancelApplyButtonProps = disableFields ? { disabled: disableFields, title: DISABLE_SUBMIT_TITLE } : {};
  useEffect(() => {
    fetchCurriculumDataAction();
  }, []);

  function renderEdulasticStandardSet(item, _, index) {
    const cleverSubject = item.subject;
    const edulasticSubject = cleverSubjectStandardMap[cleverSubject]
      ? cleverSubjectStandardMap[cleverSubject].subject
      : "";
    const edulasticStandard = cleverSubjectStandardMap[cleverSubject]
      ? cleverSubjectStandardMap[cleverSubject].standard
      : "";

    const { [edulasticSubject]: edulasticSubjects = { list: [] } } = curriculum;
    return (
      <Select
        showSearch
        style={{ width: "100%" }}
        value={edulasticStandard}
        onChange={value => updateEdulasticStandardAction({ subject: item.subject, value })}
      >
        {edulasticSubjects.list.map(curriculumItem => (
          <Option title={curriculumItem} key={curriculumItem} value={curriculumItem}>
            {curriculumItem}
          </Option>
        ))}
      </Select>
    );
  }

  function renderEdulasticSubject(item, _, index) {
    const cleverSubject = item.subject;
    const edulasticSubject = cleverSubjectStandardMap[cleverSubject]
      ? cleverSubjectStandardMap[cleverSubject].subject
      : "";

    return (
      <Select
        showSearch
        style={{ width: "100%" }}
        value={edulasticSubject}
        onChange={value => updateEdulasticSubjectAction({ subject: item.subject, value })}
      >
        {Object.keys(curriculum).map(subject => (
          <Option title={subject} key={subject} value={subject}>
            {subject}
          </Option>
        ))}
      </Select>
    );
  }

  function renderCleverSubject(item, _, index) {
    return (
      <Select
        showSearch
        style={{ width: "100%" }}
        value={item.subject}
        onChange={value => updateCleverSubjectAction({ index, value, prevValue: item.subject })}
      >
        {LIST_CLEVER_SUBJECTS.map(subject => (
          <Option
            title={subject}
            key={subject}
            value={subject}
            disabled={cleverSubjectStandardMap[subject] ? true : false}
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
        <Column title="Clever Subject" key="cleverSubject" render={renderCleverSubject} />
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
            cleverSubjectStandardMap
          })
        }
      />
    </>
  );
}
