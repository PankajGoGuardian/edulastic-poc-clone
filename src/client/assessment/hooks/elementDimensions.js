import { measureText } from "@edulastic/common";

/**
 * @typedef {Object} dimensions
 * @property {number} height
 * @property {number} width
 * @property {number} scrollHeight
 * @property {number} scrollWidth
 */

/**
 * calculates the dimensions of elements using the html templates,
 * the dimensions it would occupy if it were rendered on screen
 * @param {Array<String>} elements
 *        the html template strings
 * @returns {Array<dimensions>}
 *        objects containing the dimensions of the elements if it were rendered on screen
 */
const elementDimensions = elements => {
  const dimensions = [];
  for (const element of elements) {
    const dim = measureText(element.text);
    dimensions.push(dim);
  }

  return dimensions;
};

export default elementDimensions;
