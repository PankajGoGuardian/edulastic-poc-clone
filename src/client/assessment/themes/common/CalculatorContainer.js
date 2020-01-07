import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Draggable from "react-draggable";
import { WithResources } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import BasicCalculator from "./BasicCalculator";
import { Spin } from "antd";
import AppConfig from "../../../../../app-config";

class CalculatorContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calculateMode: this.props.calculateMode
    };

    this.desmosGraphingRef = React.createRef();
    this.desmosBasicRef = React.createRef();
    this.desmosScientificRef = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      calculateMode: nextProps.calculateMode
    });
  }

  componentDidMount() {
    const desmosGraphCalculator = Desmos.GraphingCalculator(ReactDOM.findDOMNode(this.desmosGraphingRef));
    desmosGraphCalculator.setExpression({ dragMode: Desmos.DragModes.XY });

    Desmos.FourFunctionCalculator(ReactDOM.findDOMNode(this.desmosBasicRef));
    Desmos.ScientificCalculator(ReactDOM.findDOMNode(this.desmosScientificRef));

    const geogebraGraphing = new GGBApplet(
      {
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
      "5.0",
      "geogebra-graphingculator"
    );
    geogebraGraphing.inject("geogebra-graphingculator");

    const geogebraScientific = new GGBApplet(
      {
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
      },
      "5.0",
      "geogebra-scientificcalculator"
    );
    geogebraScientific.inject("geogebra-scientificcalculator");
  }

  handleCloseCalculator = () => {
    const { changeTool } = this.props;
    changeTool(0);
  };

  render() {
    const { calculateMode } = this.state;
    return (
      <Container>
        <StyledDraggable>
          <StyledDiv visible={calculateMode === "GRAPHING_DESMOS"}>
            <CloseIcon color="#fff" onClick={this.handleCloseCalculator} />
            <StyledTitle data-cy="GRAPHING">Graphing Calculator</StyledTitle>
            <DesmosGraphingCalculator
              id="demos-graphiccalculator"
              ref={ref => {
                this.desmosGraphingRef = ref;
              }}
            />
          </StyledDiv>
        </StyledDraggable>

        <StyledDraggable>
          <StyledDiv visible={calculateMode === "BASIC_DESMOS"}>
            <CloseIcon color="#fff" onClick={this.handleCloseCalculator} />
            <StyledTitle data-cy="BASIC">Basic Calculator</StyledTitle>
            <DesmosBasicCalculator
              ref={ref => {
                this.desmosBasicRef = ref;
              }}
            />
          </StyledDiv>
        </StyledDraggable>

        {/* We are Displaying desmos scientific calc for Edulastic scientific as well since there is no implementation yet done for edulastic scientific
         calculator. But once implementation for edulastic scientific is done the below condition needs to be changed to only desmos scientific*/}
        <StyledDraggable>
          <StyledDiv visible={["SCIENTIFIC_DESMOS", "SCIENTIFIC_EDULASTIC"].includes(calculateMode)}>
            <CloseIcon color="#fff" onClick={this.handleCloseCalculator} />
            <StyledTitle data-cy="SCIENTIFIC">Scientific Calculator</StyledTitle>
            <DesmosScientificCalculator
              ref={ref => {
                this.desmosScientificRef = ref;
              }}
            />
          </StyledDiv>
        </StyledDraggable>

        <StyledDraggableF>
          <StyledDiv visible={calculateMode === "GRAPHING_GEOGEBRASCIENTIFIC"}>
            <CloseIcon color="#fff" onClick={this.handleCloseCalculator} />
            <StyledTitle>Graphing Calculator</StyledTitle>
            <GeoGebracalculator id="geogebra-graphingculator" />
          </StyledDiv>
        </StyledDraggableF>

        <StyledDraggableF>
          <StyledDiv visible={calculateMode === "BASIC_EDULASTIC"}>
            <CloseIcon color="#fff" onClick={this.handleCloseCalculator} />
            <StyledTitle>Basic Calculator</StyledTitle>
            <BasicCalculator id="edulastic-basiccalculator" />
          </StyledDiv>
        </StyledDraggableF>

        <StyledDraggableF>
          <StyledDiv visible={calculateMode === "SCIENTIFIC_GEOGEBRASCIENTIFIC"}>
            <CloseIcon color="#fff" onClick={this.handleCloseCalculator} />
            <StyledTitle>Scientific Calculator</StyledTitle>
            <GeoGebracalculator id="geogebra-scientificcalculator" />
          </StyledDiv>
        </StyledDraggableF>
      </Container>
    );
  }
}

const Container = styled.div``;

const StyledDraggable = styled(Draggable)`
  position: absolute;
`;

const StyledDraggableF = styled(Draggable)`
  position: absolute;
  width: 800px;
`;

const StyledDiv = styled.div`
  position: absolute;
  left: 50%;
  top: 80px;
  display: ${props => (props.visible ? "block" : "none")};
`;

const StyledTitle = styled.div`
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

const DesmosGraphingCalculator = styled.div`
  width: 600px;
  height: 400px;
`;

const DesmosBasicCalculator = styled.div`
  width: 350px;
  height: 500px;
`;

const DesmosScientificCalculator = styled.div`
  width: 600px;
  height: 500px;
`;

const GeoGebracalculator = styled.div`
  width: 800px !important;
  height: 600px !important;
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

// export default CalculatorContainer;
