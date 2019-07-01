import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Tag, message } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { FlexContainer, MoveLink } from "@edulastic/common";
import { IconShare, IconHeart, IconUser, IconHash } from "@edulastic/icons";
import { greenDark } from "@edulastic/colors";
import styled from "styled-components";
import { cloneDeep, uniq as _uniq } from "lodash";

import Standards from "../../../../ItemList/components/Item/Standards";
import PreviewModal from "../../../../src/components/common/PreviewModal";
import { setTestDataAction, getTestSelector, setTestDataAndUpdateAction } from "../../../ducks";

import {
  setTestItemsAction,
  getItemsSubjectAndGradeAction,
  getSelectedItemSelector,
  getTestItemsSelector
} from "../../AddItems/ducks";

import { AudioIcon } from "../../../../ItemList/components/Item/styled";

class MetaInfoCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: props.selectedTests
    };
  }

  componentDidMount() {
    const { selectedRowKeys } = this.state;
    const { setTestItems } = this.props;
    const keys = [];
    selectedRowKeys.forEach((selectedRow, index) => {
      keys[index] = selectedRow;
    });
    setTestItems(selectedRowKeys);
  }

  handleSelection = row => {
    const {
      setSelectedTests,
      setTestItems,
      setDataAndSave,
      getItemsSubjectAndGrade,
      selectedRows,
      setTestData,
      test,
      tests,
      gotoSummary
    } = this.props;
    if (!test.title) {
      gotoSummary();
      return message.error("Name field cannot be empty");
    }
    const newTest = cloneDeep(test);
    let keys = [];
    if (selectedRows !== undefined) {
      selectedRows.data.forEach((selectedRow, index) => {
        keys[index] = selectedRow;
      });
    }
    if (!keys.includes(row.id)) {
      keys[keys.length] = row.id;
      setSelectedTests(keys);
      setTestItems(keys);
      const testToAdd = tests.find(el => row.id === el._id);
      newTest.testItems.push(testToAdd);
    } else {
      keys = keys.filter(item => item !== row.id);
      setSelectedTests(keys);
      setTestItems(keys);
      newTest.testItems = newTest.testItems.filter(el => row.id !== el._id);
    }

    // getting grades and subjects from each question array in test items
    const { testItems = [] } = newTest;

    const questionGrades = testItems
      .flatMap(item => (item.data && item.data.questions) || [])
      .flatMap(question => question.grades || []);
    const questionSubjects = testItems
      .flatMap(item => (item.data && item.data.questions) || [])
      .flatMap(question => question.subjects || []);
    //alignment object inside questions contains subject and domains
    const getAlignmentsObject = testItems
      .flatMap(item => (item.data && item.data.questions) || [])
      .flatMap(question => question.alignment || []);

    const subjects = getAlignmentsObject.map(alignment => alignment.subject);

    //domains inside alignment object holds standards with grades
    const grades = getAlignmentsObject
      .flatMap(alignment => alignment.domains)
      .flatMap(domain => domain.standards)
      .flatMap(standard => standard.grades);
    getItemsSubjectAndGrade({
      subjects: _uniq([...subjects, ...questionSubjects]),
      grades: _uniq([...grades, ...questionGrades])
    });
    if (!test._id) {
      setDataAndSave(newTest);
    } else {
      setTestData(newTest);
    }
  };

  get isAddOrRemove() {
    const { data, selectedRows } = this.props;
    if (selectedRows && selectedRows.data && selectedRows.data.length) {
      return !selectedRows.data.includes(data.id);
    }
    return true;
  }

  previewItem = () => {
    this.setState({ isShowPreviewModal: true });
  };

  closeModal = () => {
    this.setState({ isShowPreviewModal: false });
  };

  mobileRender = () => {
    const { data, search } = this.props;
    return (
      <div style={{ padding: "5px 10px" }}>
        <div style={{ marginBottom: 15 }}>
          <MoveLink onClick={() => this.previewItem()}>{data.title}</MoveLink>
          <STIMULUS dangerouslySetInnerHTML={{ __html: data.stimulus }} />
        </div>
        <TypeContainer>
          <Standards item={data.item} search={search} />
        </TypeContainer>
        <FlexContainer style={{ flexWrap: "wrap" }} justifyContent="space-between">
          <CategoryDiv>
            <CategoryTitle>By:</CategoryTitle> <FirstText>{data.by}</FirstText>
          </CategoryDiv>
          <CategoryDiv>
            <CategoryTitle>ID:</CategoryTitle> <FirstText>{data._id}</FirstText>
          </CategoryDiv>
          <CategoryDiv>
            <FlexContainer>
              <IconShare color={greenDark} width={16} height={16} /> <SecondText>{data.shared}</SecondText>
            </FlexContainer>
          </CategoryDiv>
          <CategoryDiv style={{ marginRight: 10 }}>
            <FlexContainer>
              <IconHeart color={greenDark} width={16} height={16} /> <SecondText>{data.likes}</SecondText>
            </FlexContainer>
          </CategoryDiv>
        </FlexContainer>
        <StyledButton
          onClick={() => this.handleSelection(data)}
          style={{
            border: this.isAddOrRemove ? "1px solid #00b0ff" : "1px solid #ee1658",
            color: this.isAddOrRemove ? "#00b0ff" : "#ee1658",
            marginTop: 15,
            width: "100%"
          }}
        >
          {this.isAddOrRemove ? "ADD" : "REMOVE"}
        </StyledButton>
      </div>
    );
  };

  render() {
    const { isShowPreviewModal = false } = this.state;
    const { data, windowWidth, search } = this.props;

    return (
      <Container>
        <PreviewModal isVisible={isShowPreviewModal} page="addItems" onClose={this.closeModal} data={data} />
        {windowWidth > 468 ? (
          <FlexContainer flexDirection="column" justifyContent="space-between" alignItems="flex-end">
            <StyledButton
              onClick={() => this.handleSelection(data)}
              style={{
                border: "none",
                color: this.isAddOrRemove ? "#00b0ff" : "#ff0099"
              }}
            >
              {this.isAddOrRemove ? "ADD" : "REMOVE"}
            </StyledButton>
            <div>
              {windowWidth < 993 && (
                <div style={{ marginBottom: 15 }}>
                  <MoveLink onClick={() => this.previewItem()}>{data.title}</MoveLink>
                  <STIMULUS dangerouslySetInnerHTML={{ __html: data.stimulus }} />
                </div>
              )}
              <FlexContainer>
                <MetaWrapper>
                  <Standards item={data.item} search={search} />
                </MetaWrapper>
                <MetaWrapper>
                  <IconUser color="#bbbfc4" width={11} height={14} />
                  <FirstText>{data.by}</FirstText>
                </MetaWrapper>
                <MetaWrapper>
                  <IconHash color="#bbbfc4" width={11} height={14} />
                  <FirstText>{data.id}</FirstText>
                </MetaWrapper>
                <MetaWrapper>
                  <IconShare color="#bbbfc4" width={14} height={15} />
                  <FirstText>{data.shared}</FirstText>
                </MetaWrapper>
                <MetaWrapper>
                  <IconHeart color="#bbbfc4" width={16} height={14} />
                  <FirstText>{data.likes}</FirstText>
                </MetaWrapper>
                {data.audio.hasOwnProperty("ttsSuccess") ? (
                  <MetaWrapper>
                    <AudioIcon className="fa fa-volume-up" success={data.audio.ttsSuccess} />
                  </MetaWrapper>
                ) : (
                  ""
                )}
              </FlexContainer>
            </div>
          </FlexContainer>
        ) : (
          this.mobileRender()
        )}
      </Container>
    );
  }
}

MetaInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
  test: PropTypes.object.isRequired,
  tests: PropTypes.array.isRequired,
  setSelectedTests: PropTypes.func.isRequired,
  setTestData: PropTypes.func.isRequired,
  selectedTests: PropTypes.array.isRequired,
  setTestItems: PropTypes.func.isRequired,
  selectedRows: PropTypes.object,
  windowWidth: PropTypes.number.isRequired,
  gotoSummary: PropTypes.func
};

MetaInfoCell.defaultProps = {
  selectedRows: {},
  gotoSummary: () => {}
};

const enhance = compose(
  withNamespaces("MetaInfoCell"),
  connect(
    state => ({
      selectedRows: getSelectedItemSelector(state),
      test: getTestSelector(state),
      tests: getTestItemsSelector(state)
    }),
    {
      setTestItems: setTestItemsAction,
      setTestData: setTestDataAction,
      setDataAndSave: setTestDataAndUpdateAction,
      getItemsSubjectAndGrade: getItemsSubjectAndGradeAction
    }
  )
);

export default enhance(MetaInfoCell);

const MetaWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 34px;
`;

const FirstText = styled.span`
  display: inline-block;
  margin-left: 7px;
  font-size: 10px;
  font-weight: 600;
  color: #bbbfc4;
`;

const SecondText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #444444;
`;

const CategoryTitle = styled.span`
  width: 40px;
  font-size: 13px;
  color: #444444;
`;

const TypeContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 15px;

  .ant-tag {
    background: rgba(0, 176, 255, 0.2);
    color: rgb(0, 131, 190);
  }
`;

const StyledButton = styled(Button)`
  width: 150px;
  height: 40px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: #00b0ff;
  border: 1px solid #00b0ff;
  margin-bottom: 46px;
  box-shadow: 0 2px 4px 0 rgba(201, 208, 219, 0.5);
`;

const Container = styled.div``;

const STIMULUS = styled.div`
  font-size: 13px;
  color: #444444;
  margin-top: 3px;
`;

const CategoryDiv = styled.div`
  width: 45%;
  margin-bottom: 5px;
`;
