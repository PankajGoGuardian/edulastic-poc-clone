(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Text-field Component******************/

  // object.ETS.i.component.iic2 = function (obj) {
  //   iicItemArr.push(obj);
  //   $.get(obj.properties.reference, function (data) {
  //     $('#' + obj.identity.id).html($(data));
  //   });
  //
  //
  //
  // }

  object.ETS.i.component.iic = function(obj) {
    // currentObj = obj;
    iicItemArr.push(obj);
    // console.log("in iic2, currentObj.accnum==="+currentObj.accnum)
    let linkSrc = obj.properties.reference + obj.properties.file;
    let iframeId = obj.identity.id + "_iic";
    let w = obj.properties.width;
    let h = obj.properties.height;
    let str =
      '<iframe scrolling="no" id="' +
      iframeId +
      '" width="' +
      w +
      '" height="' +
      h +
      '" frameborder="0" src="' +
      linkSrc +
      '"></iframe>';
    $("#" + obj.identity.id).html(str);

    // window.initialize = function(apiHandler) {
    // IIC = apiHandler;

    // let responseId = obj.responseId;
    // let accnum = obj.accnum || "10000";

    // testn++;
    // console.log("testn==="+testn)
    // console.log("IIC accnum==="+accnum)
    // console.log("obj.id==="+obj.id)
    // var initParam = '<params><requestId>'+responseId+'</requestId><taskId>'+accnum+'</taskId><colorTheme>default</colorTheme></params>';

    // IIC.InitializeSetting_Request(initParam);
    // iicName = IIC.identifier;
    // console.log("IIC name==="+IIC.identifier)

    // }
  };
  /*
    object.LinePointFoodAndSpaceInit = function () {
      if ((testlet2.currentScene.sequence.indexOf(testlet2.currentSequence) + 1) == 6) {
        document.getElementById("iFrameTotalFoodAndSpace").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
          type: "unlockRadio",
          message: 2
        });
      }
      else if ((testlet2.currentScene.sequence.indexOf(testlet2.currentSequence) + 1) == 9) {

        document.getElementById("iFrameTotalFoodAndSpace").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
          type: "colorRadio",
          message: {
            id: 2,
            color: "#666"
          }
        });
        document.getElementById("iFrameTotalFoodAndSpace").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
          type: "colorRadio",
          message: {
            id: 1,
            color: "#666"
          }
        });

        if (($("#totalFood1_txt").val() == "75") && ($("#totalFood2_txt").val() == "90") && ($("#totalFood3_txt").val() == "105")){
          $("#divTotalFoodandSpaceTrue").show();
          $("#divTotalFoodandSpaceFalse").hide();

          document.getElementById("iFrameTotalFoodAndSpace").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
            type: "lockRadio",
            message: 2
          });
          document.getElementById("iFrameTotalFoodAndSpace").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
            type: "selectRadio",
            message: 0
          });
        }
        else{
          $("#divTotalFoodandSpaceTrue").hide();
          $("#divTotalFoodandSpaceFalse").show();

          document.getElementById("iFrameTotalFoodAndSpace").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
            type: "lockRadio",
            message: 2
          });
          document.getElementById("iFrameTotalFoodAndSpace").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
            type: "hideRadio",
            message: 1
          });
          document.getElementById("iFrameTotalFoodAndSpace").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
            type: "showRadio",
            message: 2
          });

          document.getElementById("iFrameTotalFoodAndSpace").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
            type: "selectRadio",
            message: 1
          });
        }
      }
    }

    object.LinePointEquation = function () {

      if ((testlet2.currentScene.sequence.indexOf(testlet2.currentSequence) + 1) == 2) {
        document.getElementById("iFrameEquation").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
          type: "unlockRadio",
          message: 1
        });
      }
      else if ((testlet2.currentScene.sequence.indexOf(testlet2.currentSequence) + 1) == 4) {
        document.getElementById("iFrameEquation").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
          type: "showRadio",
          message: 2
        });

        document.getElementById("iFrameEquation").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
          type: "hideRadio",
          message: 0
        });

        document.getElementById("iFrameEquation").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
          type: "hideRadio",
          message: 1
        });

        document.getElementById("iFrameEquation").contentWindow.ETS.i.linePointGraph.prototype.sendMessageToIIC({
          type: "selectRadio",
          message: 2
        });
      }
    }
*/
})(this);
