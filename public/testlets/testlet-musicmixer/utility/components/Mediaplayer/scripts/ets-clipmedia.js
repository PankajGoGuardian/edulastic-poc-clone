/* Declaring this variable to check the tabindex of parent*/
var tabMedia = "",
  autoRewind = "";

/* util function */
function stopMedia() {
  $.each($("video"), function(index, video) {
    video.pause();
  });
  $.each($("audio"), function(index, video) {
    video.pause();
  });
}

/*Format time values */
function formatTime(timeVal) {
  var seconds = Math.floor(timeVal),
    minutes = Math.floor(timeVal / 60);
  seconds = Math.floor(seconds % 60);
  seconds = seconds >= 10 ? seconds : "0" + seconds;
  return minutes + ":" + seconds;
}

/* Build the media player */
function MediaWrapper(type, className, mediaConfig, mediaIntervals, regionAddClickHandler, textConfig) {
  var mediaContainer = document.createElement("figure");
  mediaContainer.className = className;
  /*set the config for language change*/
  mediaContainer.textConfig = textConfig;
  mediaContainer.trackConfig = mediaConfig.track;

  var mediaDiv = document.createElement("div");
  mediaDiv.className = "media-wrapper " + type + "-div";

  var media = MediaWrapper.createMedia(type, mediaConfig);
  $(media).on("loadedmetadata", function() {
    /* Build media controls, properties have been declared in ets.i.media.js */
    var clippedMedia = new ClippedMedia(this, type, 0, this.duration, true);
    var clippedMediaControl = new MediaControl(
      clippedMedia,
      mediaContainer,
      {
        showSelection: !!mediaIntervals.length,
        showCaptionButton: !!mediaContainer.trackConfig,
        trackConfig: mediaContainer.trackConfig,
        playedOnce: mediaConfig.playedOnce,
        autoplay: mediaConfig.autoplay,
        fullscreen: mediaConfig.fullscreen,
        audiocontrol: mediaConfig.audiocontrol,
        captionOn: mediaConfig.captionOn
      },
      mediaContainer.textConfig
    );
    mediaContainer.appendChild(clippedMediaControl);

    media.dispatchEvent(new Event("mediaControlCreated"));
    var mediaProgressContainer = $(mediaContainer)
      .find(".media-progress-container")
      .get(0);
    if (mediaIntervals.length) {
      // activeCurrentTab(true);
      var $mediaProgress = $(clippedMediaControl).find(".media-progress");
      var mediaProgress = $mediaProgress.get(0);
      var mediaDuration = this.duration;

      var lastPlayButtonForRegion = null;
      $.each(mediaIntervals, function(idx, mediaInterval) {
        var mediaStart = mediaInterval["data-start"];
        var mediaEnd = mediaInterval["data-end"];
        var width = "calc(" + ((mediaEnd - mediaStart) * 100) / mediaDuration + "%)";
        var left = "calc(" + (mediaStart * 100) / mediaDuration + "%)";

        /* medai intervals */
        var clipRegion = new ClipRegion(
          width,
          left,
          top,
          idx + 1 + "",
          mediaInterval["data-title"],
          formatTime(mediaStart + "") + " - " + formatTime(mediaEnd + ""),
          mediaInterval["data-added"]
        );
        for (var attr in mediaInterval) {
          //copy attributes
          if (attr != "start" || attr != "end" || attr != "id") {
            clipRegion.addButton.setAttribute(attr, mediaInterval[attr]);
          } else if (attr == "id") {
            clipRegion.addButton.id = mediaInterval[attr];
          }
        }

        /* Add button while clicking on the clipped region*/
        clipRegion.addButton.onclick = function(e) {
          regionAddClickHandler.call(this, media, mediaStart, mediaEnd);
          e.stopPropagation();
        };

        /* Events for play/pause button */
        clipRegion.playButton.onclick = function(e) {
          var playButton = this;
          if (media.timeupdateHandler !== null) {
            $(media).off("timeupdate", media.timeupdateHandler);
          }
          var timeupdateHandlerForRegion = function() {
            if (this.currentTime >= mediaEnd) {
              this.pause();
              $(playButton)
                .removeClass("icon-pause")
                .addClass("icon-play");
            }
          };

          /* time handler */
          $(media).on("timeupdate", timeupdateHandlerForRegion);
          media.timeupdateHandler = timeupdateHandlerForRegion;
          if (media.paused) {
            stopMedia();
            if (media.currentTime <= mediaStart || media.currentTime >= mediaEnd) {
              media.currentTime = mediaStart;
            }
            $(playButton)
              .removeClass("icon-play")
              .addClass("icon-pause");
            media.play();
          } else {
            if (media.currentTime <= mediaStart || media.currentTime >= mediaEnd) {
              media.pause();
              media.currentTime = mediaStart;
              media.play();
              setTimeout(function() {
                $(playButton)
                  .removeClass("icon-play")
                  .addClass("icon-pause");
              }, 0);
            } else {
              media.pause();
            }
          }
          lastPlayButtonForRegion = this;
          e.stopPropagation();
        };
        $(media).on("pause", function() {
          $(clipRegion.playButton)
            .removeClass("icon-pause")
            .addClass("icon-play");
        });

        /* Add the clipped region to the progressbar container */
        mediaProgressContainer.appendChild(clipRegion.region);
      });
    }
  });
  mediaDiv.appendChild(media);

  mediaContainer.appendChild(mediaDiv);
  return mediaContainer;
}

/* Initiate the media player */
MediaWrapper.createMedia = function(type, mediaConfig) {
  var media = document.createElement(type);
  media.id = mediaConfig.id;
  media.className = "media";
  media.preload = true;
  //    media.style.height = mediaConfig.height;
  media.setAttribute("longdesc", mediaConfig.longdesc);
  media.controls = false;

  var mediaSource = document.createElement("source");
  mediaSource.src = mediaConfig.src;
  mediaSource.type = mediaConfig.type;
  media.appendChild(mediaSource);
  if (mediaConfig.poster) {
    media.poster = mediaConfig.poster;
  }
  return media;
};

/* Create the caption file for video */
MediaWrapper.createTrack = function(src, srclang, label, kind, isDefault) {
  var track = document.createElement("track");
  track.src = src;
  track.srclang = srclang;
  track.label = label;
  track.kind = kind;
  if (isDefault) {
    track.default = "";
  }
  return track;
};

/* Create the media wrapper */
function ClippedMediaWrapper(type, className, media, start, end, idExtension, textConfig) {
  var mediaContainer = document.createElement("figure");
  mediaContainer.className = className;

  var mediaDiv = document.createElement("div");
  mediaDiv.className = "media-wrapper";

  var clippedMedia = new ClippedMedia(media, type, start, end, false, idExtension);
  $(clippedMedia.mediaDOM).on("loadedmetadata", function() {
    mediaDiv.appendChild(clippedMedia.mediaDOM);
    var mediaControl = new MediaControl(
      clippedMedia,
      mediaContainer,
      {
        isMiniVersion: true
      },
      textConfig
    );
    mediaContainer.appendChild(mediaControl);
    mediaContainer.dispatchEvent(new Event("clippedMediaCreated"));
  });

  mediaContainer.appendChild(mediaDiv);
  return mediaContainer;
}

function ClippedMedia(media, type, start, end, isSource, idExtension) {
  this.media = media;
  this.type = type;
  this.start = start;
  this.end = end;
  this.duration = end - start;
  this.isSource = isSource;
  this.ended = false;
  this.mediaDOM = this.isSource ? this.media : this.create(idExtension);
}

ClippedMedia.prototype.create = function(idExtension) {
  var clippedMedia = this.media.cloneNode(true),
    that = this;
  clippedMedia.id = clippedMedia.id + idExtension;
  clippedMedia.removeAttribute("poster");
  clippedMedia.controls = false;
  clippedMedia.onloadedmetadata = function() {
    this.currentTime = that.start;
  };
  return clippedMedia;
};

/* Media control function  */
function MediaControl(clippedMedia, mediaContainer, config, textConfig) {
  var config = config || {};
  this.clippedMedia = clippedMedia;
  this.mediaContainer = mediaContainer;
  this.media = this.clippedMedia.mediaDOM;
  this.showSelection = config.showSelection;
  this.textConfig = textConfig || {};
  this.autoplay = config.autoplay;
  this.captionOn = config.captionOn;
  this.trackConfig = config.trackConfig;
  this.fullscreen = config.fullscreen;
  this.audiocontrol = config.audiocontrol;

  this.timeText = this.createTimeText(); //bind timeupdate event first
  this.progressBar = this.createProgressBar();
  this.playPauseButton = this.createPlayPauseButton();
  if (!config.isMiniVersion) {
    this.volumeContainer = this.createVolumeControl();

    if (config.showCaptionButton && this.clippedMedia.type === "video") {
      this.captionButton = this.createCaptionButton();
    }

    this.fullScreenEnabled = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled ||
      document.createElement("video").webkitRequestFullscreen ||
      document.createElement("video").mozRequestFullScreen
    );
    if (
      this.fullscreen == "true" &&
      this.clippedMedia.type === "video" &&
      !this.showSelection &&
      this.fullScreenEnabled
    ) {
      this.fullscreenButton = this.createFullscreenButton();
      if (window.frameElement) {
        window.frameElement.setAttribute("allowfullscreen", true);
        window.frameElement.setAttribute("webkitallowfullscreen", true);
        window.frameElement.setAttribute("mozallowfullscreen", true);
      }
    }
  }

  /* For regular media player: first time disable seek */
  this.media.playedOnce = config.playedOnce || this.showSelection || config.isMiniVersion;
  if (this.autoplay == "true") {
    this.media.autoplay = config.autoplay;
  }

  this.mediaControls = this.create(config);
  return this.mediaControls;
}

/* Initiate the media controls */
MediaControl.prototype.create = function(config) {
  var mediaControls = document.createElement("div");
  mediaControls.className = "media-controls";

  /* Left side media controls*/
  var leftDiv = document.createElement("div");
  leftDiv.className = "media-left-controls";
  leftDiv.appendChild(this.playPauseButton);
  leftDiv.appendChild(this.tooltipPlay);
  leftDiv.appendChild(this.timeText);
  mediaControls.appendChild(leftDiv);

  if (!config.isMiniVersion) {
    var rightDiv = document.createElement("div");
    rightDiv.className = "media-right-controls";

    /* Right side media controls */
    rightDiv.appendChild(this.muteButton);
    rightDiv.appendChild(this.volumeContainer);
    this.captionButton && rightDiv.appendChild(this.captionButton);
    this.fullscreenButton && rightDiv.appendChild(this.fullscreenButton);

    rightDiv.appendChild(this.tooltipMute);
    this.tooltipCC && rightDiv.appendChild(this.tooltipCC);
    this.tooltipFS && rightDiv.appendChild(this.tooltipFS);
    mediaControls.appendChild(rightDiv);
  }

  if (this.showSelection) {
    mediaControls.classList.add("media-sis-variant");
    $(mediaControls).append(this.progressBar);
  } else {
    $(mediaControls).prepend(this.progressBar);
  }
  return mediaControls;
};

/* Create play/pause button */
MediaControl.prototype.createPlayPauseButton = function() {
  var that = this;
  var $media = $(that.media);
  /* play button */
  var playButton = document.createElement("button");
  playButton.className = "media-btn media-btn-playpause icon-play";
  playButton.setAttribute("role", "button");
  playButton.setAttribute("aria-label", "play/pauseButton");
  playButton.setAttribute("aria-pressed", "false");
  if (tabMedia == "-1") {
    playButton.setAttribute("tabindex", "-1");
  } else {
    playButton.tabindex = 0;
  }

  var tooltip = document.createElement("span");
  tooltip.className = "media-tooltip media-btn-playpause-tooltip";
  tooltip.innerHTML = that.textConfig.play || "Play";
  this.tooltipPlay = tooltip;

  var playPause = function() {
    if (that.media.timeupdateHandler != null) {
      $media.off("timeupdate", that.media.timeupdateHandler);
      that.media.timeupdateHandler = null;
    }
    that.media.playedOnce = that.media.playedOnce || that.clippedMedia.ended || that.media.ended;

    /* Events for the state of the media */
    if (that.clippedMedia.ended) {
      stopMedia();
      that.media.currentTime = that.clippedMedia.start;
      that.clippedMedia.ended = false;
      that.media.play();
    } else if (that.media.paused || that.media.ended) {
      stopMedia();
      that.clippedMedia.ended = false;
      that.media.play();
    } else {
      that.media.pause();
    }
    if (that.media.autoplay == "true") {
      that.media.play();
    }
  };

  playButton.onclick = playPause;

  /* Create big play button in the center of the video */
  var heroplay = null;
  if (this.clippedMedia.type === "video") {
    heroplay = document.createElement("button");
    heroplay.className = "media-btn media-hero-play";
    heroplay.setAttribute("role", "button");
    heroplay.setAttribute("aria-label", "heroPlay");
    heroplay.setAttribute("aria-pressed", "false");
    heroplay.addEventListener("click", playPause, false);
    that.media.addEventListener("click", playPause, false);
    $(this.media.parentNode)
      .find(".media-hero-play")
      .remove();
    if (tabMedia == "-1") {
      heroplay.setAttribute("tabindex", "-1");
    }
    this.media.parentNode.appendChild(heroplay);
  }
  that.heroplay = heroplay;

  /* Events for the hero button */
  $media.on("play", function() {
    playButton.classList.remove("icon-play");
    playButton.classList.add("icon-pause");
    tooltip.innerHTML = that.textConfig.pause || "Pause";
    heroplay && heroplay.classList.add("paused");
  });
  $media.on("pause", function() {
    playButton.classList.remove("icon-pause");
    playButton.classList.add("icon-play");
    tooltip.innerHTML = that.textConfig.play || "Play";
    //        heroplay && heroplay.classList.remove('paused');
  });
  var timeupdateHandler = function(media) {
    if (media.currentTime >= that.clippedMedia.end) {
      media.pause();
      that.clippedMedia.ended = true;
      //If autorewind is true then set the start time to 0
      if (autoRewind == "true") {
        media.currentTime = that.clippedMedia.start || "0";
      }
    }
  };
  $media.on("timeupdate", function() {
    timeupdateHandler(this);
  });
  that.media.timeupdateHandler = timeupdateHandler;
  return playButton;
};

/* Create time stamps */
MediaControl.prototype.createTimeText = function() {
  var that = this;
  /* time */
  var timeText = document.createElement("span");
  timeText.className = "media-time-display";

  var timeCurrent = document.createElement("span");
  timeCurrent.className = "media-time-current";
  timeCurrent.textContent = "0:00";
  that.timeCurrent = timeCurrent;

  var split = document.createElement("span");
  split.textContent = "/";

  var timeDuration = document.createElement("span");
  timeDuration.className = "media-time-duration";
  timeDuration.textContent = formatTime(that.clippedMedia.duration + "");
  that.timeDuration = timeDuration;

  timeText.appendChild(timeCurrent);
  timeText.appendChild(split);
  timeText.appendChild(timeDuration);

  $(that.media).on("timeupdate", function() {
    var passed = parseInt(this.currentTime - that.clippedMedia.start) || 0;
    passed = passed < 0 ? 0 : passed;
    timeCurrent.textContent = formatTime(passed + "");
  });
  return timeText;
};

/* Create Scrubber for audio/video player */
MediaControl.prototype.createProgressBar = function() {
  var that = this;
  /* progress bar container */
  var progressContainerOuter = document.createElement("div");
  progressContainerOuter.className = "media-progress-container-outer";
  progressContainerOuter.setAttribute("role", "slider");

  var progressContainer = document.createElement("div");
  progressContainer.className = "media-progress-container slider-container";

  /* progress bar hover */
  var hover = document.createElement("div");
  hover.className = "media-hover hidden";

  /* progress bar */
  var progress = document.createElement("progress");
  progress.className = "media-progress";
  progress.value = 0;
  progress.max = that.clippedMedia.duration;

  /* progress bar seek */
  var seek = document.createElement("input");
  seek.className = "media-seek";
  seek.type = "range";
  seek.min = 0;
  seek.max = that.clippedMedia.duration;
  seek.step = 0.1;
  seek.value = 0;
  if (tabMedia == "-1") {
    seek.setAttribute("tabindex", "-1");
  }

  /* tooltips */
  var tooltipSeek = document.createElement("div");
  tooltipSeek.className = "media-tooltip media-tooltip-seek hidden";
  tooltipSeek.textContent = "0:00";

  progressContainer.appendChild(hover);
  progressContainer.appendChild(progress);
  progressContainer.appendChild(seek);

  seek.oninput = function() {
    var seekTemp = that.clippedMedia.start + parseFloat(this.value);
    if (that.media.playedOnce == "true" && seekTemp > progress.value) {
      this.value = that.media.currentTime - that.clippedMedia.start;
      return;
    }
    /* For media selection scrub */
    if (!that.media.clippedMediaStart) {
      that.media.clippedMediaStart = that.clippedMedia.start;
    }
    if (!that.media.seekStart) {
      that.media.seekStart = that.media.currentTime;
    }
    that.media.currentTime = seekTemp;
    if (that.media.currentTime < that.clippedMedia.end) {
      that.clippedMedia.ended = false;
    }
  };

  /* Change seek and progress bar positions and current time as video plays */
  that.media.addEventListener(
    "timeupdate",
    function() {
      seek.value = parseFloat(this.currentTime - that.clippedMedia.start) || 0;
      if (seek.value >= progress.value) {
        progress.value = seek.value;
      }
      /* Leaving the below code for future tweaks*/
      // timeCurrent.innerHTML = formatTime(that.media.currentTime);
      // that.timeText.textContent = formatTime(this.currentTime + "") + "/" + formatTime(seek.max + "");
    },
    false
  );

  /*  Show tooltip and hover progress on mouseover */
  progressContainer.addEventListener("mouseover", function(e) {
    if ($(this).hasClass("disabled")) return;
    hover.classList.remove("hidden");
    tooltipSeek.classList.remove("hidden");
  });

  /* Position tooltip and set width of hover progress on mousemove within progress container */
  progressContainer.addEventListener("mousemove", function(e) {
    var mouseX = event.clientX,
      left = progressContainer.getBoundingClientRect().left,
      width = progressContainer.getBoundingClientRect().width,
      percent = (mouseX - left) / width,
      tooltipPercent = percent * 0.96 * 100, //accounts for progress bar margins
      hoverVal;
    hover.style.transform = "scaleX(" + percent + ")";
    if (percent > 1) {
      percent = 1;
      hover.style.transform = "scaleX(" + 1 + ")";
    } else if (percent < 0) {
      percent = 0;
      hover.style.transform = "scaleX(" + 0 + ")";
    }
    hoverVal = formatTime(that.clippedMedia.duration * percent);
    if (tooltipPercent <= 94.6 && tooltipPercent >= 0.96) {
      tooltipSeek.style.left = "calc(0.5em + " + tooltipPercent + "%)";
    } else if (tooltipPercent < 0.96) {
      tooltipSeek.style.left = "2.4%";
    } else {
      tooltipSeek.style.left = "96%";
    }
    tooltipSeek.innerHTML = hoverVal;
  });
  /* Hide tooltip and hover progress on mouseout */
  progressContainer.addEventListener("mouseout", function(e) {
    hover.classList.add("hidden");
    tooltipSeek.classList.add("hidden");
  });
  progressContainer.addEventListener("mousedown", function(e) {
    seek.classList.add("hover");
  });

  /* De-scale seek bar on mouse-up */
  progressContainer.addEventListener("mouseup", function(e) {
    seek.classList.remove("hover");
  });

  progressContainerOuter.appendChild(progressContainer);
  progressContainerOuter.appendChild(tooltipSeek);

  return progressContainerOuter;
};

/* Create the volume control button */
MediaControl.prototype.createVolumeControl = function() {
  var that = this;

  /* mute button */
  var muteButton = document.createElement("button");
  muteButton.className = "media-btn media-btn-mute icon-volume-up";
  if (tabMedia == "-1") {
    muteButton.setAttribute("tabindex", "-1");
  }
  if (this.audiocontrol == "false") {
    muteButton.classList.add("hidden");
  }

  var tooltipMute = document.createElement("span");
  tooltipMute.className = "media-tooltip media-btn-mute-tooltip";
  tooltipMute.innerHTML = that.textConfig.mute || "Mute";
  that.tooltipMute = tooltipMute;

  muteButton.onclick = function() {
    var muted = that.media.muted;
    var volValue = that.media.volume * 100;

    /* Conditions on mute */
    if (muted && volValue == 0) {
      that.media.volume = 1;
      volumeInput.value = 100;
      this.classList.remove("icon-volume-mute");
      this.classList.add("icon-volume-up");
      tooltipMute.innerHTML = that.textConfig.mute || "Mute";
    } else if (muted && volValue > 0 && volValue < 51) {
      volumeInput.value = volValue;
      this.classList.remove("icon-volume-mute");
      this.classList.add("icon-volume-down");
      tooltipMute.innerHTML = that.textConfig.mute || "Mute";
    } else if (muted && volValue >= 51) {
      volumeInput.value = volValue;
      this.classList.remove("icon-volume-mute");
      this.classList.add("icon-volume-up");
      tooltipMute.innerHTML = that.textConfig.mute || "Mute";
    } else {
      volumeInput.value = 0;
      this.classList.remove("icon-volume-down");
      this.classList.remove("icon-volume-up");
      this.classList.add("icon-volume-mute");
      tooltipMute.innerHTML = that.textConfig.unmute || "Unmute";
    }
    volumeProgress.value = volumeInput.value;
    that.media.volumeEnd = volumeInput.value;
    that.media.muted = !that.media.muted;
  };
  that.muteButton = muteButton;

  var volumeContainer = document.createElement("div");
  volumeContainer.className = "media-volume-container slider-container";
  if (this.audiocontrol == "false") {
    volumeContainer.classList.add("hidden");
  }

  /* Create progress */
  var volumeProgress = document.createElement("progress");
  volumeProgress.className = "media-volume-progress";
  volumeProgress.min = 0;
  volumeProgress.max = 100;
  volumeProgress.value = that.media.volume * 100;
  volumeProgress.step = 1;
  that.volumeProgress = volumeProgress;
  volumeContainer.appendChild(volumeProgress);

  /* volume progress bar/scrubber */
  var volumeInput = document.createElement("input");
  volumeInput.className = "media-btn media-volume";
  volumeInput.type = "range";
  volumeInput.min = 0;
  volumeInput.max = 100;
  volumeInput.value = that.media.volume * 100;
  volumeInput.step = 1;
  if (tabMedia == "-1") {
    volumeInput.setAttribute("tabindex", "-1");
  }
  that.media.volumeStart = volumeInput.value;

  volumeInput.oninput = function() {
    that.media.volumeEnd = this.value;

    if (this.value == 0) {
      $(muteButton)
        .removeClass("icon-volume-up icon-volume-down")
        .addClass("icon-volume-mute");
      tooltipMute.innerHTML = that.textConfig.unmute || "Unmute";
    } else if (this.value <= 50) {
      $(muteButton)
        .removeClass("icon-volume-up icon-volume-mute")
        .addClass("icon-volume-down");
      tooltipMute.innerHTML = that.textConfig.mute || "Mute";
    } else {
      $(muteButton)
        .removeClass("icon-volume-mute icon-volume-down")
        .addClass("icon-volume-up");
      tooltipMute.innerHTML = that.textConfig.mute || "Mute";
    }
    that.media.volume = this.value / 100;
    that.media.muted = that.media.volume == 0;
    volumeProgress.value = this.value;
  };
  /* Scale seek bar on mouse down */
  volumeInput.addEventListener("mousedown", function(e) {
    volumeInput.classList.add("hover");
  });

  /* De-scale seek bar on mouse-up */
  volumeInput.addEventListener("mouseup", function(e) {
    volumeInput.classList.remove("hover");
  });
  this.volumeInput = volumeInput;
  volumeContainer.appendChild(volumeInput);

  return volumeContainer;
};

/* Create the caption button for videos */
MediaControl.prototype.createCaptionButton = function() {
  var that = this;
  var captionButton = document.createElement("button");
  captionButton.className = "media-btn media-btn-cc icon-cc-off hidden";
  if (tabMedia == "-1") {
    captionButton.setAttribute("tabindex", "-1");
  }
  //    captionButton.addClass("hidden");
  captionButton.setAttribute("data-state", "inactive");

  var tooltip = document.createElement("span");
  tooltip.className = "media-tooltip media-btn-cc-tooltip";
  tooltip.innerHTML = that.textConfig.captions || "Open Captions";
  this.tooltipCC = tooltip;

  /* Create track */
  $(that.media)
    .find("track")
    .remove();
  var trackArray = that.trackConfig.split(",");
  var track = MediaWrapper.createTrack(
    (trackArray[0] || "").trim(),
    (trackArray[1] || "").trim(),
    (trackArray[2] || "").trim(),
    "subtitles",
    true
  );
  track.addEventListener("load", function() {
    that.media.textTracks[0].mode = "hidden";
    setCues(that.media.textTracks[0].cues);
  });
  that.media.appendChild(track);
  that.media.textTracks[0].mode = "showing";

  /* Track wrapper */
  var customTrackWrapper = document.createElement("div");
  customTrackWrapper.className = "media-custom-track-wrapper hidden";
  var customTrack = document.createElement("span");
  customTrack.className = "media-custom-track";
  customTrackWrapper.appendChild(customTrack);
  $(that.media.parentNode)
    .find(".media-custom-track-wrapper")
    .remove();
  that.media.parentNode.appendChild(customTrackWrapper);

  var cueEnter = function() {
    var string = this.text.replace(/(\r\n|\r|\n)/g, "&#160;<br/>&#160;");
    customTrack.innerHTML = "&#160;" + string + "&#160;";
    customTrack.classList.remove("hidden");
  };
  var cueExit = function() {
    customTrack.classList.add("hidden");
  };
  var setCues = function(cues) {
    for (var i = 0; i < cues.length; i++) {
      var cue = cues[i];
      cue.onenter = cueEnter;
      cue.onexit = cueExit;
    }
  };

  if (that.captionOn) {
    turnOnCaption(captionButton);
  }

  /* Events for caption on/off*/
  captionButton.onclick = function() {
    if (this.getAttribute("data-state") == "active") {
      turnOffCaption(this);
      that.media.dispatchEvent(
        new CustomEvent("toggleCaption", {
          detail: false
        })
      );
    } else {
      turnOnCaption(this);
      that.media.dispatchEvent(
        new CustomEvent("toggleCaption", {
          detail: true
        })
      );
    }
  };

  function turnOnCaption(button) {
    button.classList.remove("icon-cc-off");
    button.classList.add("icon-cc-on");
    button.setAttribute("data-state", "active");
    tooltip.innerHTML = that.textConfig.captionsOff || "Close Captions";
    // that.media.textTracks[0].mode = "showing";
    customTrackWrapper.classList.remove("hidden");
  }

  function turnOffCaption(button) {
    button.classList.remove("icon-cc-on");
    button.classList.add("icon-cc-off");
    button.setAttribute("data-state", "inactive");
    tooltip.innerHTML = that.textConfig.captions || "Open Captions";
    // that.media.textTracks[0].mode = "hidden";
    customTrackWrapper.classList.add("hidden");
  }

  return captionButton;
};

/* Create full screen button */
MediaControl.prototype.createFullscreenButton = function() {
  var that = this;
  var mediaContainer = this.mediaContainer; //temp video container
  var isFullscreened = false;
  var fadeOut;

  /* full screen button */
  var fullscreenButton = document.createElement("button");
  fullscreenButton.className = "media-btn media-btn-fs icon-fullscreen";
  if (tabMedia == "-1") {
    fullscreenButton.setAttribute("tabindex", "-1");
  }

  var tooltip = document.createElement("span");
  tooltip.className = "media-tooltip media-btn-fs-tooltip";
  tooltip.innerHTML = that.textConfig.fullscreen || "Full screen";
  this.tooltipFS = tooltip;

  var setFullscreenData = function(state) {
    mediaContainer.setAttribute("data-fullscreen", !!state);
    if (state) {
      fullscreenButton.classList.remove("icon-fullscreen");
      fullscreenButton.classList.add("icon-fullscreen-exit");
      mediaContainer.classList.add("full-screen");
      //            mediaContainer.classList.add("fullscreen");
      $(mediaContainer)
        .children(".media-controls")
        .addClass("clip-media-fullscreen");
      $(mediaContainer)
        .children(".clip-media-selection-wrapper")
        .removeClass("active");

      tooltip.innerHTML = that.textConfig.fullscreenOff || "Exit&nbsp;full&nbspscreen";
    } else {
      fullscreenButton.classList.remove("icon-fullscreen-exit");
      fullscreenButton.classList.add("icon-fullscreen");
      mediaContainer.classList.remove("full-screen");
      $(mediaContainer)
        .children(".media-controls")
        .removeClass("clip-media-fullscreen");
      $(mediaContainer)
        .children(".clip-media-selection-wrapper")
        .addClass("active");

      tooltip.innerHTML = that.textConfig.fullscreen || "Full&nbsp;screen";
    }
    that.media.dispatchEvent(
      new CustomEvent("toggleFullscreen", {
        detail: state
      })
    );
  };

  /* Check for fullscreen false/true */
  fullscreenButton.onclick = function() {
    if (isFullscreened) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      isFullscreened = false;
      setFullscreenData(isFullscreened);
    } else {
      if (mediaContainer.requestFullscreen) mediaContainer.requestFullscreen();
      else if (mediaContainer.webkitRequestFullscreen) mediaContainer.webkitRequestFullscreen();
      else if (mediaContainer.mozRequestFullScreen) mediaContainer.mozRequestFullScreen();
      else if (mediaContainer.msRequestFullscreen) mediaContainer.msRequestFullscreen();
      isFullscreened = true;
      setFullscreenData(isFullscreened);
      that.heroplay.focus();
      fadeInControls();
    }
  };

  /* Fullscreen support*/
  this.mediaContainer.addEventListener("fullscreenchange", function(e) {
    if (isFullscreened && !document.fullscreenElement) {
      isFullscreened = false;
      setFullscreenData(false);
    }
  });
  this.mediaContainer.addEventListener("webkitfullscreenchange", function() {
    if (isFullscreened && !document.webkitFullscreenElement) {
      isFullscreened = false;
      setFullscreenData(false);
    }
  });
  this.mediaContainer.addEventListener("mozfullscreenchange", function() {
    if (isFullscreened && !document.mozFullScreenElement) {
      isFullscreened = false;
      setFullscreenData(false);
    }
  });
  this.mediaContainer.addEventListener("msfullscreenchange", function() {
    if (isFullscreened && !document.msFullscreenElement) {
      isFullscreened = false;
      setFullscreenData(false);
    }
  });

  window.addEventListener("media_ended", function() {
    if (isFullscreened) {
      document.exitFullscreen();
      console.log("media ended");
    }
  });

  /* Set up video control and cursor hiding in fullscreen mode */
  function fadeInControls() {
    that.mediaContainer.classList.remove("fadeout");
    that.heroplay.style.cursor = "pointer";
    clearTimeout(fadeOut);
    if (!that.media.paused) {
      fadeOut = setTimeout(function() {
        that.mediaContainer.classList.add("fadeout");
        that.heroplay.style.cursor = "none";
      }, 3000);
    }
  }

  /* Media control changes while in full screen mode */
  this.mediaContainer.addEventListener("mousemove", function(e) {
    fadeInControls();
  });
  this.mediaContainer.addEventListener("click", function(e) {
    fadeInControls();
  });
  this.mediaContainer.addEventListener("keydown", function(e) {
    fadeInControls();
  });
  this.mediaContainer.addEventListener("touchmove", function(e) {
    fadeInControls();
  });

  return fullscreenButton;
};
