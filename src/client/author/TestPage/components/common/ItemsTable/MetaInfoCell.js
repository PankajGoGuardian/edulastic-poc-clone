import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Tag, message } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { FlexContainer, MoveLink, PremiumTag } from "@edulastic/common";
import { IconShare, IconHeart, IconUser, IconHash, IconVolumeUp, IconNoVolume } from "@edulastic/icons";
import { greenDark, themeColor } from "@edulastic/colors";
import styled from "styled-components";
import { cloneDeep, uniq as _uniq } from "lodash";

import Standards from "../../../../ItemList/components/Item/Standards";
import PreviewModal from "../../../../src/components/common/PreviewModal";
import {
  setTestDataAction,
  getTestSelector,
  setTestDataAndUpdateAction,
  previewCheckAnswerAction,
  previewShowAnswerAction
} from "../../../ducks";

import {
  setTestItemsAction,
  getItemsSubjectAndGradeAction,
  getSelectedItemSelector,
  getTestItemsSelector
} from "../../AddItems/ducks";

import { getUserId } from "../../../../src/selectors/user";

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
      selectedRows,
      testItemsList,
      test,
      gotoSummary
    } = this.props;
    if (!test.title) {
      gotoSummary();
      return message.error("Name field cannot be empty");
    }
    const newTest = cloneDeep(test);
    let keys = [];
    if (newTest.safeBrowser && !newTest.sebPassword) {
      return message.error("Please add a valid password");
    }
    if (selectedRows !== undefined) {
      selectedRows.data.forEach((selectedRow, index) => {
        keys[index] = selectedRow;
      });
    }
    if (!keys.includes(row.id)) {
      keys[keys.length] = row.id;
      const item = testItemsList.find(el => row.id === el._id);
      setDataAndSave({ addToTest: true, item });
    } else {
      keys = keys.filter(item => item !== row.id);
      setDataAndSave({ addToTest: false, item: { _id: row.id } });
    }
    setSelectedTests(keys);
    setTestItems(keys);
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
            <CategoryTitle>ID:</CategoryTitle> <FirstText>{data.shortId}</FirstText>
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
            border: this.isAddOrRemove ? `1px solid ${themeColor}` : "1px solid #ff0099",
            color: this.isAddOrRemove ? themeColor : "#ff0099",
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
    const { data, windowWidth, search, checkAnswer, showAnswer, userId } = this.props;
    const owner = data.item && data.item.authors && data.item.authors.some(x => x._id === userId);
    const isEditable = owner;
    return (
      <Container>
        <PreviewModal
          isVisible={isShowPreviewModal}
          page="addItems"
          onClose={this.closeModal}
          data={data}
          owner={owner}
          showEvaluationButtons={true}
          isEditable={isEditable}
          checkAnswer={() => checkAnswer({ ...data.item, id: data.id, isItem: true })}
          showAnswer={() => showAnswer(data)}
        />
        {windowWidth > 468 ? (
          <FlexContainer flexDirection="column" justifyContent="space-between" alignItems="flex-end">
            <StyledButton
              onClick={() => this.handleSelection(data)}
              style={{
                border: this.isAddOrRemove ? `1px solid ${themeColor}` : "1px solid #ff0099",
                color: this.isAddOrRemove ? themeColor : "#ff0099"
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
                {data.dok && (
                  <MetaWrapper>
                    <FirstText>{`DOK:${data.dok}`}</FirstText>
                  </MetaWrapper>
                )}
                <MetaWrapper>
                  <Standards item={data.item} search={search} />
                </MetaWrapper>
                {data.isPremium && (
                  <MetaWrapper>
                    <PremiumTag />
                  </MetaWrapper>
                )}
                <MetaWrapper>
                  <IconUser color="#bbbfc4" width={11} height={14} />
                  <FirstText>{data.by}</FirstText>
                </MetaWrapper>
                <MetaWrapper>
                  <IconHash color="#bbbfc4" width={11} height={14} />
                  <FirstText>{data.shortId}</FirstText>
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
                  <MetaWrapper>{data.audio.ttsSuccess ? <IconVolumeUp /> : <IconNoVolume />}</MetaWrapper>
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
      userId: getUserId(state),
      testItemsList: getTestItemsSelector(state)
    }),
    {
      setTestItems: setTestItemsAction,
      setDataAndSave: setTestDataAndUpdateAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction
    }
  )
);

export default enhance(MetaInfoCell);

const MetaWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
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
