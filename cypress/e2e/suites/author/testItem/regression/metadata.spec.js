import MetadataPage from "../../../../framework/author/itemList/itemDetail/metadataPage";
import { subject, grades } from "../../../../framework/constants/assignmentStatus";
import { DOK, DIFFICULTY } from "../../../../framework/constants/questionAuthoring";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import { questionGroup, questionType } from "../../../../framework/constants/questionTypes";
import FileHelper from "../../../../framework/util/fileHelper";
import MCQTrueFalsePage from "../../../../framework/author/itemList/questionType/mcq/mcqTrueFalsePage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import CypressHelper from "../../../../framework/util/cypressHelpers";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}> item metadata page verification`, () => {
  const metadataPage = new MetadataPage();
  const editItemPage = new EditItemPage();
  const mcqTrueFalsePage = new MCQTrueFalsePage();
  const itemListPage = new ItemListPage();

  const { _ } = Cypress;
  const tags = ["item tag 1", "item tag 2", "item tag 3"];
  const standardMaps = [
    {
      subjects: subject.MATH,
      stadardSet: "Math - Common Core",
      grade: [grades.GRADE_7, grades.GRADE_6],
      standards: { "7.NS": ["7.NS.A.2.c"], "6.EE": ["6.EE.A.1", "6.EE.A.2.a"] }
    },
    {
      subjects: subject.ELA,
      stadardSet: "ELA - Common Core",
      grade: [grades.KINDERGARTEN],
      standards: { "CCRA.L": ["CCRA.L.6"], "CCRA.R": ["CCRA.R.1"] }
    },
    {
      subjects: subject.SOCIAL_STUDIES,
      stadardSet: "Georgia Social Studies",
      grade: [grades.GRADE_5, grades.GRADE_6],
      standards: { SS6CG2: ["SS6CG2.a"], SS6CG4: ["SS6CG4.a"] }
    }
  ];
  let itemid;

  before("> login and create item", () => {
    cy.login("teacher", "teacher.metadata.testitem@snapwiz.com", "snapwiz");
    editItemPage.createNewItem();
    editItemPage.chooseQuestion(questionGroup.MCQ, questionType.MCQ_TF);
    editItemPage.header.metadata();
  });
  context("> standards and its mapping using dropdowns", () => {
    standardMaps.forEach((standardMap, index) => {
      const { subjects, stadardSet, grade, standards } = standardMap;
      context(`> standard map-${index + 1}`, () => {
        before("> open drop down container", () => {
          metadataPage.clickOnStandardSearchOption();
        });
        it("> subject dropdown", () => {
          metadataPage.selectSubject(subjects);
          metadataPage.verifySelectedSubject(subjects);
        });

        it("> standard set dropdown", () => {
          metadataPage.selectStandardSet(stadardSet);
          metadataPage.verifySelectedStandardSet(stadardSet);
        });

        it("> grades dropdown", () => {
          metadataPage.selectGrade(grade);
          grade.forEach(gra => metadataPage.verifySelectedGrade(gra));
        });

        it("> verify standard set and grade in standard search dropdown", () => {
          cy.get("body").click(); // to close dropdown
          metadataPage.verifySubjectAndGradeInStandardSearchOption(stadardSet, grade);
        });

        it("> associated standards in dropdown", () => {
          let standardToselect = [];
          _.values(standards).forEach(sta => {
            standardToselect = _.union(standardToselect, sta);
          });

          metadataPage.routeStandardSearch();
          metadataPage.setStandard(standardToselect);
          standardToselect.forEach(standard => metadataPage.verifySelectedStandards(standard));
        });
      });
    });
  });

  context("> standards and its mapping using browse standards", () => {
    standardMaps.forEach((standardMap, index) => {
      const { subjects, stadardSet, grade, standards } = standardMap;
      context(`> standard browsing -${index + 1}`, () => {
        before("> open drop down container", () => {
          metadataPage.clearStandards();
          metadataPage.clickBrowseStandards();
        });
        it("> subject dropdown in standard browsing", () => {
          metadataPage.selectSubjectInBrowseStandards(subjects);
          metadataPage.verifySelectedSubjectInBrowseStandards(subjects);
        });

        it("> standard set dropdown in standard browsing", () => {
          metadataPage.selectStandardSetInBrowseStandards(stadardSet);
          metadataPage.verifySelectedStandardSetInBrowseStandards(stadardSet);
        });

        it("> grades dropdown in standard browsing", () => {
          metadataPage.selectGradeInBrowseStandards(grade);
          grade.forEach(gra => metadataPage.verifySelectedGradeInBrowseStandards(gra));
        });

        it("> associated domains and standards in dropdown in standard browsing", () => {
          metadataPage.getAllCurrentStandardDomains().should("be.visible");
          _.entries(standards).forEach(entry => {
            metadataPage.selectStandardDomainInBrowseStandards(entry[0]);
            metadataPage.selectStandardInBrowseStandards(entry[1]);
          });
          metadataPage.clickApplyInBrowseStandard();
        });

        it("> verify standard set and grade in standard search dropdown", () => {
          let standardToselect = [];
          _.values(standards).forEach(sta => {
            standardToselect = _.union(standardToselect, sta);
          });
          standardToselect.forEach(standard => metadataPage.verifySelectedStandards(standard));
          metadataPage.verifySubjectAndGradeInStandardSearchOption(stadardSet, grade);
        });
      });
    });
  });

  context("> item dok", () => {
    _.values(DOK).forEach(dok => {
      it(`> for dok '${dok}'`, () => {
        metadataPage.setDOK(dok);
        metadataPage.verifySelectedDok(dok);
      });
    });
  });

  context("> item difficulty", () => {
    _.values(DIFFICULTY).forEach(difficulty => {
      it(`> for difficulty '${difficulty}'`, () => {
        metadataPage.setDifficulty(difficulty);
        metadataPage.verifySelectedDifficulty(difficulty);
      });
    });
  });

  context("> item tags", () => {
    tags.forEach(tag => {
      it(`> for tag '${tag}'`, () => {
        metadataPage.setTag(tag);
        metadataPage.verifySelectedTag(tag);
      });
    });
  });

  context("> save and publish item without standard", () => {
    before("> create new item", () => {
      editItemPage.createNewItem();
      editItemPage.chooseQuestion(questionGroup.MCQ, questionType.MCQ_TF);
    });

    it("> trying to save without question text", () => {
      mcqTrueFalsePage.header.getSaveButton().click();
      CypressHelper.verifyAntMesssage("Question text should not be empty");
      mcqTrueFalsePage.header.getPublishButton().should("not.exist");
    });

    it("> enter text and trying to publish item without standard", () => {
      mcqTrueFalsePage.setQuestionEditorText("text");
      mcqTrueFalsePage.header.saveAndgetId().then(id => {
        cy.saveItemDetailToDelete(id);
        cy.url().should("contain", id);
        mcqTrueFalsePage.header.getPublishButton().click();
        editItemPage.clickProceedToPublishWithoutStandard();
        itemListPage.getCreateNewItem();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.typeInSearchBox(id);
        itemListPage.getItemContainerInlistById(id).should("be.visible");
      });
    });
  });

  context("> save and publish item with all options", () => {
    const { subjects, stadardSet, grade, standards } = standardMaps[0];
    let standardToselect = [];
    _.values(standards).forEach(sta => {
      standardToselect = _.union(standardToselect, sta);
    });
    before("> create new item", () => {
      itemListPage.sidebar.clickOnDashboard();
      editItemPage.createNewItem();
      editItemPage.chooseQuestion(questionGroup.MCQ, questionType.MCQ_TF);
      mcqTrueFalsePage.setQuestionEditorText("text");
    });

    it("> set standards, tags ,dok and difficulty", () => {
      editItemPage.header.metadata();

      metadataPage.clickOnStandardSearchOption();
      metadataPage.selectSubject(subjects);
      metadataPage.selectStandardSet(stadardSet);
      metadataPage.selectGrade(grade);

      metadataPage.routeStandardSearch();
      metadataPage.setStandard(standardToselect);

      metadataPage.setDOK(DOK.ExtendedThinking);
      metadataPage.setDifficulty(DIFFICULTY.Easy);
      metadataPage.setTag(tags[0]);
    });

    it("> save and publish", () => {
      editItemPage.header.save();
      editItemPage.header.clickOnPublishItem().then(id => {
        itemid = id;
      });
    });

    it("> verify metadata page of published item", () => {
      expect(itemid).not.to.be.undefined;
      itemListPage.sidebar.clickOnDashboard();
      itemListPage.sidebar.clickOnItemBank();
      itemListPage.searchFilters.clearAll();
      itemListPage.clickOnViewItemById(itemid);
      itemListPage.itemPreview.clickEditOnPreview();

      editItemPage.header.metadata();
      metadataPage.verifySubjectAndGradeInStandardSearchOption(stadardSet, grade);
      standardToselect.forEach(sta => metadataPage.verifySelectedStandards(sta));

      metadataPage.verifySelectedDok(DOK.ExtendedThinking);
      metadataPage.verifySelectedTag(tags[0]);
      metadataPage.verifySelectedDifficulty(DIFFICULTY.Easy);
    });

    it("> add some more standards and verify", () => {
      expect(itemid).not.to.be.undefined;
      metadataPage.clickBrowseStandards();
      metadataPage.selectSubjectInBrowseStandards(standardMaps[1].subjects);
      metadataPage.selectStandardSetInBrowseStandards(standardMaps[1].stadardSet);
      metadataPage.selectGradeInBrowseStandards(standardMaps[1].grade);
      metadataPage.getAllCurrentStandardDomains().should("be.visible");
      _.entries(standardMaps[1].standards).forEach(entry => {
        metadataPage.selectStandardDomainInBrowseStandards(entry[0]);
        metadataPage.selectStandardInBrowseStandards(entry[1]);
        standardToselect = _.union(standardToselect, entry[1]);
      });

      metadataPage.clickApplyInBrowseStandard();
      standardToselect.forEach(standard => metadataPage.verifySelectedStandards(standard));
    });
  });
});
