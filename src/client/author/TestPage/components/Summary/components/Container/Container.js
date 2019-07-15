import React, { memo } from "react";
import PropTypes from "prop-types";
import { Row, Col, Button } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { uniq as _uniq, get } from "lodash";
import { IconSource } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import { Paper, withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { getItemsSubjectAndGradeSelector } from "../../../AddItems/ducks";
import { Container, ButtonLink } from "../../../../../src/components/common";
import Sidebar from "../Sidebar/Sidebar";
import Breadcrumb from "../../../../../src/components/Breadcrumb";
import { SecondHeader } from "./styled";
import { getSummarySelector } from "../../ducks";
import { getUser } from "../../../../../src/selectors/user";
import { getDefaultThumbnailSelector, updateDefaultThumbnailAction } from "../../../../ducks";

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
  updateDefaultThumbnail,
  isTextColorPickerVisible,
  isBackgroundColorPickerVisible,
  onChangeColor,
  onChangeSubjects,
  isEditable = true
}) => {
  const handleChangeField = (field, value) => {
    if (field === "thumbnail") {
      updateDefaultThumbnail("");
    }
    setData({ ...test, [field]: value });
  };

  const breadcrumbData = [
    {
      title: "TESTS LIBRARY",
      to: "/author/tests"
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
      <Paper style={{ margin: "25px auto 0 auto", width: windowWidth > 993 ? "700px" : "100%" }}>
        <Row gutter={32}>
          <Col>
            <Sidebar
              title={test.title}
              description={test.description}
              tags={test.tags}
              analytics={test.analytics}
              collection={test.collection}
              onChangeField={handleChangeField}
              windowWidth={windowWidth}
              grades={grades}
              owner={owner}
              isPlaylist={isPlaylist}
              subjects={subjects}
              onChangeGrade={onChangeGrade}
              onChangeSubjects={onChangeSubjects}
              textColor={textColor}
              createdBy={test.createdBy && test.createdBy._id ? test.createdBy : currentUser}
              thumbnail={defaultThumbnail || test.thumbnail}
              backgroundColor={backgroundColor}
              isPlaylist={isPlaylist}
              description={test.description}
              onChangeColor={onChangeColor}
              isTextColorPickerVisible={isTextColorPickerVisible}
              isBackgroundColorPickerVisible={isBackgroundColorPickerVisible}
              isEditable={isEditable}
            />
          </Col>
        </Row>
      </Paper>
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
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state)
    }),
    {
      updateDefaultThumbnail: updateDefaultThumbnailAction
    }
  )
);

export default enhance(Summary);
