export const getInitialArray = tmpl =>
  tmpl
    .replace(/<br\/>/g, "")
    .replace(/(<p>)/g, "")
    .replace(/(<\/p>)/g, "<br/>")
    .split('<p class="newline_section">');

export const getParagraphsArray = initialArr =>
  (initialArr.join("").match(/(.*?)(<br\/>)+/g) || []).map(el => ({
    value: `${el}`,
    active: true
  }));

export const getSentencesArray = initialArr =>
  (initialArr.join("").match(/(.*?)(([.]+(<br\/>)*)|((<br\/>)+))+/g) || [])
    .map(el => ({ value: `${el}`, active: true }))
    .filter(el => el.value !== "." && el.value.trim() && el.value !== "<br/>.");

export const getWordsArray = initialArr => {
  const mathArray = initialArr.join("").match(/<span(.*?)class="input__math"(.*?)>/g);
  let stylesArray = initialArr.join("").match(/<span style="(.*?)">/g);
  const styleTemplateArr = initialArr.join("").match(/<span style="(.*?)">(.*?)<\/span>/g);

  let initialArrayForWords = initialArr;
  if (styleTemplateArr) {
    styleTemplateArr.forEach((element, index) => {
      let str = "";
      element
        .replace(/<span style="(.*?)">|<\/span>/g, "")
        .split(/\s/g)
        .forEach(subText => {
          str += ` ${stylesArray[index]}${subText}</span>`; //! need to keep whiteSpace
        });
      initialArrayForWords = initialArrayForWords.map(el => {
        el = el.replace(element, str);
        return el;
      });
    });
  }

  stylesArray = initialArrayForWords.join("").match(/<span style="(.*?)">/g);

  let i = 0;
  let j = 0;

  return (
    initialArrayForWords
      .join("")
      .replace("&nbsp;", " ")
      .replace(/<span(.*?)class="input__math"(.*?)>/g, "<span></span>")
      .replace(/<span style="(.*?)">/g, "<style></style>")
      .match(/(.*?)(([\s]+([.]*(<br\/>)*))|([.]+(<br\/>)*)|((<br\/>)+))+/g) || []
  )
    .map(el => {
      if (mathArray && el.indexOf("<span></span>") !== -1) {
        el = el.replace("<span></span>", mathArray[i]);
        i++;
      }
      if (stylesArray && el.indexOf("<style></style>") !== -1) {
        el = el.replace("<style></style>", stylesArray[j]);
        j++;
      }
      return el;
    })
    .map(el => ({ value: `${el}`, active: true }));
};

export const getCustomArray = initialArr => {
  const mathArray = initialArr.join("").match(/<span(.*?)class="input__math"(.*?)>/g);
  let i = 0;
  return [
    initialArr
      .join("")
      .replace("&nbsp;", " ")
      .replace(/<span(.*?)class="input__math"(.*?)>/g, "<span></span>")
      .replace(/<br>/g, "")
  ].map(el => {
    if (mathArray && el.indexOf("<span></span>") !== -1) {
      el = el.replace("<span></span>", mathArray[i]);
      i++;
    }
    return { value: `${el}`, active: false };
  });
};

export const getCustomTokenTemplate = tokens => {
  const template = tokens.map((token, index) => {
    if (token.active) {
      return `<span class='token active-word' sequence='${index}'>${token.value}</span>`;
    }
    return token.value;
  });
  return template.join("");
};

export const removeTokenFromHtml = str => {
  const tokenArr = [];
  const regex = new RegExp('<span(.*?)class="token active-word"(.*?)>(.*?)</span>', "g");
  let match = regex.exec(str);

  while (match !== null) {
    tokenArr.push(match.splice(3));
    match = regex.exec(str);
  }

  tokenArr.forEach(elem => {
    const replaceStr = elem.splice(0);
    str = str.replace(new RegExp(`<span(.*?)class="token active-word"(.*?)>${replaceStr}</span>`), replaceStr);
  });
  return str;
};
