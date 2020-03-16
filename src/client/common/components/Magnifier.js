import React, {useState, useEffect, useRef} from "react";
import { withWindowSizes } from "@edulastic/common";
import PropTypes from "prop-types";
import { themes } from "../../theme";
const { playerSkin: { magnifierBorderColor } } = themes;

const Magnifier = ({
  children,
  windowWidth,
  windowHeight,
  enable,
  config: {width, height, scale}
}) => {
  const [setting, setSetting] = useState({
    pos: {x: windowWidth/2 - width/2, y: windowHeight/2 - height/2},
    dragging: false,
    rel: null,
    windowWidth,
    windowHeight
  })

  const ref = useRef();
  useEffect(() => {
    if(setting.dragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    if (setting.windowWidth !== windowWidth || setting.windowHeight !== windowHeight) {
      setSetting({
        ...setting,
        windowWidth,
        windowHeight,
        pos: {x: windowWidth/2 - width/2, y: windowHeight/2 - height/2}
      });
    }
    return () => {
      document?.removeEventListener('mousemove', onMouseMove)
      document?.removeEventListener('mouseup', onMouseUp)
    }
  });

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

  const onMouseUp = (e) => {
    setSetting({
      ...setting,
      dragging: false
    });
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMove = (e) => {
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
  }

  return (
    <>
      {children}
      {enable && <div
        ref={ref}
        onMouseDown={onMouseDown}
        style={{
          border: `1px solid ${magnifierBorderColor}`,
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: "5px",
          position: "fixed",
          overflow: "hidden",
          left: setting.pos.x >= -width/2 ? setting.pos.x + 'px' : `${-width/2}px`,
          top: setting.pos.y >= -height/2 ? setting.pos.y + 'px' : `${-height/2}`,
          zIndex: 1000,
          cursor: "move"
        }}
        >
        <div style={{
          transform: `scale(${scale})`,
          width: windowWidth,
          height: windowHeight,
          overflow: "visible",
          position: "absolute",
          display: "block",
          left: setting.pos.x > -width/2 ? `-${2*setting.pos.x}px` : `${width}px`,
          top: setting.pos.y >= -height/2 ? `-${2*setting.pos.y}px` : `${height}px`,
          transformOrigin: "left top",
          userSelect: "none",
          marginLeft: `-${width/2}px`
        }}>
          {children}
        </div>
        <div style={{
          width: `${width}px`,
          height: `${height}px`, 
          position: 'absolute'}}/>
      </div>}
    </>
  );
};

Magnifier.defaultProps = {
  enable: false,
  config: {
    width: 182,
    height: 182,
    scale: 2
  }
}
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
}
export default withWindowSizes(Magnifier);