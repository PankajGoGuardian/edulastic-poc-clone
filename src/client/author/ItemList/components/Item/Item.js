import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconPlus, IconEye, IconDown } from "@edulastic/icons";
import { get } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { MoveLink, MathFormulaDisplay, PremiumTag } from "@edulastic/common";
import { getTestItemAuthorName } from "../../../dataUtils";
import { MAX_TAB_WIDTH } from "../../../src/constants/others";
import Standards from "./Standards";
import ItemTypes from "./ItemTypes";
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
  Count,
  UserIcon,
  IdIcon,
  MoreInfo,
  Details,
  AudioIcon
} from "./styled";

// render single item
class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    windowWidth: PropTypes.number.isRequired,
    onToggleToCart: PropTypes.func.isRequired,
    selectedToCart: PropTypes.bool
  };

  static defaultProps = {
    selectedToCart: false
  };

  state = {
    isOpenedDetails: false
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

  handleToggleItemToCart = itemId => () => {
    const { onToggleToCart } = this.props;
    onToggleToCart(itemId);
  };

  get description() {
    const { item } = this.props;
    return get(item, "rows[0].widgets[0].entity.stimulus", "");
  }

  renderDetails = () => {
    const { item } = this.props;
    const questions = get(item, "data.questions", []);
    const getAllTTS = questions.filter(item => item.tts).map(item => item.tts);
    const details = [
      {
        name: "DOK:",
        text: (questions.find(item => item.depthOfKnowledge) || {}).depthOfKnowledge
      },
      {
        name: <UserIcon />,
        text: getTestItemAuthorName(item)
      },
      {
        name: <IdIcon />,
        text: item._id,
        type: "id"
      },
      {
        name: <ShareIcon />,
        text: "9578 (1)"
      },
      {
        name: <HeartIcon />,
        text: "9"
      }
    ];
    if (getAllTTS.length) {
      const ttsSuccess = getAllTTS.filter(item => item.taskStatus !== "COMPLETED").length === 0;
      const ttsStatusSuccess = {
        name: <AudioIcon className="fa fa-volume-up" success={ttsSuccess} />
      };
      details.push(ttsStatusSuccess);
    }
    if (item.collectionName) {
      details.unshift({ name: <PremiumTag />, type: "premium" });
    }
    return details.map(
      (detail, index) =>
        detail.text && (
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

  render() {
    const { item, t, windowWidth, selectedToCart, search } = this.props;
    const resources =
      item.rows && item.rows.flatMap(row => row.widgets).filter(widget => widget.widgetType === "resource");
    const { isOpenedDetails } = this.state;
    return (
      <Container>
        <Question>
          <QuestionContent>
            <MoveLink onClick={this.moveToItem}>
              {item.data && item.data.questions && item.data.questions[0] && item.data.questions[0].stimulus
                ? item.data.questions[0].stimulus
                : "Click here to view the question detail."}
            </MoveLink>
            <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: this.description }} />
          </QuestionContent>
          {windowWidth > MAX_TAB_WIDTH && (
            <ViewButton>
              <ViewButtonStyled onClick={this.moveToItem}>{t("component.item.view")}</ViewButtonStyled>
              <AddButtonStyled onClick={this.handleToggleItemToCart(item._id)}>
                {selectedToCart ? "Remove" : <IconPlus />}
              </AddButtonStyled>
            </ViewButton>
          )}
        </Question>
        <Detail>
          {resources.map((resource, index) => (
            <TypeCategory>
              <Label key={index}>
                <LabelText>{resource.title}</LabelText>
              </Label>
            </TypeCategory>
          ))}
          <TypeCategory>
            {windowWidth > MAX_TAB_WIDTH && <Standards item={item} search={search} />}
            <CategoryContent>
              <ItemTypes item={item} />
            </CategoryContent>
          </TypeCategory>
          {windowWidth > MAX_TAB_WIDTH && <Categories>{this.renderDetails()}</Categories>}
        </Detail>
        {windowWidth < MAX_TAB_WIDTH && (
          <ViewButton>
            <MoreInfo onClick={this.toggleDetails} isOpenedDetails={isOpenedDetails}>
              <IconDown />
            </MoreInfo>
            <ViewButtonStyled onClick={this.moveToItem}>
              {t("component.item.view")}
              <IconEye />
            </ViewButtonStyled>
            <AddButtonStyled onClick={this.handleToggleItemToCart(item._id)}>
              {selectedToCart ? "Remove" : <IconPlus />}
            </AddButtonStyled>
          </ViewButton>
        )}
        {windowWidth < MAX_TAB_WIDTH && (
          <Details isOpenedDetails={isOpenedDetails}>
            {<Standards item={item} search={search} />}
            <Categories>{this.renderDetails()}</Categories>
          </Details>
        )}
      </Container>
    );
  }
}

export default withNamespaces("author")(Item);
