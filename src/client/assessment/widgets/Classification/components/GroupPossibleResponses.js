import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Checkbox, Row, Col } from "antd";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { EduButton } from "@edulastic/common";

import { Subtitle } from "../../../styled/Subtitle";
import withAddButton from "../../../components/HOC/withAddButton";
import QuillSortableList from "../../../components/QuillSortableList";

import Group from "./Group";

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
    const { checkboxChange, checkboxVal, items, t, firstFocus, onAdd, ...restProps } = this.props;

    return (
      <Fragment>
        <Subtitle margin="0 0 15px">{t("component.classification.possibleRespTitle")}</Subtitle>
        {checkboxVal ? (
          <Fragment>
            <div style={{ marginBottom: 20 }}>
              <Checkbox defaultChecked={checkboxVal} onChange={checkboxChange}>
                {t("component.classification.groupPossibleRespTitle")}
              </Checkbox>
            </div>
            <Row gutter={60}>
              {items.map((item, index) => (
                <Col data-cy={`group-container-${index}`} key={index} span={12}>
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
            <EduButton type="primary" onClick={onAdd}>
              {t("component.classification.addNewGroup")}
            </EduButton>
          </Fragment>
        ) : (
          <Fragment>
            <Row>
              <Col>
                <div style={{ marginBottom: 20 }}>
                  <Checkbox defaultChecked={checkboxVal} onChange={checkboxChange}>
                    {t("component.classification.groupPossibleRespTitle")}
                  </Checkbox>
                </div>
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
