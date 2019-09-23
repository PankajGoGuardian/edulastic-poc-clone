(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Speech Bubble Component******************/

  object.ETS.i.component.speechbubble = function(obj) {
    console.log("create speechbubble...");
    console.log(obj);

    //Declare the image and name variables for character object
    //Mapping all the parameters for content
    var speechbubbleId = obj.identity.id + "-txt";
    var responseId = idMapContent(obj.identity.responseId);
    var name = idMapContent(obj.identity.name);
    var alignment = idMapContent(obj.properties.alignment);
    var backgroundImage = "assets/img/" + idMapContent(obj.properties.characterImage);
    var characterName = idMapContent(obj.properties.characterName);
    var charcaterAlt = idMapContent(obj.properties.title);

    var content = idMapContent(obj.properties.content);

    //Create the speechbubble component
    //All the properties have been declared dynamically and it will be loaded through the JSON file.
    var str = "";
    str += '<div name="' + name + '" class="' + obj.properties.class + " " + alignment + '" aria-label="speechbubble">';
    str += '<div class="character">';
    str +=
      '<div class="visual" aria-labelledby="speechbubble" style="background-image:url(' +
      backgroundImage +
      ');"><div class="volume"><div class="icon"></div></div></div>';
    if (characterName !== null && characterName !== "") {
      str += '<div class="name">' + characterName + "</div>";
    }
    str += "</div>";
    str += '<div class="bubble" aria-label="speechbubble">';
    str += '<div class="pointer"></div>';
    str += '<div class="content">' + content + "</div>";
    str += "</div>";
    str += "</div>";

    $("#" + obj.identity.id).html(str);
  };
})(this);
