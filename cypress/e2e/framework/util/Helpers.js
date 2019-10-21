import { getFontSize } from "../../../../src/client/assessment/utils/helpers";

class Helpers {
  static stringTypes = () => {
    return { ALPHA: "Alphabetical", ALPHA_NUM: "Alpha Numreric", NUMERIC: "Numeric" };
  };

  static getElement(element) {
    return cy.get(`[data-cy="${element}"]`);
  }

  static fontSize(font) {
    switch (font) {
      case "small":
        return { font: getFontSize(font, false), name: "Small" };
      case "normal":
        return { font: getFontSize(font, false), name: "Normal" };
      case "large":
        return { font: getFontSize(font, false), name: "Large" };
      case "xlarge":
        return { font: getFontSize(font, false), name: "Extra Large" };
      case "xxlarge":
        return { font: getFontSize(font, false), name: "Huge" };
      default:
        return { font: getFontSize("normal", false), name: "Normal" };
    }
  }

  static get stemNumeration() {
    return {
      numerical: "Numerical",
      upperAlpha: "Uppercase Alphabet",
      lowerAlpha: "Lowercase Alphabet"
    };
  }

  static getShortName(name) {
    let shortName;
    const [firstName, lastName] = name.split(" ");
    if (!firstName) shortName = "";
    else
      shortName = lastName
        ? `${firstName.trim().substr(0, 1)}${lastName.trim().substr(0, 1)}`
        : `${firstName.trim().substr(0)}`;
    return shortName.toUpperCase();
  }

  static getRamdomString(length = 8, type = this.stringTypes().ALPHA) {
    let string = "";
    let possibleChars;
    switch (type) {
      case this.stringTypes().ALPHA:
        possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        break;

      case this.stringTypes().ALPHA_NUM:
        possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        break;

      case this.stringTypes().NUMERIC:
        possibleChars = "123456789";
        break;

      default:
        break;
    }

    for (let i = 0; i < length; i++) {
      string += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    return string;
  }

  static getRamdomEmail(domain = "snapwiz.com", emailStringType = this.stringTypes().ALPHA_NUM) {
    const prefix = this.getRamdomString(12, emailStringType);
    return `${prefix}@${domain}`;
  }
}

export default Helpers;
