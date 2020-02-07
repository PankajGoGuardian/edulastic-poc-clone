import { EduButton } from "@edulastic/common";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { IMAGE_LIST_DEFAULT_WIDTH } from "@edulastic/constants/const/imageConstants";
import { withNamespaces } from "@edulastic/localization";
import { Checkbox, Col, Row } from "antd";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import withAddButton from "../../../components/HOC/withAddButton";
import QuillSortableList from "../../../components/QuillSortableList";
import { CheckboxLabel } from "../../../styled/CheckboxWithLabel";
import { Subtitle } from "../../../styled/Subtitle";
import Group from "./Group";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";

const List = withAddButton(QuillSortableList);

class GroupPossibleResponses extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.classification.possibleRespTitle"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount = () => {
    const { cleanSections } = this.props;

    cleanSections();
  };

  render() {
    const { item, checkboxChange, checkboxVal, items, t, firstFocus, onAdd, ...restProps } = this.props;
    return (
      <Fragment>
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.classification.possibleRespTitle")}`)}>
          {t("component.classification.possibleRespTitle")}
        </Subtitle>
        {checkboxVal ? (
          <Fragment>
            <CheckboxLabel defaultChecked={checkboxVal} onChange={checkboxChange}>
              {t("component.classification.groupPossibleRespTitle")}
            </CheckboxLabel>
            <Row gutter={24}>
              {items.map((item, index) => (
                <Col data-cy={`group-container-${index}`} key={index}>
                  <Group
                    prefix={`group${index}`}
                    item={item}
                    firstFocus={firstFocus}
                    index={index}
                    groupHeadText={t("component.classification.titleOfGroupTitle")}
                    headText={t("component.classification.titleOfGroupTitleLabel")}
                    text={t("component.classification.possibleRespTitle")}
                    {...restProps}
                  />
                </Col>
              ))}
            </Row>
            <CustomStyleBtn onClick={onAdd}>{t("component.classification.addNewGroup")}</CustomStyleBtn>
          </Fragment>
        ) : (
          <Fragment>
            <Row>
              <Col span={24}>
                <CheckboxLabel mb="15px" defaultChecked={checkboxVal} onChange={checkboxChange}>
                  {t("component.classification.groupPossibleRespTitle")}
                </CheckboxLabel>
                <List
                  prefix="group"
                  items={items}
                  firstFocus={firstFocus}
                  onAdd={onAdd}
                  onSortEnd={restProps.onSortEnd}
                  onChange={restProps.onChange}
                  onRemove={restProps.onRemove}
                  useDragHandle
                  columns={1}
                  imageDefaultWidth={IMAGE_LIST_DEFAULT_WIDTH}
                  t={t}
                />
              </Col>
            </Row>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

GroupPossibleResponses.propTypes = {
  checkboxChange: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  firstFocus: PropTypes.bool.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  checkboxVal: PropTypes.bool.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

GroupPossibleResponses.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(GroupPossibleResponses);
