import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { helpers, WithMathFormula } from "@edulastic/common";
import { mainTextColor } from "@edulastic/colors";
import MatrixCell from "../MatrixCell";
import { StyledTable } from "./styled/StyledTable";
import { getFontSize } from "../../../../utils/helpers";
import StyledHeader from "./styled/StyledHeader";
import { IconWrapper } from "./styled/IconWrapper";
import { IconCheck } from "./styled/IconCheck";
import { IconClose } from "./styled/IconClose";

const MathSpan = WithMathFormula(styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`);

const Matrix = props => {
  const { stems, options, response, isMultiple, onCheck, uiStyle, evaluation, smallSize, isPrintPreview } = props;

  // We expect stems to be an array, otherwise don't render
  if (!stems || !Array.isArray(stems)) {
    return null;
  }

  const getCell = (columnIndex, data) => {
    let checked = false;
    let correct = false;
    const rowIndex = data.index;

    if (evaluation && evaluation.length > 0) {
      correct = evaluation[rowIndex][columnIndex] ? true : "incorrect";
    }
    if (!Array.isArray(response.value[rowIndex])) {
      correct = false;
    }

    if (data && data.value && data.value.length) {
      checked = data.value.includes(columnIndex);
    }

    const handleChange = e => {
      const checkData = {
        columnIndex,
        rowIndex,
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
        isPrintPreview={isPrintPreview}
      >
        {evaluation && checked && (
          <IconWrapper correct={correct}>
            {correct === true && <IconCheck />}
            {correct === "incorrect" && <IconClose />}
          </IconWrapper>
        )}
      </MatrixCell>
    );
  };

  const isTable = uiStyle.type === "table";

  const optionsData = options.map((option, i) => ({
    title: (
      <StyledHeader style={{ color: mainTextColor }} dangerouslySetInnerHTML={{ __html: isTable ? option : "" }} />
    ),
    dataIndex: `${i}`,
    width: uiStyle.optionWidth || "auto",
    key: i,
    render: data => getCell(i, data)
  }));

  const hasOptionRow = !helpers.isEmpty(uiStyle.optionRowTitle);
  const hasStemTitle = !helpers.isEmpty(uiStyle.stemTitle);

  const stemTitle = <StyledHeader dangerouslySetInnerHTML={{ __html: uiStyle.stemTitle || "" }} />;
  const optionRowTitle = <StyledHeader dangerouslySetInnerHTML={{ __html: uiStyle.optionRowTitle || "" }} />;

  let columns = [
    {
      title: stemTitle,
      dataIndex: "stem",
      key: "stem",
      width: uiStyle.stemWidth || "auto",
      render: stem => <MathSpan dangerouslySetInnerHTML={{ __html: stem }} />
    },
    {
      title: optionRowTitle,
      children: [...optionsData]
    }
  ];

  if (isTable && uiStyle.stemNumeration) {
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

  const getData = i => {
    const result = {};

    options.forEach((o, index) => {
      result[index] = {
        value: response.value[i],
        index: i
      };
    });

    if (evaluation && evaluation.length > 0) {
      result[options.length] = {
        value: evaluation[i],
        index: i
      };
    }

    return result;
  };

  const data = stems.map((stem, i) => ({
    key: i,
    stem,
    numeration: helpers.getNumeration(i, uiStyle.stemNumeration),
    ...getData(i)
  }));

  const fontSize = getFontSize(uiStyle.fontsize);

  const showHead = isTable || hasStemTitle || hasOptionRow;

  return (
    <StyledTable
      evaluated={evaluation && evaluation.length > 0}
      data-cy="matrixTable"
      fontSize={fontSize}
      horizontalLines={uiStyle.horizontalLines}
      columns={columns}
      dataSource={data}
      pagination={false}
      maxWidth={uiStyle.maxWidth}
      hasOptionRow={hasOptionRow}
      isTable={isTable}
      showHead={showHead}
    />
  );
};

Matrix.propTypes = {
  stems: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  response: PropTypes.object.isRequired,
  onCheck: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  smallSize: PropTypes.bool,
  isMultiple: PropTypes.bool,
  evaluation: PropTypes.object
};

Matrix.defaultProps = {
  isMultiple: false,
  evaluation: null,
  smallSize: false,
  uiStyle: {}
};

export default Matrix;
