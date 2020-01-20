import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { IconPencilEdit, IconTrash, IconEye } from "@edulastic/icons";
import { themeColor, fadedGrey } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { StyledTable, StyledTableButton, StyledTableHeader, StyledIconEye } from "../styled";

const TestCasesTable = ({ onEditTestCase, handleDeleteTestCase, t, data, theme }) => {
  const columnsData = [
    {
      title: t("component.coding.testCases.table.index"),
      key: "index",
      render: (text, record, index) => <span>{index + 1}</span>
    },
    {
      title: t("component.coding.testCases.table.desc"),
      dataIndex: "description",
      render: desc => <span>{desc}</span>
    },
    {
      title: t("component.coding.testCases.table.input"),
      dataIndex: "input",
      render: input => <span>{input}</span>
    },
    {
      title: t("component.coding.testCases.table.output"),
      dataIndex: "output",
      render: output => <span>{output}</span>
    },
    {
      title: t("component.coding.testCases.table.categories"),
      dataIndex: "category",
      render: category => <span>{category}</span>
    },
    {
      title: t("component.coding.testCases.table.weightage"),
      dataIndex: "weightage",
      render: weightage => <span>{weightage}</span>
    },
    {
      title: () => t("component.coding.testCases.table.visibility"),
      dataIndex: "visibility",
      className: "column-visibility",
      render: visibility => {
        return (
          <div style={{ whiteSpace: "nowrap", textAlign: "center" }}>
            <IconEye color={visibility === "open" ? themeColor : fadedGrey} style={{ width: "20px" }} />
          </div>
        );
      }
    },
    {
      title: t("component.coding.testCases.table.actions"),
      dataIndex: "id",
      render: id => {
        return (
          <div style={{ whiteSpace: "nowrap" }}>
            <StyledTableButton onClick={() => onEditTestCase(id)} title="Edit">
              <IconPencilEdit color={theme.themeColor} />
            </StyledTableButton>
            <StyledTableButton onClick={() => handleDeleteTestCase(id)} title="Archive">
              <IconTrash color={theme.themeColor} />
            </StyledTableButton>
          </div>
        );
      }
    }
  ];

  return <StyledTable rowKey={record => record._id} dataSource={data} columns={columnsData} pagination={false} />;
};

TestCasesTable.propTypes = {
  onEditTestCase: PropTypes.func.isRequired,
  handleDeleteTestCase: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  data: PropTypes.array,
  theme: PropTypes.object
};

TestCasesTable.defaultProps = {
  data: [],
  theme: {}
};

const enhance = compose(withNamespaces("assessment"));
export default enhance(withTheme(TestCasesTable));
