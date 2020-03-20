import React, { useEffect } from "react";
import { themeColor } from "@edulastic/colors";
import { IconEye, IconClose } from "@edulastic/icons";
import { connect } from "react-redux";
import { receiveTestByIdAction, getTestSelector, getTestItemsRowsSelector } from "../../../TestPage/ducks";
import Review from "../../../TestPage/components/Review";
import { ModalWrapper, Wrapper, SubHeader, BreadCrumb, ActionsWrapper, ActionBtn } from "./styled";

const PlaylistTestDetailsModal = ({
  onClose,
  modalInitData: { isVisible, currentTestId } = {},
  receiveTestById,
  test = {},
  rows = [],
  userId = "",
  viewAsStudent
}) => {
  useEffect(() => {
    receiveTestById(currentTestId, true, false, true);
  }, []);

  const defaultPropsForReview = {
    onChangeGrade: () => {},
    onChangeSubjects: () => {},
    onChangeCollection: () => {}
  };

  return (
    <ModalWrapper
      key={`playlist-review-${currentTestId}`}
      footer={null}
      visible={isVisible}
      onCancel={onClose}
      width="100vw"
      height="100vh"
      destroyOnClose
    >
      <SubHeader>
        <BreadCrumb onClick={onClose}>
          <i className="fa fa-angle-left" aria-hidden="true">
            &nbsp;
          </i>{" "}
          back to playlist
        </BreadCrumb>
        <ActionsWrapper>
          <ActionBtn onClick={() => viewAsStudent(currentTestId)}>
            <IconEye color={themeColor} width={16} height={16} /> view as student
          </ActionBtn>
          <ActionBtn onClick={onClose}>
            <IconClose color={themeColor} width={16} height={16} /> close
          </ActionBtn>
        </ActionsWrapper>
      </SubHeader>

      <Wrapper>
        <Review
          test={test}
          rows={rows}
          owner={test?.authors?.some(x => x._id === userId)}
          isEditable={false}
          current={"review"}
          showCancelButton={true}
          {...defaultPropsForReview}
          isPlaylistTestReview
        />
      </Wrapper>
    </ModalWrapper>
  );
};

export default connect(
  state => ({
    test: getTestSelector(state),
    rows: getTestItemsRowsSelector(state),
    userId: state?.user?.user?._id
  }),
  {
    receiveTestById: receiveTestByIdAction
  }
)(PlaylistTestDetailsModal);
