/* eslint-disable react/no-this-in-sfc */
import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import { connect } from "react-redux";
import { Rnd } from "react-rnd";

import { withTheme } from "styled-components";
import { compose } from "redux";
import { get } from "lodash";
import produce from "immer";
import uuid from "uuid/v4";

import { Paper, FlexContainer, beforeUpload, notification } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { Upload } from "antd";
import { aws, clozeImage } from "@edulastic/constants";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import CorrectAnswers from "../../components/CorrectAnswers";

import { EDIT } from "../../constants/constantsForQuestions";

import { updateVariables } from "../../utils/variables";

import { setQuestionDataAction, setFirstMountAction } from "../../../author/QuestionEditor/ducks";

import GroupPossibleResponses from "./components/GroupPossibleResponses";
import ClassificationPreview from "./ClassificationPreview";
import Options from "./components/Options";
import Question from "../../components/Question";

import ComposeQuestion from "./ComposeQuestion";
import RowColumn from "./RowColumn";
import { DropContainer } from "./styled/DropContainer";

import { uploadToS3 } from "../../../author/src/utils/upload";
import { CheckboxLabel } from "../../styled/CheckboxWithLabel";
import { CustomStyleBtn } from "../../styled/ButtonStyles";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";

const Enable = {
  bottomLeft: true,
  bottomRight: true,
  topLeft: true,
  topRight: true,
  bottom: true,
  left: true,
  right: true,
  top: true
};

const actions = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  SORTEND: "SORTEND"
};

const EditClassification = ({
  item,
  setQuestionData,
  setFirstMount,
  theme,
  t,
  advancedAreOpen,
  advancedLink,
  fillSections,
  cleanSections
}) => {
  const {
    firstMount,
    shuffleOptions,
    transparentPossibleResponses,
    transparentBackgroundImage = true,
    duplicateResponses,
    imageOptions,
    uiStyle: { showDragHandle },
    classifications
  } = item;

  const [correctTab, setCorrectTab] = useState(0);

  const [dragItem, setDragItem] = useState(imageOptions || { width: 0, height: 0, x: 0, y: 0 });
  const { width: dragItemWidth, height: dragItemHeight } = dragItem;

  useEffect(
    () => () => {
      setFirstMount(item.id);
    },
    []
  );

  useEffect(() => {
    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { ...imageOptions, ...dragItem };
        updateVariables(draft);
      })
    );
  }, [dragItemWidth, dragItemHeight]);

  const setImageDimensions = (url, isNew) => {
    const img = new Image();
    const { maxWidth, maxHeight } = clozeImage;
    // eslint-disable-next-line func-names
    img.addEventListener("load", function() {
      let height;
      let width;
      if (this.naturalHeight > maxHeight || this.naturalWidth > maxWidth) {
        const fitHeight = Math.floor(maxWidth * (this.naturalHeight / this.naturalWidth));
        const fitWidth = Math.floor(maxHeight * (this.naturalWidth / this.naturalHeight));
        if (fitWidth > maxWidth) {
          width = maxWidth;
          height = fitHeight;
        } else {
          height = maxHeight;
          width = fitWidth;
        }
      } else {
        width = this.naturalWidth;
        height = this.naturalHeight;
      }
      setQuestionData(
        produce(item, draft => {
          if (isNew) {
            draft.imageHeight = undefined;
            draft.imageWidth = undefined;
          }
          draft.imageUrl = url;
          draft.imageOriginalHeight = height;
          draft.imageOriginalWidth = width;
          updateVariables(draft);
        })
      );
      setDragItem({ ...dragItem, width, height });
    });
    img.src = url;
  };

  const getInitalAnswerMap = () => {
    const initalAnswerMap = {};
    classifications.forEach(classification => {
      initalAnswerMap[classification.id] = initalAnswerMap[classification.id] || [];
    });
    return initalAnswerMap;
  };

  const handleItemChangeChange = (key, val) => {
    setQuestionData(
      produce(item, draft => {
        draft[key] = val;
        if (key === "duplicateResponses") {
          draft.validation.validResponse.value = getInitalAnswerMap();
          draft.validation.altResponses.forEach(altResponse => {
            altResponse.value = getInitalAnswerMap();
          });
        }
        updateVariables(draft);
      })
    );
  };

  const deleteBgImg = () => {
    setDragItem({ x: 0, y: 0, width: 0, height: 0 });
    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { x: 0, y: 0, width: 0, height: 0 };
        draft.imageUrl = "";
      })
    );
  };

  const onGroupPossibleResp = e => {
    setQuestionData(
      produce(item, draft => {
        draft.groupPossibleResponses = e.target.checked;
        draft.validation.validResponse.value = getInitalAnswerMap();

        draft.validation.altResponses.forEach(ite => {
          ite.value = getInitalAnswerMap();
        });
        updateVariables(draft);
      })
    );
  };

  const handleGroupAdd = () => {
    setQuestionData(
      produce(item, draft => {
        draft.possibleResponseGroups.push({ id: uuid(), title: "", responses: [] });
        updateVariables(draft);
      })
    );
  };

  const handleGroupRemove = index => () => {
    setQuestionData(
      produce(item, draft => {
        const responses = draft.possibleResponseGroups[index].responses.flatMap(resp => resp.id);
        responses.forEach(responseID => {
          const validResponse = draft.validation.validResponse.value;
          const validResponseKeys = Object.keys(validResponse);
          validResponseKeys.forEach(key => {
            validResponse[key] = validResponse[key].filter(respID => respID !== responseID);
          });
          draft.validation.altResponses.forEach(alt_response => {
            const value = alt_response.value;
            const altAnsKeys = Object.keys(value);
            altAnsKeys.forEach(key => {
              value[key] = value[key].filter(respID => respID !== responseID);
            });
          });
        });
        draft.possibleResponseGroups.splice(index, 1);
        updateVariables(draft);
      })
    );
  };

  const onAddInner = index => () => {
    setQuestionData(
      produce(item, draft => {
        draft.possibleResponseGroups[index].responses.push({ id: uuid(), value: "" });
        updateVariables(draft);
      })
    );
  };

  const onRemoveInner = groupIndex => respIndex => {
    setQuestionData(
      produce(item, draft => {
        const response = get(draft, `possibleResponseGroups[${groupIndex}][responses][${respIndex}]`);
        if (response) {
          const validResponse = draft.validation.validResponse.value;
          const validResponseKeys = Object.keys(validResponse);
          validResponseKeys.forEach(key => {
            const optionIndex = validResponse[key].indexOf(response.id);
            if (optionIndex !== -1) {
              validResponse[key].splice(optionIndex, 1);
            }
          });

          draft.validation.altResponses.forEach(altResponse => {
            const altAnswer = altResponse.value;
            const altAnswerKeys = Object.keys(altAnswer);
            altAnswerKeys.forEach(key => {
              const optionIndex = altAnswer[key].indexOf(response.id);
              if (optionIndex !== -1) {
                altAnswer[key].splice(optionIndex, 1);
              }
            });
          });

          draft.possibleResponseGroups[groupIndex].responses.splice(respIndex, 1);
          updateVariables(draft);
        }
      })
    );
  };

  const onGroupTitleChange = (index, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.possibleResponseGroups[index].title = value;
        updateVariables(draft);
      })
    );
  };

  const handleGroupSortEnd = index => ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, draft => {
        draft.possibleResponseGroups[index].responses = arrayMove(
          draft.possibleResponseGroups[index].responses,
          oldIndex,
          newIndex
        );
        updateVariables(draft);
      })
    );
  };

  const handleGroupChange = ind => (index, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.possibleResponseGroups[ind].responses[index].value = value;
        updateVariables(draft);
      })
    );
  };

  const handleMainPossible = action => restProp => {
    setQuestionData(
      produce(item, draft => {
        switch (action) {
          case actions.ADD:
            draft.possibleResponses.push({ id: uuid(), value: "" });
            break;

          case actions.REMOVE:
            // eslint-disable-next-line no-case-declarations
            const respID = get(draft, `possibleResponses[${restProp}].id`, "");

            Object.values(get(draft, `validation.validResponse.value`, [])).forEach((value = []) => {
              const optionIndex = value.indexOf(respID);
              if (optionIndex !== -1) {
                value.splice(optionIndex, 1);
              }
            });

            draft.validation.altResponses.forEach(altResponse => {
              const { value = {} } = altResponse;
              Object.values(value).forEach(arr => {
                const optionIndex = arr.indexOf(respID);
                if (optionIndex !== -1) {
                  arr.splice(optionIndex, 1);
                }
              });
            });
            draft.possibleResponses.splice(restProp, 1);
            break;

          case actions.SORTEND:
            draft.possibleResponses = arrayMove(item.possibleResponses, restProp.oldIndex, restProp.newIndex);
            break;

          default:
            return;
        }
        updateVariables(draft);
      })
    );
  };

  const handleChangePossible = () => (index, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.possibleResponses[index].value = value;
        updateVariables(draft);
      })
    );
  };

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = [];
        }
        draft.validation.altResponses.push({
          score: 1,
          value: getInitalAnswerMap()
        });

        updateVariables(draft);
      })
    );
    setCorrectTab(correctTab + 1);
  };

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.splice(tabIndex, 1);
        updateVariables(draft);
      })
    );
    setCorrectTab(0);
  };

  const handlePointsChange = val => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.score = val;
        } else {
          draft.validation.altResponses[correctTab - 1].score = val;
        }
        updateVariables(draft);
      })
    );
  };

  const handleAnswerChange = answer => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          if (draft.validation && draft.validation.validResponse) {
            draft.validation.validResponse.value = answer;
          }
        } else if (draft.validation && draft.validation.altResponses && draft.validation.altResponses[correctTab - 1])
          draft.validation.altResponses[correctTab - 1].value = answer;

        updateVariables(draft);
      })
    );
  };

  // need to update validation here if used (currently not in use)
  const onUiChange = prop => val => {
    setQuestionData(
      produce(item, draft => {
        draft.uiStyle[prop] = val;

        if (prop === "columnCount" || prop === "rowCount") {
          draft.validation.validResponse.value = getInitalAnswerMap();

          draft.validation.altResponses.forEach(ite => {
            ite.value = getInitalAnswerMap();
          });
        }

        updateVariables(draft);
      })
    );
  };

  const renderOptions = () => (
    <ClassificationPreview
      item={item}
      saveAnswer={handleAnswerChange}
      editCorrectAnswers={
        correctTab === 0 ? item.validation.validResponse.value : item.validation.altResponses[correctTab - 1].value
      }
      setQuestionData={setQuestionData}
      view={EDIT}
    />
  );

  const handleDrag = (e, d) => {
    setDragItem({ ...dragItem, x: d.x, y: d.y });
    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { ...{ ...dragItem, x: d.x, y: d.y } };
        updateVariables(draft);
      })
    );
  };

  const handleResize = (e, direction, ref, delta, position) => {
    const width = typeof ref.style.width === "number" ? ref.style.width : parseInt(ref.style.width.split("px")[0], 10);

    const height =
      typeof ref.style.height === "number" ? ref.style.height : parseInt(ref.style.height.split("px")[0], 10);

    setDragItem({
      width: width >= 700 ? 700 : width,
      height: height >= 600 ? 600 : height,
      ...position
    });
  };

  const handleDragAndResizeStop = () => {
    setQuestionData(
      produce(item, draft => {
        draft.imageOptions = { ...dragItem };
        updateVariables(draft);
      })
    );
  };

  const handleChange = async info => {
    try {
      const { file } = info;
      if (!file.type.match(/image/g)) {
        notification({ messageKey: "pleaseUploadFileInImageFormat" });
        return;
      }
      const canUpload = beforeUpload(file);
      if (!canUpload) {
        return;
      }
      const imageUrl = await uploadToS3(file, aws.s3Folders.DEFAULT);
      setImageDimensions(imageUrl, true);
      // handleItemChangeChange("imageUrl", imageUrl);
      notification({
        type: "success",
        msg: `${info.file.name} ${t("component.cloze.imageText.fileUploadedSuccessfully")}.`
      });
    } catch (e) {
      console.log(e);
      notification({ msg: `${info.file.name} ${t("component.cloze.imageText.fileUploadFailed")}.` });
    }
  };

  const uploadProps = {
    beforeUpload: () => false,
    onChange: handleChange,
    accept: "image/*",
    multiple: false,
    showUploadList: false
  };

  const imageOptionWidth = get(imageOptions, "width");
  const imageOptionHeight = get(imageOptions, "height");

  const isBgImageMaximized = imageOptionWidth >= 700 || imageOptionHeight >= 600;
  return (
    <Fragment>
      <Paper padding="0px" boxShadow="none">
        <ComposeQuestion item={item} fillSections={fillSections} cleanSections={cleanSections} />

        <Question section="main" label="Background" fillSections={fillSections} cleanSections={cleanSections}>
          {item.imageUrl ? (
            <FlexContainer flexDirection="column">
              <DropContainer>
                <Rnd
                  size={{ width: dragItem.width || "100%", height: dragItem.height || "100%" }}
                  enableResizing={Enable}
                  style={{
                    zIndex: 10,
                    backgroundImage: `url(${item.imageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: isBgImageMaximized
                      ? "100% 100%"
                      : `${imageOptions.width}px ${imageOptions.height}px`
                  }}
                  position={{ x: dragItem.x, y: dragItem.y }}
                  onDragStop={handleDrag}
                  onResize={handleResize}
                  onResizeStop={handleDragAndResizeStop}
                  bounds="parent"
                />
              </DropContainer>
              <CustomStyleBtn onClick={deleteBgImg}>{t("component.classification.deleteBackImage")}</CustomStyleBtn>
            </FlexContainer>
          ) : (
            <Upload {...uploadProps} showUploadList={false}>
              <CustomStyleBtn
                width="180px"
                id={getFormattedAttrId(`${item?.title}-${t("component.classification.addBackImage")}`)}
              >
                {t("component.classification.addBackImage")}
              </CustomStyleBtn>
            </Upload>
          )}
        </Question>

        <RowColumn
          item={item}
          theme={theme}
          fillSections={fillSections}
          cleanSections={cleanSections}
          toolbarSize="MD"
        />

        <Question
          section="main"
          label={t("component.classification.possibleRespTitle")}
          fillSections={fillSections}
          cleanSections={cleanSections}
        >
          <GroupPossibleResponses
            checkboxChange={onGroupPossibleResp}
            checkboxVal={item.groupPossibleResponses}
            items={
              item.groupPossibleResponses
                ? item.possibleResponseGroups.map(it => ({
                    title: it.title,
                    responses: it.responses.map(resp => resp.value)
                  }))
                : item.possibleResponses.map(ite => ite.value)
            }
            onAddInner={onAddInner}
            onTitleChange={onGroupTitleChange}
            onAdd={item.groupPossibleResponses ? handleGroupAdd : handleMainPossible(actions.ADD)}
            onSortEnd={item.groupPossibleResponses ? handleGroupSortEnd : handleMainPossible(actions.SORTEND)}
            firstFocus={firstMount}
            onChange={item.groupPossibleResponses ? handleGroupChange : handleChangePossible()}
            onRemoveInner={onRemoveInner}
            onRemove={item.groupPossibleResponses ? handleGroupRemove : handleMainPossible(actions.REMOVE)}
            fillSections={fillSections}
            cleanSections={cleanSections}
            t={t}
            item={item}
          />

          <Row gutter={24} marginTop={16}>
            <Col span={24} marginBottom="0px">
              <CheckboxLabel
                className="additional-options"
                onChange={() => onUiChange("showDragHandle")(!showDragHandle)}
                checked={!!showDragHandle}
                mb="20px"
              >
                {t("component.cloze.imageDragDrop.showdraghandle")}
              </CheckboxLabel>
              <CheckboxLabel
                className="additional-options"
                onChange={() => handleItemChangeChange("duplicateResponses", !duplicateResponses)}
                checked={!!duplicateResponses}
                mb="20px"
              >
                {t("component.cloze.imageDragDrop.duplicatedresponses")}
              </CheckboxLabel>
              <CheckboxLabel
                className="additional-options"
                onChange={() => handleItemChangeChange("shuffleOptions", !shuffleOptions)}
                checked={!!shuffleOptions}
                mb="20px"
              >
                {t("component.cloze.imageDragDrop.shuffleoptions")}
              </CheckboxLabel>
              <CheckboxLabel
                className="additional-options"
                onChange={() => handleItemChangeChange("transparentPossibleResponses", !transparentPossibleResponses)}
                checked={!!transparentPossibleResponses}
                mb="20px"
              >
                {t("component.cloze.imageDragDrop.transparentpossibleresponses")}
              </CheckboxLabel>
              <CheckboxLabel
                className="additional-options"
                onChange={() => handleItemChangeChange("transparentBackgroundImage", !transparentBackgroundImage)}
                checked={!!transparentBackgroundImage}
                mb="20px"
              >
                {t("component.cloze.imageDragDrop.transparentbackgroundimage")}
              </CheckboxLabel>
            </Col>
          </Row>
        </Question>

        <Question
          section="main"
          label={t("component.classification.correctAnswers")}
          fillSections={fillSections}
          cleanSections={cleanSections}
        >
          <CorrectAnswers
            onTabChange={setCorrectTab}
            correctTab={correctTab}
            onAdd={handleAddAnswer}
            validation={item.validation}
            options={renderOptions()}
            onCloseTab={handleCloseTab}
            fillSections={fillSections}
            cleanSections={cleanSections}
            marginBottom="-50px"
            questionType={item?.title}
            points={
              correctTab === 0
                ? item.validation.validResponse.score
                : item.validation.altResponses[correctTab - 1].score
            }
            onChangePoints={handlePointsChange}
            isCorrectAnsTab={correctTab === 0}
          />
        </Question>
      </Paper>

      {advancedLink}

      <Options
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
        item={item}
      />
    </Fragment>
  );
};

EditClassification.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  setFirstMount: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  advancedLink: PropTypes.any
};

EditClassification.defaultProps = {
  advancedAreOpen: false,
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme,
  connect(
    null,
    { setQuestionData: setQuestionDataAction, setFirstMount: setFirstMountAction }
  )
);

export default enhance(EditClassification);
