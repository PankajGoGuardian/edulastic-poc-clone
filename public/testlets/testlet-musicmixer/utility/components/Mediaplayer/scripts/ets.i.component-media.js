(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /* *****************Create Media Player Component***************** */
  object.ETS.i.component.mediaplayer = function(obj) {
    console.log("Create Media Player...");
    console.log(obj);

    var str = "";

    /* Map all the ids for params.json */
    var mediaId = obj.identity.id + "-media";
    var interactiveMedia = obj.identity.id + "-player";
    var responseId = idMapContent(obj.identity.responseId);
    var scoreId = idMapContent(obj.identity.scoreID);
    var options = obj.properties.options;
    tabMedia = obj.properties.tabindex;

    /* Build the media player */
    $("#" + obj.identity.id).html(
      '<div class="media-wrapper video-div ' +
        obj.properties.class +
        '" id="' +
        interactiveMedia +
        '" tabindex="' +
        obj.properties.tabindex +
        '"></div>'
    );
    var mediaDiv = $("#interactive-media-player");

    /* Initialize the media create function and declare the path and values */
    createClipMedia = function(type, mediaConfig, clipArray, regionAddClickHandler, textConfig) {
      var that = this;
      if (type == "audio") {
        mediaConfig.src = "assets/aud/" + mediaConfig.src;
      } else if (type == "video") {
        mediaConfig.src = "assets/vid/" + mediaConfig.src;
        mediaConfig.poster = "assets/img/" + mediaConfig.poster;
        mediaConfig.track = "assets/vid/" + mediaConfig.track;
      }
      var mediaWrapper = new MediaWrapper(
        type,
        "media-container sis-media-wrapper sis-" + type + "-wrapper",
        mediaConfig,
        clipArray,
        regionAddClickHandler,
        textConfig
      );
      var $media = $(mediaWrapper).find(type);
      var mediaDOM = $media.get(0);
      //Save Logs
      //can add it to show timestamps
      /*$media.on("timeupdate", function () {
    console.log(responseId);
    apiTestlet.saveState(responseId, mediaDOM.currentTime);
});*/

      $media.on("play", function() {
        if (this.currentTime == "0") {
          $("#" + interactiveMedia).attr("ended", "false");
        } else {
          $("#" + interactiveMedia).attr("ended", "true");
        }

        /*var srcArr = this.currentSrc.split("/");
apiTestlet.saveLog(responseId, srcArr[srcArr.length - 1]);*/
        apiTestlet.saveLog(responseId, this.currentTime);
        apiTestlet.saveResponse(scoreId, responseId, this.currentTime);
        apiTestlet.saveState(responseId, this.currentTime);
        window.dispatchEvent(
          new CustomEvent("media_play", {
            detail: {
              target: this
            }
          })
        );
      });

      $media.on("pause", function() {
        if (mediaDOM.currentTime >= mediaDOM.duration) {
          apiTestlet.saveState(responseId, "ended");
          apiTestlet.saveResponse(scoreId, responseId, "ended");
        } else {
          var srcArr = this.currentSrc.split("/");
          apiTestlet.saveLog(responseId, this.currentTime);
          apiTestlet.saveResponse(scoreId, responseId, this.currentTime);
          apiTestlet.saveState(responseId, this.currentTime);
        }
        window.dispatchEvent(
          new CustomEvent("media_stop", {
            detail: {
              target: this
            }
          })
        );
      });

      $media.on("ended", function() {
        $("#" + interactiveMedia).attr("ended", "true");
        apiTestlet.saveState(responseId, "ended");
        window.dispatchEvent(
          new CustomEvent("media_ended", {
            detail: {
              target: this
            }
          })
        );
        $(options).each(function(index) {
          autoRewind = idMapContent(this.autorewind);
          //If autorewind is true set the start time to 0
          if (autoRewind == "true") {
            var MediaPlayer = document.getElementById(obj.identity.id + "-player");
            MediaPlayer.removeChild(MediaPlayer.childNodes[0]);
            MediaCreated();
          } else if (autoRewind == "false") {
            return false;
          }
        });
      });

      $media.on("loadeddata", function() {
        window.dispatchEvent(
          new CustomEvent("media_loaded", {
            detail: {
              target: this
            }
          })
        );
      });

      //Can add it for scrubber logs
      /*$media.on("seeked", function () {
                var srcArr = this.currentSrc.split("/");
                apiTestlet.saveLog("from", mediaDOM.seekStart || 0);
                apiTestlet.saveLog("to", this.currentTime);
                mediaDOM.seekStart = null;
            });*/

      return mediaWrapper;
    };

    /* Declaring the createMedia from ets-clipmedia.js */
    createMedia = function(type, mediaConfig, textConfig) {
      var mediaWrapper = this.createClipMedia(type, mediaConfig, [], null, textConfig);
      return mediaWrapper;
    };
    MediaCreated();

    /* Create the player */
    function MediaCreated() {
      $(document).ready(function() {
        $(options).each(function(index) {
          /* Check if the type is audio or video*/
          if (idMapContent(this.type) == "video/mp4") {
            var mediaWrapper = createMedia(
              "video",
              {
                id: mediaId,
                src: idMapContent(this.src),
                type: idMapContent(this.type),
                playedOnce: idMapContent(this.flow),
                autoplay: idMapContent(this.autoplay),
                poster: idMapContent(this.posterImage),
                track: idMapContent(this.vtt),
                //                        height: idMapContent(this.videoHeight),
                fullscreen: idMapContent(this.fullscreen),
                audiocontrol: idMapContent(this.audio),
                longdesc: "#mediaLongdesc",
                captionOn: true
              },
              {
                play: "Play",
                pause: "Pause",
                captions: "Closed Captions",
                captionsOff: "Closed Captions",
                fullscreen: "Full screen",
                fullscreenOff: "Exit&nbsp;full&nbspscreen"
              }
            );

            document.getElementById(interactiveMedia).appendChild(mediaWrapper);
          } else if (idMapContent(this.type) == "audio/mp3") {
            var mediaWrapper = createMedia(
              "audio",
              {
                id: mediaId,
                src: idMapContent(this.src),
                type: idMapContent(this.type),
                playedOnce: idMapContent(this.flow),
                autoplay: idMapContent(this.autoplay),
                height: idMapContent(this.videoHeight)
              },
              {
                play: "Play",
                pause: "Pause",
                mute: "Mute",
                unmute: "Unmute"
              }
            );

            document.getElementById(interactiveMedia).appendChild(mediaWrapper);
          }
        });
      });
    }
    /*Handle volume property */
    /*$(options).each(function (index) {
    if (idMapContent(this.audio) == "false") {
        $('.media-volume-container').addClass("hidden");
    }
});*/

    /* Add the short description div if media type is video*/
    $(options).each(function(index) {
      if (
        idMapContent(this.type) == "video/mp4" &&
        idMapContent(this.shortDescription) != "" &&
        idMapContent(this.shortDescription) != null
      ) {
        str += '<div class="description" id="mediaShortdesc">' + idMapContent(this.shortDescription) + "</div>";
      }
    });

    /* Add the long description div if media type is video*/
    $(options).each(function(index) {
      if (
        idMapContent(this.type) == "video/mp4" &&
        idMapContent(this.longDescription) != "" &&
        idMapContent(this.longDescription) != null
      ) {
        str += '<div class="description" id="mediaLongdesc">' + idMapContent(this.longDescription) + "</div>";
      }
    });

    $(mediaDiv).html(str);

    /* Add the width to the wrapper */
    $(options).each(function(index) {
      var objWidth = idMapContent(this.width);
      $("#" + interactiveMedia).css("width", objWidth);
    });
    /*Print some values to the consoler */
    cPrint("system", "component", "This is a Media player component");
    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);
  };
})(this);
