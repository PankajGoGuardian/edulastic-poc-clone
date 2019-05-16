import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import ClassList from "./ClassList";
import ClassSelectModal from "./ClassSelectModal";

// eslint-disable-next-line max-len
const ClassListContainer = ({ setModal, groups, isModalVisible, googleCourseList, syncClass, onCreate, setEntity }) => {
  const closeModal = () => setModal(false);
  const selectedGroups = groups.filter(i => !!i.code).map(i => i.code);
  return (
    <React.Fragment>
      <Header onCreate={onCreate} />
      <ClassSelectModal
        visible={isModalVisible}
        close={closeModal}
        groups={googleCourseList}
        syncClass={syncClass}
        selectedGroups={selectedGroups}
      />
      <ClassList groups={groups} setEntity={setEntity} />
    </React.Fragment>
  );
};

ClassListContainer.propTypes = {
  setModal: PropTypes.func.isRequired,
  syncClass: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
  googleCourseList: PropTypes.array.isRequired,
  onCreate: PropTypes.func.isRequired,
  setEntity: PropTypes.func.isRequired
};

export default ClassListContainer;
