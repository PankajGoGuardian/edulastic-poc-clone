const onHandler = (board, xMin, xMax, settings) => (
  board.$board.create(
    'axis',
    [[settings.showMin ? xMin - 0.1 : xMin, 0], [settings.showMax ? xMax + 0.1 : xMax, 0]],
    {
      straightFirst: false,
      straightLast: false,
      firstArrow: settings.leftArrow === true ? { size: 10 } : false,
      lastArrow: settings.rightArrow === true ? { size: 10 } : false,
      strokeColor: '#d6d6d6',
      highlightStrokeColor: '#d6d6d6',
      ticks: {
        visible: settings.showTicks,
        anchor: 'left',
        insertTicks: false,
        drawZero: true,
        tickEndings: [1, 1],
        majorHeight: 25,
        minorHeight: 0,
        drawLabels: true,
        ticksDistance: settings.ticksDistance,
        label: {
          offset: [0, -13],
          anchorX: 'middle',
          fontSize: settings.fontSize
        }
      }
    }
  )
);

const updateCoords = (board, xMin, xMax, settings) => {
  const oldAxis = board.elements.filter(element => element.elType === 'axis' || element.elType === 'arrow');
  board.$board.removeObject(oldAxis);
  board.elements = board.elements.filter(element => element.elType !== 'axis');
  board.elements = board.elements.filter(element => element.elType !== 'arrow');
  board.elements.push(onHandler(board, xMin, xMax, settings));
  board.$board.fullUpdate();
};

export default {
  onHandler,
  updateCoords
};
