import React, { memo, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { uniq as _uniq } from "lodash";
import { IconSource } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import { withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { getItemsSubjectAndGradeSelector } from "../../../AddItems/ducks";
import { Container, ButtonLink } from "../../../../../src/components/common";
import SummaryCard from "../Sidebar/SideBarSwitch";
import Breadcrumb from "../../../../../src/components/Breadcrumb";
import { SecondHeader } from "./styled";
import { getSummarySelector } from "../../ducks";
import { getUser } from "../../../../../src/selectors/user";
import {
  getDefaultThumbnailSelector,
  updateDefaultThumbnailAction,
  getAllTagsAction,
  getAllTagsSelector,
  addNewTagAction
} from "../../../../ducks";

const Summary = ({
  setData,
  currentUser,
  test,
  current,
  owner,
  t,
  defaultThumbnail,
  onShowSource,
  windowWidth,
  itemsSubjectAndGrade,
  isPlaylist,
  onChangeGrade,
  backgroundColor,
  textColor,
  getAllTags,
  allTagsData,
  allPlaylistTagsData,
  updateDefaultThumbnail,
  isTextColorPickerVisible,
  isBackgroundColorPickerVisible,
  onChangeColor,
  addNewTag,
  onChangeSubjects,
  isEditable = true,
  showCancelButton
}) => {
  const handleChangeField = (field, value) => {
    if (field === "thumbnail") {
      updateDefaultThumbnail("");
    }
    setData({ ...test, [field]: value });
  };

  useEffect(() => {
    getAllTags({ type: isPlaylist ? "playlist" : "test" });
  }, []);
  const breadcrumbData = [
    {
      title: showCancelButton ? "ASSIGNMENTS / EDIT TEST" : "TESTS LIBRARY",
      to: showCancelButton ? "/author/assignments" : "/author/tests"
    },
    {
      title: current,
      to: ""
    }
  ];
  const playlistBreadcrumbData = [
    {
      title: "PLAY LIST",
      to: "/author/playlists"
    },
    {
      title: "SUMMARY",
      to: ""
    }
  ];
  const grades = _uniq([...test.grades, ...itemsSubjectAndGrade.grades]);
  const subjects = _uniq([...test.subjects, ...itemsSubjectAndGrade.subjects]);
  return (
    <Container>
      <SecondHeader>
        <Breadcrumb data={isPlaylist ? playlistBreadcrumbData : breadcrumbData} style={{ position: "unset" }} />
        {!isPlaylist && false && (
          <Button>
            <ButtonLink
              onClick={onShowSource}
              color="primary"
              icon={<IconSource color={themeColor} width={16} height={16} />}
            >
              {t("component.questioneditor.buttonbar.source")}
            </ButtonLink>
          </Button>
        )}
      </SecondHeader>
      <SummaryCard
        title={test.title}
        description={test.description}
        tags={test.tags}
        analytics={test.analytics}
        collection={test.collection}
        onChangeField={handleChangeField}
        windowWidth={windowWidth}
        grades={grades}
        addNewTag={addNewTag}
        owner={owner}
        allTagsData={allTagsData}
        allPlaylistTagsData={allPlaylistTagsData}
        isPlaylist={isPlaylist}
        subjects={subjects}
        onChangeGrade={onChangeGrade}
        onChangeSubjects={onChangeSubjects}
        textColor={textColor}
        createdBy={test.createdBy && test.createdBy._id ? test.createdBy : currentUser}
        thumbnail={defaultThumbnail || test.thumbnail}
        backgroundColor={backgroundColor}
        description={test.description}
        onChangeColor={onChangeColor}
        isTextColorPickerVisible={isTextColorPickerVisible}
        isBackgroundColorPickerVisible={isBackgroundColorPickerVisible}
        isEditable={isEditable}
      />
    </Container>
  );
};

Summary.defaultProps = {
  owner: false,
  test: {}
};
Summary.propTypes = {
  setData: PropTypes.func.isRequired,
  test: PropTypes.object.isRequired,
  owner: PropTypes.bool,
  t: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  onShowSource: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  itemsSubjectAndGrade: PropTypes.object.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  isPlaylist: PropTypes.bool,
  onChangeSubjects: PropTypes.func.isRequired,
  textColor: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  isBackgroundColorPickerVisible: PropTypes.bool,
  isTextColorPickerVisible: PropTypes.bool,
  isTextColorPickerVisible: PropTypes.bool,
  onChangeColor: PropTypes.func
};

const enhance = compose(
  memo,
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      summary: getSummarySelector(state),
      currentUser: getUser(state),
      defaultThumbnail: getDefaultThumbnailSelector(state),
      allTagsData: getAllTagsSelector(state, "test"),
      allPlaylistTagsData: getAllTagsSelector(state, "playlist"),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state)
    }),
    {
      getAllTags: getAllTagsAction,
      addNewTag: addNewTagAction,
      updateDefaultThumbnail: updateDefaultThumbnailAction
    }
  )
);

export default enhance(Summary);
