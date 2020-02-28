/* global Desmos, GGBApplet */
import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import { WithResources } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import { white, boxShadowDefault } from "@edulastic/colors";
import { Spin } from "antd";
import BasicCalculator from "./BasicCalculator";
import AppConfig from "../../../../../app-config";

const defaultRndPros = {
  geogebraCalculator: { x: 0, y: 0, width: 800, height: 635 },
  basicCalculator: { x: 0, y: 0, width: 350, height: 355 },
  graphingDesmos: { x: 0, y: 0, width: 600, height: 400 },
  basicDesmos: { x: 0, y: 0, width: 350, height: 500 },
  desmosScientific: { x: 0, y: 0, width: 600, height: 500 }
};

const geogebraParams = {
  graphing: {
    id: "ggbAppletGraphing",
    appName: "graphing",
    width: 800,
    height: 600,
    showToolBar: true,
    borderColor: null,
    showMenuBar: true,
    allowStyleBar: true,
    showAlgebraInput: true,
    enableLabelDrags: false,
    enableShiftDragZoom: true,
    capturingThreshold: null,
    showToolBarHelp: false,
    errorDialogsActive: true,
    showTutorialLink: true,
    showLogging: true,
    useBrowserForJS: false
  },
  scientific: {
    id: "ggbAppletScientific",
    appName: "scientific",
    width: 800,
    height: 600,
    showToolBar: true,
    borderColor: null,
    showMenuBar: true,
    allowStyleBar: true,
    showAlgebraInput: true,
    enableLabelDrags: false,
    enableShiftDragZoom: true,
    capturingThreshold: null,
    showToolBarHelp: false,
    errorDialogsActive: true,
    showTutorialLink: true,
    showLogging: true,
    useBrowserForJS: false
  }
};

const CalculatorContainer = ({ calculateMode, changeTool, style }) => {
  const handleCloseCalculator = () => {
    changeTool(0);
  };

  const desmosGraphingRef = useRef();
  const desmosBasicRef = useRef();
  const desmosScientificRef = useRef();

  useEffect(() => {
    if (desmosGraphingRef.current && calculateMode === "GRAPHING_DESMOS") {
      const desmosGraphCalculator = Desmos.GraphingCalculator(desmosGraphingRef.current);
      desmosGraphCalculator.setExpression({ dragMode: Desmos.DragModes.XY });
    }

    if (desmosBasicRef.current && calculateMode === "BASIC_DESMOS") {
      Desmos.FourFunctionCalculator(desmosBasicRef.current);
    }

    if (
      desmosScientificRef.current &&
      ["SCIENTIFIC_DESMOS", "SCIENTIFIC_EDULASTIC"].includes(calculateMode)
    ) {
      Desmos.ScientificCalculator(desmosScientificRef.current);
    }

    if (calculateMode === "GRAPHING_GEOGEBRASCIENTIFIC") {
      const geogebraGraphing = new GGBApplet(
        geogebraParams.graphing,
        "5.0",
        "geogebra-graphingculator"
      );
      geogebraGraphing.inject("geogebra-graphingculator");
    }

    if (calculateMode === "SCIENTIFIC_GEOGEBRASCIENTIFIC") {
      const geogebraScientific = new GGBApplet(
        geogebraParams.scientific,
        "5.0",
        "geogebra-scientificcalculator"
      );
      geogebraScientific.inject("geogebra-scientificcalculator");
    }
  }, [calculateMode]);

  return (
    <Container style={{...style, zIndex: 510}}>
      {calculateMode === "GRAPHING_DESMOS" && (
        <RndWrapper
          default={defaultRndPros.graphingDesmos}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="GRAPHING">Graphing Calculator</Title>
          </div>
          <Calculator id="demos-graphiccalculator" ref={desmosGraphingRef} />
        </RndWrapper>
      )}

      {calculateMode === "BASIC_DESMOS" && (
        <RndWrapper
          default={defaultRndPros.basicDesmos}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="BASIC">Basic Calculator</Title>
          </div>
          <Calculator id="demos-basiccalculator" ref={desmosBasicRef} />
        </RndWrapper>
      )}

      {/* We are Displaying desmos scientific calc for Edulastic scientific as well since 
          there is no implementation yet done for edulastic scientific
          calculator. But once implementation for edulastic scientific is done the below condition 
          needs to be changed to only desmos scientific */}
      {["SCIENTIFIC_DESMOS", "SCIENTIFIC_EDULASTIC"].includes(calculateMode) && (
        <RndWrapper
          default={defaultRndPros.desmosScientific}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="SCIENTIFIC">Scientific Calculator</Title>
          </div>
          <Calculator id="demos-scientific-calculator" ref={desmosScientificRef} />
        </RndWrapper>
      )}

      {calculateMode === "BASIC_EDULASTIC" && (
        <RndWrapper
          default={defaultRndPros.basicCalculator}
          minWidth={defaultRndPros.basicCalculator.width}
          minHeight={defaultRndPros.basicCalculator.height}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="BASIC">Basic Calculator</Title>
          </div>
          <BasicCalculator id="edulastic-basiccalculator" />
        </RndWrapper>
      )}

      {calculateMode === "GRAPHING_GEOGEBRASCIENTIFIC" && (
        <RndWrapper
          default={defaultRndPros.geogebraCalculator}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="GRAPHING">Graphing Calculator</Title>
          </div>
          <Calculator id="geogebra-graphingculator" />
        </RndWrapper>
      )}

      {calculateMode === "SCIENTIFIC_GEOGEBRASCIENTIFIC" && (
        <RndWrapper
          default={defaultRndPros.geogebraCalculator}
          dragHandleClassName="calculator-drag-handler"
        >
          <div className="calculator-drag-handler">
            <CloseIcon color={white} onClick={handleCloseCalculator} />
            <Title data-cy="SCIENTIFIC">Scientific Calculator</Title>
          </div>
          <Calculator id="geogebra-scientificcalculator" />
        </RndWrapper>
      )}
    </Container>
  );
};

CalculatorContainer.propTypes = {
  calculateMode: PropTypes.string.isRequired,
  changeTool: PropTypes.func.isRequired,
  style: PropTypes.object
};

CalculatorContainer.defaultProps = {
  style: {}
};

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 80px;
`;

const RndWrapper = styled(Rnd)`
  box-shadow: ${boxShadowDefault};
`;

const Calculator = styled.div`
  width: 100%;
  height: calc(100% - 35px);
`;

const Title = styled.div`
  width: 100%;
  height: 35px;
  background: #0288d1;
  color: #ffffff;
  font-size: 16px;
  line-height: 35px;
  padding: 0 12px;
  font-weight: 600;
  text-align: left;
  cursor: move;
`;

const CloseIcon = styled(IconClose)`
  width: 30px;
  float: right;
  cursor: pointer;
  margin-top: 10px;
`;

const CalculatorContainerWithResources = ({ ...props }) => (
  <WithResources
    resources={[`${AppConfig.desmosPath}/calculator.js`, `${AppConfig.geoGebraPath}/deployggb.js`]}
    fallBack={<Spin />}
  >
    <CalculatorContainer {...props} />
  </WithResources>
);

export default CalculatorContainerWithResources;
