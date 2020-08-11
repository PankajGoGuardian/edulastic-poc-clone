export const contains = (selector, text) => {
    const elements = document.querySelectorAll(selector);
    return [].filter.call(elements, (element) => RegExp(text).test(element.textContent));
  };
  
  export const generateUUID = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  