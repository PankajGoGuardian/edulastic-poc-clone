import React, { useState, useEffect } from "react";

import { BannerDiv } from "./styled";
import { Button } from "antd";
import { themeColor, white } from "@edulastic/colors";

const GoogleBanner = ({ syncClassLoading, showBanner = false, setShowDetails }) => {
  const [bgColor, setBgColor] = useState("#D3FEA6");
  const [color, setColor] = useState("#77B833");
  const [text, setText] = useState("is Complete");
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    if (syncClassLoading) {
      setBgColor("#F5EE8B");
      setColor("#B5AA08");
      setText("in Progress");
      setShowButton(false);
    } else {
      setBgColor("#D3FEA6");
      setColor("#77B833");
      setText("is Complete");
      setShowButton(true);
    }
  }, [syncClassLoading]);

  if (!showBanner) return "";
  return (
    <BannerDiv style={{ backgroundColor: bgColor, color }}>
      <span style={{ marginLeft: "auto", marginRight: "auto", padding: "5px 10px" }}>
        Google Classroom Import {text}
      </span>
      {showButton && (
        <Button
          style={{ backgroundColor: themeColor, color: white, padding: "3px 30px 3px" }}
          onClick={() => setShowDetails(true)}
        >
          {" "}
          Show Details{" "}
        </Button>
      )}
    </BannerDiv>
  );
};

export default GoogleBanner;
