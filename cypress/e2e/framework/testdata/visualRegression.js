export const getQuestions = tests => {
  const questions = {};
  Cypress._.keys(tests).forEach(testId => {
    const items = tests[testId];
    items.forEach(item => {
      const { itemType, itemId } = item;
      const testItems = questions[itemType] || [];
      testItems.push(itemId);
      questions[itemType] = testItems;
    });
  });
  return questions;
};

export const draftTests = {
  "5de8cf6fe345a10008f4cf2c": [
    { itemId: "5dc19bf836a282f883a61857", itemType: "Cloze with Text" },
    { itemId: "5dc1ca0e36a282f883b4a28d", itemType: "Cloze with Drag & Drop" },
    { itemId: "5dc1b42136a282f883ae0c63", itemType: "Multiple choice - multiple response" },
    { itemId: "5dc19ee736a282f883a6a148", itemType: "Number line with drag & drop" },
    { itemId: "5dc1c79c36a282f883b3e227", itemType: "Graphing" },
    { itemId: "5dc1c8b636a282f883b4300a", itemType: "Graph Placement" },
    { itemId: "5dc19bbb36a282f883a60e47", itemType: "Match list" },
    { itemId: "5dc1c97f36a282f883b479b4", itemType: "Fraction Editor" },
    { itemId: "5dc1bcfa36a282f883b127cf", itemType: "Number line with plot" },
    { itemId: "5dc1c7e036a282f883b3f914", itemType: "Dot Plot - Number Line" },
    { itemId: "5dc1b8a436a282f883b01d52", itemType: "Math, Text & Dropdown" },
    { itemId: "5dc1b79736a282f883afd913", itemType: "Cloze with Text" },
    { itemId: "5dc1c70336a282f883b37d01", itemType: "Classification" },
    { itemId: "5dc1d2d136a282f883b66680", itemType: "Math, Text & Dropdown" },
    { itemId: "5dc1bae436a282f883b0a340", itemType: "Cloze with Drop Down" },
    { itemId: "5dc1be9a36a282f883b18ff7", itemType: "Combination Multipart" },
    { itemId: "5dc1950736a282f883a4da8b", itemType: "Label Image with Drag & Drop" },
    { itemId: "5dc1d12136a282f883b60f76", itemType: "Combination Multipart" },
    { itemId: "5dc1b66336a282f883af182c", itemType: "Essay with rich text" },
    { itemId: "5dc1b10d36a282f883ad0668", itemType: "Match list" },
    { itemId: "5dc1c4dd36a282f883b300a0", itemType: "Choice matrix - standard" },
    { itemId: "5dc1ab6c36a282f883ab03d3", itemType: "Multiple choice - standard" },
    { itemId: "5dc1b2c436a282f883ad9bd4", itemType: "True or false" },
    { itemId: "5dc1b3e736a282f883adf9d6", itemType: "Multiple choice - multiple response" },
    { itemId: "5dc19b2036a282f883a5f4a1", itemType: "Label Image with Text" }
  ]
};

export const assignedTests = {
  "5de8ce86c05b97000826d0ae": [
    { itemId: "5dc19bf836a282f883a61857", itemType: "Cloze with Text" },
    { itemId: "5dc1ca0e36a282f883b4a28d", itemType: "Cloze with Drag & Drop" },
    { itemId: "5dc1b42136a282f883ae0c63", itemType: "Multiple choice - multiple response" },
    { itemId: "5dc19ee736a282f883a6a148", itemType: "Number line with drag & drop" },
    { itemId: "5dc1c79c36a282f883b3e227", itemType: "Graphing" },
    { itemId: "5dc1c8b636a282f883b4300a", itemType: "Graph Placement" },
    { itemId: "5dc19bbb36a282f883a60e47", itemType: "Match list" },
    { itemId: "5dc1c97f36a282f883b479b4", itemType: "Fraction Editor" },
    { itemId: "5dc1bcfa36a282f883b127cf", itemType: "Number line with plot" },
    { itemId: "5dc1c7e036a282f883b3f914", itemType: "Dot Plot - Number Line" },
    { itemId: "5dc1b8a436a282f883b01d52", itemType: "Math, Text & Dropdown" },
    { itemId: "5dc1b79736a282f883afd913", itemType: "Cloze with Text" },
    { itemId: "5dc1c70336a282f883b37d01", itemType: "Classification" },
    { itemId: "5dc1d2d136a282f883b66680", itemType: "Math, Text & Dropdown" },
    { itemId: "5dc1bae436a282f883b0a340", itemType: "Cloze with Drop Down" },
    { itemId: "5dc1be9a36a282f883b18ff7", itemType: "Combination Multipart" },
    { itemId: "5dc1950736a282f883a4da8b", itemType: "Label Image with Drag & Drop" },
    { itemId: "5dc1d12136a282f883b60f76", itemType: "Combination Multipart" },
    { itemId: "5dc1b66336a282f883af182c", itemType: "Essay with rich text" },
    { itemId: "5dc1b10d36a282f883ad0668", itemType: "Match list" },
    { itemId: "5dc1c4dd36a282f883b300a0", itemType: "Choice matrix - standard" },
    { itemId: "5dc1ab6c36a282f883ab03d3", itemType: "Multiple choice - standard" },
    { itemId: "5dc1b2c436a282f883ad9bd4", itemType: "True or false" },
    { itemId: "5dc1b3e736a282f883adf9d6", itemType: "Multiple choice - multiple response" },
    { itemId: "5dc19b2036a282f883a5f4a1", itemType: "Label Image with Text" }
  ]
};

export const assignedTests1 = {
  "5e4b9001f13f470008a12ab2": [
    { itemId: "5dc55be71f221d00089993fd", itemType: "Cloze with Drag & Drop" },
    { itemId: "5dc55f5c1fd7b30007f3d199", itemType: "Label Image with Drag & Drop" },
    { itemId: "5dc55f6f1fd7b30007f3d19b", itemType: "Label Image with Drag & Drop" },
    { itemId: "5dc55f9de402510007e1f5af", itemType: "Label Image with Drag & Drop" },
    { itemId: "5dc55fe6e402510007e1f5b1", itemType: "Cloze with Drag & Drop" },
    { itemId: "5dc560991373ba0007b6f082", itemType: "Cloze with Drag & Drop" },
    { itemId: "5dc560bd1fd7b30007f3d19f", itemType: "Label Image with Drag & Drop" },
    { itemId: "5dc561e7fa22a900071d2789", itemType: "Sort List" },
    { itemId: "5dc5636c411194000864b588", itemType: "Classification" },
    { itemId: "5dc5638c1373ba0007b6f085", itemType: "Classification" },
    { itemId: "5dc563b71fd7b30007f3d1a8", itemType: "Classification" },
    { itemId: "5dc563f3b7056400076e00cd", itemType: "Classification" },
    { itemId: "5dc565471373ba0007b6f08b", itemType: "Match list" },
    { itemId: "5dc5658e411194000864b58a", itemType: "Match list" },
    { itemId: "5dc565b0b7056400076e00d1", itemType: "Match list" },
    { itemId: "5dc565d91fd7b30007f3d1ab", itemType: "Match list" },
    { itemId: "5dc566e7b7056400076e00d5", itemType: "OrderList" },
    { itemId: "5dc56967e402510007e1f5c5", itemType: "Classification" },
    { itemId: "5dc5697e8829380008941734", itemType: "Classification" },
    { itemId: "5dc56b3117b0f80007a8164b", itemType: "Graph Placement" },
    { itemId: "5dc56cce2709b70007f7c4ec", itemType: "Number line with drag & drop" },
    { itemId: "5dc56d393fc89d000886dd7a", itemType: "Number line with drag & drop" },
    { itemId: "5dc56d5700e419000870b6e6", itemType: "Number line with drag & drop" }
  ]
};

/* 
  export const draftTests = {
  "5dc3fc9b2ab139000860fa37": [
    {
      itemId: "5dc1b36b36a282f883add11b",
      itemType: "Match list"
    },
    {
      itemId: "5dc17bd836a282f883a145d2",
      itemType: "Match list"
    },
    {
      itemId: "5dc1970a36a282f883a549bc",
      itemType: "Match list"
    },
    {
      itemId: "5dc1973736a282f883a55120",
      itemType: "Match list"
    },
    {
      itemId: "5dc1979e36a282f883a5632d",
      itemType: "Match list"
    },
    {
      itemId: "5dc197a436a282f883a56425",
      itemType: "Match list"
    },
    {
      itemId: "5dc199d836a282f883a5bda6",
      itemType: "Match list"
    },
    {
      itemId: "5dc19a0f36a282f883a5c680",
      itemType: "Match list"
    },
    {
      itemId: "5dc19a2136a282f883a5c9a4",
      itemType: "Match list"
    },
    {
      itemId: "5dc1b10d36a282f883ad0668",
      itemType: "Match list"
    },
    {
      itemId: "5dc29ff430c78e00077f300e",
      itemType: "Match list"
    }
  ],
  "5dc3fc492ab139000860fa35": [
    {
      itemId: "5dc1970a36a282f883a549bc",
      itemType: "Match list"
    },
    {
      itemId: "5dc19a4536a282f883a5cf36",
      itemType: "Match list"
    },
    {
      itemId: "5dc19a2136a282f883a5c9a4",
      itemType: "Match list"
    },
    {
      itemId: "5dc19a0f36a282f883a5c680",
      itemType: "Match list"
    },
    {
      itemId: "5dc1979e36a282f883a5632d",
      itemType: "Match list"
    },
    {
      itemId: "5dc17bd836a282f883a145d2",
      itemType: "Match list"
    },
    {
      itemId: "5dc1b36b36a282f883add11b",
      itemType: "Match list"
    },
    {
      itemId: "5dc1973736a282f883a55120",
      itemType: "Match list"
    },
    {
      itemId: "5dc197a436a282f883a56425",
      itemType: "Match list"
    },
    {
      itemId: "5dc1b10d36a282f883ad0668",
      itemType: "Match list"
    },
    {
      itemId: "5dc199d836a282f883a5bda6",
      itemType: "Match list"
    }
  ],
  "5dc3fc332ab139000860fa33": [
    {
      itemId: "5dc1b34636a282f883adc492",
      itemType: "True or false"
    },
    {
      itemId: "5dc1b2b936a282f883ad9835",
      itemType: "True or false"
    },
    {
      itemId: "5dc1b33d36a282f883adc152",
      itemType: "True or false"
    },
    {
      itemId: "5dc1b2c436a282f883ad9bd4",
      itemType: "True or false"
    },
    {
      itemId: "5dc1b35636a282f883adca48",
      itemType: "Math, Text & Dropdown"
    },
    {
      itemId: "5dc1b21736a282f883ad6264",
      itemType: "Math, Text & Dropdown"
    },
    {
      itemId: "5dc1b35f36a282f883adcc58",
      itemType: "Math, Text & Dropdown"
    },
    {
      itemId: "5dc1c72636a282f883b38f4c",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c79c36a282f883b3e227",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c72536a282f883b38ed0",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c84836a282f883b415c2",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c79736a282f883b3dff6",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c7d136a282f883b3f490",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c82336a282f883b40b2d",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c87a36a282f883b4219b",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c7d736a282f883b3f6a1",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c87436a282f883b42061",
      itemType: "Graphing in the 1st quadrant"
    },
    {
      itemId: "5dc1bf9636a282f883b1d344",
      itemType: "Multiple choice - standard"
    },
    {
      itemId: "5dc1be9a36a282f883b18ff7",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1bcd736a282f883b11fce",
      itemType: "Math, Text & Dropdown"
    },
    {
      itemId: "5dc195dc36a282f883a50dc1",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1947636a282f883a4b68f",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1966e36a282f883a52bf6",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1946036a282f883a4b1bb",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc194a136a282f883a4c0ed",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1953436a282f883a4e4bd",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1942836a282f883a4a2dc",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1948336a282f883a4b9fa",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1950736a282f883a4da8b",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1962e36a282f883a51fec",
      itemType: "Label Image with Drag & Drop"
    }
  ],
  "5dc3fc8106f3d600082cf0fb": [
    {
      itemId: "5dc1b3e736a282f883adf9d6",
      itemType: "Multiple choice - multiple response"
    },
    {
      itemId: "5dc1b31136a282f883adb270",
      itemType: "Multiple choice - multiple response"
    },
    {
      itemId: "5dc1b44736a282f883ae196d",
      itemType: "Multiple choice - multiple response"
    },
    {
      itemId: "5dc1b42136a282f883ae0c63",
      itemType: "Multiple choice - multiple response"
    },
    {
      itemId: "5dc1b34836a282f883adc537",
      itemType: "Multiple choice - multiple response"
    },
    {
      itemId: "5dc1b50736a282f883ae5dcd",
      itemType: "Multiple choice - multiple response"
    }
  ],
  "5dc3fc1006f3d600082cf0f7": [
    {
      itemId: "5dc1b77636a282f883afc862",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1b79736a282f883afd913",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1b73436a282f883afa75a",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1b80236a282f883aff6d3",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1bcc536a282f883b11ac0",
      itemType: "Cloze with Drop Down"
    },
    {
      itemId: "5dc1b84436a282f883b007d3",
      itemType: "Cloze with Drop Down"
    },
    {
      itemId: "5dc1b86436a282f883b00f03",
      itemType: "Cloze with Drop Down"
    },
    {
      itemId: "5dc1b77236a282f883afc5b8",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1b9f536a282f883b065f9",
      itemType: "Cloze with Drop Down"
    },
    {
      itemId: "5dc1bae436a282f883b0a340",
      itemType: "Cloze with Drop Down"
    },
    {
      itemId: "5dc1b79436a282f883afd881",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1ba7336a282f883b08503",
      itemType: "Cloze with Drop Down"
    }
  ],
  "5dc3fb360e43cf000724ffa2": [
    {
      itemId: "5dc19b2036a282f883a5f4a1",
      itemType: "Label Image with Text"
    },
    {
      itemId: "5dc19de336a282f883a66897",
      itemType: "Label Image with Text"
    },
    {
      itemId: "5dc19d2f36a282f883a64b48",
      itemType: "Label Image with Text"
    },
    {
      itemId: "5dc1b57936a282f883ae8833",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b69136a282f883af3fa1",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b6c436a282f883af6be2",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b6d436a282f883af7484",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b61036a282f883aed57c",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b66336a282f883af182c",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b60a36a282f883aecff3",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b5d436a282f883aeaafc",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b6f636a282f883af8794",
      itemType: "Essay with rich text"
    }
  ]
};
 */
/* export const assignedTests = {
  "5dc3e3018286cb00071c326b": [
    {
      itemId: "5dc19b2036a282f883a5f4a1",
      itemType: "Label Image with Text"
    },
    {
      itemId: "5dc19de336a282f883a66897",
      itemType: "Label Image with Text"
    },
    {
      itemId: "5dc19d2f36a282f883a64b48",
      itemType: "Label Image with Text"
    },
    {
      itemId: "5dc1b57936a282f883ae8833",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b69136a282f883af3fa1",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b6c436a282f883af6be2",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b6d436a282f883af7484",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b61036a282f883aed57c",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b66336a282f883af182c",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b60a36a282f883aecff3",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b5d436a282f883aeaafc",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1b6f636a282f883af8794",
      itemType: "Essay with rich text"
    }
  ],
  "5dc3bea2b38694000706b3af": [
    {
      itemId: "5dc1b77636a282f883afc862",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1b79736a282f883afd913",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1b73436a282f883afa75a",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1b80236a282f883aff6d3",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1bcc536a282f883b11ac0",
      itemType: "Cloze with Drop Down"
    },
    {
      itemId: "5dc1b84436a282f883b007d3",
      itemType: "Cloze with Drop Down"
    },
    {
      itemId: "5dc1b86436a282f883b00f03",
      itemType: "Cloze with Drop Down"
    },
    {
      itemId: "5dc1b77236a282f883afc5b8",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1b9f536a282f883b065f9",
      itemType: "Cloze with Drop Down"
    },
    {
      itemId: "5dc1bae436a282f883b0a340",
      itemType: "Cloze with Drop Down"
    },
    {
      itemId: "5dc1b79436a282f883afd881",
      itemType: "Cloze with Text"
    },
    {
      itemId: "5dc1ba7336a282f883b08503",
      itemType: "Cloze with Drop Down"
    }
  ],
  "5dc2c932a226b700089e0576": [
    {
      itemId: "5dc1b34636a282f883adc492",
      itemType: "True or false"
    },
    {
      itemId: "5dc1b2b936a282f883ad9835",
      itemType: "True or false"
    },
    {
      itemId: "5dc1b33d36a282f883adc152",
      itemType: "True or false"
    },
    {
      itemId: "5dc1b2c436a282f883ad9bd4",
      itemType: "True or false"
    },
    {
      itemId: "5dc1b35636a282f883adca48",
      itemType: "Math, Text & Dropdown"
    },
    {
      itemId: "5dc1b21736a282f883ad6264",
      itemType: "Math, Text & Dropdown"
    },
    {
      itemId: "5dc1b35f36a282f883adcc58",
      itemType: "Math, Text & Dropdown"
    },
    {
      itemId: "5dc1c72636a282f883b38f4c",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c79c36a282f883b3e227",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c72536a282f883b38ed0",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c84836a282f883b415c2",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c79736a282f883b3dff6",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c7d136a282f883b3f490",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c82336a282f883b40b2d",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c87a36a282f883b4219b",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c7d736a282f883b3f6a1",
      itemType: "Graphing"
    },
    {
      itemId: "5dc1c87436a282f883b42061",
      itemType: "Graphing in the 1st quadrant"
    },
    {
      itemId: "5dc1bf9636a282f883b1d344",
      itemType: "Multiple choice - standard"
    },
    {
      itemId: "5dc1be9a36a282f883b18ff7",
      itemType: "Essay with rich text"
    },
    {
      itemId: "5dc1bcd736a282f883b11fce",
      itemType: "Math, Text & Dropdown"
    },
    {
      itemId: "5dc195dc36a282f883a50dc1",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1947636a282f883a4b68f",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1966e36a282f883a52bf6",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1946036a282f883a4b1bb",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc194a136a282f883a4c0ed",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1953436a282f883a4e4bd",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1942836a282f883a4a2dc",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1948336a282f883a4b9fa",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1950736a282f883a4da8b",
      itemType: "Label Image with Drag & Drop"
    },
    {
      itemId: "5dc1962e36a282f883a51fec",
      itemType: "Label Image with Drag & Drop"
    }
  ],
  "5dc2cf06b0f83c000799480a": [
    {
      itemId: "5dc1970a36a282f883a549bc",
      itemType: "Match list"
    },
    {
      itemId: "5dc19a4536a282f883a5cf36",
      itemType: "Match list"
    },
    {
      itemId: "5dc19a2136a282f883a5c9a4",
      itemType: "Match list"
    },
    {
      itemId: "5dc19a0f36a282f883a5c680",
      itemType: "Match list"
    },
    {
      itemId: "5dc1979e36a282f883a5632d",
      itemType: "Match list"
    },
    {
      itemId: "5dc17bd836a282f883a145d2",
      itemType: "Match list"
    },
    {
      itemId: "5dc1b36b36a282f883add11b",
      itemType: "Match list"
    },
    {
      itemId: "5dc1973736a282f883a55120",
      itemType: "Match list"
    },
    {
      itemId: "5dc197a436a282f883a56425",
      itemType: "Match list"
    },
    {
      itemId: "5dc1b10d36a282f883ad0668",
      itemType: "Match list"
    },
    {
      itemId: "5dc199d836a282f883a5bda6",
      itemType: "Match list"
    }
  ],
  "5dc2a85243e5bb0008cae586": [
    {
      itemId: "5dc1b3e736a282f883adf9d6",
      itemType: "Multiple choice - multiple response"
    },
    {
      itemId: "5dc1b31136a282f883adb270",
      itemType: "Multiple choice - multiple response"
    },
    {
      itemId: "5dc1b44736a282f883ae196d",
      itemType: "Multiple choice - multiple response"
    },
    {
      itemId: "5dc1b42136a282f883ae0c63",
      itemType: "Multiple choice - multiple response"
    },
    {
      itemId: "5dc1b34836a282f883adc537",
      itemType: "Multiple choice - multiple response"
    },
    {
      itemId: "5dc1b50736a282f883ae5dcd",
      itemType: "Multiple choice - multiple response"
    }
  ],
  "5dc27818474ba500079b39eb": [
    {
      itemId: "5dc1b36b36a282f883add11b",
      itemType: "Match list"
    },
    {
      itemId: "5dc17bd836a282f883a145d2",
      itemType: "Match list"
    },
    {
      itemId: "5dc1970a36a282f883a549bc",
      itemType: "Match list"
    },
    {
      itemId: "5dc1973736a282f883a55120",
      itemType: "Match list"
    },
    {
      itemId: "5dc1979e36a282f883a5632d",
      itemType: "Match list"
    },
    {
      itemId: "5dc197a436a282f883a56425",
      itemType: "Match list"
    },
    {
      itemId: "5dc199d836a282f883a5bda6",
      itemType: "Match list"
    },
    {
      itemId: "5dc19a0f36a282f883a5c680",
      itemType: "Match list"
    },
    {
      itemId: "5dc19a2136a282f883a5c9a4",
      itemType: "Match list"
    },
    {
      itemId: "5dc1b10d36a282f883ad0668",
      itemType: "Match list"
    },
    {
      itemId: "5dc29ff430c78e00077f300e",
      itemType: "Match list"
    }
  ]
}; */
