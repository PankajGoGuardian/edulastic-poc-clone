import React, { useEffect } from "react";
import { Table, Select } from "antd";
import { LIST_CLEVER_SUBJECTS, LIST_EDULASTIC_SUBJECTS } from "../Data";
import { IconAddItems } from "@edulastic/icons";
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
  updateSubjectStdMapAction
}) {
  const { rows, cleverSubjectStandardMap, curriculum } = subStandardMapping;

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
        value={edulasticStandard}
        onChange={value => updateEdulasticStandardAction({ subject: item.subject, value })}
      >
        {edulasticSubjects.list.map(curriculumItem => (
          <Option key={curriculumItem} value={curriculumItem}>
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
        value={edulasticSubject}
        onChange={value => updateEdulasticSubjectAction({ subject: item.subject, value })}
      >
        {LIST_EDULASTIC_SUBJECTS.map(subject => (
          <Option key={subject} value={subject}>
            {subject}
          </Option>
        ))}
      </Select>
    );
  }

  function renderCleverSubject(item, _, index) {
    return (
      <Select
        value={item.subject}
        onChange={value => updateCleverSubjectAction({ index, value, prevValue: item.subject })}
      >
        {LIST_CLEVER_SUBJECTS.map(subject => (
          <Option key={subject} value={subject} disabled={cleverSubjectStandardMap[subject] ? true : false}>
            {subject}
          </Option>
        ))}
      </Select>
    );
  }

  return (
    <>
      <Table rowKey={record => record.subject} dataSource={rows} pagination={false}>
        <Column title="Clever Subject" key="cleverSubject" render={renderCleverSubject} />
        <Column title="Edulastic Subject" key="edulasticSubject" render={renderEdulasticSubject} />
        <Column
          title={() => (
            <>
              <span>Edulastic Standard Set</span>
              <Button aria-label="Add a Row" onClick={addSubjectStandardRowAction} noStyle>
                <IconAddItems />
              </Button>
            </>
          )}
          key="edulasticStandardSet"
          render={renderEdulasticStandardSet}
        />
      </Table>
      <CancelApplyActions
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
