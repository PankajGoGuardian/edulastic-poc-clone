import React, { useState, useEffect, useRef } from "react";
import { withWindowSizes } from "@edulastic/common";
import PropTypes from "prop-types";
import { themes } from "../../theme";
import styled from "styled-components";
const {
  playerSkin: { magnifierBorderColor }
} = themes;

const copyDomOnClickOfElements = ["question-select-dropdown", "answer-math-input-field", "ant-select-selection"];

const Magnifier = ({
  children,
  windowWidth,
  windowHeight,
  enable,
  config: { width, height, scale },
  zoomedContent: ZoomedContent,
  type,
  offset
}) => {
  const [setting, setSetting] = useState({
    pos: { x: windowWidth / 2 - width / 2, y: windowHeight / 2 - height / 2 },
    dragging: false,
    rel: null,
    windowWidth,
    windowHeight
  });
  const clickedClassName = useRef();
  const ref = useRef();
  useEffect(() => {
    if (setting.dragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      handleSidebarScroll({
        target: document.getElementsByClassName("scrollbar-container")[0]
      });
      handleScroll({
        target: document.getElementsByClassName("test-item-preview")[0]
      });
      handleDragElements();
      handleHints();
    }
    if (setting.windowWidth !== windowWidth || setting.windowHeight !== windowHeight) {
      setSetting({
        ...setting,
        windowWidth,
        windowHeight,
        pos: { x: windowWidth / 2 - width / 2, y: windowHeight / 2 - height / 2 }
      });
    }

    return () => {
      document?.removeEventListener("mousemove", onMouseMove);
      document?.removeEventListener("mouseup", onMouseUp);
    };
  });

  useEffect(() => {
    const container = document.getElementsByClassName("test-item-preview")[0];
    container?.addEventListener("scroll", handleScroll);
    const sideBar = document.getElementsByClassName("scrollbar-container")[0];
    sideBar?.addEventListener("scroll", handleSidebarScroll);
    document.addEventListener("click", hideElements);

    //This is to attach events to dom elements after some moment
    setTimeout(attachEvents, 1000);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
      sideBar?.removeEventListener("scroll", handleSidebarScroll);
      document.removeEventListener("click", hideElements);

      //This is to deattach events to dom elements after some moment
      removeAttachedEvents();
    };
  }, []);

  const attachEvents = () => {
    copyDomOnClickOfElements.forEach(className => {
      const elms = document.querySelectorAll(`.unzoom-container-wrapper .${className}`);
      elms.forEach(elm => {
        if (elm) {
          elm.addEventListener("click", cloneDom(className));
        }
      })
    })
  }

  const removeAttachedEvents = () => {
    copyDomOnClickOfElements.forEach(className => {
      const elms = document.querySelectorAll(`.unzoom-container-wrapper .${className}`);
      elms.forEach(elm => {
        if (elm) {
          elm.removeEventListener("click", cloneDom(className));
        }
      })
    })
  }

  const cloneDom = (className) => {
    //THis work to clone main container to zoomed container on any specific event happened.
    const cls = className;
    return () => {
      clickedClassName.current = cls;
      const mainWrapper = document.querySelector(".zoomed-container-wrapper");
      if (mainWrapper) {
        //copy after some time as to wait to fully render main container
        setTimeout(() => {
          mainWrapper.innerHTML = document.querySelector(".unzoom-container-wrapper").innerHTML;
        }, 1000);
      }
    }
  }
  const hideElements = e => {
    //THis work to copy dom if any attached event fired before

    const className = clickedClassName.current;
    if (className) {
      //copy after some time as to wait to fully render main container
      setTimeout(() => {
        const elm = document.querySelector(`.unzoom-container-wrapper .${className}`);
        const zoomedElm = document.querySelector(`.zoomed-container-wrapper .${className}`);
        if (elm && (e.target !== elm || !elm.contains(e.target))) {
          if (zoomedElm) {
            document.querySelector(`.zoomed-container-wrapper`).innerHTML = document.querySelector(`.unzoom-container-wrapper`).innerHTML;
          }
        }
      }, 1000)
    }
  }

  const handleScroll = e =>
    document.getElementsByClassName("test-item-preview")[1]?.scrollTo(0, scale * e.target.scrollTop);
  const handleSidebarScroll = e =>
    document.getElementsByClassName("scrollbar-container")[1]?.scrollTo(0, scale * e.target.scrollTop);

  const onMouseDown = e => {
    if (e.button !== 0) return;
    var pos = ref.current.getBoundingClientRect();
    setSetting({
      ...setting,
      dragging: true,
      rel: {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top
      }
    });
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseUp = e => {
    setSetting({
      ...setting,
      dragging: false
    });
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMove = e => {
    if (!setting.dragging) return;
    setSetting({
      ...setting,
      pos: {
        x: e.pageX - setting.rel.x,
        y: e.pageY - setting.rel.y
      }
    });
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDragElements = () => {
    const dragElements = document.querySelectorAll(".zoomed-container-wrapper .react-draggable");
    if (dragElements.length > 0) {
      document.querySelectorAll(".unzoom-container-wrapper .react-draggable").forEach((elm, i) => {
        dragElements[i].style.transform = elm.style.transform;
      })
    }
  }

  const handleHints = () => {
    const dragElements = document.querySelectorAll(".zoomed-container-wrapper .hint-container");
    if (dragElements.length > 0) {
      document.querySelectorAll(".unzoom-container-wrapper .hint-container").forEach((elm, i) => {
        dragElements[i].innerHTML = elm.innerHTML;
      })
    }
  }

  return (
    <>
      <div className="unzoom-container-wrapper">{children}</div>
      {(enable || type === "testlet") && <ZoomedWrapper
        ref={ref}
        onMouseDown={onMouseDown}
        id="magnifier-wrapper"
        style={{
          border: `1px solid ${magnifierBorderColor}`,
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: "5px",
          position: "fixed",
          overflow: "hidden",
          left: setting.pos.x + 'px',
          top: setting.pos.y + 'px',
          zIndex: 1050,
          cursor: "move",
          background: "white",
          display: type === "testlet" ? "none" : "block"
        }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              width: windowWidth,
              height: windowHeight,
              overflow: "visible",
              position: "absolute",
              display: "block",
              left: `${-(scale * setting.pos.x) - offset.left}px`,
              top: `${-(scale * setting.pos.y) - offset.top}px`,
              transformOrigin: "left top",
              userSelect: "none",
              marginLeft: `-${width / scale}px`
            }}
            className="zoomed-container-wrapper"
          >
            {(ZoomedContent && <ZoomedContent />) || children}
          </div>
          <div
            style={{
              width: `${width}px`,
              height: `${height}px`,
              position: "absolute"
            }}
          />
        </ZoomedWrapper>
      }
    </>
  );
};

const ZoomedWrapper = styled.div`
  main {
    .test-item-preview {
      overflow: auto !important;
      .classification-preview {
        * {
          overflow: visible !important;
        }
      }
    }
  }
`;

Magnifier.defaultProps = {
  enable: false,
  config: {
    width: 182,
    height: 182,
    scale: 2
  },
  offset: {
    top: 0,
    left: 0
  }
};
Magnifier.propTypes = {
  children: PropTypes.node.isRequired,
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  enable: PropTypes.bool,
  config: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired
  })
};
export default withWindowSizes(Magnifier);
