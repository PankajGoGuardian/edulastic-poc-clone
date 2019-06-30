import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import ClassList from "./ClassList";
import ClassSelectModal from "./ClassSelectModal";

// eslint-disable-next-line max-len
const ClassListContainer = ({
  setModal,
  groups,
  archiveGroups,
  isModalVisible,
  googleCourseList,
  syncClass,
  setEntity
}) => {
  const closeModal = () => setModal(false);
  const selectedGroups = groups.filter(i => !!i.code).map(i => i.code);

  return (
    <React.Fragment>
      <Header />
      <ClassSelectModal
        visible={isModalVisible}
        close={closeModal}
        groups={googleCourseList}
        syncClass={syncClass}
        selectedGroups={selectedGroups}
      />
      <ClassList groups={groups} archiveGroups={archiveGroups} setEntity={setEntity} />
    </React.Fragment>
  );
};

ClassListContainer.propTypes = {
  setModal: PropTypes.func.isRequired,
  syncClass: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  archiveGroups: PropTypes.array.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
  googleCourseList: PropTypes.array.isRequired,
  setEntity: PropTypes.func.isRequired
};

export default ClassListContainer;
