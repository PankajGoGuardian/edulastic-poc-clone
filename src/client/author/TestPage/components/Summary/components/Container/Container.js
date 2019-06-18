import React, { memo } from "react";
import PropTypes from "prop-types";
import { Row, Col, Button } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { uniq as _uniq } from "lodash";
import { IconSource } from "@edulastic/icons";
import { blue } from "@edulastic/colors";
import { Paper, withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { getItemsSubjectAndGradeSelector } from "../../../AddItems/ducks";
import { Container, ButtonLink } from "../../../../../src/components/common";
import Sidebar from "../Sidebar/Sidebar";
import Breadcrumb from "../../../../../src/components/Breadcrumb";
import { SecondHeader } from "./styled";
import { getSummarySelector } from "../../ducks";
import { getUser } from "../../../../../src/selectors/user";

const Summary = ({
  setData,
  currentUser,
  test,
  current,
  t,
  onShowSource,
  windowWidth,
  itemsSubjectAndGrade,
  isPlaylist,
  onChangeGrade,
  backgroundColor,
  textColor,
  isTextColorPickerVisible,
  isBackgroundColorPickerVisible,
  onChangeColor,
  onChangeSubjects
}) => {
  const handleChangeField = (field, value) => {
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
              icon={<IconSource color={blue} width={16} height={16} />}
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
              isPlaylist={isPlaylist}
              subjects={subjects}
              onChangeGrade={onChangeGrade}
              onChangeSubjects={onChangeSubjects}
              textColor={textColor}
              createdBy={test.createdBy && test.createdBy._id ? test.createdBy : currentUser}
              thumbnail={test.thumbnail}
              backgroundColor={backgroundColor}
              isPlaylist={isPlaylist}
              description={test.description}
              onChangeColor={onChangeColor}
              isTextColorPickerVisible={isTextColorPickerVisible}
              isBackgroundColorPickerVisible={isBackgroundColorPickerVisible}
            />
          </Col>
        </Row>
      </Paper>
    </Container>
  );
};

Summary.defaultProps = {
  test: {}
};
Summary.propTypes = {
  setData: PropTypes.func.isRequired,
  test: PropTypes.object.isRequired,
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
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state)
    }),
    null
  )
);

export default enhance(Summary);
