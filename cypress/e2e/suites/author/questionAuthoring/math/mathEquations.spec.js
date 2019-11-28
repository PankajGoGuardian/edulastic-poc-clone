import { math } from "@edulastic/constants";
import MathEquationPage from "../../../../framework/author/itemList/questionType/math/mathEquationPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import FileHelper from "../../../../framework/util/fileHelper";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { methods } from "../../../../framework/constants/questionAuthoring";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Math Cloze" type question`, () => {
  const queData = {
    mockString: "10-5+8-4",
    group: "Math",
    queType: "Equations & Inequalities",
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2",
    answer: {
      value: "1234",
      ariaLabel: "test"
    },
    responseBoxQuantity: 2,
    decimalSeparators: ["Dot", "Comma"],
    thousandsTestingSeparators: ["Comma", "Dot"],
    responseBoxText: ["Response box 1 :", "{enter}Response box 2 :"],
    equivSymbolicTwoResponse: {
      value: {
        input: ["80+20=100", "25*4=100"],
        expected: ["40+60=100", "20*5=100"],
        isCorrectAnswer: [true, true]
      },
      ignoreText: {
        expected: ["25m", "25asd"],
        input: ["25", "25"],
        checkboxValues: ["getAnswerIgnoreTextCheckox", null],
        isCorrectAnswer: [true, false]
      },
      compareSides: {
        expected: ["2+8=10", "12+8=20"],
        input: ["7+3=10", "4+16=20"],
        checkboxValues: ["getAnswerCompareSides", "getAnswerCompareSides"],
        isCorrectAnswer: [true]
      },
      eulersNumber: {
        input: ["2.718", "2.718"],
        expected: ["e", "e"],
        checkboxValues: ["getAnswerTreatEasEulersNumber", "getAnswerTreatEasEulersNumber"],
        isCorrectAnswer: [true]
      },
      significantDecimal: {
        expected: ["0.33", "0.33"],
        input: "1\\div3",
        decimalPlaces: 2
      },
      setThousandsSeparator: {
        expected: [["1,000,000", "1,000,000"], ["1.000.000", "1.000.000"]],
        input: "1000000",
        isCorrectAnswer: [true, true]
      }
    },
    equivLiteralTwoResponse: {
      value: {
        input: ["1+2", "5-6"],
        expected: ["1+2", "5-6"],
        isCorrectAnswer: [true, true]
      },
      allowInterval: {
        expected: ["(0,4]", "[0,4)"],
        input: ["(0,4]", "[0,4)"],
        checkboxValues: ["getAnswerAllowInterval", null],
        isCorrectAnswer: [true, false]
      },
      ignoreOrder: {
        expected: ["1+x", "x+5"],
        input: ["x+1", "5+x"],
        checkboxValues: ["getAnswerIgnoreOrder", null],
        isCorrectAnswer: [true, false]
      },
      ignoreTrailing: {
        expected: ["1000.000", "5000.000"],
        input: ["1000", "5000"],
        checkboxValues: ["getAnswerIgnoreTrailingZeros", null],
        isCorrectAnswer: [true, false]
      },
      ignoreCoefficientOfOne: {
        expected: ["1x+2", "1x+2"],
        input: ["x+2", "x+2"],
        checkboxValues: ["getAnswerIgnoreCoefficientOfOne", null],
        isCorrectAnswer: [false, false]
      },
      inverseResult: {
        expected: ["(x+2)2", "2(x+2)"],
        input: ["(x+2)2", "2(x+2)"],
        checkboxValues: ["getAnswerInverseResult", null],
        isCorrectAnswer: [false, true]
      },
      setDecimalSeparator: {
        expected: [["1.01", "1.01"], ["1,01", "1,01"]],
        input: "1.01",
        isCorrectAnswer: [true, true]
      }
    },
    equivValueTwoResponse: {
      value: {
        input: ["4+5=9", "4+5=9"],
        expected: ["4+5=9", "4+5=9"],
        isCorrectAnswer: [true]
      },
      inverseResult: {
        expected: ["4+6", "4+6"],
        input: ["4+6", "4+6"],
        checkboxValues: ["getAnswerInverseResult", null],
        isCorrectAnswer: [false, true]
      },
      ignoreText: {
        expected: ["25ms", "25asd"],
        input: ["25", "25"],
        checkboxValues: ["getAnswerIgnoreTextCheckox", null],
        isCorrectAnswer: [true, false]
      },
      significantDecimal: {
        expected: ["0.33", "0.33"],
        input: "1\\div3",
        decimalPlaces: 2
      },
      tolerance: {
        input: ["10", "10"],
        expected: ["8.5", "8.5"],
        tolerance: ["1.5", "1.5"],
        isCorrectAnswer: [true]
      }
    },
    isSimplifiedTwoResponse: {
      setThousandsSeparator: {
        expected: [["1,000,000", "1,000,000"]],
        isCorrectAnswer: [true]
      },
      inverseResult: {
        expected: ["8+2=10", "2+8=10"],
        checkboxValues: ["getAnswerInverseResult", null],
        isCorrectAnswer: [false, true]
      }
    },
    stringMatchTwoResponse: {
      literalStringComparison: {
        expected: ["abc", "abc"],
        input: ["abc", "abc"],
        isCorrectAnswer: [true]
      },
      leadingAndTrailing: {
        expected: [" a ", " a "],
        input: ["a", "a"],
        checkboxValues: ["getAnswerIgnoreLeadingAndTrailingSpaces"],
        isCorrectAnswer: [true]
      },
      multipleSpaces: {
        expected: ["a   b", "a   b"],
        input: ["a b", "a b"],
        checkboxValues: ["getAnswerTreatMultipleSpacesAsOne"],
        isCorrectAnswer: [true]
      }
    },
    isFactorisedTwoResponse: {
      inverseResult: {
        expected: ["(x−1)(x−2)", "(x−1)(x−2)"],
        isCorrectAnswer: [true]
      }
    },
    equivSymbolic: {
      value: {
        input: "80+20=100",
        expected: "40+60=100"
      },
      ignoreText: {
        expected: "25m",
        input: "25",
        checkboxValues: ["getAnswerIgnoreTextCheckox", null],
        isCirrectAnsver: [true, false]
      },
      compareSides: {
        expected: "2+8=10",
        input: "7+3=10"
      },
      eulersNumber: {
        input: "2.718",
        expected: "e"
      },
      significantDecimal: {
        expected: "0.33",
        input: "1\\div3",
        decimalPlaces: 2
      },
      setThousandsSeparator: {
        expected: ["1,000,000", "1.000.000"],
        input: "1000000"
      },
      combinationIgnoreTxt: {
        expected: "7.00001m",
        input: "7",
        decimalPlaces: 3
      },
      combinationSetDecimalSeparator: {
        expected: "1,000001",
        input: "1.000001",
        decimalSeparators: "Comma",
        thousandsSeparators: "Dot"
      },
      setDecimalSeparator: {
        expected: ["1.01", "1,01"],
        input: "1.01"
      }
    },
    equivLiteral: {
      value: {
        input: "1+2",
        expected: "1+2"
      },
      allowInterval: {
        expected: "(0,4]",
        input: "(0,4]",
        checkboxValues: ["getAnswerAllowInterval", null],
        isCorrectAnswer: [true, false]
      },
      ignoreOrder: {
        expected: "1+x",
        input: "x+1",
        checkboxValues: ["getAnswerIgnoreOrder", null],
        isCorrectAnswer: [true, false]
      },
      ignoreTrailing: {
        expected: "1000.000",
        input: "1000",
        checkboxValues: ["getAnswerIgnoreTrailingZeros", null],
        isCorrectAnswer: [true, false]
      },
      ignoreCoefficientOfOne: {
        expected: "1x+2",
        input: "x+2",
        checkboxValues: ["getAnswerIgnoreCoefficientOfOne", null],
        isCorrectAnswer: [true, false]
      },
      inverseResult: {
        expected: "(x+2)2",
        input: "(x+2)2",
        checkboxValues: ["getAnswerInverseResult", null],
        isCorrectAnswer: [false, true]
      }
    },
    equivValue: {
      value: {
        expected: "4+6",
        input: "4+6"
      },
      inverse: {
        expected: "44",
        input: "44"
      },
      ignoreText: {
        expected: "33sdf",
        input: "33"
      },
      significantDecimal: {
        expected: "0.33",
        input: "1/3",
        decimalPlaces: 2
      },
      compareSides: {
        expected: "4+5=9",
        input: "5+4=9"
      },
      tolerance: {
        input: "10",
        expected: "8.5",
        tolerance: "1.5"
      }
    },
    isSimplified: {
      simplifiedVersion: {
        expected: "4x+1",
        checkboxValues: ["getAnswerInverseResult", null],
        isCorrectAnswer: [false, true]
      }
    },
    isFactorised: {
      inverseResult: {
        expected: "(x-3)(x-4)"
      }
    },
    isExpanded: {
      expandedForm: {
        expected: ["x^", "{uparrow}", "2", "{downarrow}", "+3x"]
      }
    },
    isUnit: {
      expectedUnits: {
        expected: "7ft",
        input: "7ft",
        units: "ft"
      },
      allowedUnits: {
        expected: "12km",
        units: "km"
      },
      setThousandsSeparator: {
        thousands: ["Comma", "Dot"],
        separators: ["Dot", "Comma"],
        expected: ["1,000,000mi", "1.000.000mi"],
        input: "1000000mi",
        units: "mi"
      }
    },
    isTrue: {
      comparison: {
        expected: "6=6"
      },
      significantDecimal: {
        expected: "0.33",
        input: 2
      }
    },
    equivSyntax: {
      decimal: {
        expected: "2.165",
        input: "3"
      },
      simpleFraction: {
        expected: "2/4"
      },
      mixedFraction: {
        expected: ["1\\frac{enter}1", "{downarrow}", "2"]
      },
      exponent: {
        expected: ["2^", "{uparrow}", "2"]
      },
      standardFormLinear: {
        expected: "Ax+By=C"
      },
      standardFormQuadratic: {
        expected: ["5x^", "{uparrow}", "2", "{downarrow}", "+3x-4=0"]
      },
      slopeIntercept: {
        expected: "y=-x+1"
      },
      pointSlope: {
        expected: "(y-1)=2(x+3)"
      }
    },
    stringMatch: {
      literalStringComparison: {
        expected: "abc",
        input: "abc"
      },
      leadingAndTrailing: {
        expected: " a ",
        input: "a"
      },
      multipleSpaces: {
        expected: "a   b",
        input: "a b"
      }
    },
    combination: {
      significantDecimalPlaces: {
        input: "5",
        expected: ["5.001", "5.0001"],
        isCorrectAnswer: [false, true],
        decimalPlaces: 3
      },
      setDecimalSeparator: {
        expected: "1/1.000",
        input: "0,001",
        decimalSeparators: "Comma",
        thousandsSeparators: "Dot"
      },
      setThousandsSeparator: {
        thousands: ["Space", "Comma"],
        separators: ["Dot", "Dot"],
        expected: ["1/1 000", "1/1,000"],
        input: "0.001",
        isCorrectAnswer: [true, true]
      }
    }
  };
  const question = new MathEquationPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const { syntaxes, fields } = math;
  const editToolBar = new EditToolBar();
  const preview = new PreviewItemPage();
  const ruleArguments = question.argumentMethods;
  let previewItems;

  before(() => {
    cy.login();
  });

  context(" > User creates question", () => {
    context(" > Math Cloze type question with one Response box", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
      });

      context(" > TC_553 => Enter question text in Compose Question text box", () => {
        it(" > Write text in textbox", () => {
          question.checkIfTextExist(queData.testtext);
        });

        it(" > give external link", () => {
          question.checkIfTextExist(queData.testtext).type("{selectall}");
          editToolBar.clickOnMore();
          editToolBar.linkButton().click({ force: true });
          editToolBar.linkURL().type(queData.testtext, { force: true });
          //editToolBar.linkText().type(queData.testtext ,{force: true});
          editToolBar.insertLinkButton().click({ force: true });
          question
            .getComposeQuestionTextBox()
            .find("a")
            .should("have.attr", "href")
            .and("equal", `http://${queData.testtext}`)
            .then(href => {
              expect(href).to.equal(`http://${queData.testtext}`);
            });
        });

        it(" > insert formula", () => {
          question.checkIfTextExist(queData.testtext).clear();
        });
        it.skip(" > Upload image to server", () => {
          question
            .getComposeQuestionTextBox()
            .first()
            .focus();

          question
            .getUploadImageIcon()
            .first()
            .click();
          cy.uploadFile("testImages/sample.jpg", "input.ql-image[type=file]").then(() =>
            question
              .getEditorData()
              .find("img")
              .should("be.visible")
          );

          question
            .getComposeQuestionTextBox()
            .first()
            .clear();
        });
      });

      // context(" > TC_554 => Enter the text/inputs to Template Markup", () => {
      //   it(" > On click of template box a latex keyboard should appear", () => {
      //     question
      //       .getComposeQuestionTextBox()
      //       .last()
      //       .should("be.visible")
      //       .and("exist");

      //     question
      //       .getComposeQuestionTextBox()
      //       .last()
      //       .click()
      //       .then(() => {
      //         question.getToolbarTemplate().should("be.visible");
      //         question.findByselector(".ql-insertStar").click();
      //         question
      //           .getComposeQuestionTextBox()
      //           .last()
      //           .should("be.visible")
      //           .contains("Response");
      //       });
      //   });
      // });

      context(" > TC_555 => Set Correct Answer(s)", () => {
        it(" > Update Points", () => {
          question
            .getPointsInput()
            .click({ force: true })
            .focus()
            .clear()
            .type("{selectall}1")
            .should("have.value", "1")
            .type("{uparrow}")
            .should("have.value", "1.5")
            .type("{selectall}1")
            .should("have.value", "1")
            .blur();
        });
        // it(" > Add and remove new method", () => {
        //   question
        //     .getAddNewMethod()
        //     .click()
        //     .then(() => {
        //       question.getMathFormulaAnswers().should("have.length", 2);
        //     });
        //   question.deleteLastMethod().then(() => {
        //     question.getMathFormulaAnswers().should("have.length", 1);
        //   });
        // });
        it(" > Add and remove alternate answer", () => {
          question.addAlternateAnswer();
          question
            .getAddedAlternateAnswer()
            .then(element => {
              cy.wrap(element)
                .should("be.visible")
                .click();
            })
            .should("not.exist");
          //question.returnToCorrectTab();
        });
        it(" > Change answer methods", () => {
          Object.keys(methods).forEach(item => {
            question.setMethod(item);
            question.getMethodSelectionDropdow().contains("div", methods[item]);
          });
        });
      });
      // context(" > TC_562 => isUnit method", () => {
      //   beforeEach("Change to isUnit method", () => {
      //     preview.header.edit();
      //   });
      //   it(" > Testing with expression contains the expected units", () => {
      //     const { input, units } = queData.isUnit.expectedUnits;

      //     // question.setMethodAndResponse(methods.IS_UNIT);
      //     question.setMethodAndResponse('IS_UNIT');
      //     question.setValue(input, 0);
      //     question.setAllowedUnitsInput(units);
      //     question.checkMathClozeCorrectAnswer(units, preview, input.length, true);
      //   });

      //   it(" > Testing with allowed units", () => {
      //     const { units } = queData.isUnit.allowedUnits;

      //     question.setAllowedUnitsInput(units);
      //     question.checkMathClozeCorrectAnswer(units, preview, 0, true);
      //   });
      //   it(" > Testing with allow decimal marks", () => {
      //     const { expected, separators, thousands, input, units } = queData.isUnit.setThousandsSeparator;

      //     thousands.forEach((thousand, index) => {
      //       question.setValue(input, 0);
      //       question.setAllowedUnitsInput(units);
      //       question.allowDecimalMarksWithMathCloze(separators[index], thousand, 0, expected[index], preview, true);
      //     });
      //   });
      // });
    });

    context(" > TC_563 =>  isTrue method", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
      });
      beforeEach("Change to isTrue method", () => {
        preview.header.edit();
      });
      it(" > Testing that an expression has a comparison, or equality", () => {
        const { expected } = queData.isTrue.comparison;

        // question.setMethodAndResponse(methods.IS_TRUE);
        question.setMethod("CHECK_IF_TRUE");

        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      // it(" > Testing significant decimal places", () => {
      //   const { input, expected } = queData.isTrue.significantDecimal;

      //   question.setArgumentInputSignDec("getAnswerSignificantDecimalPlaces", input);
      //   // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
      //   question.checkCorrectAnswer(expected, preview, 0, true);
      // });

      // it(" > Testing with allow decimal marks", () => {
      //   const { expected } = queData.equivSymbolic.setThousandsSeparator;
      //   const { thousandsTestingSeparators, decimalSeparators } = queData;
      //   thousandsTestingSeparators.forEach((thousand, index) => {
      //     question.allowDecimalMarksWithMathCloze(
      //       decimalSeparators[index],
      //       thousand,
      //       0,
      //       expected[index],
      //       preview,
      //       true
      //     );
      //   });
      // });
    });
    context(" > TC_565 =>  equivSyntax method", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
      });
      beforeEach("Change to equivSyntax method", () => {
        preview.header.edit();
      });

      /*  it(" > Testing Rule : Decimal", () => {
            const { input, expected } = queData.equivSyntax.decimal;
  
            // question.setMethodAndResponse(methods.EQUIV_SYNTAX);
            question.setMethod('EQUIV_SYNTAX');
            question.setRule(syntaxes.DECIMAL);
            question.setArgumentInput("getAnswerRuleArgumentInput", input);
           // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
            question.checkCorrectAnswer(expected, preview, 0, true);
          }); */

      it(" > Testing Rule : Simple Fraction", () => {
        const { expected } = queData.equivSyntax.simpleFraction;
        question.setMethod("EQUIV_SYNTAX");

        question.setRule(syntaxes.SIMPLE_FRACTION);
        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      it(" > Testing Rule : mixed Fraction", () => {
        const { expected } = queData.equivSyntax.mixedFraction;

        question.setRule(syntaxes.MIXED_FRACTION);
        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      /* it(" > Testing Rule : Exponent", () => {
            const { expected } = queData.equivSyntax.exponent;
  
            question.setRule(syntaxes.EXPONENT);
            // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
            question.checkCorrectAnswer(expected, preview, 0, true);
          });
   */
      it(" > Testing Rule : Standard form, Argument: linear", () => {
        const { expected } = queData.equivSyntax.standardFormLinear;

        question.setRule(syntaxes.STANDARD_FORM);
        question.setAnswerArgumentDropdownValue(ruleArguments[0]);
        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      it(" > Testing Rule : Standard form, Argument: quadratic", () => {
        const { expected } = queData.equivSyntax.standardFormQuadratic;

        question.setRule(syntaxes.STANDARD_FORM);
        question.setAnswerArgumentDropdownValue(ruleArguments[1]);
        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      it(" > Testing Rule : Slope intercept form", () => {
        const { expected } = queData.equivSyntax.slopeIntercept;

        question.setRule(syntaxes.SLOPE_INTERCEPT_FORM);
        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      it(" > Testing Rule : point slope form", () => {
        const { expected } = queData.equivSyntax.pointSlope;

        question.setRule(syntaxes.POINT_SLOPE_FORM);
        //question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
      });
    });
    context(" > TC_560 => isFactorised method", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
      });
      beforeEach("Change to isFactorised method", () => {
        preview.header.edit();
      });
      it(" > Testing method", () => {
        const { expected } = queData.isFactorised.inverseResult;

        // question.setMethodAndResponse('IS_FACTORISED');
        question.setMethod("IS_FACTORISED");
        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.setIsFactorisedMethodField("realType");
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      it(" > Testing with field", () => {
        question.setMethod("IS_FACTORISED");
        question.mapIsFactorisedMethodFields(fields);
      });

      it(" > Testing inverse result", () => {
        const { expected } = queData.isFactorised.inverseResult;
        question.setIsFactorisedMethodField(fields.INTEGER);
        question.setSeparator("getAnswerInverseResult")();

        // question.checkMathClozeCorrectAnswer(expected, preview, 0, false);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      // it(" > Testing with allow decimal marks", () => {
      //   const { input, expected } = queData.equivSymbolic.setThousandsSeparator;
      //   const { thousandsTestingSeparators, decimalSeparators } = queData;

      //   question.unCheckAllCheckBox();
      //   thousandsTestingSeparators.forEach((thousand, index) => {
      //     question.allowDecimalMarksWithMathCloze(
      //       decimalSeparators[index],
      //       thousand,
      //       input.length,
      //       expected[index],
      //       preview,
      //       true
      //     );
      //   });
      // });
    });
    context(" > TC_564 =>  stringMatch method", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
      });
      beforeEach("Change to stringMatch method", () => {
        preview.header.edit();
      });
      it(" > Testing with literal string comparison", () => {
        const { input, expected } = queData.stringMatch.literalStringComparison;
        // question.setMethodAndResponse(methods.STRING_MATCH);
        question.setMethod("STRING_MATCH");
        question.setValueNew(input, 0);
        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.checkCorrectAnswer(expected, preview, input.length, true);
      });

      it(" > Testing ignores spaces before and after a value", () => {
        const { input, expected } = queData.stringMatch.leadingAndTrailing;
        question.setValue(input, 0);
        question.setSeparator("getAnswerIgnoreLeadingAndTrailingSpaces")();
        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      it(" > Testing multiple spaces will be ignored and treated as one", () => {
        const { input, expected } = queData.stringMatch.multipleSpaces;

        question.setValue(input, 0);
        question.setSeparator("getAnswerTreatMultipleSpacesAsOne")();
        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
    });
    context(" > TC_556 => equivSymbolic method", () => {
      before("", () => {
        // question.setMethod('EQUIV_VALUE');
        // question.allowNumeric().uncheck({force:true});
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
        question.setMethod("EQUIV_SYMBOLIC");
      });

      beforeEach("Back to create question", () => {
        preview.header.edit();
      });
      it(" > Testing Value", () => {
        const { input, expected } = queData.equivSymbolic.value;

        // question.setMethodAndResponse('EQUIV_SYMBOLIC');
        question.setValueNew(input);
        question.checkCorrectAnswer(expected, preview, input.length, true);
      });

      // it(" > Testing check/uncheck Ignore text check box", () => {
      //   const { input, expected, checkboxValues, isCirrectAnsver } = queData.equivSymbolic.ignoreText;
      //   checkboxValues.forEach((checkboxValue, index) => {
      //     question.setValue(input, 0);
      //     question.setSeparator(checkboxValue)();
      //     question.checkMathClozeCorrectAnswer(expected, preview, input.length, isCirrectAnsver[index]);
      //   });
      // });

      it(" > Testing with compare sides", () => {
        const { expected, input } = queData.equivSymbolic.compareSides;

        question.setValue(input, 0);
        question.setSeparator("getAnswerCompareSides")();
        question.checkCorrectAnswer(expected, preview, input.length, true);
      });

      // it(" > Testing Treat 'e' as Euler's numbe", () => {
      //   const { expected, input } = queData.equivSymbolic.eulersNumber;

      //   question.setValue(input, 0);
      //   question.setSeparator("getAnswerTreatEasEulersNumber")();
      //   question.checkMathClozeCorrectAnswer(expected, preview, input.length, true);
      // });

      // it(" > Testing significant decimal places", () => {
      //   const { input, expected, decimalPlaces } = queData.equivSymbolic.significantDecimal;

      //   question.setValue(input, 0);
      //   question.setArgumentInputSignDec("getAnswerSignificantDecimalPlaces", decimalPlaces);
      //   question.checkCorrectAnswer(expected, preview, 0, true);
      // });

      it(" > Testing with thousands separators - Space and Comma", () => {
        const { input, expected } = queData.equivSymbolic.setThousandsSeparator;
        const { thousandsTestingSeparators, decimalSeparators } = queData;

        question.unCheckAllCheckBox();
        thousandsTestingSeparators.forEach((thousand, index) => {
          question.setValue(input, 0);
          question.allowDecimalMarksWithMathCloze(
            decimalSeparators[index],
            thousand,
            input.length,
            expected[index],
            preview,
            true
          );
        });
      });

      // it(" > Combination of methods ignoreText and significantDecimalPlaces", () => {
      //   const { input, decimalPlaces, expected } = queData.equivSymbolic.combinationIgnoreTxt;

      //   question.setValue(input, 0);
      //   question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
      //   question.setSeparator("getAnswerIgnoreTextCheckox")();
      //   question.checkMathClozeCorrectAnswer(expected, preview, input.length, true);
      // });
    });
    context(" > TC_557 => equivLiteral method", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
        // question.setMethod('IS_EXPANDED');
        // question.setMethod('EQUIV_VALUE');
        // question.allowNumeric().uncheck({force:true});

        // question.setMethod('EQUIV_SYMBOLIC')
      });

      beforeEach("Change to equivLiteral method", () => {
        preview.header.edit();
      });
      it(" > Testing Value", () => {
        const { input, expected } = queData.equivLiteral.value;
        question.setMethod("IS_EXPANDED");
        question.setMethod("EQUIV_LITERAL");
        question.setValue(input, 0);
        question.checkCorrectAnswer(expected, preview, input.length, true);
      });

      // it(" > Testing check/uncheck Allow interval check box", () => {
      //   const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.allowInterval;

      //   checkboxValues.forEach((checkboxValue, index) => {
      //     question.setValue(input, 0);
      //     question.setSeparator(checkboxValue)();
      //     question.checkMathClozeCorrectAnswer(expected, preview, input.length, isCorrectAnswer[index], true);
      //   });
      // });

      it(" > Testing check/uncheck Ignore order check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreOrder;

        question.checkUncheckMathClozeChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it(" > Testing check/uncheck Ignore trailing zeros check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreTrailing;

        question.checkUncheckMathClozeChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it(" > Testing check/uncheck Ignore coefficient of 1 check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreCoefficientOfOne;

        question.checkUncheckMathClozeChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it(" > Testing check/uncheck Inverse result check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.inverseResult;

        question.checkUncheckMathClozeChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it(" > Testing Allow decimal marks", () => {
        const { expected, input } = queData.equivSymbolic.setDecimalSeparator;
        const { thousandsTestingSeparators, decimalSeparators } = queData;
        decimalSeparators.forEach((separator, index) => {
          question.setValue(input, 0);
          question.allowDecimalMarksWithMathCloze(
            separator,
            thousandsTestingSeparators[index],
            input.length,
            expected[index],
            preview,
            true
          );
        });
      });
    });
    context(" > TC_561 => isExpanded method", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
        question.setMethod("EQUIV_VALUE");
        question.allowNumeric().uncheck({ force: true });
      });
      beforeEach("Change to isExpanded method", () => {
        preview.header.edit();
      });
      it(" > Testing that a mathematical expression is in factorised form", () => {
        const { expected } = queData.isExpanded.expandedForm;

        // question.setMethodAndResponse(methods.IS_EXPANDED);
        question.setMethod("EQUIV_VALUE");
        question.allowNumeric().uncheck({ force: true });
        question.setMethod("IS_EXPANDED");
        // question.checkMathClozeCorrectAnswer(expected, preview, 0, true);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      it(" > Testing with allow decimal marks", () => {
        const { expected } = queData.equivSymbolic.setThousandsSeparator;
        const { thousandsTestingSeparators, decimalSeparators } = queData;
        question.unCheckAllCheckBox();
        thousandsTestingSeparators.forEach((thousand, index) => {
          question.allowDecimalMarksWithMathCloze(
            decimalSeparators[index],
            thousand,
            0,
            expected[index],
            preview,
            true
          );
        });
      });
    });
    context(" > TC_559 => isSimplified method", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
        question.setMethod("EQUIV_VALUE");
        question.allowNumeric().uncheck({ force: true });
      });
      beforeEach("Change to isSimplified method", () => {
        preview.header.edit();
      });

      it(" > Testing with allow decimal marks", () => {
        const { expected } = queData.equivSymbolic.setThousandsSeparator;
        const { thousandsTestingSeparators, decimalSeparators } = queData;
        question.unCheckAllCheckBox();
        question.setMethod("EQUIV_VALUE");
        question.allowNumeric().uncheck({ force: true });
        question.setMethod("IS_SIMPLIFIED");
        thousandsTestingSeparators.forEach((thousand, index) => {
          question.allowDecimalMarksWithMathCloze(
            decimalSeparators[index],
            thousand,
            0,
            expected[index],
            preview,
            true
          );
        });
      });
      it(" > Testing inverse result", () => {
        const { expected, isCorrectAnswer, checkboxValues } = queData.isSimplified.simplifiedVersion;

        //question.setMethodAndResponse('IS_SIMPLIFIED');
        //question.setMethod('EQUIV_VALUE');
        // cy.get('[data-cy="answer-allow-numeric-only"]').uncheck({force:true});
        question.setMethod("IS_SIMPLIFIED");
        checkboxValues.forEach((checkboxValue, index) => {
          question.setSeparator(checkboxValue)();
          // question.checkMathClozeCorrectAnswer(expected, preview, 0, isCorrectAnswer[index]);
          question.checkCorrectAnswer(expected, preview, 0, isCorrectAnswer[index]);
        });
      });
    });
    context(" > TC_558 => equivValue method", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
        question.setMethod("EQUIV_VALUE");
        question.allowNumeric().uncheck({ force: true });
      });
      beforeEach("Change to equivLiteral method", () => {
        preview.header.edit();
      });
      it(" > Testing significant decimal places", () => {
        const { input, expected, decimalPlaces } = queData.equivValue.significantDecimal;
        question.setMethod("IS_EXPANDED");
        question.setMethod("EQUIV_VALUE");
        question.setValue(input, 0);
        question.setArgumentInputSignDec("getAnswerSignificantDecimalPlaces", decimalPlaces);
        question.checkCorrectAnswer(expected, preview, input.length, true);
      });
      it(" > Testing Value", () => {
        const { expected, input } = queData.equivValue.value;
        question.setMethod("IS_EXPANDED");
        question.setMethod("EQUIV_VALUE");
        question.setValue(input, 0);
        question.checkCorrectAnswer(expected, preview, input.length, true);
      });

      it(" > Testing Inverse result", () => {
        const { expected, input } = queData.equivValue.inverse;

        question.setValue(input, 0);
        question.setSeparator("getAnswerInverseResult")();
        question.checkCorrectAnswer(expected, preview, input.length, false);
      });

      // it(" > Testing with ignore text", () => {
      //   const { expected, input } = queData.equivValue.ignoreText;
      //   question.setValue(input, 0);
      //   question.setSeparator("getAnswerIgnoreTextCheckox")();

      //   question.checkCorrectAnswer(expected, preview, input.length, true);
      // });

      it(" > Testing with compare sides", () => {
        const { expected, input } = queData.equivValue.compareSides;

        question.setValue(input, 0);
        question.setSeparator("getAnswerCompareSides")();

        question.checkCorrectAnswer(expected, preview, input.length, true);
      });

      // it(" > Testing Allow decimal marks", () => {
      //   const { expected, input } = queData.equivSymbolic.setDecimalSeparator;
      //   const { thousandsTestingSeparators, decimalSeparators } = queData;
      //   decimalSeparators.forEach((separator, index) => {
      //     question.setValue(input, 0);
      //     question.allowDecimalMarks(
      //       separator,
      //       thousandsTestingSeparators[index],
      //       input.length,
      //       expected[index],
      //       preview,
      //       true
      //     );
      //   });
      // });

      it(" > Testing with tolerance that will be deemed as correct", () => {
        const { expected, input, tolerance } = queData.equivValue.tolerance;
        question.unCheckAllCheckBox();

        question.setValue(input, 0);

        question.setAnswerTolerance(tolerance, 0);

        question.checkCorrectAnswer(expected, preview, input.length, true);
        question.getAnswerTolerance().clear({ force: true });
      });
    });
    context("TC_556 => equivSymbolic method-1", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
        question.setMethod("IS_EXPANDED");
        question.setMethod("EQUIV_VALUE");
        question.allowNumeric().uncheck({ force: true });

        question.setMethod("EQUIV_SYMBOLIC");
      });
      it(" > Combination of methods setDecimalSeparator", () => {
        const {
          expected,
          input,
          decimalSeparators,
          thousandsSeparators
        } = queData.equivSymbolic.combinationSetDecimalSeparator;

        question.setValue(input, 0);
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setDecimalSeperator(decimalSeparators);
        question.getAnswerSetDecimalSeparatorDropdownListTab().contains("div", decimalSeparators);
        question.setThousandsSeparatorDropdown(thousandsSeparators);
        question.checkCorrectAnswer(expected, preview, input.length, true);
      });
    });
    context("> TC_572 => Combination of methods", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        question.getAddOptions();
      });

      it(" > Combination of methods setThousandsSeparator - Space and Comma", () => {
        const { input, expected, isCorrectAnswer, thousands, separators } = queData.combination.setThousandsSeparator;
        // question.setMethodAndResponse(methods.EQUIV_SYMBOLIC);
        //question.setMethod('IS_FACTORISED');
        question.setMethod("EQUIV_SYMBOLIC");
        separators.forEach((separator, index) => {
          question.setValueNew(input);
          question.allowDecimalMarks(
            separator,
            thousands[index],
            input.length,
            expected[index],
            preview,
            isCorrectAnswer[index]
          );
        });
      });

      it(" > Combination of methods setDecimalSeparator", () => {
        const { expected, input, decimalSeparators, thousandsSeparators } = queData.combination.setDecimalSeparator;
        //question.setMethod('IS_FACTORISED');

        question.setMethod("EQUIV_SYMBOLIC");
        question.setValueNew(input, 0);
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setDecimalSeperator(decimalSeparators);
        question.getAnswerSetDecimalSeparatorDropdownListTab().contains("div", decimalSeparators);
        question.setThousandsSeparatorDropdown(thousandsSeparators);

        //question.checkMathClozeCorrectAnswer(expected, preview, input.length, true);
        question.checkCorrectAnswer(expected, preview, input.length, true);
      });
      // it(" > Combination of methods significantDecimalPlaces", () => {
      //   const { expected, input, isCorrectAnswer, decimalPlaces } = queData.combination.significantDecimalPlaces;

      //   question.unCheckAllCheckBox();
      //   expected.forEach((exp, index) => {
      //     question.setValue(input, 0);
      //     question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
      //     // question.checkMathClozeCorrectAnswer(exp, preview, input.length, isCorrectAnswer[index]);
      //     question.checkCorrectAnswer(exp, preview, input.length, isCorrectAnswer[index]);
      //   });
      // });
    });

    // TODO Math Cloze type question with TWO Response boxes
    context.skip(" > Math Cloze type question with two Response boxes", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();

        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
      });

      context(" > TC_567 => equivSymbolic method", () => {
        beforeEach("Back to create question", () => {
          preview.header.edit();
        });
        it(" > Testing Value", () => {
          const { input, expected } = queData.equivSymbolicTwoResponse.value;
          const { responseBoxText } = queData;

          question.setResponseBox(responseBoxText);

          question.getAddNewMethod().click();
          question.setMethod(methods.EQUIV_SYMBOLIC);
          question.setValue(input[0], 0);

          question.setNewMethodAnd();

          question.setMethod(methods.EQUIV_SYMBOLIC, 1);
          question.setValue(input[1], 1);

          question.checkMathClozeCorrectAnswer(expected, preview, 0, true, true);
        });

        it(" > Testing check/uncheck Ignore text check box", () => {
          const { ignoreText } = queData.equivSymbolicTwoResponse;
          const { responseBoxQuantity } = queData;

          question.setAndCheckMathClozeCorrectAnswer(ignoreText, preview, responseBoxQuantity);
        });
        it(" > Testing with compare sides", () => {
          const { compareSides } = queData.equivSymbolicTwoResponse;
          const { responseBoxQuantity } = queData;

          question.setAndCheckMathClozeCorrectAnswer(compareSides, preview, responseBoxQuantity);
        });

        it(" > Testing Treat 'e' as Euler's numbe", () => {
          const { eulersNumber } = queData.equivSymbolicTwoResponse;
          const { responseBoxQuantity } = queData;

          question.setAndCheckMathClozeCorrectAnswer(eulersNumber, preview, responseBoxQuantity);
        });

        it(" > Testing significant decimal places", () => {
          const { input, expected, decimalPlaces } = queData.equivSymbolicTwoResponse.significantDecimal;

          question
            .getLastCollapseItem()
            .last()
            .click();

          question.setValue(input, 0);
          question.setValue(input, 1);
          question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces, 0);
          question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces, 1);
          question.checkMathClozeCorrectAnswer(expected, preview, 0, true, true);
        });

        it(" > Allow decimal marks", () => {
          const { setThousandsSeparator } = queData.equivSymbolicTwoResponse;
          const { thousandsTestingSeparators, decimalSeparators, responseBoxQuantity } = queData;

          question.setAndCheckAllowDecimalMarks(
            setThousandsSeparator,
            preview,
            thousandsTestingSeparators,
            decimalSeparators,
            responseBoxQuantity
          );
        });
      });

      context(" > TC_568 => equivLiteral method", () => {
        beforeEach("Change to equivLiteral method", () => {
          preview.header.edit();
        });
        it(" > Testing Value", () => {
          const { input, expected } = queData.equivLiteralTwoResponse.value;
          const { responseBoxText, responseBoxQuantity } = queData;

          question.setResponseBox(responseBoxText);
          question.getAddNewMethod().click();

          question.setNewMethodAnd();

          for (let i = 0; i < responseBoxQuantity; i++) {
            question.setMethod(methods.EQUIV_LITERAL, i);
            question.setValue(input[i], i);
          }
          question.checkMathClozeCorrectAnswer(expected, preview, 0, true, true);
        });

        it(" > Testing check/uncheck Allow interval check box", () => {
          const { allowInterval } = queData.equivLiteralTwoResponse;
          const { responseBoxQuantity } = queData;

          question.setAndCheckMathClozeCorrectAnswer(allowInterval, preview, responseBoxQuantity);
        });

        it(" > Testing check/uncheck Ignore order check box", () => {
          const { ignoreOrder } = queData.equivLiteralTwoResponse;
          const { responseBoxQuantity } = queData;

          question.setAndCheckMathClozeCorrectAnswer(ignoreOrder, preview, responseBoxQuantity);
        });

        it(" > Testing check/uncheck Ignore trailing zeros check box", () => {
          const { ignoreTrailing } = queData.equivLiteralTwoResponse;
          const { responseBoxQuantity } = queData;

          question.setAndCheckMathClozeCorrectAnswer(ignoreTrailing, preview, responseBoxQuantity);
        });

        it(" > Testing check/uncheck Ignore coefficient of 1 check box", () => {
          const { ignoreCoefficientOfOne } = queData.equivLiteralTwoResponse;
          const { responseBoxQuantity } = queData;

          question.setAndCheckMathClozeCorrectAnswer(ignoreCoefficientOfOne, preview, responseBoxQuantity);
        });

        it(" > Testing check/uncheck Inverse result check box", () => {
          const { inverseResult } = queData.equivLiteralTwoResponse;
          const { responseBoxQuantity } = queData;

          question.setAndCheckMathClozeCorrectAnswer(inverseResult, preview, responseBoxQuantity);
        });

        it(" > Allow decimal marks", () => {
          const { setDecimalSeparator } = queData.equivLiteralTwoResponse;
          const { thousandsTestingSeparators, decimalSeparators, responseBoxQuantity } = queData;

          question.setAndCheckAllowDecimalMarks(
            setDecimalSeparator,
            preview,
            thousandsTestingSeparators,
            decimalSeparators,
            responseBoxQuantity
          );
        });
      });

      context(" > TC_569 => equivValue method", () => {
        beforeEach("Change to equivValue method", () => {
          preview.header.edit();
        });

        it(" > Testing Value", () => {
          const { input, expected } = queData.equivValueTwoResponse.value;
          const { responseBoxText, responseBoxQuantity } = queData;

          question.setResponseBox(responseBoxText);
          question.getAddNewMethod().click();

          question.setNewMethodAnd();

          for (let i = 0; i < responseBoxQuantity; i++) {
            question.setMethod(methods.EQUIV_VALUE, i);
            question.setValue(input[i], i);
          }
          question.checkMathClozeCorrectAnswer(expected, preview, 0, true, true);
        });

        it(" > Testing Inverse result", () => {
          const { inverseResult } = queData.equivValueTwoResponse;
          const { responseBoxQuantity } = queData;
          question.setAndCheckMathClozeCorrectAnswer(inverseResult, preview, responseBoxQuantity);
        });

        it(" > Testing Ignore text", () => {
          const { ignoreText } = queData.equivValueTwoResponse;
          const { responseBoxQuantity } = queData;
          question.setAndCheckMathClozeCorrectAnswer(ignoreText, preview, responseBoxQuantity);
        });

        it(" > Testing significant decimal places", () => {
          const { input, expected, decimalPlaces } = queData.equivSymbolicTwoResponse.significantDecimal;

          question
            .getLastCollapseItem()
            .last()
            .click();

          question.setValue(input, 0);
          question.setValue(input, 1);
          question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces, 0);
          question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces, 1);
          question.checkMathClozeCorrectAnswer(expected, preview, 0, true, true);
        });

        it(" > Testing with compare sides", () => {
          const { compareSides } = queData.equivSymbolicTwoResponse; //
          const { responseBoxQuantity } = queData;
          question.setAndCheckMathClozeCorrectAnswer(compareSides, preview, responseBoxQuantity);
        });

        it(" > Testing with tolerance that will be deemed as correct", () => {
          const { expected, input, tolerance, isCorrectAnswer } = queData.equivValueTwoResponse.tolerance;
          const { responseBoxQuantity } = queData;

          isCorrectAnswer.forEach((isCorrect, index) => {
            question
              .getLastCollapseItem()
              .last()
              .click();
            for (let i = 0; i < responseBoxQuantity; i++) {
              question.setValue(input[i], i);
              question.setAnswerTolerance(tolerance[i], i);
            }
            question.checkMathClozeCorrectAnswer(expected, preview, input.length, isCorrect, true);
            question.getAnswerTolerance().clear({ force: true });
          });
          question.setAnswerTolerance("0", 1);
        });

        it(" > Allow decimal marks", () => {
          const { setDecimalSeparator } = queData.equivLiteralTwoResponse;
          const { thousandsTestingSeparators, decimalSeparators, responseBoxQuantity } = queData;

          question.setAndCheckAllowDecimalMarks(
            setDecimalSeparator,
            preview,
            thousandsTestingSeparators,
            decimalSeparators,
            responseBoxQuantity
          );
        });
      });

      context(" > TC_570 => isSimplified method", () => {
        beforeEach("Change to isSimplified method", () => {
          preview.header.edit();
        });

        it(" > Testing inverse result", () => {
          const { inverseResult } = queData.isSimplifiedTwoResponse;
          const { responseBoxQuantity, responseBoxText } = queData;

          question.setResponseBox(responseBoxText);
          question.getAddNewMethod().click();
          question.setNewMethodAnd();

          for (let i = 0; i < responseBoxQuantity; i++) {
            question.setMethod(methods.IS_SIMPLIFIED, i);
          }
          question.setAndCheckMathClozeCorrectAnswer(inverseResult, preview, responseBoxQuantity);
        });

        it(" > Testing with allow decimal marks", () => {
          const { setThousandsSeparator } = queData.isSimplifiedTwoResponse;
          const { thousandsTestingSeparators, decimalSeparators, responseBoxQuantity } = queData;

          question.setAndCheckAllowDecimalMarks(
            setThousandsSeparator,
            preview,
            thousandsTestingSeparators,
            decimalSeparators,
            responseBoxQuantity
          );
        });
      });

      context(" > TC_571 => isFactorised method", () => {
        beforeEach("Change to isFactorised method", () => {
          preview.header.edit();
        });
        it(" > Testing method", () => {
          const { inverseResult } = queData.isFactorisedTwoResponse;
          const { responseBoxQuantity, responseBoxText } = queData;

          question.setResponseBox(responseBoxText);
          question.getAddNewMethod().click();
          question.setNewMethodAnd();

          for (let i = 0; i < responseBoxQuantity; i++) {
            question.setMethod(methods.IS_FACTORISED, i);
          }
          question.setAndCheckMathClozeCorrectAnswer(inverseResult, preview, responseBoxQuantity);
        });
        it(" > Testing with field", () => {
          question.mapIsFactorisedMethodFields(fields, 0);
          question.mapIsFactorisedMethodFields(fields, 1);
        });

        it(" > Testing inverse result", () => {
          const { inverseResult } = queData.isSimplifiedTwoResponse;
          const { responseBoxQuantity, responseBoxText } = queData;

          question.setResponseBox(responseBoxText);
          question.getAddNewMethod().click();
          question.setNewMethodAnd();

          for (let i = 0; i < responseBoxQuantity; i++) {
            question.setMethod(methods.IS_SIMPLIFIED, i);
          }
          question.setAndCheckMathClozeCorrectAnswer(inverseResult, preview, responseBoxQuantity);
        });
        it(" > Testing with allow decimal marks", () => {
          const { setThousandsSeparator } = queData.isSimplifiedTwoResponse;
          const { thousandsTestingSeparators, decimalSeparators, responseBoxQuantity } = queData;

          question.setAndCheckAllowDecimalMarks(
            setThousandsSeparator,
            preview,
            thousandsTestingSeparators,
            decimalSeparators,
            responseBoxQuantity
          );
        });
      });

      context(" > TC_564 =>  stringMatch method", () => {
        beforeEach("Change to stringMatch method", () => {
          preview.header.edit();
        });
        it(" > Testing with literal string comparison", () => {
          const { literalStringComparison } = queData.stringMatchTwoResponse;
          const { responseBoxQuantity, responseBoxText } = queData;

          question.setResponseBox(responseBoxText);
          question.getAddNewMethod().click();
          question.setNewMethodAnd();

          for (let i = 0; i < responseBoxQuantity; i++) {
            question.setMethod(methods.STRING_MATCH, i);
          }
          question.setAndCheckMathClozeCorrectAnswer(literalStringComparison, preview, responseBoxQuantity);
        });

        it(" > Testing ignores spaces before and after a value", () => {
          const { leadingAndTrailing } = queData.stringMatchTwoResponse;
          const { responseBoxQuantity } = queData;

          question.setAndCheckMathClozeCorrectAnswer(leadingAndTrailing, preview, responseBoxQuantity);
        });
        it(" > Testing multiple spaces will be ignored and treated as one", () => {
          const { multipleSpaces } = queData.stringMatchTwoResponse;
          const { responseBoxQuantity } = queData;

          question.setAndCheckMathClozeCorrectAnswer(multipleSpaces, preview, responseBoxQuantity);
        });
      });

      context(" > TC_568 => Save question", () => {
        it(" > Click on save button", () => {
          question.header.save();
          cy.url().should("contain", "item-detail");
        });
      });

      context(" > TC_569 => Preview Items", () => {
        it(" > Click on preview", () => {
          const { expected } = queData.stringMatchTwoResponse.multipleSpaces;

          previewItems = editItem.header.preview();
          question.getBody().contains("span", "Check Answer");

          question.typeInResponseBox().then(inputElements => {
            expected.forEach((expectedValue, index) => {
              cy.wrap(inputElements[index]).typeWithDelay(expectedValue);
            });
          });
        });

        it(" > Click on Check answer", () => {
          previewItems
            .getCheckAnswer()
            .click()
            .then(() => {
              question
                .getBody()
                .children()
                .should("contain", "score: 1/1");
              question.checkAnswerHighlightColor(true);
            });
        });

        it(" > Click on Show Answers", () => {
          previewItems
            .getShowAnswer()
            .click()
            .then(() => {
              question.getCorrectAnswerBox().should("be.visible");
            });
        });

        it(" > Click on Clear", () => {
          previewItems.getClear().click();
          question.getEditableField().should("have.value", "");
        });
      });

      context(" > TC_570 => delete the question after creation", () => {
        it(" > Click on delete button", () => {
          preview.header.edit();
          editItem.getDelButton().click();
          question.getQuestionContainer().should("not.exist");
        });
      });
    });
  });
});
