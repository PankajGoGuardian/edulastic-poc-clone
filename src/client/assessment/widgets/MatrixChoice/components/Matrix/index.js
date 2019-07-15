import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { cloneDeep, flatten } from "lodash";
import styled, { withTheme } from "styled-components";

import { helpers, WithMathFormula } from "@edulastic/common";

import MatrixCell from "../MatrixCell";
import { StyledTable } from "./styled/StyledTable";
import { getFontSize } from "../../../../utils/helpers";
import StyledHeader from "./styled/StyledHeader";
import { IconWrapper } from "./styled/IconWrapper";
import { IconCheck } from "./styled/IconCheck";
import { IconClose } from "./styled/IconClose";
import { CHECK_ANSWER } from "../../../../constants/actions";
import { SHOW_ANSWER } from "../../../../../author/src/constants/actions";
import { CHECK, SHOW } from "../../../../constants/constantsForQuestions";

const getResponses = validation => {
  const altResponses =
    validation.alt_responses && validation.alt_responses.length ? validation.alt_responses.map(res => res.value) : [];
  return [validation.valid_response.value, ...altResponses];
};

const validatedAnswers = (answers, responses, matrix, type) => {
  let result = [];

  if (type === "show") {
    const newMatrix = cloneDeep(matrix);

    result = [
      newMatrix.map((mat, matIndex) =>
        mat.map((row, rowIndex) => {
          const isCorrect = responses.some(arr => {
            return arr[matIndex] && arr[matIndex].includes(rowIndex);
          });

          return isCorrect;
        })
      )
    ];

    const userResponsesResult = responses.map(res => {
      let newMatrix = cloneDeep(matrix);

      newMatrix = newMatrix.map((mat, matIndex) =>
        mat.map((row, rowIndex) => {
          if (!res[matIndex]) {
            res[matIndex] = [];
          }

          if (!answers[matIndex]) {
            answers[matIndex] = [];
          }

          if (!res[matIndex].includes(rowIndex) && answers[matIndex].includes(rowIndex)) {
            return "incorrect";
          }

          return res[matIndex].includes(rowIndex) && answers[matIndex].includes(rowIndex);
        })
      );

      return newMatrix;
    });

    result = [...result, ...userResponsesResult];
  } else {
    result = responses.map(res => {
      let newMatrix = cloneDeep(matrix);

      newMatrix = newMatrix.map((mat, matIndex) =>
        mat.map((row, rowIndex) => {
          if (!res[matIndex]) {
            res[matIndex] = [];
          }

          if (!answers[matIndex]) {
            answers[matIndex] = [];
          }

          if (!res[matIndex].includes(rowIndex) && answers[matIndex].includes(rowIndex)) {
            return "incorrect";
          }

          return res[matIndex].includes(rowIndex) && answers[matIndex].includes(rowIndex);
        })
      );

      return newMatrix;
    });
  }

  return result;
};

const MathSpan = WithMathFormula(styled.div``);

const Matrix = props => {
  const {
    stems,
    options,
    response,
    isMultiple,
    onCheck,
    uiStyle,
    validation,
    type,
    smallSize,
    theme,
    previewTab,
    isReviewTab
  } = props;
  let correctAnswersMatrix;

  // We expect stems to be an array, otherwise don't render
  if (!stems || !Array.isArray(stems)) {
    return null;
  }

  if (response && validation && type !== "clear") {
    const responses = getResponses(validation);
    const matrix = stems.map(() => options.map(() => false));
    correctAnswersMatrix = validatedAnswers(response.value, responses, matrix, type);
  }

  if (isReviewTab) {
    const responses = getResponses(validation);
    const matrix = stems.map(() => options.map(() => false));
    correctAnswersMatrix = validatedAnswers(response.value, responses, matrix, "show");
  }

  const getCell = (columnIndex, data) => {
    let checked = false;
    let correct = false;

    if (correctAnswersMatrix) {
      const answers = correctAnswersMatrix.map(mat => mat[data.index][columnIndex]);

      const isTrue = el => el === true;
      const isIncorrect = el => el === "incorrect";

      if (answers.some(isTrue)) {
        correct = true;
      } else if (answers.some(isIncorrect)) {
        correct = "incorrect";
      }
    }

    if (data && data.value && data.value.length) {
      checked = data.value.includes(columnIndex);
    }

    if (isReviewTab && correct === true) {
      checked = true;
    }

    const handleChange = e => {
      const checkData = {
        columnIndex,
        rowIndex: data.index,
        checked: e.target.checked
      };

      onCheck(checkData);
    };

    return (
      <MatrixCell
        onChange={handleChange}
        checked={checked}
        correct={correct}
        type={uiStyle.type}
        label={options[columnIndex]}
        isMultiple={isMultiple}
        smallSize={smallSize}
      >
        {previewTab === CHECK || previewTab === SHOW ? (
          <IconWrapper>
            {correct === true && <IconCheck />}
            {correct === "incorrect" && <IconClose />}
          </IconWrapper>
        ) : null}
      </MatrixCell>
    );
  };

  const getColumns = () => {
    const isTable = uiStyle.type === "table";

    const optionsData = options.map((option, i) => ({
      title: isTable ? (
        <StyledHeader
          style={{ color: theme.widgets.matrixChoice.tableStyledHeaderColor }}
          dangerouslySetInnerHTML={{ __html: option }}
        />
      ) : (
        ""
      ),
      dataIndex: `${i}`,
      width: uiStyle.option_width || "auto",
      key: i,
      render: data => getCell(i, data)
    }));

    const stemTitle = !helpers.isEmpty(uiStyle.stem_title) ? (
      <StyledHeader dangerouslySetInnerHTML={{ __html: uiStyle.stem_title }} />
    ) : (
      ""
    );
    const optionRowTitle = !helpers.isEmpty(uiStyle.option_row_title) ? (
      <StyledHeader dangerouslySetInnerHTML={{ __html: uiStyle.option_row_title }} />
    ) : (
      ""
    );

    let columns = [
      {
        title: stemTitle,
        dataIndex: "stem",
        key: "stem",
        width: uiStyle.stem_width || "auto",
        render: stem => <MathSpan dangerouslySetInnerHTML={{ __html: stem }} />
      },
      {
        title: optionRowTitle,
        children: [...optionsData]
      }
    ];

    if (uiStyle.type === "table" && uiStyle.stem_numeration) {
      columns = [
        {
          title: "",
          dataIndex: "numeration",
          key: "numeration",
          render: stem => <MathSpan dangerouslySetInnerHTML={{ __html: stem }} />
        },
        ...columns
      ];
    }

    return columns;
  };

  const getData = i => {
    const result = {};

    options.forEach((o, index) => {
      result[index] = {
        value: response.value[i],
        index: i
      };
    });

    return result;
  };

  const data = stems.map((stem, i) => ({
    key: i,
    stem,
    numeration: helpers.getNumeration(i, uiStyle.stem_numeration),
    ...getData(i)
  }));

  const fontSize = getFontSize(uiStyle.fontsize);

  return (
    <StyledTable
      data-cy="matrixTable"
      fontSize={fontSize}
      horizontalLines={uiStyle.horizontal_lines}
      columns={getColumns()}
      dataSource={data}
      pagination={false}
    />
  );
};

Matrix.propTypes = {
  stems: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  response: PropTypes.object.isRequired,
  onCheck: PropTypes.func.isRequired,
  uiStyle: PropTypes.object.isRequired,
  smallSize: PropTypes.bool,
  isMultiple: PropTypes.bool,
  validation: PropTypes.object,
  type: PropTypes.string,
  theme: PropTypes.object.isRequired,
  isReviewTab: PropTypes.bool
};

Matrix.defaultProps = {
  isMultiple: false,
  validation: null,
  type: "clear",
  smallSize: false,
  isReviewTab: false
};

export default withTheme(Matrix);
