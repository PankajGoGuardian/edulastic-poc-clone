import React, { useState } from "react";
import Rnd from "react-rnd-rotate";
import { Container, Protractor, Centimeter } from "./styled";

import RotateProtractorImg from "./assets/rotate.svg";

const handleRotateStyles = {
  display: "block",
  width: 25,
  height: 47,
  bottom: 0,
  top: "none",
  left: -30,
  marginLeft: 0,
  border: "none",
  backgroundImage: `url(${RotateProtractorImg})`,
  backgroundSize: "contain"
};

const MeasureTools = () => {
  const [centimeterPosition, setCentimeterPosition] = useState({
    x: 0,
    y: 10
  });

  const [protractorPosition, setProtractorPosition] = useState({
    x: 0,
    y: 125
  });

  const size = {
    c: { width: 720, height: 90 },
    p: { width: 550, height: 290 }
  };

  const styles = {
    p: {
      rotate: { ...handleRotateStyles, bottom: -20 }
    },
    c: {
      rotate: { ...handleRotateStyles, bottom: -25 }
    }
  };

  return (
    <Container>
      <Rnd
        size={size.p}
        position={{ x: protractorPosition.x, y: protractorPosition.y }}
        onDragStop={(e, d) => setProtractorPosition({ x: d.x, y: d.y })}
        resizeHandleStyles={styles.p}
      >
        <Protractor {...size.p} />
      </Rnd>

      <Rnd
        size={size.c}
        position={{ x: centimeterPosition.x, y: centimeterPosition.y }}
        onDragStop={(e, d) => setCentimeterPosition({ x: d.x, y: d.y })}
        resizeHandleStyles={styles.c}
      >
        <Centimeter {...size.c} />
      </Rnd>
    </Container>
  );
};

export default MeasureTools;
