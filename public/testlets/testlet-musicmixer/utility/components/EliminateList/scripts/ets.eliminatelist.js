/*Declaring the global variables to capture the response*/
var eliminateObj = {},
  eliminateArray = [];

/*Toggles the state of an eliminate list and update the icons based on the aria-checked value*/
/*function toggleEliminateList(event, val, index) {

    var node = event.currentTarget;

    var state = node.getAttribute('aria-checked').toLowerCase();

    if (event.type === 'click' ||
        (event.type === 'keydown' && event.keyCode == '32')
    ) {
        if (state === 'true') {
            node.setAttribute('aria-checked', 'false')
            node.classList.remove("optionSelected");
            eliminateObj[val] = false;

            eliminateArray.splice(eliminateArray.indexOf(val), 1);

        } else {
            node.setAttribute('aria-checked', 'true');
            node.classList.add('optionSelected');
            eliminateObj[val] = true;

            eliminateArray.push({
                index: index,
                label: val
            });

        }

        event.preventDefault();
        event.stopPropagation();
    }

}*/

function toggleEliminateListNodeValue(node, val, state) {
  if (state === "true") {
    node.setAttribute("aria-checked", "false");
    node.classList.remove("optionSelected");
    eliminateObj[val] = false;

    eliminateArray.splice(eliminateArray.indexOf(val), 1);
  } else {
    node.setAttribute("aria-checked", "true");
    node.classList.add("optionSelected");
    eliminateObj[val] = true;

    eliminateArray.push(val);
  }
}
function toggleEliminateList(event, val) {
  var node = event.currentTarget;

  var state = node.getAttribute("aria-checked").toLowerCase();

  if (event.type === "click" || (event.type === "keydown" && event.keyCode == "32")) {
    toggleEliminateListNodeValue(node, val, state);

    event.preventDefault();
    event.stopPropagation();
  }
}

/*function to capture response if selected=true by default */
function preLoad(event) {
  $("[role='checkbox']").each(function(event, val) {
    if ($(this).attr("aria-checked") == "true") {
      eliminateArray.push(val.childNodes[0].textContent);
      console.log(eliminateArray);
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
