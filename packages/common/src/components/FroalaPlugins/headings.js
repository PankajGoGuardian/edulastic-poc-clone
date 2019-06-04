export default FroalaEditor => {
  const isActive = function(cmd) {
    var blocks = this.selection.blocks();

    if (blocks.length) {
      var blk = blocks[0];
      var tag = "N";
      var default_tag = this.html.defaultTag();
      if (blk.tagName.toLowerCase() != default_tag && blk != this.el) {
        tag = blk.tagName;
      }
    }

    if (["LI", "TD", "TH"].indexOf(tag) >= 0) {
      tag = "N";
    }

    return tag.toLowerCase() == cmd;
  };

  // Define custom buttons.
  FroalaEditor.DefineIcon("h1", { NAME: "<strong>H1</strong>", template: "text" });
  FroalaEditor.DefineIcon("h2", { NAME: "<strong>H2</strong>", template: "text" });
  FroalaEditor.RegisterCommand("h1", {
    title: "Heading 1",
    callback: function(cmd, val, params) {
      if (isActive.apply(this, [cmd])) {
        this.paragraphFormat.apply("N");
      } else {
        this.paragraphFormat.apply(cmd);
      }
    },
    refresh: function($btn) {
      $btn.toggleClass("fr-active", isActive.apply(this, [$btn.data("cmd")]));
    }
  });

  FroalaEditor.RegisterCommand("h2", {
    title: "Heading 2",
    callback: function(cmd, val, params) {
      if (isActive.apply(this, [cmd])) {
        this.paragraphFormat.apply("N");
      } else {
        this.paragraphFormat.apply(cmd);
      }
    },
    refresh: function($btn) {
      $btn.toggleClass("fr-active", isActive.apply(this, [$btn.data("cmd")]));
    }
  });
};
