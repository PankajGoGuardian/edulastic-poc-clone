context("Algebra", () => {
  it("test", () => {
    cy.fixture("/dynamic_demo/csv/Grade-8").then(sheet => {
      let lineSplit = sheet.split("\n");
      const dat = [];
      const requiredLine = lineSplit.slice(1);
      requiredLine.forEach(line => {
        let obj = {};
        let lineElements = line.split(",");
        obj["tags"] = lineElements[0];
        obj["collection"] = "Spark Math";
        obj["name"] = `Grade-8-${lineElements[3]}`;
        obj["deliveryCount"] = 10;
        obj["standard"] = {};
        obj.standard["standardsToSelect"] = [lineElements[2]];
        obj.standard["grade"] = [`Grade ${lineElements[1]}`];
        obj.standard["subject"] = "Mathematics";
        obj.standard["standardSet"] = "Math - Common Core";
        let tempArray = lineElements[2].split(".");
        obj.standard["standardsGroup"] = `${tempArray[0]}.${tempArray[1]}`;
        dat.push(obj);
      });
      cy.writeFile("cypress/fixtures/dynamic_demo/data/Grade-8.json", dat);
      // cy.writeFile("dynsmic_updated",spit);
    });
  });
});
