/*Declaring the global variables to capture the response*/
var obj = {},
  arr = [];

/*Toggles the state of a checkbox and update the icons based on the aria-checked value*/
function toggleResponseGrid(event, val) {
  console.log("Click 3");

  var node = event.currentTarget;

  var state = node.getAttribute("aria-checked").toLowerCase();

  if (event.type === "click" || (event.type === "keydown" && event.keyCode == "32")) {
    if (state === "true") {
      node.setAttribute("aria-checked", "false");
      node.classList.remove("optionSelected");

      obj[val] = false;

      arr.splice(arr.indexOf(val), 1);
    } else {
      node.setAttribute("aria-checked", "true");
      node.classList.add("optionSelected");

      obj[val] = true;

      arr.push(val);
    }

    event.preventDefault();
    event.stopPropagation();
  }
}

/*function to capture response if selected=true by default */
function loadRes(event) {
  $("[role='checkbox']").each(function(event, val) {
    if ($(this).attr("aria-checked") == "true") {
      arr.push(val.childNodes[1].innerHTML);
      console.log(arr);
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
