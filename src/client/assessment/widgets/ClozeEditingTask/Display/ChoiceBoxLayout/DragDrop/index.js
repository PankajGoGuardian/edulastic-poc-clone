import React from "react";
import { DragDrop, MathFormulaDisplay } from "@edulastic/common";

const { DropContainer } = DragDrop;

const EditingDragDrop = ({ onChange, userAnswer, styles }) => {
  const answer = userAnswer?.value;
  const containerStyle = {
    borderRadius: 2,
    display: "inline-flex",
    alignItems: "center",
    verticalAlign: "middle",
    background: "#f8f8f8",
    border: "1px solid #b9b9b9",
    padding: "0px 8px",
    ...styles
  };

  const onDrop = ({ data }) => {
    onChange(data);
  };

  return (
    <DropContainer drop={onDrop} style={containerStyle}>
      <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: answer }} />
    </DropContainer>
  );
};

export default EditingDragDrop;
