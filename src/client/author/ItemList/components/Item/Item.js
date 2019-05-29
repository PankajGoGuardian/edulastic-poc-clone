import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconPlus, IconEye, IconDown } from "@edulastic/icons";
import { get } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { MoveLink, MathFormulaDisplay } from "@edulastic/common";
import { getTestItemAuthorName } from "../../../dataUtils";
import { MAX_TAB_WIDTH } from "../../../src/constants/others";
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
  StandardContent,
  LabelStandard,
  LabelStandardText,
  CountGreen,
  MoreInfo,
  Details
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

  renderTypes = () => {
    const { item } = this.props;
    const itemTypes = [];

    if (item.data && item.data.questions) {
      item.data.questions.map(({ type }) => {
        const index = itemTypes.findIndex(({ name }) => name === type);

        if (index >= 0) {
          itemTypes[index].count++;
        } else {
          itemTypes.push({
            name: type,
            count: 1
          });
        }

        return itemTypes;
      });
    }

    return itemTypes.map(({ name }, index) =>
      index + 1 <= 1 ? (
        <Label key={`TypeName_${name}_${index}`}>
          <LabelText>{name}</LabelText>
        </Label>
      ) : (
        index + 1 === itemTypes.length && <Count key={`Count_TypeName__${item._id}`}>+{itemTypes.length - 1}</Count>
      )
    );
  };

  renderDetails = () => {
    const { item } = this.props;

    const details = [
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

    return details.map((detail, index) => (
      <DetailCategory key={`DetailCategory_${index}`}>
        <CategoryName>{detail.name}</CategoryName>
        <CategoryContent>
          <Text title={detail.type === "id" ? detail.text : ""}>
            {detail.type === "id" ? detail.text.substr(detail.text.length - 5) : detail.text}
          </Text>
        </CategoryContent>
      </DetailCategory>
    ));
  };

  renderStandards = () => {
    const outStandardsCount = 3;
    const {
      item,
      interestedCurriculums,
      search: { curriculumId }
    } = this.props;
    const domains = [];
    const standards = [];
    if (item.data && item.data.questions) {
      item.data.questions.map(question => {
        if (!question.alignment || !question.alignment.length) return;
        //removing all multiStandard mappings
        const authorAlignments = question.alignment.filter(item => !item.isEquivalentStandard && item.curriculumId);

        //pick alignments matching with interested curriculums
        let interestedAlignments = authorAlignments.filter(alignment =>
          interestedCurriculums.some(interested => interested._id === alignment.curriculumId)
        );

        //pick alignments based on search if interested alignments is empty
        if (!interestedAlignments.length) {
          interestedAlignments = authorAlignments.filter(alignment => alignment.curriculumId === curriculumId);
          // use the authored alignments if still the interested alignments is empty
          if (!interestedAlignments.length) {
            interestedAlignments = authorAlignments;
          }
        }
        interestedAlignments.map(el => (el.domains && el.domains.length ? domains.push(...el.domains) : null));
      });
      if (!domains.length) return null;
      domains.map(el => (el.standards && el.standards.length ? standards.push(...el.standards) : null));
    }

    return standards.length ? (
      <StandardContent>
        {standards.map((standard, index) =>
          index + 1 <= outStandardsCount ? (
            <LabelStandard key={`Standard_${standard.name}_${index}`}>
              <LabelStandardText>{standard.name}</LabelStandardText>
            </LabelStandard>
          ) : (
            index + 1 === standards.length && (
              <CountGreen key={`Count_${item._id}`}>+{standards.length - outStandardsCount}</CountGreen>
            )
          )
        )}
      </StandardContent>
    ) : null;
  };

  toggleDetails = () => {
    const { isOpenedDetails } = this.state;

    this.setState({
      isOpenedDetails: !isOpenedDetails
    });
  };

  render() {
    const { item, t, windowWidth, selectedToCart } = this.props;
    const { isOpenedDetails } = this.state;

    return (
      <Container>
        <Question>
          <QuestionContent>
            <MoveLink onClick={this.moveToItem}>
              {item.data && item.data.questions && item.data.questions[0] && item.data.questions[0].stimulus
                ? item.data.questions[0].stimulus
                : item._id}
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
          <TypeCategory>
            {windowWidth > MAX_TAB_WIDTH && this.renderStandards()}
            <CategoryContent>{this.renderTypes()}</CategoryContent>
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
            {this.renderStandards()}
            <Categories>{this.renderDetails()}</Categories>
          </Details>
        )}
      </Container>
    );
  }
}

export default withNamespaces("author")(Item);
