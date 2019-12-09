import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { IconPlus, IconEye, IconDown, IconVolumeUp, IconNoVolume } from "@edulastic/icons";
import { get } from "lodash";
import { message, Row } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { question } from "@edulastic/constants";
import { MathFormulaDisplay, PremiumTag, helpers, WithResources } from "@edulastic/common";
import { themeColor, red } from "@edulastic/colors";
import { testItemsApi } from "@edulastic/api";
import { getTestItemAuthorName, getQuestionType, getTestItemAuthorIcon } from "../../../dataUtils";
import { MAX_TAB_WIDTH } from "../../../src/constants/others";
import Standards from "./Standards";
import Stimulus from "./Stimulus";
import {
  Container,
  Categories,
  CategoryContent,
  CategoryName,
  Detail,
  DetailCategory,
  Text,
  Label,
  LabelText,
  Question,
  QuestionContent,
  TypeCategory,
  ViewButton,
  ViewButtonStyled,
  AddButtonStyled,
  HeartIcon,
  ShareIcon,
  UserIcon,
  IdIcon,
  MoreInfo,
  Details,
  AddRemoveBtn
} from "./styled";
import PreviewModal from "../../../src/components/common/PreviewModal";
import {
  setAndSavePassageItemsAction,
  getPassageItemsCountSelector,
  setPassageItemsAction
} from "../../../TestPage/ducks";
import PassageConfirmationModal from "../../../TestPage/components/PassageConfirmationModal/PassageConfirmationModal";
import Tags from "../../../src/components/common/Tags";
import appConfig from "../../../../../../app-config";

// render single item
class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    checkAnswer: PropTypes.func.isRequired,
    showAnser: PropTypes.func.isRequired,
    windowWidth: PropTypes.number.isRequired,
    onToggleToCart: PropTypes.func.isRequired,
    selectedToCart: PropTypes.bool,
    page: PropTypes.string
  };

  static defaultProps = {
    selectedToCart: false,
    gotoSummary: () => {}
  };

  state = {
    isShowPreviewModal: false,
    isOpenedDetails: false,
    passageConfirmModalVisible: false,
    selectedId: ""
  };

  moveToItem = () => {
    const { history, item, t } = this.props;
    history.push({
      pathname: `/author/items/${item._id}/item-detail`,
      state: {
        backText: t("component.itemAdd.backToItemList"),
        backUrl: "/author/items",
        itemDetail: true
      }
    });
  };

  handleToggleItemToCart = item => async () => {
    const { onToggleToCart, selectedToCart, setPassageItems } = this.props;
    if (!selectedToCart && item.passageId) {
      const passageItems = await testItemsApi.getPassageItems(item.passageId);
      setPassageItems(passageItems);

      if (passageItems.length > 1) {
        return this.setState({
          passageConfirmModalVisible: true
        });
      }
    }
    onToggleToCart(item);
  };

  get description() {
    const { item } = this.props;
    return get(item, "rows[0].widgets[0].entity.stimulus", "");
  }

  get itemStimulus() {
    const { item } = this.props;
    const stimulus = get(item, ["data", "questions", 0, "stimulus"], question.DEFAULT_STIMULUS);
    return helpers.sanitizeForReview(stimulus);
  }

  closeModal = () => {
    this.setState({ isShowPreviewModal: false });
  };

  previewItem = () => {
    this.setState({ isShowPreviewModal: true });
  };

  renderDetails = () => {
    const { item, windowWidth } = this.props;
    const questions = get(item, "data.questions", []);
    const getAllTTS = questions.filter(item => item.tts).map(item => item.tts);
    const details = [
      {
        name: "DOK:",
        text: (questions.find(item => item.depthOfKnowledge) || {}).depthOfKnowledge
      },
      {
        name: getTestItemAuthorIcon(item),
        text: getTestItemAuthorName(item)
      },
      {
        name: <IdIcon />,
        text: item._id,
        type: "id"
      },
      {
        name: windowWidth > 1024 ? <ShareIcon /> : "",
        text: windowWidth > 1024 ? "9578 (1)" : ""
      },
      {
        name: <HeartIcon />,
        text: "9"
      }
    ];
    if (getAllTTS.length) {
      const ttsSuccess = getAllTTS.filter(item => item.taskStatus !== "COMPLETED").length === 0;
      const ttsStatusSuccess = {
        name: ttsSuccess ? <IconVolumeUp /> : <IconNoVolume />
      };
      details.push(ttsStatusSuccess);
    }
    if (item.collectionName) {
      details.unshift({ name: <PremiumTag />, type: "premium" });
    }
    return details.map(
      (detail, index) =>
        (detail.text || detail.type === "premium") && (
          <DetailCategory key={`DetailCategory_${index}`}>
            <CategoryName>{detail.name}</CategoryName>
            {detail.type !== "premium" && (
              <CategoryContent>
                <Text title={detail.type === "id" ? detail.text : ""}>
                  {detail.type === "id" ? detail.text.substr(detail.text.length - 6) : detail.text}
                </Text>
              </CategoryContent>
            )}
          </DetailCategory>
        )
    );
  };

  toggleDetails = () => {
    const { isOpenedDetails } = this.state;

    this.setState({
      isOpenedDetails: !isOpenedDetails
    });
  };

  handleSelection = async row => {
    const { setTestItems, setDataAndSave, selectedRows, test, gotoSummary, setPassageItems, item, page } = this.props;
    if (!test.title.trim().length && page !== "itemList") {
      gotoSummary();
      return message.error("Name field cannot be empty");
    }

    let keys = [];
    if (test.safeBrowser && !test.sebPassword) {
      return message.error("Please add a valid password");
    }

    this.setState({ selectedId: item._id });
    if (selectedRows !== undefined) {
      (selectedRows || []).forEach((selectedRow, index) => {
        keys[index] = selectedRow;
      });
    }
    if (!keys.includes(row._id)) {
      keys[keys.length] = row._id;
      if (item.passageId) {
        const passageItems = await testItemsApi.getPassageItems(item.passageId);
        setPassageItems(passageItems);
        if (passageItems.length > 1) {
          return this.setState({ selectedId: "", passageConfirmModalVisible: true });
        }
      }
      setDataAndSave({ addToTest: true, item, current: this.props.current });
    } else {
      keys = keys.filter(item => item !== row._id);
      setDataAndSave({ addToTest: false, item: { _id: row._id }, current: this.props.current });
    }
    setTestItems(keys);
    this.setState({ selectedId: "" });
  };

  get isAddOrRemove() {
    const { item, selectedRows } = this.props;
    if (selectedRows && selectedRows.length) {
      return !selectedRows.includes(item._id);
    }
    return true;
  }

  /**
   *  TODO: find a friggin better name for the handler!
   *  handles the user response from the Passage confirmation modal.
   *  {Bool} value: user wants to select all the items?
   */
  handleResponse = value => {
    const { setAndSavePassageItems, passageItems, selectedRows = [] } = this.props;
    this.setState({ passageConfirmModalVisible: false });
    // add all the passage items to test.
    if (value) {
      return setAndSavePassageItems(passageItems);
    }

    // open the modal for selecting  testItems manually.
    this.setState({ isShowPreviewModal: true });
  };

  render() {
    const {
      item,
      t,
      windowWidth,
      selectedToCart,
      search,
      userId,
      checkAnswer,
      showAnswer,
      page,
      passageItemsCount,
      gotoSummary,
      test
    } = this.props;
    const { isOpenedDetails, isShowPreviewModal = false, selectedId, passageConfirmModalVisible } = this.state;
    const owner = item.authors && item.authors.some(x => x._id === userId);
    const isEditable = owner;
    const itemTypes = getQuestionType(item);
    return (
      <WithResources resources={[`${appConfig.jqueryPath}/jquery.min.js`]} fallBack={<span />}>
        <Container className="fr-view">
          {isShowPreviewModal && (
            <PreviewModal
              isVisible={isShowPreviewModal}
              page={page}
              showAddPassageItemToTestButton={true}
              showEvaluationButtons
              onClose={this.closeModal}
              data={{ ...item, id: item._id }}
              isEditable={isEditable}
              owner={owner}
              testId={test?._id}
              checkAnswer={() => checkAnswer({ ...item, isItem: true })}
              showAnswer={() => showAnswer(item)}
              gotoSummary={gotoSummary}
            />
          )}
          {passageConfirmModalVisible && (
            <PassageConfirmationModal
              visible={passageConfirmModalVisible}
              closeModal={() => this.setState(prev => ({ passageConfirmModalVisible: false }))}
              itemsCount={passageItemsCount}
              handleResponse={this.handleResponse}
            />
          )}
          <Question>
            <QuestionContent>
              <Stimulus
                onClickHandler={this.previewItem}
                stimulus={get(item, ["data", "questions", 0, "stimulus"], question.DEFAULT_STIMULUS)}
              />
              <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: this.description }} />
            </QuestionContent>
            {windowWidth > MAX_TAB_WIDTH &&
              (page === "itemList" ? (
                <ViewButton>
                  <ViewButtonStyled onClick={this.previewItem}>
                    <IconEye /> {t("component.item.view")}
                  </ViewButtonStyled>
                  <AddButtonStyled selectedToCart={selectedToCart} onClick={this.handleToggleItemToCart(item)}>
                    {selectedToCart ? "Remove" : <IconPlus />}
                  </AddButtonStyled>
                </ViewButton>
              ) : (
                <AddRemoveBtn
                  data-cy={item._id}
                  loading={selectedId === item._id}
                  onClick={() => this.handleSelection(item)}
                  isAddOrRemove={this.isAddOrRemove}
                >
                  {this.isAddOrRemove ? "ADD" : "REMOVE"}
                </AddRemoveBtn>
              ))}
          </Question>
          <Row type="flex" align="center">
            <Detail>
              <TypeCategory>
                {windowWidth > MAX_TAB_WIDTH && <Standards item={item} search={search} />}
                {windowWidth > MAX_TAB_WIDTH && <Tags tags={item.tags} key="tags" />}
                <CategoryContent>
                  {itemTypes.map(itemType => (
                    <Label>
                      <LabelText>{itemType}</LabelText>
                    </Label>
                  ))}
                </CategoryContent>
              </TypeCategory>
              {windowWidth > MAX_TAB_WIDTH && <Categories>{this.renderDetails()}</Categories>}
            </Detail>
            {windowWidth <= MAX_TAB_WIDTH &&
              (page === "itemList" ? (
                <ViewButton>
                  <MoreInfo onClick={this.toggleDetails} isOpenedDetails={isOpenedDetails}>
                    <IconDown />
                  </MoreInfo>
                  <ViewButtonStyled onClick={this.moveToItem}>
                    {t("component.item.view")}
                    <IconEye />
                  </ViewButtonStyled>
                  <AddButtonStyled selectedToCart={selectedToCart} onClick={this.handleToggleItemToCart(item)}>
                    {selectedToCart ? "Remove" : <IconPlus />}
                  </AddButtonStyled>
                </ViewButton>
              ) : (
                <ViewButton>
                  <MoreInfo onClick={this.toggleDetails} isOpenedDetails={isOpenedDetails}>
                    <IconDown />
                  </MoreInfo>
                  <AddRemoveBtn
                    loading={selectedId === item._id}
                    onClick={() => this.handleSelection(item)}
                    isAddOrRemove={this.isAddOrRemove}
                  >
                    {this.isAddOrRemove ? "ADD" : "REMOVE"}
                  </AddRemoveBtn>
                </ViewButton>
              ))}
          </Row>
          {windowWidth <= MAX_TAB_WIDTH && (
            <Details isOpenedDetails={isOpenedDetails}>
              <Standards item={item} search={search} />
              <Tags tags={item.tags} key="tags" />
              <Categories>{this.renderDetails()}</Categories>
            </Details>
          )}
        </Container>
      </WithResources>
    );
  }
}

const enhance = compose(
  withNamespaces("author"),
  connect(
    state => ({
      passageItemsCount: getPassageItemsCountSelector(state),
      passageItems: state.tests.passageItems
    }),
    {
      setAndSavePassageItems: setAndSavePassageItemsAction,
      setPassageItems: setPassageItemsAction
    }
  )
);

export default enhance(Item);
