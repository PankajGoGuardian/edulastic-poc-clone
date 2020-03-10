import { lightGreen7, lightBlue8, lightRed2 } from "@edulastic/colors";

export const getQuadsData = data => {
  // mulFactor to keep all the data inside the graph
  // should be close to {sqrt(2) * limit}
  const scaleFactor = 1.5,
    threshFactor = 0.15;

  // limits for rendering the graph
  let eLimit = 50,
    pLimit = 50;
  data.map(item => {
    if (eLimit < Math.abs(item.effort)) eLimit = Math.abs(item.effort);
    if (pLimit < Math.abs(item.performance)) pLimit = Math.abs(item.performance);
  });

  eLimit = Math.round(eLimit * scaleFactor);
  pLimit = Math.round(pLimit * scaleFactor);

  // nearby threshold for axes to prevent labels from being cut off
  const eThresh = Math.round(eLimit * threshFactor),
    pThresh = Math.round(pLimit * threshFactor);

  // initialize quadsData with domains
  const quads = [
    {
      domainX: [-eLimit, eThresh],
      domainY: [-pThresh, pLimit],
      color: lightBlue8,
      data: []
    },
    {
      domainX: [-eThresh, eLimit],
      domainY: [-pThresh, pLimit],
      color: lightGreen7,
      data: []
    },
    {
      domainX: [-eLimit, eThresh],
      domainY: [-pLimit, pThresh],
      color: lightRed2,
      data: []
    },
    {
      domainX: [-eThresh, eLimit],
      domainY: [-pLimit, pThresh],
      color: lightBlue8,
      data: []
    }
  ];

  data.map(item => {
    // push the data into their respective quads
    if (item.effort < 0 && item.performance > 0) {
      quads[0].data.push(item);
    } else if (item.effort > 0 && item.performance > 0) {
      quads[1].data.push(item);
    } else if (item.effort < 0 && item.performance < 0) {
      quads[2].data.push(item);
    } else {
      quads[3].data.push(item);
    }
  });

  return quads;
};
