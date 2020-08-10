import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import produce from "immer";
import { isEmpty } from "lodash";
import { getFormattedAttrId } from "@edulastic/common";

import { ContentArea } from "../../../styled/ContentArea";
import QuestionTextArea from "../../../components/QuestionTextArea";
import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";
import { Widget } from "../../../styled/Widget";
import Scoring from "../../../containers/WidgetOptions/components/Scoring";
import Uploader from "./Uploader";
import FilesView from "./FilesView";

const UploadFileEdit = ({ item, setQuestionData, fillSections, cleanSections, t }) => {
  const handleItemChangeChange = (prop, uiStyle) => {
    setQuestionData(
      produce(item, draft => {
        draft[prop] = uiStyle;
      })
    );
  };

  const uploadFinished = files => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.files) {
          draft.files = [];
        }
        draft.files = [...draft.files, ...files];
      })
    );
  };

  const handleDeleteFile = index => {
    setQuestionData(
      produce(item, draft => {
        if (draft.files) {
          draft.files = draft.files.filter((_, i) => i !== index);
        }
      })
    );
  };

  return (
    <ContentArea>
      <Question
        section="main"
        label={t("component.uploadfile.composeQuestion")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.uploadfile.composeQuestion")}`)}>
          {t("component.uploadfile.composeQuestion")}
        </Subtitle>

        <QuestionTextArea
          placeholder={t("component.uploadfile.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
          border="border"
        />
      </Question>

      {!isEmpty(item.files) && (
        <Widget advancedAreOpen>
          <FilesView files={item.files} onDelete={handleDeleteFile} />
        </Widget>
      )}

      <Widget advancedAreOpen>
        <Uploader onCompleted={uploadFinished} item={item} />
      </Widget>

      <Question section="main" label="Scoring" fillSections={fillSections} cleanSections={cleanSections}>
        <Scoring
          scoringTypes={[]}
          fillSections={fillSections}
          cleanSections={cleanSections}
          showSelect={false}
          item={item}
        />
      </Question>
    </ContentArea>
  );
};

UploadFileEdit.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

UploadFileEdit.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(UploadFileEdit);
