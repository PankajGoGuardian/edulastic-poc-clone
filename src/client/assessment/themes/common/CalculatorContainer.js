import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Draggable from "react-draggable";
import BasicCalculator from "./BasicCalculator";
import { WithResources } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";

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
    let desmosGraphCalculator = Desmos.GraphingCalculator(ReactDOM.findDOMNode(this.desmosGraphingRef));
    desmosGraphCalculator.setExpression({ dragMode: Desmos.DragModes.XY });

    Desmos.FourFunctionCalculator(ReactDOM.findDOMNode(this.desmosBasicRef));
    Desmos.ScientificCalculator(ReactDOM.findDOMNode(this.desmosScientificRef));

    let geogebraGraphing = new GGBApplet(
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

    let geogebraScientific = new GGBApplet(
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
    const { changeMode, changeTool } = this.props;
    changeMode(0);
    changeTool(0);
  };
  render() {
    const { calculateMode } = this.state;
    return (
      <Container>
        <StyledDraggable>
          <StyledDiv visible={calculateMode === "GRAPHING_DESMOS"}>
            <CloseIcon color={"#fff"} onClick={this.handleCloseCalculator} />
            <StyledTitle>Desmos Graphing Calculator</StyledTitle>
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
            <CloseIcon color={"#fff"} onClick={this.handleCloseCalculator} />
            <StyledTitle>Desmos Basic Calculator</StyledTitle>
            <DesmosBasicCalculator
              ref={ref => {
                this.desmosBasicRef = ref;
              }}
            />
          </StyledDiv>
        </StyledDraggable>

        <StyledDraggable>
          <StyledDiv visible={calculateMode === "SCIENTIFIC_DESMOS"}>
            <CloseIcon color={"#fff"} onClick={this.handleCloseCalculator} />
            <StyledTitle>Desmos Scientific Calculator</StyledTitle>
            <DesmosScientificCalculator
              ref={ref => {
                this.desmosScientificRef = ref;
              }}
            />
          </StyledDiv>
        </StyledDraggable>

        <StyledDraggableF>
          <StyledDiv visible={calculateMode === "GRAPHING_GEOGEBRASCIENTIFIC"}>
            <CloseIcon color={"#fff"} onClick={this.handleCloseCalculator} />
            <StyledTitle>GeoGebra Graphing Calculator</StyledTitle>
            <GeoGebracalculator id="geogebra-graphingculator" />
          </StyledDiv>
        </StyledDraggableF>

        <StyledDraggableF>
          <StyledDiv visible={calculateMode === "BASIC_GEOGEBRASCIENTIFIC"}>
            <CloseIcon color={"#fff"} onClick={this.handleCloseCalculator} />
            <StyledTitle>Basic Calculator</StyledTitle>
            <BasicCalculator id="geogebra-basiccalculator" />
          </StyledDiv>
        </StyledDraggableF>

        <StyledDraggableF>
          <StyledDiv visible={calculateMode === "SCIENTIFIC_GEOGEBRASCIENTIFIC"}>
            <CloseIcon color={"#fff"} onClick={this.handleCloseCalculator} />
            <StyledTitle>GeoGebra Scientific Calculator</StyledTitle>
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
  top: 200px;
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
    resources={[
      "https://www.desmos.com/api/v1.2/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6&ext.js",
      "https://cdn.geogebra.org/apps/deployggb.js"
    ]}
    fallBack={<span />}
  >
    <CalculatorContainer {...props} />
  </WithResources>
);

export default CalculatorContainerWithResources;

// export default CalculatorContainer;
