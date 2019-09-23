var ETS = ETS || {};

var ETS_RadioGroup = function(domNode) {
  this.domNode = domNode;

  this.radioButtons = [];

  this.firstRadioButton = null;
  this.lastRadioButton = null;
};

//Identify and initialize the radio group
ETS_RadioGroup.prototype.init = function() {
  // initialize pop up menus
  if (!this.domNode.getAttribute("role")) {
    this.domNode.setAttribute("role", "radiogroup");
  }

  var rbs = this.domNode.querySelectorAll("[role=radio]");

  for (var i = 0; i < rbs.length; i++) {
    var rb = new ETS_RadioButton(rbs[i], this);
    rb.init();
    this.radioButtons.push(rb);

    console.log(rb);

    if (!this.firstRadioButton) {
      this.firstRadioButton = rb;
    }
    this.lastRadioButton = rb;
  }
  if (this.domNode.tabIndex == "-1") {
    this.firstRadioButton.domNode.tabIndex = "-1";
  } else {
    this.firstRadioButton.domNode.tabIndex = "0";
  }
};

ETS_RadioGroup.prototype.setChecked = function(currentItem) {
  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    rb.domNode.setAttribute("aria-checked", "false");
    rb.domNode.setAttribute("selected", "false");
    rb.domNode.tabIndex = -1;
  }
  currentItem.domNode.setAttribute("aria-checked", "true");
  currentItem.domNode.setAttribute("selected", "true");
  currentItem.domNode.tabIndex = 0;
  currentItem.domNode.focus();
};

//PZ: The SetFocus is a different version from the setFocus to avoid the cursor keys setting the aria-checked
ETS_RadioGroup.prototype.setFocus = function(currentItem) {
  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    rb.domNode.tabIndex = -1;
  }
  currentItem.domNode.tabIndex = 0;
  currentItem.domNode.focus();
};

//PZ: When the cursor keys are being used, use the setFocus function
ETS_RadioGroup.prototype.setFocusToPreviousItem = function(currentItem) {
  var index;

  if (currentItem === this.firstRadioButton) {
    this.setFocus(this.lastRadioButton);
  } else {
    index = this.radioButtons.indexOf(currentItem);
    this.setFocus(this.radioButtons[index - 1]);
  }
};

//PZ: When the cursor keys are being used, use the setFocus function
ETS_RadioGroup.prototype.setFocusToNextItem = function(currentItem) {
  var index;

  if (currentItem === this.lastRadioButton) {
    this.setFocus(this.firstRadioButton);
  } else {
    index = this.radioButtons.indexOf(currentItem);
    this.setFocus(this.radioButtons[index + 1]);
  }
};
