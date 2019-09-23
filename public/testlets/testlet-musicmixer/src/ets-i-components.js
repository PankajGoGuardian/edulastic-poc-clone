(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /********************** modules *************************/

  object.ETS.i.component.createComponent = function(obj) {
    var type = obj.type;
    switch (type) {
      case "button":
        ETS.i.component.button(obj);
        break;
      case "textfield":
        ETS.i.component.textfield(obj);
        break;
      case "iic":
        ETS.i.component.iic(obj);
        break;
      case "iic2":
        ETS.i.component.iic2(obj);
        break;
      case "textarea":
        ETS.i.component.textarea(obj);
        break;
      case "listbox":
        ETS.i.component.listbox(obj);
        break;
      case "dropdown":
        ETS.i.component.dropdown(obj);
        break;
      case "checkbox":
        ETS.i.component.checkbox(obj);
        break;
      case "eliminatelist":
        ETS.i.component.eliminatelist(obj);
        break;
      case "mediaplayer":
        ETS.i.component.mediaplayer(obj);
        break;
      case "image":
        ETS.i.component.image(obj);
        break;
      case "popover":
        ETS.i.component.popover(obj);
        break;
      case "placeholder":
        ETS.i.component.placeholder(obj);
        break;
      case "speechbubble":
        ETS.i.component.speechbubble(obj);
        break;
      case "radio":
        ETS.i.component.radio(obj);
        break;
      case "text":
        ETS.i.component.text(obj);
        break;
      case "responseGrid":
        ETS.i.component.responseGrid(obj);
        break;
      case "passageSelection":
        ETS.i.component.passageSelection(obj);
        break;
      case "imageZoom":
        ETS.i.component.imageZoom(obj);
        break;
      case "range":
        ETS.i.component.range(obj);
        break;
      // case "html":
      // ETS.i.component.html(obj);
      // break;
    }
  };

  object.ETS.i.component.trigger = function(name, arguments) {
    var fn = window[name];
    if (typeof fn !== "function") return;

    fn.apply(window, arguments);
  };
})(this);
