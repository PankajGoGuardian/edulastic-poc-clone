context("Algebra", () => {
  it("test", () => {
    cy.fixture("/dynamic_demo/csv/Grade5").then(sheet => {
      const lineSplit = sheet.split("\n");
      const dat = [];
      const requiredLine = lineSplit.slice(1);
      requiredLine.forEach(line => {
        const obj = {};
        const lineElements = line.split(",");
        obj.tags = lineElements[0];
        obj.collection = "Spark Math";
        obj.name = `Grade-4-${lineElements.slice(2, lineElements.length - 1).join("")}`;
        obj.deliveryCount = 10;
        obj.standard = {};
        obj.standard.standardsToSelect = [lineElements[1]];
        obj.standard.grade = [`Grade ${lineElements[lineElements.length - 1].trim()}`];
        obj.standard.subject = "Mathematics";
        obj.standard.standardSet = "Math - Common Core";
        const tempArray = lineElements[1].split(".");
        obj.standard.standardsGroup = `${tempArray[0]}.${tempArray[1]}`;
        dat.push(obj);
      });
      cy.writeFile("cypress/fixtures/dynamic_demo/data/Grade5.json", dat);
      // cy.writeFile("dynsmic_updated",spit);
    });
  });
});
