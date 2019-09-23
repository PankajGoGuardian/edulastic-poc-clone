//For activating the tabs
function tShowPage(tab, page) {
  //pause the media when tab is switched
  stopMedia();
  //first hide all the pages
  $('[data-type="tab"]').removeClass("active");
  //Now show the selected page
  $("#" + page).addClass("active");
  //Remove the highlights for all the tabs
  $(".tab").removeClass("active");
  //Highlight the tab
  $("#" + tab).addClass("active");
}

function textFieldInput(evt) {
  console.log("TEST");
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (
    evt.shiftKey ||
    (charCode > 31 &&
      (charCode < 37 || charCode > 40) &&
      (charCode < 48 || charCode > 57) &&
      (charCode < 96 || charCode > 105) &&
      charCode != 46 &&
      charCode != 110 &&
      charCode != 109 &&
      charCode != 190 &&
      charCode != 189)
  ) {
    evt.preventDefault();
    console.log("Only integers and decimals are allowed");
  } else {
    return true;
  }
}

function scannr() {
  if (typeof MathJax !== "undefined") {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "preview"]);
  }
}
