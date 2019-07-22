import React, { Component, Fragment } from "react";
import { Checkbox, Row, Col } from "antd";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { EduButton } from "@edulastic/common";

import { IMAGE_RESPONSE_DEFAULT_WIDTH } from "@edulastic/constants/const/imageConstants";
import { Subtitle } from "../../../styled/Subtitle";
import withAddButton from "../../../components/HOC/withAddButton";
import QuillSortableList from "../../../components/QuillSortableList";

import Group from "./Group";

const List = withAddButton(QuillSortableList);

class GroupPossibleResponses extends Component {
  render() {
    const { checkboxChange, checkboxVal, firstFocus, items, t, onAdd, ...restProps } = this.props;

    return (
      <Fragment>
        <Subtitle margin="0 0 15px">{t("component.matchList.possibleRespTitle")}</Subtitle>
        {checkboxVal ? (
          <Fragment>
            <div style={{ marginBottom: 20 }}>
              <Checkbox defaultChecked={checkboxVal} onChange={checkboxChange}>
                {t("component.matchList.groupPossibleRespTitle")}
              </Checkbox>
            </div>
            <Row>
              {items.map((item, index) => (
                <Col data-cy={`group-container-${index}`} key={index} span={24}>
                  <Group
                    prefix={`group${index}`}
                    item={item}
                    firstFocus={firstFocus}
                    index={index}
                    groupHeadText={t("component.matchList.titleOfGroupTitle")}
                    headText={t("component.matchList.titleOfGroupTitleLabel")}
                    text={t("component.matchList.possibleRespTitle")}
                    {...restProps}
                  />
                </Col>
              ))}
            </Row>
            <EduButton type="primary" onClick={onAdd}>
              {t("component.matchList.addNewGroup")}
            </EduButton>
          </Fragment>
        ) : (
          <Fragment>
            <div style={{ marginBottom: 20 }}>
              <Checkbox defaultChecked={checkboxVal} onChange={checkboxChange}>
                {t("component.matchList.groupPossibleRespTitle")}
              </Checkbox>
            </div>
            <Row>
              <Col>
                <List
                  prefix="group"
                  items={items}
                  onAdd={onAdd}
                  firstFocus={firstFocus}
                  onSortEnd={restProps.onSortEnd}
                  onChange={restProps.onChange}
                  onRemove={restProps.onRemove}
                  useDragHandle
                  columns={1}
                  imageDefaultWidth={IMAGE_RESPONSE_DEFAULT_WIDTH}
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
  firstFocus: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
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
