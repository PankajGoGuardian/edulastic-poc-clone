import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Summary from "../../../TestPage/components/Summary/components/Container/Container";
import {
  getItemsSubjectAndGradeAction,
  getItemsSubjectAndGradeSelector
} from "../../../TestPage/components/AddItems/ducks";
import SourceModal from "../../../QuestionEditor/components/SourceModal/SourceModal";

const Description = ({ setData, getItemsSubjectAndGrade, assessment, itemsSubjectAndGrade }) => {
  const [showModal, setShowModal] = useState(false);

  const handleChangeGrade = grades => {
    setData({ ...assessment, grades });
    getItemsSubjectAndGrade({ subjects: itemsSubjectAndGrade.subjects, grades: [] });
  };

  const handleChangeSubject = subjects => {
    setData({ ...assessment, subjects });
    getItemsSubjectAndGrade({ grades: itemsSubjectAndGrade.grades, subjects: [] });
  };

  const handleToggleSource = () => {
    setShowModal(!showModal);
  };

  const handleApplySource = source => {
    try {
      const data = JSON.parse(source);

      setData(data);
      handleToggleSource();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Summary
        onShowSource={handleToggleSource}
        setData={setData}
        test={assessment}
        current="Description"
        onChangeGrade={handleChangeGrade}
        onChangeSubjects={handleChangeSubject}
      />
      {showModal && (
        <SourceModal onClose={handleToggleSource} onApply={handleApplySource}>
          {JSON.stringify(assessment, null, 4)}
        </SourceModal>
      )}
    </>
  );
};

Description.propTypes = {
  assessment: PropTypes.object.isRequired,
  itemsSubjectAndGrade: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  getItemsSubjectAndGrade: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state)
});

const mapDispatchToProps = {
  getItemsSubjectAndGrade: getItemsSubjectAndGradeAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Description);
