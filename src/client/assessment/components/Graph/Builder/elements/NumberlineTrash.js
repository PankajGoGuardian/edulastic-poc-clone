const cleanBoard = board => {
  const segments = board.elements.filter(element => element.elType === "segment" || element.elType === "point");

  segments.forEach(segmentToDelete => {
    if (segmentToDelete.elType === "segment") {
      segmentToDelete.inherits.forEach(point => board.$board.removeObject(point));
      board.$board.removeObject(segmentToDelete);
      board.elements = board.elements.filter(element => element.id !== segmentToDelete.id);

      // Check if it's separate point or not
    } else if (segmentToDelete) {
      if (!board.elements.find(element => element.id === segmentToDelete.id)) {
        let parentSegment;

        board.elements
          .filter(element => element.elType === "segment")
          .forEach(segment => {
            if (segment.inherits.some(point => point.id === segmentToDelete.id)) {
              parentSegment = segment;
            }
          });

        parentSegment.inherits.forEach(point => board.$board.removeObject(point));
        board.$board.removeObject(parentSegment);
        board.elements = board.elements.filter(element => element.id !== parentSegment.id);
      } else {
        board.$board.removeObject(segmentToDelete);
        board.elements = board.elements.filter(element => element.id !== segmentToDelete.id);
      }
    }
  });
};

export default {
  cleanBoard
};
