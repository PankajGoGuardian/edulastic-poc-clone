context("Algebra", () => {
  it("test", () => {
    cy.fixture("/dynamic_demo/csv/Geometry-2").then(sheet => {
      let lineSplit = sheet.split("\n");
      const dat = [];
      const requiredLine = lineSplit.slice(2);
      requiredLine.forEach(line => {
        let obj = {};
        let lineElements = line.split(",");
        obj["tags"] = lineElements[0];
        obj["collection"] = "Spark Math";
        obj["name"] = `Geometry-1-${lineElements[3]}`;
        obj["deliveryCount"] = 10;
        obj["standard"] = {};
        obj.standard["standardsToSelect"] = [lineElements[2]];
        obj.standard["subject"] = "Mathematics";
        obj.standard["standardSet"] = "Math - Common Core";
        obj.standard["standardsGroup"] = lineElements[2].slice(0, 3);
        dat.push(obj);
      });
      cy.writeFile("cypress/fixtures/dynamic_demo/data/Geometry-2.json", dat);
      // cy.writeFile("dynsmic_updated",spit);
    });
  });
});
