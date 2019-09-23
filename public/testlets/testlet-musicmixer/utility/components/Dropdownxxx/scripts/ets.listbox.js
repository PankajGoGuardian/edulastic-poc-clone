var ETS = ETS || {};

ETS.Listbox = function(listboxNode) {
  this.listboxNode = listboxNode;
  this.activeDescendant = this.listboxNode.getAttribute("aria-activedescendant");
  this.multiselectable = this.listboxNode.hasAttribute("aria-multiselectable");
  this.moveUpDownEnabled = false;
  this.siblingList = null;
  this.upButton = null;
  this.downButton = null;
  this.moveButton = null;
  this.keysSoFar = "";
  this.handleFocusChange = function() {};
  this.handleItemChange = function(event, items) {};
  this.registerEvents();
};

/* Register events for the listbox interactions */

ETS.Listbox.prototype.registerEvents = function() {
  this.listboxNode.addEventListener("focus", this.setupFocus.bind(this));
  this.listboxNode.addEventListener("keydown", this.checkKeyPress.bind(this));
  this.listboxNode.addEventListener("click", this.checkClickItem.bind(this));
};

/* If there is no activeDescendant, focus on the first option */

ETS.Listbox.prototype.setupFocus = function() {
  if (this.activeDescendant) {
    return;
  }

  this.focusFirstItem();
};

/* Focus on first item */
ETS.Listbox.prototype.focusFirstItem = function() {
  var firstItem;

  firstItem = this.listboxNode.querySelector('[role="option"]');

  if (firstItem) {
    this.focusItem(firstItem);
  }
};

/* Focus on last item */
ETS.Listbox.prototype.focusLastItem = function() {
  var itemList = this.listboxNode.querySelectorAll('[role="option"]');

  if (itemList.length) {
    this.focusItem(itemList[itemList.length - 1]);
  }
};

/* Handle various keyboard controls; UP/DOWN will shift focus */
ETS.Listbox.prototype.checkKeyPress = function(evt) {
  var key = evt.which || evt.keyCode;
  var nextItem = document.getElementById(this.activeDescendant);

  if (!nextItem) {
    this.handleFocusChange(evt.target);
    return;
  }

  switch (key) {
    case ETS.KeyCode.PAGE_UP:
    case ETS.KeyCode.PAGE_DOWN:
      if (this.moveUpDownEnabled) {
        evt.preventDefault();

        if (key === ETS.KeyCode.PAGE_UP) {
          this.moveUpItems();
        } else {
          this.moveDownItems();
        }
      }

      break;
    case ETS.KeyCode.UP:
    case ETS.KeyCode.DOWN:
      evt.preventDefault();

      if (this.moveUpDownEnabled && evt.altKey) {
        if (key === ETS.KeyCode.UP) {
          this.moveUpItems();
        } else {
          this.moveDownItems();
        }
        return;
      }

      if (key === ETS.KeyCode.UP) {
        nextItem = nextItem.previousElementSibling;
      } else {
        nextItem = nextItem.nextElementSibling;
      }

      if (nextItem) {
        this.focusItem(nextItem);
      }

      break;
    case ETS.KeyCode.HOME:
      evt.preventDefault();
      this.focusFirstItem();
      break;
    case ETS.KeyCode.END:
      evt.preventDefault();
      this.focusLastItem();
      break;
    case ETS.KeyCode.SPACE:
      evt.preventDefault();
      this.toggleSelectItem(nextItem);
      break;
    case ETS.KeyCode.BACKSPACE:
    case ETS.KeyCode.DELETE:
    case ETS.KeyCode.RETURN:
      if (!this.moveButton) {
        this.handleFocusChange(nextItem);
        return;
      }

      var keyshortcuts = this.moveButton.getAttribute("ETS-keyshortcuts");
      if (key === ETS.KeyCode.RETURN && keyshortcuts.indexOf("Enter") === -1) {
        return;
      }
      if ((key === ETS.KeyCode.BACKSPACE || key === ETS.KeyCode.DELETE) && keyshortcuts.indexOf("Delete") === -1) {
        return;
      }

      evt.preventDefault();

      var nextUnselected = nextItem.nextElementSibling;
      while (nextUnselected) {
        if (nextUnselected.getAttribute("aria-selected") !== "true") {
          break;
        }
        nextUnselected = nextUnselected.nextElementSibling;
      }
      if (!nextUnselected) {
        nextUnselected = nextItem.previousElementSibling;
        while (nextUnselected) {
          if (nextUnselected.getAttribute("aria-selected") !== "true") {
            break;
          }
          nextUnselected = nextUnselected.previousElementSibling;
        }
      }

      this.moveItems();

      if (!this.activeDescendant && nextUnselected) {
        this.focusItem(nextUnselected);
      }
      break;
    default:
      var itemToFocus = this.findItemToFocus(key);
      if (itemToFocus) {
        this.focusItem(itemToFocus);
      }
      break;
  }
};

ETS.Listbox.prototype.findItemToFocus = function(key) {
  var itemList = this.listboxNode.querySelectorAll('[role="option"]');
  var character = String.fromCharCode(key);

  if (!this.keysSoFar) {
    for (var i = 0; i < itemList.length; i++) {
      if (itemList[i].getAttribute("id") === this.activeDescendant) {
        this.searchIndex = i;
      }
    }
  }
  this.keysSoFar += character;
  this.clearKeysSoFarAfterDelay();

  var nextMatch = this.findMatchInRange(itemList, this.searchIndex + 1, itemList.length);
  if (!nextMatch) {
    nextMatch = this.findMatchInRange(itemList, 0, this.searchIndex);
  }
  return nextMatch;
};

ETS.Listbox.prototype.clearKeysSoFarAfterDelay = function() {
  if (this.keyClear) {
    clearTimeout(this.keyClear);
    this.keyClear = null;
  }
  this.keyClear = setTimeout(
    function() {
      this.keysSoFar = "";
      this.keyClear = null;
    }.bind(this),
    500
  );
};

ETS.Listbox.prototype.findMatchInRange = function(list, startIndex, endIndex) {
  // Find the first item starting with the keysSoFar substring, searching in
  // the specified range of items
  for (var n = startIndex; n < endIndex; n++) {
    var label = list[n].innerText;
    if (label && label.toUpperCase().indexOf(this.keysSoFar) === 0) {
      return list[n];
    }
  }
  return null;
};

/*Check if an item is clicked on. If so, focus on it and select it.*/
ETS.Listbox.prototype.checkClickItem = function(evt) {
  if (evt.target.getAttribute("role") === "option") {
    this.focusItem(evt.target);
    this.toggleSelectItem(evt.target);
  }
  this.handleFocusChange(evt.target);

  // dispatch event on change
  window.dispatchEvent(
    new CustomEvent("itemChange", {
      detail: {
        target: evt.target
      }
    })
  );
};

/*  Toggle the aria-selected value */
ETS.Listbox.prototype.toggleSelectItem = function(element) {
  if (this.multiselectable) {
    element.setAttribute("aria-selected", element.getAttribute("aria-selected") === "true" ? "false" : "true");

    if (this.moveButton) {
      if (this.listboxNode.querySelector('[aria-selected="true"]')) {
        this.moveButton.setAttribute("aria-disabled", "false");
      } else {
        this.moveButton.setAttribute("aria-disabled", "true");
      }
    }
  }
};

/*Defocus the specified item */
ETS.Listbox.prototype.defocusItem = function(element) {
  if (!element) {
    return;
  }
  ETS.Utils.removeClass(element, "focused");
};

/* Focus on the specified item */
ETS.Listbox.prototype.focusItem = function(element) {
  //Remove the foces of the first item
  $(this.listboxNode.children[0]).removeClass("focused");

  this.defocusItem(document.getElementById(this.activeDescendant));
  ETS.Utils.addClass(element, "focused");
  this.listboxNode.setAttribute("aria-activedescendant", element.id);
  this.activeDescendant = element.id;

  if (this.listboxNode.scrollHeight > this.listboxNode.clientHeight) {
    var scrollBottom = this.listboxNode.clientHeight + this.listboxNode.scrollTop;
    var elementBottom = element.offsetTop + element.offsetHeight;
    if (elementBottom > scrollBottom) {
      this.listboxNode.scrollTop = elementBottom - this.listboxNode.clientHeight;
    } else if (element.offsetTop < this.listboxNode.scrollTop) {
      this.listboxNode.scrollTop = element.offsetTop;
    }
  }

  if (!this.multiselectable && this.moveButton) {
    this.moveButton.setAttribute("aria-disabled", false);
  }

  this.checkUpDownButtons();
  //    this.handleFocusChange(element);
};

/*Enable/disable the up/down arrows based on the activeDescendant.*/
ETS.Listbox.prototype.checkUpDownButtons = function() {
  var activeElement = document.getElementById(this.activeDescendant);

  if (!this.moveUpDownEnabled) {
    return false;
  }

  if (!activeElement) {
    this.upButton.setAttribute("aria-disabled", "true");
    this.downButton.setAttribute("aria-disabled", "true");
    return;
  }

  if (this.upButton) {
    if (activeElement.previousElementSibling) {
      this.upButton.setAttribute("aria-disabled", false);
    } else {
      this.upButton.setAttribute("aria-disabled", "true");
    }
  }

  if (this.downButton) {
    if (activeElement.nextElementSibling) {
      this.downButton.setAttribute("aria-disabled", false);
    } else {
      this.downButton.setAttribute("aria-disabled", "true");
    }
  }
};

/*Add the specified items to the listbox. Assumes items are valid options. An array of items to add to the listbox */
ETS.Listbox.prototype.addItems = function(items) {
  if (!items || !items.length) {
    return false;
  }

  items.forEach(
    function(item) {
      this.defocusItem(item);
      this.toggleSelectItem(item);
      this.listboxNode.append(item);
    }.bind(this)
  );

  if (!this.activeDescendant) {
    this.focusItem(items[0]);
  }

  this.handleItemChange("added", items);
};

/*Remove all of the selected items from the listbox; Removes the focused items in a single select listbox and the items with aria-selected in a multiselect listbox. @returns items an array of items that were removed from the listbox. */
ETS.Listbox.prototype.deleteItems = function() {
  var itemsToDelete;

  if (this.multiselectable) {
    itemsToDelete = this.listboxNode.querySelectorAll('[aria-selected="true"]');
  } else if (this.activeDescendant) {
    itemsToDelete = [document.getElementById(this.activeDescendant)];
  }

  if (!itemsToDelete || !itemsToDelete.length) {
    return [];
  }

  itemsToDelete.forEach(
    function(item) {
      item.remove();

      if (item.id === this.activeDescendant) {
        this.clearActiveDescendant();
      }
    }.bind(this)
  );

  this.handleItemChange("removed", itemsToDelete);

  return itemsToDelete;
};

ETS.Listbox.prototype.clearActiveDescendant = function() {
  this.activeDescendant = null;
  this.listboxNode.setAttribute("aria-activedescendant", null);

  if (this.moveButton) {
    this.moveButton.setAttribute("aria-disabled", "true");
  }

  this.checkUpDownButtons();
};

/* Shifts the currently focused item up on the list. No shifting occurs if the item is already at the top of the list.*/
ETS.Listbox.prototype.moveUpItems = function() {
  var previousItem;

  if (!this.activeDescendant) {
    return;
  }

  currentItem = document.getElementById(this.activeDescendant);
  previousItem = currentItem.previousElementSibling;

  if (previousItem) {
    this.listboxNode.insertBefore(currentItem, previousItem);
    this.handleItemChange("moved_up", [currentItem]);
  }

  this.checkUpDownButtons();
};

/*Shifts the currently focused item down on the list. No shifting occurs if the item is already at the end of the list. */
ETS.Listbox.prototype.moveDownItems = function() {
  var nextItem;

  if (!this.activeDescendant) {
    return;
  }

  currentItem = document.getElementById(this.activeDescendant);
  nextItem = currentItem.nextElementSibling;

  if (nextItem) {
    this.listboxNode.insertBefore(nextItem, currentItem);
    this.handleItemChange("moved_down", [currentItem]);
  }

  this.checkUpDownButtons();
};

/* Delete the currently selected items and add them to the sibling list. */
ETS.Listbox.prototype.moveItems = function() {
  if (!this.siblingList) {
    return;
  }

  var itemsToMove = this.deleteItems();
  this.siblingList.addItems(itemsToMove);
};

/* Enable Up/Down controls to shift items up and down, Up button to trigger up shift, Down button to trigger down shift */
ETS.Listbox.prototype.enableMoveUpDown = function(upButton, downButton) {
  this.moveUpDownEnabled = true;
  this.upButton = upButton;
  this.downButton = downButton;
  upButton.addEventListener("click", this.moveUpItems.bind(this));
  downButton.addEventListener("click", this.moveDownItems.bind(this));
};

/*Enable Move controls. Moving removes selected items from the current list and adds them to the sibling list.
 Move button to trigger delete. */

ETS.Listbox.prototype.setupMove = function(button, siblingList) {
  this.siblingList = siblingList;
  this.moveButton = button;
  button.addEventListener("click", this.moveItems.bind(this));
};

ETS.Listbox.prototype.setHandleItemChange = function(handlerFn) {
  this.handleItemChange = handlerFn;
};

ETS.Listbox.prototype.setHandleFocusChange = function(focusChangeHandler) {
  this.handleFocusChange = focusChangeHandler;
};
