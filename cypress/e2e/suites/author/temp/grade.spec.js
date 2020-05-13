context("Algebra", () => {
  it("test", () => {
    cy.fixture("/dynamic_demo/csv/engageny").then(sheet => {
      const requiredLine = sheet.split("\n");
      const dat = { module1: {} };
      let modu = 1;
      let totalSd = 1;
      let test = 0;
      // const requiredLine = lineSplit.slice(1);
      console.log(requiredLine.length);
      requiredLine.forEach(line => {
        if (line.split(",")[0] === "EOM") {
          modu++;
          test = 0;
          dat[`module${modu}`] = {};
        } else {
          totalSd++;
          test++;
          const lineElements = line.split(",");
          dat[`module${modu}`][`test${test}`] = [];
          lineElements.slice(1).forEach((std, index) => {
            const obj = {};
            obj.collection = "Spark Math";
            obj.name = `${lineElements[0]}`;
            obj.deliveryCount = 10;
            obj.standard = {};
            obj.standard.standardsGroup;
            obj.standard.standardsToSelect = [];
            std = std.trim();

            if (std.charAt(0) === `"`) std = std.split(`"`)[1];
            if (std.charAt(std.length - 1) === `"`) std = std.split(`"`)[0];

            let temp1 = std.split(".");

            if (temp1[temp1.length - 1].toString().length === 2) {
              console.log(std);
              const temp = std.split(`.`);
              console.log(temp[temp.length - 1].split(""));
              temp[temp.length - 1] = temp[temp.length - 1].split("").join(".");
              std = temp.join(".");
              console.log(std);
            }
            const tempArray = std.split(".");
            obj.standard.standardsGroup = `${tempArray[0]}.${tempArray[1]}`;
            obj.standard.standardsToSelect.push(std);
            obj.standard.grade = [`Grade 7`];
            obj.standard.subject = "Mathematics";
            obj.standard.standardSet = "Math - Common Core";
            // console.log(obj);
            dat[`module${modu}`][`test${test}`].push(obj);
          });
        }
      });
      // console.log(totalSd);
      cy.writeFile("cypress/fixtures/dynamic_demo/data/engageny.json", dat);
      // cy.writeFile("dynsmic_updated",spit);
    });
  });
});
