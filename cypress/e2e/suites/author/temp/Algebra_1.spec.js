context("Algebra", () => {
  it("test", () => {
    cy.fixture("/dynamic_demo/csv/Algebra-1").then(sheet => {
      let lineSplit = sheet.split("\n");
      const dat = [];
      const requiredLine = lineSplit.slice(2);
      requiredLine.forEach(line => {
        let obj = {};
        let lineElements = line.split(",");
        obj["tags"] = lineElements[0];
        obj["collection"] = "Spark Math";
        obj["name"] = `Algebra-1-${lineElements[1]}`;
        obj["deliveryCount"] = 10;
        obj["standard"] = {};
        obj.standard["standardsToSelect"] = [lineElements[8]];
        obj.standard["subject"] = "Mathematics";
        obj.standard["standardSet"] = "Math - Common Core";
        obj.standard["standardsGroup"] = lineElements[8].slice(0, 3);
        dat.push(obj);
      });
      cy.writeFile("cypress/fixtures/dynamic_demo/data/Algebra_1.json", dat);
      // cy.writeFile("dynsmic_updated",spit);
    });
  });
});
