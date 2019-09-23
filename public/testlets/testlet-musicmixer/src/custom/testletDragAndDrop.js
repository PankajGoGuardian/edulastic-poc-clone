//Flexible drag and drop for Winsight

//Assign required variables
var dd = new Object(); //The testlet Drag and Drop object
dd.loc = new Object({
  x: 0,
  y: 0
}); //Store the mouse position
dd.activeDropZone = null; //Store the drop zone that is active by hover
dd.owner = null; //Store the original parent of this draggable object
dd.dragmode = false; //The dragmode that shows if an item is in drag
dd.kbd = new Object(); //Data storage for keyboard control
dd.kbd.dropzoneActive = null; //Which dropzone is active at this moment?
dd.dropZones = new Array();

//Initialize the draggable objects or drop-zones
function dragDropSetup(target, myObj) {
  var obj = myObj.properties.dragAndDrop;

  dd.dropZones = [];

  //Position the parent relatively
  $(target)
    .parent()
    .addClass("dragContainer");

  //add responseID to drag object
  $(target).attr("data-scoreID", idMapContent(myObj.identity.scoreID));
  $(target).attr("data-responseID", idMapContent(myObj.identity.responseId));
  $(target).attr("data-responseParam", myObj.identity.responseId);

  if (obj.drag.enabled) {
    //Add the value
    $(target).attr("data-value", idMapContent(myObj.properties.value));

    //This item is draggable
    $(target).attr("data-dragDrop", "drag");
    $(target).attr("draggable", "false");

    //For keyboard support
    $(target).attr("tabindex", 1);
    $(target).attr("onkeypress", "initKeyboardSupport(event)");

    //Add the correct classes
    $(target).addClass("dragDrop object");

    //Add a group if available
    if (typeof obj.drag.group !== typeof undefined) {
      $(target).attr("data-dragObjectGroup", obj.drag.group);
    }

    //Touch support
    $(target).attr("ontouchstart", "tdd('start', this)");
    $(target).attr("ontouchmove", "tdd('move', this)");
    $(target).attr("ontouchend", "tdd('end',this)");
    $(target).attr("ontouchcancel", "tdd('cancel',this)");

    //Mouse support
    $(target).attr("onmousedown", "tdd('start',this)");
    $(target).attr("onmousemove", "tdd('move',this)");
    $(target).attr("onmouseup", "tdd('end',this)");

    //Add a clone object or clone it
    if (obj.drag.remnant) {
      //Add a remnant object
      $(target)
        .parent()
        .prepend(
          '<div class="dragDrop remnant" style="width:' +
            $(target).css("width") +
            "; height:" +
            $(target).css("height") +
            '"></div>'
        );
    } else if (obj.drag.clone) {
      var cloneAmount = 1;
      if (typeof obj.drag.cloneAmount !== typeof undefined) {
        cloneAmount = obj.drag.cloneAmount;
      }
      //Add a clone as remnant
      for (i = 1; i <= cloneAmount - 1; i++) {
        $(target)
          .clone()
          .attr("id", $(target).attr("id") + i)
          .appendTo($(target).parent());
        $("#" + $(target).attr("id") + i).attr("style", "");
      }
    }
  } else if (obj.drop.enabled) {
    //add drop amount to drag object
    $(target).attr("data-maxDropItems", obj.drop.amount);
    $(target).attr("data-required", myObj.required);

    //This item is a drop zone
    $(target).attr("data-dragDrop", "drop");
    $(target).attr("tabindex", -1); //By default, turn off the tabindex until the indrag is on
    $(target).addClass("dragDrop dropZone");

    //Add a group support if available
    if (typeof obj.drop.acceptGroups !== typeof undefined) {
      var aGroups = "";
      $(obj.drop.acceptGroups).each(function(index) {
        if (aGroups.length > 0) {
          aGroups += ",";
        }
        aGroups += this;
      });

      $(target).attr("data-acceptGroups", aGroups);
    }

    //Add a position if available
    if (typeof obj.drop.position !== typeof undefined) {
      $(target).attr("data-position", obj.drop.position);
    }

    //Add the amount of elements allowed
    $(target).attr("data-drop-amount", obj.drop.amount);
    //Add the scaleability
    $(target).attr("data-drop-scale", obj.drop.scale);
  }

  //Identify all the dropZone items
  $(".dropZone").each(function(index) {
    dd.dropZones.push(this);
  });

  //Initialize the actual dd functionality
  initDragAndDrop(true);
}

//Allow drag and drop in this screen when drag and drop items are available
function initDragAndDrop(dnd) {
  if (dnd) {
    $(".testlet-player.winsight").attr("data-dndActive", true);

    //Recording the position for the mouse event (listener);
    $('[data-dndActive="true"]').on("mousedown mousemove touchstart touchmove", function(event) {
      var myX = getPointerLoc(event).x;
      var myY = getPointerLoc(event).y;

      if (myX !== dd.loc.x || myY !== dd.loc.y) {
        dd.loc.x = myX;
        dd.loc.y = myY;

        moveObject();
      }
    });

    //Canceling the drag and drop
    $('[data-dndActive="true"').on("mouseup touchend", function(event) {
      tdd("end");
    });

    $('[data-dndActive="true"').on("touchcancel", function(event) {
      tdd("cancel");
    });
  } else {
    //End
    $(".testlet-player.winsight").removeAttr("data-dnd");
  }
}

//Keyboard support
function initKeyboardSupport(event) {
  console.log(event.keyCode);

  //activate drag | Start
  if (event.keyCode === 13 || event.keyCode === 32) {
    cPrint("system", "keyboard", "Keyboard: Drag Initiated");

    //turn on the drag mode
    dd.dragmode = true;

    //Get the drag object
    var myObj = event.target;

    if ($(myObj).hasClass("inDrag")) {
      //Check if any drop zone is active
      dd.activeDropZone = $(".dragObjectOver");

      //Cancel class
      tdd("end");
      //cancelKbdDD(); <-- Check how to implement this again
    } else {
      //Initiate drag

      $(myObj).attr("data-dragType", "keyboard");
      $(myObj).addClass("inDrag");

      //Now highlight all the drop-zones

      $(".dragDrop.dropZone").addClass("active");

      //Listen for keyboard support
      startKbdDD();
    }
  }
}

//Keyboard Listener Events
function startKbdDD() {
  $(document).keydown(function(e) {
    console.log("key", event.keyCode);

    if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
      //Find and add the drop zones for keyboard support
      dd.kbd.dropzones = $(".dragDrop.dropZone.active");

      //Figuring out which drop zone is selected.
      var currentSelectedDropZone = -1;
      if ($(".dragDrop.dropZone.active").length > 0) {
        $(".dragDrop.dropZone.active").each(function(index) {
          console.log(">", $(this).hasClass("dragObjectOver"));
          if ($(this).hasClass("dragObjectOver")) {
            currentSelectedDropZone = index;
          }
        });
      }

      //Next - Right, Down
      if (event.keyCode === 39 || event.keyCode === 40) {
        currentSelectedDropZone++;
        if (currentSelectedDropZone >= dd.kbd.dropzones.length) {
          currentSelectedDropZone = 0;
        }
      }

      //Previous - Left, up
      if (event.keyCode === 37 || event.keyCode === 38) {
        currentSelectedDropZone--;
        if (currentSelectedDropZone < 0) {
          currentSelectedDropZone = dd.kbd.dropzones.length - 1;
        }
      }

      //Remove now all active classes from dropzones and reset them
      $(".dragDrop.dropZone").removeClass("dragObjectOver");
    }

    console.log("dz", currentSelectedDropZone);

    //Highlight the active dropzone
    $(dd.kbd.dropzones[currentSelectedDropZone]).addClass("dragObjectOver");

    //reset the dropzones
    dd.kbd.dropzones = [];
  });
}

//For touch event
function getPointerLoc(event) {
  var pos = {
    x: 0,
    y: 0
  };

  /*if (window.PointerEvents) {
        if (event.type === 'pointerstart' || event.type === 'pointermove' || event.type === 'pointerend' || event.type === 'pointercancel') {
            //var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
            pos.x = event.targetTouches[0].clientX;
            pos.y = event.targetTouches[0].clientY;
        }
    } else { */

  if (
    event.type === "touchstart" ||
    event.type === "touchmove" ||
    event.type === "touchend" ||
    event.type === "touchcancel"
  ) {
    var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
    pos.x = touch.pageX;
    pos.y = touch.pageY;
  } else if (
    event.type === "mousedown" ||
    event.type === "mouseup" ||
    event.type === "mousemove" ||
    event.type === "mouseover" ||
    event.type === "mouseout" ||
    event.type === "mouseenter" ||
    event.type === "mouseleave"
  ) {
    pos.x = event.pageX;
    pos.y = event.pageY;
  }
  //}

  var myScale = getScale();

  pos.x = myScale * pos.x;
  pos.y = myScale * pos.y;

  return pos;
}

//Move the object
function moveObject() {
  //Position any item in drag
  if ($(".testlet-player.winsight").hasClass("inDragMode") && $(".inDrag").length > 0) {
    //Position of the object
    var objInDrag = $(".inDrag");

    $(objInDrag).css({
      left: dd.loc.x - $(objInDrag).width() + "px",
      top: dd.loc.y - $(objInDrag).height() + "px"
    });

    //Check if this object is over a droppable zone
    var elements = document.elementsFromPoint(dd.loc.x, dd.loc.y);
    var identifiedDropZone = null;
    $(elements).each(function(index) {
      if ($(this).hasClass("dropZone") && !$(this).hasClass("disabled")) {
        //make this the active drop zone
        identifiedDropZone = this;
      }
    });

    //If a dropzone has been found, activate it
    if (identifiedDropZone !== null) {
      activateDropZone(identifiedDropZone);
    } else {
      deactivateDropZone();
    }
  }
}

//Activate the drop zone
function activateDropZone(obj) {
  dd.activeDropZone = obj;
  $(obj).addClass("dragObjectOver");
}

//Deactivate it
function deactivateDropZone() {
  dd.activeDropZone = null;
  $(".dragObjectOver").removeClass("dragObjectOver");
}

//The drag and drop library
function tdd(type, obj) {
  if (type === "start") {
    var initPosition = { x: 0, y: 0 };

    //Remove any inDrag that might be available
    $(".inDrag").each(function(index) {
      cancelDrag(obj);
    });

    //Set the drag mode
    dd.dragmode = true;

    //Add the active class to all dropzones that don't already have it
    $(".dragDrop.dropZone:not(.active)").addClass("active");

    //Store the owner of this object
    dd.owner = $(obj).parent();
    console.log("owner: ", dd.owner);

    //Check if the owner has the dynamic pos property
    if (typeof $(dd.owner).attr("data-position") !== typeof undefined) {
      if ($(dd.owner).attr("data-position") === "dynamic") {
        initPosition = $(obj).position();
      }
    }

    //Add the obj drag type
    $(obj).attr("data-dragType", "pointer");

    //Add the original owner to this object
    if (typeof $(obj).attr("data-originalOwner") === typeof undefined) {
      $(obj).attr(
        "data-originalOwner",
        $(obj)
          .parent()
          .attr("id")
      );
    }
    dd.originalOwner = $("#" + $(obj).attr("data-originalOwner"));

    //turn the drag mode of the teslet on
    $(".testlet-player.winsight").addClass("inDragMode");

    //Move this object into the body space
    $(".testlet-player.winsight").append(obj);

    //Start the drag process
    $(obj).addClass("inDrag");

    //Get the offset
    var myOffset = getRealDdOffset(obj);
    var myTransform =
      "translate(" +
      -1 * Math.floor(myOffset.x * myOffset.scale - $(obj).width() / 2) +
      "px," +
      -1 * Math.floor((initPosition.y + myOffset.y) * myOffset.scale - $(obj).height() / 2) +
      "px)";

    $(obj).css({
      transform: myTransform
    });

    moveObject();
    window.dispatchEvent(new CustomEvent("customDragStart", { detail: obj }));
  } else if (type === "move") {
    //Moving the object is done in the listener
  } else if (type === "cancel") {
    //Cancel the drag and return the objects to it's original position
    cancelDrag();
  } else if (type === "end") {
    //End the drag successfully
    endDrop();
  }
}

//Get the offset needed to position the dragged object relative to the position of the testlet
function getRealDdOffset(obj) {
  //Store the original position
  var myOffset = new Object({
    x: 0,
    y: 0,
    scale: 1
  });

  myOffset.x = $(obj).offset().left;
  myOffset.y = $(obj).offset().top;
  myOffset.scale = getScale();

  return myOffset;
}

//Get the scale of the testlet
function getScale() {
  var myScale = 1;
  if (typeof $(".testlet-player.winsight").attr("data-scale") !== typeof undefined) {
    myScale = Number($(".testlet-player.winsight").attr("data-scale"));
  }
  return myScale;
}

//End a drop successfully on a drop zone
function endDrop() {
  var obj = $(".inDrag");

  if (dd.activeDropZone !== null) {
    //first check if this drop-zone accepts groups
    var isDropAllowed = true;
    if (typeof $(dd.activeDropZone).attr("data-acceptGroups") !== typeof undefined) {
      var myAllowedGroups = $(dd.activeDropZone)
        .attr("data-acceptGroups")
        .split(",");

      //Get this drag item's group

      isDropAllowed = false;
      if (typeof obj.attr("data-dragobjectgroup") !== typeof undefined) {
        var myDragGroup = obj.attr("data-dragobjectgroup");

        //Check if this group is in the accepted groups list of the drop zone
        $(myAllowedGroups).each(function(index) {
          console.log("Accept Group: " + myDragGroup + "=" + this);
          if (String(myDragGroup) === String(this)) {
            isDropAllowed = true;
          }
        });
      } else {
        isDropAllowed = false;
      }
    }

    console.log("drag drop: ", isDropAllowed);

    if (isDropAllowed) {
      //Add the object to the drop-zone
      $(dd.activeDropZone).append(obj);

      //Check if the drop zone is allowing this drop, and not exceeding the max
      if ($(dd.activeDropZone).children(".dragDrop.object").length > $(dd.activeDropZone).attr("data-maxdropitems")) {
        //Remove access dropped stuff
        removeDroppedStuff(dd.activeDropZone);
      }

      //Clear the original owner upon a succesfull drop to avoid the object to return there.
      dd.originalOwner = null;
      dd.owner = null;
    } else {
      //Drop the item in the drop-box
      $(dd.originalOwner).append(obj);
      dd.originalOwner = null;
      dd.owner = null;
    }
  } else {
    //Drop the item in the drop-box
    $(dd.originalOwner).append(obj);
    dd.originalOwner = null;
    dd.owner = null;
  }

  //Successfully ended the drag? Clear the object
  cancelDrag(true);
}

//Remove the access dropped content
function removeDroppedStuff(dz) {
  var allowedDS = $(dz).attr("data-maxdropitems");
  $(dz)
    .children(".dragDrop.object")
    .each(function(index) {
      //Remove this item
      dd.originalOwner = $("#" + $(this).attr("data-originalowner"));
      cancelDrag(true, $(this));

      //Check if the amount of remaining items are correct now.
      if ($(dz).children(".dragDrop.object").length <= allowedDS) {
        return false;
      }
    });
}

//Clear the dragged object
var cancelDragEvent = false;

function cancelDrag(returnToOwner, obj) {
  if (!cancelDragEvent) {
    cancelDragEvent = true;
    atTheEndOfDragDropEventStuff($(".inDrag"));
    setTimeout("cancelDragEvent=false", 500);
  }

  if (!obj) {
    var obj = $(".inDrag");
  }

  //Remove the class
  $(".testlet-player.winsight").removeClass("inDragMode");

  //Remove the drag type
  $(obj).removeAttr("data-dragType");

  //remove classes
  $(obj).removeClass("inDrag");
  $(".dragDrop.dropZone.active").removeClass("active");
  $(".dragDrop.dropZone.dragObjectOver").removeClass("dragObjectOver");

  //Clear keyboard support
  dd.kbd.dropzones = [];

  $(obj).addClass("returnToOriginalPosition");

  //turn off the drag mode
  dd.dragmode = false;

  //Does this object need to be returned to its original owner?
  if (dd.originalOwner !== null) {
    $(dd.originalOwner).append(obj);
  }

  //Reset the original owner
  dd.originalOwner = null;

  //Clear all the stuff from the draggable object
  setTimeout("endReturnDragState()", 500);
  $(obj).css("left", "");
  $(obj).css("top", "");
  $(obj).css("transform", "");

  //return a responseString

  if ($(".dragDrop.dropZone:visible").length > 0) {
    var myResponse = generateResponse();
  }

  //Hi Krupali, you can take the response string from here!
  //apiTestlet.saveResponse(myResponse.scoreID, myResponse.string);
}

//Remove the return class from the dragged object
function endReturnDragState() {
  $(".returnToOriginalPosition").removeClass("returnToOriginalPosition");
}

//Generate a response string
var myCancelTime = getNow();

function getNow() {
  var myDdTime = new Date();
  return "" + myDdTime.getFullYear() + myDdTime.getDate() + myDdTime.getHours() + myDdTime.getSeconds();
}

function generateResponse() {
  var myNow = getNow();
  if (myNow !== myCancelTime) {
    //reset myCancelTime
    myCancelTime = myNow;

    //set time
    var scoreOpportunities = new Array(); //Assigning an array for availale score opportunities.

    //Assign the variable for
    var mySO = "";

    $(dd.dropZones).each(function(index) {
      var thisScoreOpp = new Array();

      //What SO does this dropzone connect to?
      thisScoreOpp.push($(this).attr("data-scoreid"));
      thisScoreOpp.push($(this).attr("data-responseid"));

      //Add any input in this placeholder;
      var myContentStr = "";
      if ($(this).find(".dragDrop.object").length > 0) {
        $(this)
          .find(".dragDrop.object")
          .each(function(index2) {
            if (myContentStr.length > 0) {
              myContentStr += ",";
            }
            myContentStr += $(this).attr("data-value");
          });
      }

      thisScoreOpp.push(myContentStr);

      thisScoreOpp.push($(this).attr("data-responseParam"));
      thisScoreOpp.push($(this).attr("data-required"));

      //push this scoreOpp into the the total listed opportunities.
      scoreOpportunities.push(thisScoreOpp);
    });

    //Report the score opportunities

    $(scoreOpportunities).each(function(index) {
      console.log(this);
      //Store the response string
      apiTestlet.saveResponse(this[0], this[1], this[2]);
      //Store the response string
      apiTestlet.saveLog(this[1], this[2]);
      //Store the response string
      apiTestlet.saveState(this[1], this[2]);

      //Next button Enable/Disable
      if (this[4] === "true") {
        if (this[2].value !== "" && this[2].length > 0) {
          apiTestlet.removeRequired(this[3]);
        } else {
          apiTestlet.addRequired(this[3]);
        }
      }
    });
  }
}

//Run at the successful end of the drag interaction
function atTheEndOfDragDropEventStuff(obj) {
  customDrag(obj);
}
