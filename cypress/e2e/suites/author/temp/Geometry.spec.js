context("Algebra", () => {
  it("test", () => {
    cy.fixture("/dynamic_demo/csv/Geomerty").then(sheet => {
      let lineSplit = sheet.split("\n");
      const dat = [];
      const requiredLine = lineSplit.slice(1);
      requiredLine.forEach(line => {
        let obj = {};
        let lineElements = line.split(",");
        obj["tags"] = lineElements[0];
        obj["collection"] = "Spark Math";
        obj["name"] = `Geometry-1-${lineElements[2]}`;
        obj["deliveryCount"] = 10;
        obj["standard"] = {};
        obj.standard["standardsToSelect"] = [lineElements[1]];
        obj.standard["grade"] = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
        obj.standard["subject"] = "Mathematics";
        obj.standard["standardSet"] = "Math - Common Core";
        obj.standard["standardsGroup"] = lineElements[1].slice(0, 3);
        dat.push(obj);
      });
      cy.writeFile("cypress/fixtures/dynamic_demo/data/Geometry-2.json", dat);
      // cy.writeFile("dynsmic_updated",spit);
    });
  });
});
