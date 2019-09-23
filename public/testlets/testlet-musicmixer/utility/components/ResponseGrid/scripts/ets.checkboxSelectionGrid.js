/*Declaring the global variables to capture the response*/
var objResponse = {},
  arrResponse = [];

/*Toggles the state of a checkbox and update the icons based on the aria-checked value*/
function toggleCheckboxResponse(event, val) {
  var node = event.currentTarget;

  var state = node.getAttribute("aria-checked").toLowerCase();

  if (event.type === "click" || (event.type === "keydown" && event.keyCode == "32")) {
    if (state === "true") {
      node.setAttribute("aria-checked", "false");
      node.classList.remove("optionSelected");

      objResponse[val] = false;

      arrResponse.splice(arrResponse.indexOf(val), 1);
    } else {
      node.setAttribute("aria-checked", "true");
      node.classList.add("optionSelected");

      objResponse[val] = true;

      arrResponse.push(val);
    }

    event.preventDefault();
    event.stopPropagation();
  }
}

/*function to capture response if selected=true by default */
function loadGrid(event) {
  $("[role='checkbox']").each(function(event, val) {
    if ($(this).attr("aria-checked") == "true") {
      arrResponse.push(val.childNodes[1].innerHTML);
      console.log(arrResponse);
    }
  });
}

/* Adds focus to the class name of the checkbox */
function focusCheckbox(event) {
  event.currentTarget.className += " focus";
}

/* Adds focus to the class name of the checkbox */
function blurCheckbox(event) {
  event.currentTarget.className = event.currentTarget.className.replace("focus", "");
}
