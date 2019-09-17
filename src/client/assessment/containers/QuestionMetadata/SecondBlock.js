import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Select, message } from "antd";

import { Container } from "./styled/Container";
import { ItemBody } from "./styled/ItemBody";
import { selectsData } from "../../../author/TestPage/components/common";
import { SelectSuffixIcon } from "./styled/SelectSuffixIcon";
import { tagsApi } from "@edulastic/api";

const SecondBlock = ({
  t,
  onChangeTags,
  onQuestionDataSelect,
  depthOfKnowledge = "",
  authorDifficulty = "",
  tags = [],
  allTagsData,
  addNewTag
}) => {
  const [searchValue, setSearchValue] = useState("");
  const selectTags = async id => {
    let newTag = {};
    if (id === searchValue) {
      const tempSearchValue = searchValue;
      setSearchValue("");
      try {
        const { _id, tagName } = await tagsApi.create({ tagName: tempSearchValue, tagType: "testitem" });
        newTag = { _id, tagName };
        addNewTag({ tag: newTag, tagType: "testitem" });
      } catch (e) {
        message.error("Saving tag failed");
      }
    } else {
      newTag = allTagsData.find(tag => tag._id === id);
    }
    const newTags = [...tags, newTag];
    onChangeTags(newTags);
    setSearchValue("");
  };

  const deselectTags = id => {
    const newTags = tags.filter(tag => tag._id !== id);
    onChangeTags(newTags);
  };

  const searchTags = async value => {
    if (allTagsData.some(tag => tag.tagName === value)) {
      setSearchValue("");
    } else {
      setSearchValue(value);
    }
  };
  return (
    <Container padding="20px">
      <Row gutter={36}>
        <Col md={8}>
          <ItemBody>
            <div className="label">
              <b>{t("component.options.depthOfKnowledge")}</b>
            </div>
            <Select
              style={{ width: "100%" }}
              placeholder={t("component.options.selectDOK")}
              onSelect={onQuestionDataSelect("depthOfKnowledge")}
              value={depthOfKnowledge}
              suffixIcon={<SelectSuffixIcon type="caret-down" />}
            >
              <Select.Option key={"Select DOK"} value={""}>
                {"Select DOK"}
              </Select.Option>
              {selectsData.allDepthOfKnowledge.map(
                el =>
                  el.value && (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  )
              )}
            </Select>
          </ItemBody>
        </Col>
        <Col md={8}>
          <ItemBody>
            <div className="label">
              <b>{t("component.options.difficultyLevel")}</b>
            </div>
            <Select
              style={{ width: "100%" }}
              placeholder={t("component.options.selectDifficulty")}
              onSelect={onQuestionDataSelect("authorDifficulty")}
              value={authorDifficulty}
              suffixIcon={<SelectSuffixIcon type="caret-down" />}
            >
              <Select.Option key={"Select Difficulty Level"} value={""}>
                {"Select Difficulty Level"}
              </Select.Option>
              {selectsData.allAuthorDifficulty.map(
                el =>
                  el.value && (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  )
              )}
            </Select>
          </ItemBody>
        </Col>
        <Col md={8}>
          <ItemBody>
            <div className="label">
              <b>{t("component.options.tags")}</b>
            </div>
            {searchValue.length && !searchValue.trim().length ? (
              <Select
                mode="multiple"
                style={{ marginBottom: 0, width: "100%" }}
                optionLabelProp="title"
                className="tagsSelect"
                placeholder="Please select"
                filterOption={(input, option) => option.props.title.toLowerCase().includes(input.trim().toLowerCase())}
                onSearch={searchTags}
              >
                <Select.Option key={0} value={"invalid"} title={"invalid"} disabled>
                  {"Please enter valid characters"}
                </Select.Option>
              </Select>
            ) : (
              <Select
                data-cy="tagsSelect"
                mode="multiple"
                className="tagsSelect"
                style={{ marginBottom: 0, width: "100%" }}
                optionLabelProp="title"
                placeholder="Please select"
                value={tags.map(t => t._id)}
                onSearch={searchTags}
                onSelect={selectTags}
                onDeselect={deselectTags}
                filterOption={(input, option) => option.props.title.toLowerCase().includes(input.toLowerCase())}
              >
                {!!searchValue.trim() ? (
                  <Select.Option key={0} value={searchValue} title={searchValue}>
                    {`${searchValue} (Create new Tag)`}
                  </Select.Option>
                ) : (
                  ""
                )}
                {allTagsData.map(({ tagName, _id }, index) => (
                  <Select.Option key={_id} value={_id} title={tagName}>
                    {tagName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </ItemBody>
        </Col>
      </Row>
    </Container>
  );
};

SecondBlock.propTypes = {
  t: PropTypes.func.isRequired,
  onChangeTags: PropTypes.func.isRequired,
  onQuestionDataSelect: PropTypes.func.isRequired,
  depthOfKnowledge: PropTypes.string.isRequired,
  authorDifficulty: PropTypes.string.isRequired,
  tags: PropTypes.array
};

SecondBlock.defaultProps = {
  tags: []
};

export default SecondBlock;
