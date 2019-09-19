import React, { useRef } from "react";
import { white, grey } from "@edulastic/colors";

const WithoutKeyboard = () => {
  const mathFieldRef = useRef();
  return (
    <div
      className="input__math"
      style={{
        borderRadius: 5,
        background: white,
        border: `1px solid ${grey}`,
        padding: "5px 25px",
        minHeight: 40
      }}
      data-cy="answer-math-input-field"
    >
      <span className="input__math__field" ref={mathFieldRef} />
    </div>
  );
};

export default WithoutKeyboard;
