import React from "react";
import { WithResources } from "../../HOC/withResources";

import MathInput from "./MathInput";

class MathInputWithResources extends React.PureComponent {
  mathInputRef = React.createRef();

  setFocus = () => {
    if (this.mathInputRef.current) {
      this.mathInputRef.current.focus();
    }
  };

  render() {
    return (
      <WithResources
        resources={[
          "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
          "https://cdnedupoc.snapwiz.net/mathquill/mathquill.css",
          "https://cdnedupoc.snapwiz.net/mathquill/mathquill.min.js"
        ]}
        fallBack={<span />}
      >
        <MathInput ref={this.mathInputRef} {...this.props} />
      </WithResources>
    );
  }
}

export default MathInputWithResources;
