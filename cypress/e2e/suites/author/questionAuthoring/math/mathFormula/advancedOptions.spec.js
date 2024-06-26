import EditItemPage from "../../../../../framework/author/itemList/itemDetail/editPage";
import ExtrasOptions from "../../../../../framework/author/itemList/questionType/math/mathFormula/extarsOptions";
import FileHelper from "../../../../../framework/util/fileHelper";
import ItemListPage from "../../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Extras on "Math formula" type question`, () => {
  const queData = {
    group: "Math",
    queType: "Math formula"
  };
  const extras = new ExtrasOptions();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();

  before(() => {
    cy.login();
  });

  context(" > User creates question.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    describe(" > Extras", () => {
      /*       before(() => {
        editItem.clickAdvancedOptionsButton(); // UI toggel has been removed
      });
 */
      describe(" > Main options", () => {
        it(" > Enter acknowledgements text", () => {
          const text = "acknowledgements";

          extras
            .getAcknowledgements()
            .clear()
            .type(text)
            .should("contain", text);
        });

        it(" > Enter distractor rationale text", () => {
          const text = "distractorRationale";

          extras
            .getDistractorRationale()
            .clear()
            .type(text)
            .should("contain", text);
        });

        it(" > Enter rubric reference text", () => {
          const text = "rubric reference";

          extras
            .getRubricReference()
            .clear()
            .type(text)
            .should("contain", text);
        });

        it(" > Enter instructor stimulus text", () => {
          const text = "instructor stimulus";

          extras
            .getInstructorStimulus()
            .clear()
            .type(text)
            .should("contain", text);
        });

        it(" > Enter sample answer text", () => {
          const text = "sample answer";

          extras
            .getSampleAnswer()
            .clear()
            .type(text)
            .should("contain", text);
        });
      });

      describe(" > Distractor rationale per response", () => {
        beforeEach(() => {
          extras.deleteAllDistractors();
        });

        it(" > should be able to add new distractor", () => {
          extras
            .clickAddDistractorButton()
            .getDistractorList()
            .find('[data-cy="choice_prefix_0"]')
            .should("be.visible");
        });

        it(" > should be able to delete first distractor", () => {
          extras
            .clickAddDistractorButton()
            .getDistractorList()
            .find('[data-cy="choice_prefix_0"]')
            .should("be.visible");

          extras
            .getDistractorList()
            .find('[data-cy="deleteButton"]')
            .eq(0)
            .should("be.visible")
            .click();

          extras
            .getDistractorList()
            .find('[data-cy="choice_prefix_0"]')
            .should("not.be.visible");
        });

        it(" > should be able to type text", () => {
          const text = "test text";

          extras
            .clickAddDistractorButton()
            .getDistractorList()
            .find('[data-cy="edit_prefix_0"]')
            .should("be.visible")
            .clear()
            .type(text)
            .should("have.value", text);
        });
      });

      describe(" > Hint", () => {
        beforeEach(() => {
          extras.deleteAllHints();
        });

        it(" > should be able to add new hint", () => {
          extras
            .clickAddHintButton()
            .getHintsList()
            .find('[data-cy="quillSortableItem"]')
            .eq(0)
            .should("be.visible");
        });

        it(" > should be able to delete first hint", () => {
          extras
            .clickAddHintButton()
            .getHintsList()
            .find('[data-cy="quillSortableItem"]')
            .should("be.visible");

          extras
            .getHintsList()
            .find('[data-cy="deletehints0"]')
            .should("be.visible")
            .click();

          extras
            .getHintsList()
            .find('[data-cy="quillSortableItem"]')
            .should("not.be.visible");
        });

        it(" > should be able to type text", () => {
          const text = "test text";

          extras
            .clickAddHintButton()
            .getHintsList()
            .find('[data-cy="quillSortableItem"]')
            .eq(0)
            .should("be.visible")
            .find(".ql-editor")
            .type(text)
            .should("contain", text);
        });
      });
    });
  });
});
