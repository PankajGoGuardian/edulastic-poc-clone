var ETS = ETS || {},
  dropdownText = "";

/* Defined button and listbox values in ets.i.dropdown.js */
ETS.ListboxButton = function(button, listbox, captureResponse) {
  this.button = button;
  this.listbox = listbox;
  this.captureResponse = captureResponse;
  this.registerEvents();
};

/* Event Handlers */
ETS.ListboxButton.prototype.registerEvents = function() {
  this.button.addEventListener("mousedown", this.buttonMouseDown.bind(this));
  this.button.addEventListener("click", this.showListbox.bind(this));
  this.button.addEventListener("keyup", this.checkShow.bind(this));
  this.listbox.listboxNode.addEventListener("blur", this.hideListbox.bind(this));
  this.listbox.listboxNode.addEventListener("click", this.hideListbox.bind(this));
  this.listbox.listboxNode.addEventListener("keydown", this.checkHide.bind(this));
  this.listbox.setHandleFocusChange(this.onFocusChange.bind(this));
};

/*Check to show the listbox */
ETS.ListboxButton.prototype.checkShow = function(evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case ETS.KeyCode.UP:
    case ETS.KeyCode.DOWN:
      evt.preventDefault();
      this.showListbox();
      this.listbox.checkKeyPress(evt);
      break;
  }
};

/*Check to hide the listbox */
ETS.ListboxButton.prototype.checkHide = function(evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case ETS.KeyCode.RETURN:
    case ETS.KeyCode.ESC:
      evt.preventDefault();
      this.hideListbox();
      this.button.focus();
      break;
  }
};

/* Show the Listbox */
ETS.ListboxButton.prototype.showListbox = function() {
  if (this.listbox.listboxNode.classList.contains("hidden")) {
    ETS.Utils.removeClass(this.listbox.listboxNode, "hidden");
    ETS.Utils.addClass(this.button, "active");
    this.button.setAttribute("aria-expanded", "true");
    this.listbox.listboxNode.focus();
  } else {
    this.hideListbox();
  }
};

/* Hide the Listbox */
ETS.ListboxButton.prototype.hideListbox = function() {
  ETS.Utils.addClass(this.listbox.listboxNode, "hidden");
  ETS.Utils.removeClass(this.button, "active");
  this.button.removeAttribute("aria-expanded");
};

/* Prevent from the mouse down event */
ETS.ListboxButton.prototype.buttonMouseDown = function(event) {
  event.preventDefault();
};

/* Change the value of button with selected listbox value */
ETS.ListboxButton.prototype.onFocusChange = function(focusedItem) {
  //var isMML = focusedItem.dataset.label && focusedItem.dataset.label.includes("<m");

  if (focusedItem.tagName.toLowerCase() === "li") {
    var isMML = false;
    var myMML = "";
    if ($(focusedItem).find(".MathJax").length > 0) {
      isMML = true;
      myMML = $(focusedItem)
        .find(".MathJax")
        .eq(0)
        .html();
    }

    if (isMML) {
      dropdownText = myMML; //myMML.replace(/&quot;/g, '"');

      $(this.button).html(dropdownText);

      scannr();
    } else {
      this.button.innerText = focusedItem.innerText;
    }

    this.captureResponse(focusedItem.attributes[1].nodeValue);
  }

  //    captureResponse("Passing this value back:" + this.button.innerText);
};
