/* eslint-disable */

define([
  "jquery",
  "jqueryui",
  "underscore",
  "backbone",
  "questions/js/models/SentenceResponseQuestionModel",
  "questions/js/models/DragAndDropUserResponseModel",
  "questions/js/models/DragAndDropCorrectAnswersModel",
  "questions/js/views/question/BaseQuestionView",
  "questions/js/views/question/DragAndDropAnswerChoiceView",
  "text!questions/js/templates/question/sentenceResponseQuestionTemplate.html",
  "text!questions/js/templates/question/sentenceResponseQuestionPreviewTemplate.html",
  "ace/range",
  "ace/range_list",
  "backboneLocalStorage"
], function(
  $,
  jqueryui,
  _,
  Backbone,
  SentenceResponseQuestionModel,
  DragAndDropUserResponseModel,
  DragAndDropCorrectAnswersModel,
  BaseQuestionView,
  DragAndDropAnswerChoiceView,
  sentenceResponseQuestionTemplate,
  sentenceResponseQuestionPreviewTemplate
) {
  "use strict";
  var sentenceResponseQuestionView = BaseQuestionView.extend({
    /**
     * Render the question considering the aspects like question type, mode of operation.
     */
    initialize: function(opts) {
      this.options = opts;
      var isPassage = false;
      (this.isPreview = false), this.parametersView, this.CurrentSelection;
      if (!opts.mode || (opts.mode !== "preview" && opts.mode !== "review")) {
        var elId = this.$el.attr("id");

        this.$el = $("#question-content-section");
        this.delegateEvents();
        this.$el = $("#" + elId);
        var question = {},
          commonParameters = {};
        var isEditQuestion = opts.question ? true : false;
        if (isEditQuestion) {
          question = opts.question;
          if (question.commonparameters) {
            commonParameters = question.commonparameters;
          }
        } else {
          question = {
            title: "",
            answerChoices: [{ id: "true", answer: "True" }, { id: "false", answer: "False" }]
          };
        }
        var questionData = {
          _requireContextPath: _requireContextPath,
          question: question,
          isEditQuestion: isEditQuestion,
          questionSetType: opts.questionSetType,
          canAddNewQuestion: "false"
        };

        this.renderTemplateOnAuthorMode(opts, questionData, question, sentenceResponseQuestionTemplate);
        //Show Redactor for Question content
        this.showRedactorEditor();
        //Show Redactor for Sentence response section
        this.showRedactorEditorForSentenceResponseView();

        //In Edit mode
        if (isEditQuestion) {
          // In edit question view hide the user selected answer choices
          this.showOrHideHighlightTextForSentenceSelectionQuestionContent("HIDE");
          // In edit question view Update the answer choice inputs values
          this.updateAnswerChoiceInputsValueBeforeEdit();
        }
        if (opts.questionSetType != "PASSAGE") {
          this.parametersView = this.showParametersView(commonParameters);
        }
        /**Hide the Redactor Editor after open it for Create Mode**/
        setTimeout(
          $.proxy(function() {
            this.$(".redactor_editor").trigger("blur");
            this.showMessage("", "info");

            // TO fix - notification section UI - changing width values so that accomidate the text in all scenarios
            this.$el.find(".as-editor-question-type").css({ width: "235px" });
            this.$el.find("#footer-notification-text").css({ width: "523px", "text-align": "center" });
            // In Edit/update question mode, toggle tab to highlight tab view
            if ($.trim(question.sentenceSelectionRawContent) != "") {
              this.toggleTabs();
            }
          }, this),
          1000
        );
      }

      // Get Selection object from window or document
      //Make sure the object is created if it's already not
      if (!window.CurrentSelection) {
        this.CurrentSelection = {};
      }
      //define the selector object
      this.CurrentSelection.Selector = {};

      //get the current selection
      this.CurrentSelection.Selector.getSelected = function() {
        var sel = "";
        if (window.getSelection) {
          sel = window.getSelection();
        } else if (document.getSelection) {
          sel = document.getSelection();
        } else if (document.selection) {
          sel = document.selection.createRange();
        }
        return sel;
      };

      SnapwizEvents.on("sentenceResponse.yesNavigateToEditTabView", this.yesNavigateToEditTabView, this);
      SnapwizEvents.on(
        "sentenceResponse.cancelAndGoBackToHighlightTabView",
        this.cancelAndGoBackToHighlightTabView,
        this
      );
      SnapwizEvents.on(
        "sentenceResponse.clearAllSentenceResponseAnswerChoices",
        this.clearAllSentenceResponseAnswerChoices,
        this
      );
      SnapwizEvents.on("sentenceResponse.cancelClearAllAnswerChoices", this.cancelClearAllAnswerChoices, this);
    },

    events: {
      // To Switch tabs
      "click .tab-sentence-selection-btn": "toggleTabs",
      "mouseup .dnd-question-content-section #sentence-selection-heighlight-text-wrapper": "selectSentenceResponseText",
      "mouseleave #sentence-selection-heighlight-text-wrapper": "unSelectSentenceResponseText",
      "mouseover .dnd-question-content-section #sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext":
        "sentenceSelectionHighlightMouseOver",
      "mouseout .dnd-question-content-section #sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext":
        "sentenceSelectionHighlightMouseOut",
      "mouseenter .dnd-question-content-section #sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext":
        "sentenceSelectionHighlightMouseEnter",
      "mouseleave .dnd-question-content-section #sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext":
        "sentenceSelectionHighlightMouseLeave",

      //For Add/Remove answer choice, Add/Correct correct answer choice
      "click #remove-selected-answer-option": "removeSelectedOption",
      "click #mark-correct-answer-option": "markCorrectAnswerOption",
      "click #remove-correct-answer-option": "removeCorrectAnswerOption",
      "click #sentence-response-clear-answer-choices": "clearAllAnswerChoices",
      "click #clear-all-answer-choice label": "toggleShowAllHighlights",
      "click #allow-multiple-correct-ans-checkbox": "multipleCorrectAnswerCheckbox",

      //Events for Preview view
      "mouseover #dnd-question-preview .sentence-response-selectiontext": "showAnswerChoicesOnHover",
      "mouseout #dnd-question-preview .sentence-response-selectiontext": "hideAnswerChoicesOnMouseOut",
      "click #dnd-question-preview .sentence-response-selectiontext": "selectUserResponseAndValidate",

      //Writeboard click events
      "click #show-your-work-label": "renderWhiteBoard",
      "click #white-board-feedBack-link-text": "renderWriteBoardFeedback"
    },
    /**
     * Save the question model
     */
    save: function(isLocal, sentenceResponseQuestionModel) {
      var data;
      if (!isLocal) {
        var q = sentenceResponseQuestionModel.get("question");
        if (this.parametersView && !q.passageQuestionModel) {
          var commonparameters = this.parametersView.get();
          if (commonparameters && !commonparameters.error) {
            q.commonparameters = commonparameters;
            data = JSON.stringify(q);
            $("#jsonData").val(data);
          } else if (commonparameters.error) {
            this.showMessage(commonparameters.error, "error");
            return false;
          }
        } else {
          data = JSON.stringify(q);
          $("#jsonData").val(data);
        }
      } else {
        sentenceResponseQuestionModel.setLocalMode();
        sentenceResponseQuestionModel.save();
      }
    },

    /**
     * Get the question attributes from the user via html form and canvas here converts in to the json object and
     * send it to the DragAndDropQuestionModel.
     * We can set the object wheher it is local or server mode via global variable
     */
    saveQuestion: function() {
      var sentenceResponseQuestionModel = new SentenceResponseQuestionModel();
      var questionId = $("#questionId").val() ? $("#questionId").val() : $.fn.Snapwiz.guid();
      var isLocal = this.isDataStoreLocal();
      var questionTitle = this.cleanMathJaxMarkup(this.$(".question-sr-raw-content").html(), ".swformula");
      if (questionTitle.indexOf("Enter Question Text") >= 0) {
        this.showMessage("Question title should not be empty", "warning");
        return false;
      }
      if ($.trim(this.$el.find("input#points-input-tag").val()) == "") {
        this.showMessage("Please enter points", "warning");
        return false;
      }
      var answerChoicesAndCorrectAnswer = this.getAnswerChoicesAndCorrectAnswer();
      if (answerChoicesAndCorrectAnswer == false) {
        return false;
      }
      var sentenceSelectionRawContent = this.$el.find("#sentenceSelectionText").val();
      //Fix to make sure that the hover options (remove answer choice, mark as correct answer) don't save in the questionText - http://bugtracker.snapwiz.net/view.php?id=17560
      var $div = $("<div/>").html(sentenceSelectionRawContent);
      $div.find(".sentence-selection-anser-choice-optns").remove();
      $div.find(".sentence-selection-anser-choice-arrow").remove();
      sentenceSelectionRawContent = $div.html();

      var allowMultiSentenceSelects = this.$el
        .find("#allow-multiple-correct-ans-checkbox")
        .hasClass("allow-multiple-correct-ans-checkbox-checked");

      var answerChoices = answerChoicesAndCorrectAnswer[0]["answerChoices"];
      var correctAnswer = answerChoicesAndCorrectAnswer[0]["correctAnswer"];
      var correctAnswerCount = answerChoicesAndCorrectAnswer[0]["correctAnswerCount"];

      sentenceResponseQuestionModel.setQuestionAttribute("id", questionId);
      sentenceResponseQuestionModel.setQuestionAttribute("question", {
        id: questionId,
        title: questionTitle,
        answerChoices: answerChoices,
        qtype: 158,
        sentenceSelectionRawContent: sentenceSelectionRawContent,
        allowMultiSentenceSelects: allowMultiSentenceSelects
      });
      sentenceResponseQuestionModel = this.saveQuestionOnAuthorMode(sentenceResponseQuestionModel);
      var correctAnswers = correctAnswer;
      var correctAnswersSize = _.size(correctAnswers);
      if (correctAnswersSize == 0) {
        this.showMessage("Select at least an answer choice", "warning");
        return false;
      } else if (correctAnswerCount == 0) {
        this.showMessage("Select correct answer choice", "warning");
        return false;
      } else {
        // save question object
        this.save(isLocal, sentenceResponseQuestionModel);
        this.saveCorrectAnswer(isLocal, questionId, correctAnswers);
      }
      this.$("#question-raw-content").html(this.$(".question-ms-raw-content").html());
      return true;
    },
    /**
     * Save the user Response model according to the mode of operation Server/Local
     * The questionId will be the correctanswerID also
     * So while quesrying the correct answer you should get using the questionId
     */
    saveCorrectAnswer: function(isLocal, questionId, correctAnswers) {
      if (!isLocal) {
        var data = JSON.stringify(correctAnswers);
        $("#correctAnswerJson").val(data);
      } else {
        var dndCorrectAnswer = new DragAndDropCorrectAnswersModel();
        dndCorrectAnswer.setLocalMode();
        dndCorrectAnswer.set({
          id: questionId
        });
        dndCorrectAnswer.set({
          questionId: questionId
        });
        dndCorrectAnswer.set({
          answers: correctAnswers
        });
        dndCorrectAnswer.save();
      }
    },

    /**
     * Color changes drop zone according to the result
     */
    colorChangeForResult: function(results, userResponse, mode) {
      // To check whether the answer choice is selected or not.
      var sequence;
      if (results && results.evaluation) {
        _.map(
          userResponse,
          $.proxy(function(response, reponseId) {
            _.map(
              results.evaluation,
              $.proxy(function(result, answerChoiceId) {
                if (response === true && reponseId == answerChoiceId) {
                  if (result === true) {
                    //Evaluation result is true.
                    sequence = answerChoiceId.replace("ch", "");
                    this.$el
                      .find(".sentence-response-selectiontext[sequence=" + sequence + "]")
                      .css("background", "#73b966")
                      .removeClass("selectedSentance")
                      .addClass("user-correct-answer");
                  }
                  //Evaluation result is false.
                  else {
                    sequence = answerChoiceId.replace("ch", "");
                    this.$el
                      .find(".sentence-response-selectiontext[sequence=" + sequence + "]")
                      .css("background", "#FF6666")
                      .removeClass("selectedSentance")
                      .addClass("user-wrong-answer");
                  }
                }
              }, this)
            );
          }, this)
        );
      }
    },

    setUserResponseOnReview: function(params) {
      var questionId = params.questionId;
      var userResponseStore = new Backbone.LocalStorage("UserResponses");
      var userResponse = userResponseStore.find({ id: questionId });
      if (!params.isLocal) {
        userResponse = {};
        if (params.userResponse) {
          userResponse["answers"] = params.userResponse;
        }
      }
      if (userResponse && userResponse.answers) {
        _.map(
          userResponse.answers,
          $.proxy(function(userChoice, key) {
            var answerChoiceKey = key + "";
            var sequence = answerChoiceKey.replace("ch", "");
            //params.viewType will be undefind when the user is student and mode is preview that is when the student checks next and previous questions.
            //If user submits the assignment and is not graded,then selected option should be displayed.
            if (
              userChoice &&
              typeof userJSON != "undefined" &&
              userJSON.currentUserRole == "ROLE_USER" &&
              (params.viewType == undefined || (params.viewType == "report" && !params.isAttemptReviewed))
            ) {
              this.$el.find(".sentence-response-selectiontext[sequence=" + sequence + "]").addClass("selectedSentance");
            }
          }, this)
        );
      }
    },

    showCorrectAnswer: function(params) {
      this.$el.find(".sentence-response-selectiontext").each(function() {
        if (!$(this).hasClass("user-correct-answer") && !$(this).hasClass("user-wrong-answer")) {
          $(this).css("background", "rgb(230, 230, 230)");
        }
      });
      _.map(
        params.correctAnswerJSON,
        $.proxy(function(choice, key) {
          if (choice && choice == true) {
            var answerChoiceKey = key + "";
            var sequence = answerChoiceKey.replace("ch", "");
            if (
              !this.$el
                .find(".sentence-response-selectiontext[sequence=" + sequence + "]")
                .hasClass("user-correct-answer")
            ) {
              this.$el.find(".sentence-response-selectiontext[sequence=" + sequence + "]").css("background", "#d2e7cd");
              this.$el
                .find(".sentence-response-selectiontext[sequence=" + sequence + "]")
                .css("border", "1px solid blue");
            }
          }
        }, this)
      );
    },

    /**
     * Construct user response as map
     */
    constructUserResponse: function() {
      var userResponse = {},
        isSelected = false,
        userResponseId = "",
        sequenceId;
      this.$el.find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext").each(function() {
        if ($(this).hasClass("selectedSentance")) {
          sequenceId = $(this).attr("sequence");
          if (sequenceId != undefined && sequenceId != "") {
            userResponseId = "ch" + sequenceId;
            userResponse[userResponseId] = true;
            isSelected = true;
          }
        } else {
          sequenceId = $(this).attr("sequence");
          if (sequenceId != undefined && sequenceId != "") {
            userResponseId = "ch" + sequenceId;
            userResponse[userResponseId] = false;
          }
        }
      });
      if (isSelected == true) {
        return userResponse;
      } else {
        return {};
      }
    },

    /**
     * To get answer choices.
     */
    getAnswerChoicesAndCorrectAnswer: function(ev) {
      var self = this;
      var answerChoices = [],
        idx = 0,
        checkEmptyOption = true,
        isSelected = false;
      var answerId, correctAnswerId, answer;
      var correctAnswers = {};
      var correctAnswerCount = 0;
      this.$el
        .parents()
        .find(".answerChoiceInput")
        .each(function() {
          var sequenceId = $(this)
            .attr("id")
            .replace("ch", "");
          if (
            self.$el.find(
              "#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext[sequence=" +
                sequenceId +
                "]"
            ).length > 0
          ) {
            if ($(this).val() != -1 || $(this).val() != "-1") {
              correctAnswerId = $(this).attr("id");
              correctAnswers[correctAnswerId] = true;
              correctAnswerCount++;
            } else {
              correctAnswerId = $(this).attr("id");
              correctAnswers[correctAnswerId] = false;
            }
            var answerChoice = { id: correctAnswerId };
            answerChoices[idx++] = answerChoice;
          }
        });
      var answerChoicesAndCorrectAnswer = [
        {
          answerChoices: answerChoices,
          correctAnswer: correctAnswers,
          correctAnswerCount: correctAnswerCount
        }
      ];
      return answerChoicesAndCorrectAnswer;
    },

    /**
     * Preview question an author mode.
     */
    showQuestionPreview: function(params) {
      var question,
        questionId = params.questionId;
      var answerChoices, questionSetDetails, questionData;
      var isEditQuestion = false;
      this.isPreview = true;
      if (params.isLocal) {
        var questionsStore = new Backbone.LocalStorage("Questions");
        question = questionsStore.find({
          id: questionId
        });
        questionSetDetails = question.questionSetDetails;
        questionData = {
          _requireContextPath: _requireContextPath,
          question: question,
          isLocal: params.isLocal,
          questionType: params.questionType,
          mode: "edit",
          displayLabel: params.displayLabel,
          pageView: params.pageView,
          userRole: params.userRole,
          graded: params.graded
        };
        this.showPreview(
          question,
          sentenceResponseQuestionPreviewTemplate,
          questionSetDetails.question,
          question.question,
          true
        );
        this.showOrHideHighlightTextForSentenceSelectionQuestionContent("HIDE");
        this.updateAnswerChoiceInputsValueBeforeEdit();
      } else {
        question = params.question;
        questionSetDetails = params.questionSetDetails;
        questionData = {
          _requireContextPath: _requireContextPath,
          question: question,
          isLocal: params.isLocal,
          questionType: params.questionType,
          mode: "edit",
          displayLabel: params.displayLabel,
          pageView: params.pageView,
          userRole: params.userRole,
          graded: params.graded
        };
        this.showPreview(
          question,
          sentenceResponseQuestionPreviewTemplate,
          questionSetDetails,
          questionData,
          false,
          params
        );
        this.showOrHideHighlightTextForSentenceSelectionQuestionContent("HIDE");
        this.updateAnswerChoiceInputsValueBeforeEdit();
      }
    },

    /**
     * Evaluation in student review mode.
     */
    showQuestionAsStudentReviewView: function(params) {
      var question = params.question,
        questionId = params.questionId,
        answerChoices;
      if (params.isLocal) {
        //do the local stuff
        return;
      } else {
        //do the server stuff
        var questionData = {
          _requireContextPath: _requireContextPath,
          question: question,
          isLocal: params.isLocal,
          questionType: params.questionType,
          mode: "review"
        };
        var compiledTemplate = _.template(sentenceResponseQuestionPreviewTemplate, questionData);
        this.$el.prepend(compiledTemplate);
        this.colorChangeForResult(params.evaluatedResponse, params.userResponse, "stud");
        this.options.userType = "student";
      }
    },

    /**
     * Show redactor editor for question content
     */
    showRedactorEditor: function() {
      this.passageRedactorEditor();
      var toolbarButtons = [
        "html",
        "formatting",
        "|",
        "bold",
        "italic",
        "underline",
        "deleted",
        "|",
        "unorderedlist",
        "orderedlist",
        "outdent",
        "indent",
        "|",
        "video",
        "file",
        "table",
        "link",
        "|",
        "alignment",
        "|",
        "horizontalrule"
      ];
      this.applyRedactorHtmlEditorById("question-raw-content", "Enter Question Text", toolbarButtons);
    },

    /**
     * Show redactor editor for sentence response content
     */
    showRedactorEditorForSentenceResponseView: function() {
      var toolbarButtons = [""];
      this.applyRedactorHtmlEditor(
        "sentence-selection-raw-content-text-area",
        "Enter Your Paragraph here",
        toolbarButtons
      );
      var reDomEle = this.$el.find(".sentence-selection-raw-content-text-area");
      reDomEle.focusout(
        $.proxy(function() {
          if (
            $.trim(reDomEle.html()) !=
            '<span class="redactor_placeholder" contenteditable="false">Enter Your Paragraph here</span>'
          ) {
            this.$el.find("#sentenceSelectionText").val(reDomEle.html());
          }
        }, this)
      );
    },

    /**
     *  For switch tabs
     */
    toggleTabs: function(ev) {
      var currentTabObj = null,
        tabId = null;
      if (ev == undefined || ev == "undefined") {
        currentTabObj = this.$el.find("#tab-highlight-text");
        tabId = currentTabObj.attr("id");
      } else {
        currentTabObj = $(ev.currentTarget);
        tabId = currentTabObj.attr("id");
      }
      if (tabId == "tab-edit-text") {
        // If selected tab is Edit Text
        var isHighlightedText = this.$(
          ".sentence-response-selectiontext",
          "#sentence-selection-raw-content-div-heighlight"
        ).html(); // checking if any text is highlighted
        this.showNotificationDialogForSentenceSelectionTabNav(tabId, isHighlightedText);
      } else {
        // If selected tab is Highlight Text
        this.$el.find(".tab-sentence-selection-btn").removeClass("selected");
        currentTabObj.addClass("selected");
        this.displayHighlightTextContent();
        if (this.$el.find("#clear-all-answer-choice label").hasClass("clear-all-answer-choice-checkbox-unchecked")) {
          this.showOrHideHighlightTextForSentenceSelectionQuestionContent("SHOW");
        } else {
          this.showOrHideHighlightTextForSentenceSelectionQuestionContent("HIDE");
        }
        //To reset the saved input hidden values for Answer choice and correct answer
        // after user remove some text/sentence and add new
        this.resetAnswerChoiceAndCorrectAnswerValues();
      }

      if (ev != undefined) ev.stopPropagation();
    },
    resetAnswerChoiceAndCorrectAnswerValues: function() {
      var self = this;
      // Remove the existing answer choice input value
      this.$el.find(".answerChoiceInput").remove();
      // Loop the selected sentence span value, get the sequenceid and correct answer and create new input hidden values
      this.$el.find("#sentence-selection-raw-content-div-heighlight [sequence]").each(function() {
        var sequenceId = $(this).attr("sequence");
        if (sequenceId != undefined && sequenceId != "") {
          var answerChoiceInputValue = -1;
          if ($(this).hasClass("selected-text-correct-answer")) {
            answerChoiceInputValue = sequenceId;
          }
          var inputHiddenTemplate =
            '<input id="ch' +
            sequenceId +
            '" class="sw-question-element answerChoiceInput" type="hidden" value="' +
            answerChoiceInputValue +
            '">';
          self.$el.find(".dnd-question-content-section").append(inputHiddenTemplate);
        }
      });
    },
    showEditTextTabContentView: function() {
      this.clearAllSentenceResponseAnswerChoices();
      this.$el.find(".tab-sentence-selection-btn").removeClass("selected");
      this.$el.find("#tab-edit-text").addClass("selected");
      this.$el.find(".clear-all-answer-choice-wrapper").hide();
      this.$el.find("#sentence-selection-heighlight-text-wrapper").hide();
      this.$el.find("#sentence-selection-edit-text-wrapper").show();

      var selectionTextContent = this.$el.find("#sentenceSelectionText").val();
      if (selectionTextContent == "") {
        selectionTextContent = "Enter Your Paragraph here";
      }
      this.$el
        .find("#sentence-selection-raw-content-div #sentence-selection-raw-content-text-area")
        .html(selectionTextContent);
      this.showOrHideHighlightTextForSentenceSelectionQuestionContent("HIDE");
      this.$el.find(".sentence-selection-anser-choice-optns").remove();
      this.$el.find(".sentence-selection-anser-choice-arrow").remove();
    },
    displayHighlightTextContent: function() {
      this.$el.find(".clear-all-answer-choice-wrapper").show();
      this.$el.find("#sentence-selection-edit-text-wrapper").hide();
      this.$el.find("#sentence-selection-heighlight-text-wrapper").show();
      this.$el
        .find("#sentence-selection-heighlight-text-wrapper #sentence-selection-raw-content-div-heighlight")
        .html(this.$el.find("#sentenceSelectionText").val());
      this.showOrHideHighlightTextForSentenceSelectionQuestionContent("SHOW"); // Show the applied background color for answer choice and correct answer in hightligh tab view
    },

    showNotificationDialogForSentenceSelectionTabNav: function(tabId, isHighlightedText) {
      if (tabId == "tab-edit-text") {
        if (!this.$el.find("#tab-edit-text").hasClass("selected")) {
          if (isHighlightedText != undefined && isHighlightedText != null) {
            var notificationMessage =
              "You are about to edit some text which is already highlighted. Additions/deletions to the text will delete all the highlighted text. Are you sure you want to continue?";
            this.showPopUp(
              "sentenceResponse.yesNavigateToEditTabView",
              "sentenceResponse.cancelAndGoBackToHighlightTabView",
              notificationMessage,
              "Yes ",
              "Cancel"
            );
          } else {
            this.showEditTextTabContentView();
          }
        }
      }
    },
    /*
     * Add selection span element with style on mouse selection
     */
    selectSentenceResponseText: function(ev) {
      this.showMessage("");
      var st = this.CurrentSelection.Selector.getSelected();
      var range, textMesg;
      var count = this.$el.find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext")
        .length;
      if (count >= 12) {
        textMesg =
          "You have already added 12 answer choices. A total of 12 answer choices is supported. Please remove a few answer choices and try again.";
        this.addNotificatonForSentenceResponse(textMesg);
        this.clearSelection();
        return;
      } else {
        if (document.selection && !window.getSelection) {
          range = st;
          range.pasteHTML(
            "<span class='sentence-response-selectiontext' sequence='" + count + "'>" + range.htmlText + "</span>"
          );
          this.createOrRemoveAnswerChoiceInputHiddenToSaveUserResponse(count);
        } else {
          {
            try {
              if (st.rangeCount > 0) {
                range = st.getRangeAt(0);
                if (range.startOffset == range.endOffset) {
                  //If jus click avoid to mark that one as one option selected
                  this.clearSelection();
                  return;
                }
                var startOffset = 0;
                if (
                  range.commonAncestorContainer != undefined &&
                  range.commonAncestorContainer.parentNode != undefined &&
                  range.commonAncestorContainer.parentNode.className != undefined &&
                  (range.commonAncestorContainer.parentNode.className == "sentence-response-selectiontext" ||
                    range.commonAncestorContainer.parentNode.className ==
                      "sentence-response-selectiontext selected-text-correct-answer")
                ) {
                  this.$el.find(".sentence-selection-anser-choice-optns").remove();
                  this.$el.find(".sentence-selection-anser-choice-arrow").remove();
                  this.clearSelection();
                  textMesg = "You are highlighting already selected text. Please select a distinct text and try again.";
                  this.addNotificatonForSentenceResponse(textMesg);
                  return;
                }
                var newNode = document.createElement("span");
                newNode.setAttribute("class", "sentence-response-selectiontext");
                newNode.setAttribute("sequence", count);
                if (
                  this.$el.find("#clear-all-answer-choice label").hasClass("clear-all-answer-choice-checkbox-unchecked")
                ) {
                  newNode.setAttribute("style", "background-color:#e6e4e5");
                }
                range.surroundContents(newNode);
                if ($(range.commonAncestorContainer).closest(".sentence-selection-raw-content-div")) {
                  this.createOrRemoveAnswerChoiceInputHiddenToSaveUserResponse(count);
                }
              }
            } catch (err) {
              this.$el.find(".sentence-selection-anser-choice-optns").remove();
              this.$el.find(".sentence-selection-anser-choice-arrow").remove();
              this.clearSelection();
              textMesg = "You are highlighting already selected text. Please select a distinct text and try again.";
              this.addNotificatonForSentenceResponse(textMesg);
              return;
            }
          }
        }
        this.clearSelection();
        this.populateSelectionTextAnswerChoices("sentence-selection-raw-content-div-heighlight");
      }
      ev.stopPropagation();
    },
    unSelectSentenceResponseText: function() {
      if (this.options && this.options.mode == "preview") {
        this.showOrHideHighlightTextForSentenceSelectionQuestionContent("HIDE");
      }
    },
    //clear the selection
    clearSelection: function() {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      } else if (document.selection) {
        document.selection.empty();
      }
    },
    populateSelectionTextAnswerChoices: function(sentenceSelectionTextId, currentSelectionSequence) {
      var self = this;
      this.$el.find("#" + sentenceSelectionTextId + " .sentence-response-selectiontext").each(function(i) {
        var index = Number($(this).attr("sequence")) + 1;
        self.$("#choice" + index + "HTML").val(index);
      });
      this.$el
        .find("#sentenceSelectionText")
        .val(
          this.$el
            .find("#sentence-selection-heighlight-text-wrapper #sentence-selection-raw-content-div-heighlight")
            .html()
        );
    },
    sentenceSelectionHighlightMouseOver: function(ev) {
      var thisObj = $(ev.currentTarget);
      if (!this.$el.find("#clear-all-answer-choice label").hasClass("clear-all-answer-choice-checkbox-unchecked")) {
        thisObj.css("background-color", "#e6e6e6");
      }
    },
    sentenceSelectionHighlightMouseOut: function(ev) {
      var thisObj = $(ev.currentTarget);
      if (!this.$el.find("#clear-all-answer-choice label").hasClass("clear-all-answer-choice-checkbox-unchecked")) {
        $(thisObj).css("background-color", "");
      }
    },
    sentenceSelectionHighlightMouseEnter: function(ev) {
      var thisObj = $(ev.currentTarget);
      if (thisObj.find(".sentence-selection-anser-choice-optns").length > 0) {
        return false;
      }
      this.$el.find(".sentence-selection-anser-choice-optns").remove();
      this.$el.find(".sentence-selection-anser-choice-arrow").remove();
      var addCorrectAnswer =
        '<li id="remove-correct-answer-option" title="Mark as correct answer" choiceOrder=' +
        currentChoiceSequence +
        ">Remove correct answer</li>";
      var currentChoiceSequence = thisObj.attr("sequence");
      // check if the answer choice Exist or not, if true Add text "Remove Correct Answer" else add text "Add a correct Answer"
      var isMarkAsCorrectAnswerExistBoolean = this.isMarkAsCorrectAnswerExist(currentChoiceSequence);
      if (!isMarkAsCorrectAnswerExistBoolean) {
        addCorrectAnswer =
          '<li id="mark-correct-answer-option" title="Mark as correct answer" choiceOrder=' +
          currentChoiceSequence +
          ">Mark as correct answer</li>";
      } else {
        addCorrectAnswer =
          '<li id="remove-correct-answer-option" title="Remove correct answer" choiceOrder=' +
          currentChoiceSequence +
          ">Remove correct answer</li>";
      }

      var htmlMarkUp =
        '<div class="sentence-selection-anser-choice-optns">' +
        '<div><ul class="sentence-selection-anser-choice-optns-ul"><li id="remove-selected-answer-option" title="Remove answer choice" choiceOrder=' +
        currentChoiceSequence +
        '>Remove answer choice</li><li class="separator-strip">&nbsp;</li>';
      htmlMarkUp =
        htmlMarkUp + addCorrectAnswer + '</div> </div><div class="sentence-selection-anser-choice-arrow"></div>';
      thisObj.append(htmlMarkUp);
      var relY = thisObj.position().top;
      var relX = thisObj.position().left;
      var mousex = ev.pageX - thisObj.offset().left;
      var mousey = ev.pageY - thisObj.offset().top;

      var dialogHt = 32;
      var dialogWt = 165;
      var div = Math.floor(mousey / dialogHt);
      mousey = div * dialogHt;

      var dialogMarginTop = mousey + relY - Math.floor(1.5 * dialogHt) + 20;
      var dialogMarginLeft = mousex + relX - dialogWt;

      var dialogArrowMarginTop = dialogMarginTop + dialogHt - 2;
      var dialogArrowMarginLeft = dialogMarginLeft + dialogWt;

      var minLeft = 0;
      if (dialogMarginLeft < minLeft) {
        dialogMarginLeft = minLeft;
        var minArrowLeft = 17;
        if (dialogArrowMarginLeft < minArrowLeft) {
          dialogArrowMarginLeft = minArrowLeft;
        }
      }
      var maxLeft =
        $(this)
          .closest("div")
          .width() -
        2 * dialogWt -
        2;
      if (maxLeft > 0 && dialogMarginLeft > maxLeft) {
        dialogMarginLeft = maxLeft;
      }
      this.$el
        .find(".sentence-selection-anser-choice-optns")
        .css("top", dialogMarginTop + "px")
        .css("left", dialogMarginLeft + "px")
        .css("position", "absolute");
      this.$el
        .find(".sentence-selection-anser-choice-arrow")
        .css("top", dialogArrowMarginTop + "px")
        .css("left", dialogArrowMarginLeft + "px")
        .css("position", "absolute");
      ev.stopPropagation();
    },
    sentenceSelectionHighlightMouseLeave: function(ev) {
      this.$el.find(".sentence-selection-anser-choice-optns").remove();
      this.$el.find(".sentence-selection-anser-choice-arrow").remove();
      ev.stopPropagation();
    },
    // check if the answer choice Exist or not, if true Add text "Remove Correct Answer" else add text "Add a correct Answer"
    isMarkAsCorrectAnswerExist: function(currentChoiceSequence) {
      var self = this;
      if (
        this.$el.find(
          ".sentence-selection-text-wrapper #sentence-selection-heighlight-text-wrapper .selected-text-correct-answer"
        ).length > 12
      ) {
        return false;
      }
      var isMarkAsCorrectAnswerExist = true;
      this.$el.find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext").each(function() {
        var index = Number($(this).attr("sequence"));
        if (index == currentChoiceSequence) {
          var choiceId = Number(self.$el.find("#ch" + index).val());
          if (choiceId < 0) {
            isMarkAsCorrectAnswerExist = false;
          }
        }
      });
      return isMarkAsCorrectAnswerExist;
    },
    removeSelectedOption: function(ev) {
      var thisObj = $(ev.currentTarget);
      this.$el.find(".sentence-selection-anser-choice-optns").remove();
      this.$el.find(".sentence-selection-anser-choice-arrow").remove();
      this.removeSelectedAnswerOption(thisObj.attr("choiceOrder"));
    },
    removeSelectedAnswerOption: function(currentIndex) {
      var self = this;
      this.showMessage("");
      this.$el.find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext").each(function() {
        var index = Number($(this).attr("sequence"));
        if (index == currentIndex) {
          var text = $(this).html();
          $(this).replaceWith(text);
          self.createOrRemoveAnswerChoiceInputHiddenToSaveUserResponse(index, "DELETE");
        }
      });
      this.resetSelectionTextAnswerChoices("sentence-selection-raw-content-div-heighlight", currentIndex);
    },
    resetSelectionTextAnswerChoices: function(sentenceSelectionTextId, currentSelectionSequence) {
      var self = this;
      this.$el.find("#" + sentenceSelectionTextId + " .sentence-response-selectiontext").each(function() {
        var index = Number($(this).attr("sequence"));
        if (index > currentSelectionSequence) {
          $(this).attr("sequence", index - 1); //decrement the current sequence in Highlight
          if (!self.$el.find("#ch" + (index - 1)).length) {
            var inputHiddenTemplate =
              '<input id="ch' +
              (index - 1) +
              '" class="sw-question-element answerChoiceInput" type="hidden" value="-1">';
            self.$el.find(".dnd-question-content-section").append(inputHiddenTemplate);
          }
          var chidValue = self.$el.find("#ch" + index).val();
          self.$el.find("#ch" + index).val(-1);
          if (chidValue != -1 || chidValue != "-1") {
            var correctAnswerId = self.$el.find("#ch" + (index - 1));
            correctAnswerId.val(index); //if previously marked the correct answer update it by index
          }
        }
      });
      this.$el
        .find("#sentenceSelectionText")
        .val(
          this.$("#sentence-selection-heighlight-text-wrapper #sentence-selection-raw-content-div-heighlight").html()
        );
    },
    markCorrectAnswerOption: function(ev) {
      var thisObj = $(ev.currentTarget);
      if (
        this.$el.find(
          ".sentence-selection-text-wrapper #sentence-selection-heighlight-text-wrapper .selected-text-correct-answer"
        ).length >= 12
      ) {
        var textMesg =
          "You have already added 12 correct answers. A total of 12 correct answers is supported. Please remove a few correct answers and try again.";
        this.addNotificatonForSentenceResponse(textMesg);
        return;
      }
      this.$el.find(".sentence-selection-anser-choice-optns").remove();
      this.$el.find(".sentence-selection-anser-choice-arrow").remove();
      this.populateCorrectAnswerOption(thisObj.attr("choiceOrder"));
    },
    populateCorrectAnswerOption: function(currentIndex) {
      var self = this;
      if (
        this.$el.find("#allow-multiple-correct-ans-checkbox").hasClass("allow-multiple-correct-ans-checkbox-unchecked")
      ) {
        this.$el
          .find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext")
          .each(function() {
            var index = Number($(this).attr("sequence"));
            var chid = self.$el.find("#ch" + index);
            chid.val(-1);
            $(this).removeClass("selected-text-correct-answer");
            if (
              !self.$el.find("#clear-all-answer-choice label").hasClass("clear-all-answer-choice-checkbox-unchecked")
            ) {
              $(this).css({ "background-color": "" });
            }
          });
      } else {
        this.$el
          .find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext")
          .each(function() {
            if (
              !self.$el.find("#clear-all-answer-choice label").hasClass("clear-all-answer-choice-checkbox-unchecked")
            ) {
              $(this).css({ "background-color": "" });
            }
          });
      }
      this.$el.find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext").each(function() {
        var index = Number($(this).attr("sequence"));
        if (index == currentIndex) {
          var chid = self.$el.find("#ch" + index);
          chid.val(index);
          $(this).addClass("selected-text-correct-answer");
        }
      });

      this.$el.find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext").each(function() {
        if (self.$el.find("#clear-all-answer-choice label").hasClass("clear-all-answer-choice-checkbox-unchecked")) {
          if ($(this).hasClass("selected-text-correct-answer")) {
            $(this).css("background", "#d2e7cd");
          } else {
            $(this).css("background", "#e6e4e5");
          }
        }
      });
      this.$el
        .parents()
        .find("#sentenceSelectionText")
        .val(
          this.$el
            .find("#sentence-selection-heighlight-text-wrapper #sentence-selection-raw-content-div-heighlight")
            .html()
        );
    },
    createOrRemoveAnswerChoiceInputHiddenToSaveUserResponse: function(index, mode) {
      if (mode == "DELETE") {
        this.$el.find("#ch" + index).remove();
        return;
      }
      if (this.$el.find("#ch" + index).length === 0) {
        var inputHiddenTemplate =
          '<input id="ch' + index + '" class="sw-question-element answerChoiceInput" type="hidden" value="-1">';
        this.$el.find(".dnd-question-content-section").append(inputHiddenTemplate);
      }
    },
    removeCorrectAnswerOption: function(ev) {
      this.showMessage("");
      var thisObj = $(ev.currentTarget);
      this.$el.find(".sentence-selection-anser-choice-optns").remove();
      this.$el.find(".sentence-selection-anser-choice-arrow").remove();
      this.removeCorrectAnswerOptionValue(thisObj.attr("choiceOrder"));
    },
    removeCorrectAnswerOptionValue: function(currentIndex) {
      var self = this;
      this.$el.find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext").each(function() {
        var index = Number($(this).attr("sequence"));
        if (index == currentIndex) {
          var chid = self.$el.find("#ch" + index);
          chid.val(-1);
          $(this)
            .removeClass("selected-text-correct-answer")
            .css({ "background-color": "" });
          if (self.$el.find("#clear-all-answer-choice label").hasClass("clear-all-answer-choice-checkbox-unchecked")) {
            $(this).css("background-color", "#e6e4e5");
          }
        }
      });
      this.$el
        .parents()
        .find("#sentenceSelectionText")
        .val(
          this.$el
            .find("#sentence-selection-heighlight-text-wrapper #sentence-selection-raw-content-div-heighlight")
            .html()
        );
    },
    clearAllAnswerChoices: function() {
      var notMessage = "Are you sure you want to clear all answer choices?";
      this.showPopUp(
        "sentenceResponse.clearAllSentenceResponseAnswerChoices",
        "sentenceResponse.cancelClearAllAnswerChoices",
        notMessage,
        "Yes ",
        " Cancel"
      );
    },
    clearAllSentenceResponseAnswerChoices: function() {
      this.$el.find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext").each(function() {
        var text = $(this).html();
        $(this).replaceWith(text);
      });
      this.$el
        .parents()
        .find("#sentenceSelectionText")
        .val(
          this.$el
            .find("#sentence-selection-heighlight-text-wrapper #sentence-selection-raw-content-div-heighlight")
            .html()
        );
      this.$el.find("input.sw-question-element.answerChoiceInput").remove();
      this.showMessage("You have unsaved changes", "warning");
    },
    toggleShowAllHighlights: function(ev) {
      var thisObj = $(ev.currentTarget);
      if (thisObj.hasClass("clear-all-answer-choice-checkbox-checked")) {
        thisObj
          .removeClass("clear-all-answer-choice-checkbox-checked")
          .addClass("clear-all-answer-choice-checkbox-unchecked");
        this.showOrHideHighlightTextForSentenceSelectionQuestionContent("SHOW");
      } else {
        thisObj
          .removeClass("clear-all-answer-choice-checkbox-unchecked")
          .addClass("clear-all-answer-choice-checkbox-checked");
        this.showOrHideHighlightTextForSentenceSelectionQuestionContent("HIDE");
      }
    },
    showOrHideHighlightTextForSentenceSelectionQuestionContent: function(viewMode) {
      if (viewMode == "SHOW") {
        this.$el.find(".sentence-response-selectiontext").each(function(i) {
          if ($(this).hasClass("selected-text-correct-answer")) {
            $(this).css("background-color", "#d2e7cd");
          } else {
            $(this).css("background-color", "#e6e4e5");
          }
        });
      } else {
        this.$el.find(".sentence-response-selectiontext").css("background-color", "");
      }
    },
    addNotificatonForSentenceResponse: function(notMessage) {
      this.showMessage(notMessage, "warning");
    },
    cancelAndGoBackToHighlightTabView: function(ev) {
      this.showMessage("You have unsaved changes", "warning");
    },
    yesNavigateToEditTabView: function(ev) {
      this.showEditTextTabContentView();
      this.showMessage("You have unsaved changes", "warning");
    },
    cancelClearAllAnswerChoices: function() {
      this.showMessage("You have unsaved changes", "warning");
    },
    showAnswerChoicesOnHover: function(ev) {
      var thisObj = $(ev.currentTarget);
      if (this.options && this.options.mode == "readOnly") {
        return;
      }
      if (thisObj.attr("selectedResponse") != "true") {
        this.$el.find(".sentence-response-selectiontext").css("background", "transparent");
        thisObj.css("background", "#999999");
      }
    },
    hideAnswerChoicesOnMouseOut: function() {
      if (this.options && this.options.mode == "readOnly") {
        return;
      }
      if (
        this.options &&
        this.options.mode == "preview" &&
        typeof userJSON != "undefined" &&
        userJSON.currentUserRole == "ROLE_USER"
      ) {
        return;
      }
      this.$el.find(".sentence-response-selectiontext").css("background", "transparent");
    },
    selectUserResponseAndValidate: function(ev) {
      if (this.options && this.options.mode == "readOnly") {
        return;
      }
      var thisObj = $(ev.currentTarget);
      var allowMultiSentenceSelects = this.$el.find("#allowMultiSentenceSelects").val();
      if (allowMultiSentenceSelects != undefined && allowMultiSentenceSelects == "true") {
        if (thisObj.attr("selectedResponse") == "true" || thisObj.hasClass("selectedSentance")) {
          thisObj.attr("selectedResponse", "false").removeClass("selectedSentance", 1000);
        } else {
          thisObj.attr("selectedResponse", "true").addClass("selectedSentance", 100);
        }
      } else {
        this.clearUserSelectedOtherResponse(thisObj.attr("sequence"));
        this.$el
          .find("#sentence-selection-raw-content-div-heighlight")
          .children()
          .removeClass("selectedSentance");
        if (thisObj.attr("selectedResponse") == "true" || thisObj.hasClass("selectedSentance")) {
          thisObj.attr("selectedResponse", "false").removeClass("selectedSentance", 1000);
        } else {
          thisObj.attr("selectedResponse", "true").addClass("selectedSentance", 100);
        }
      }
    },
    clearUserSelectedOtherResponse: function(currentSequence) {
      this.$el.find("#sentence-selection-raw-content-div-heighlight .sentence-response-selectiontext").each(function() {
        if (currentSequence != $(this).attr("sequence")) {
          $(this)
            .removeAttr("selectedResponse")
            .removeClass("selectedSentance");
        }
      });
    },
    updateAnswerChoiceInputsValueBeforeEdit: function() {
      var correctAnswerJson = this.options.correctAnswerJson;
      if (typeof correctAnswerJson === "string") {
        correctAnswerJson = JSON.parse(correctAnswerJson);
      }
      if (!_.isEmpty(correctAnswerJson)) {
        $.each(
          correctAnswerJson,
          $.proxy(function(key, value) {
            var answerChVal = -1;
            var answerChoiceKey = key + "";
            if (value == true) {
              answerChVal = answerChoiceKey.replace("ch", "");
            }
            var inputHiddenTemplate =
              '<input id="' +
              answerChoiceKey +
              '" class="sw-question-element answerChoiceInput" type="hidden" value="' +
              answerChVal +
              '">';
            this.$el.append(inputHiddenTemplate);
          }, this)
        );
      }
    },
    multipleCorrectAnswerCheckbox: function(ev) {
      var self = this;
      var thisObj = $(ev.currentTarget);
      if (thisObj.hasClass("allow-multiple-correct-ans-checkbox-unchecked")) {
        thisObj
          .removeClass("allow-multiple-correct-ans-checkbox-unchecked")
          .addClass("allow-multiple-correct-ans-checkbox-checked");
      } else {
        thisObj
          .removeClass("allow-multiple-correct-ans-checkbox-checked")
          .addClass("allow-multiple-correct-ans-checkbox-unchecked");
      }

      this.$el.find(".sentence-response-selectiontext").each(function() {
        if ($(this).hasClass("selected-text-correct-answer")) {
          $(this)
            .removeClass("selected-text-correct-answer")
            .css("background", "#e6e4e5");
          var sequenceId = $(this).attr("sequence");
          if (sequenceId != undefined && sequenceId != "") {
            self.$el.find("#ch" + sequenceId).val(-1);
          }
        }
      });
    }
  });
  return sentenceResponseQuestionView;
});
