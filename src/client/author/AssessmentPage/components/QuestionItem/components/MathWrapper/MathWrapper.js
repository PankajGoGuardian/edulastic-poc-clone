import React, { useRef, useState, useEffect } from "react";
import { WithResources } from "../../../../../../../../packages/common/src/HOC/withResources.js";
import AppConfig from "../../../../../../../../app-config.js";

export const MathWrapper = props => (
  <WithResources
    resources={[
      `${AppConfig.jqueryPath}/jquery.min.js`,
      `${AppConfig.mathquillPath}/mathquill.css`,
      `${AppConfig.mathquillPath}/mathquill.min.js`
    ]}
    fallBack={<span />}
  >
    <StaticMathDisplay {...props} />
  </WithResources>
);

export const StaticMathDisplay = ({ latex }) => {
  const [mathField, setMathField] = useState(null);
  const mathFieldRef = useRef(null);

  const sanitizeLatex = v => v.replace(/&amp;/g, "&");

  useEffect(() => {
    const MQ = window.MathQuill.getInterface(2);
    if (mathFieldRef.current) {
      setMathField(MQ.StaticMath(mathFieldRef.current));
    }
  }, [latex]);

  useEffect(() => {
    if (!mathField) return;
    mathField.latex(sanitizeLatex(latex));
  }, [mathField]);

  return <span className="input__math__field" ref={mathFieldRef} />;
};
