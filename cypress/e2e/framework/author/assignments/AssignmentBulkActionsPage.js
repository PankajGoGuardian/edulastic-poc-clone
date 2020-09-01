import CypressHelper from "../../util/cypressHelpers";

export const filter = {
  ALL : "allFilter",
  NOT_OPEN : "notOpenFilter",
  IN_PROGRESS : "inProgressFilter",
  IN_GRADING : "inGradingFilter",
  DONE : "doneFilter"
}

export const icons = {
  LCB : "lcb",
  EXPRESS_GRADER : "expressGrader",
  REPORTS : "reports"
}

export default class AssignmentBulkActionsPage {
  getSelectAllCheckBox = () =>
    cy
      .get(`.ant-table-thead >tr >th`)
      .eq(0)
      .find(`.ant-checkbox`);

  getOpenActionButton = () => cy.get(`[data-cy="openButton"]`);

  getCloseActionButton = () => cy.get(`[data-cy="closeButton"]`);

  getMoreActionButton = () => cy.get(`[data-cy="moreButton"]`);

  getDoneActionButton = () => cy.get(`[data-cy="doneButton"]`);

  getConfirmButton = () => cy.get('[data-cy="submitConfirm"]')

  getConfirmationInput = () => cy.get('[data-cy="confirmationInput"]');

  getPauseActionButton = () => cy.get(`[data-cy="pauseButton"]`);

  getTotalSelected = () => cy.get(`[data-cy="totalSelected"]`);

  getTestByID = id => cy.get(`[data-row-key='${id}_assessment']`);

  getClassRows = ()=> cy.get(`.ant-table-tbody > tr`);

  getFilterOption = option => cy.get(`[data-cy=${option}]`)

  clickIconByClassName = (icon, className) =>{
    cy.server();
    cy.route("GET", "**/assignments/**").as("assignment");
    cy.contains(className).then($className =>{
      cy.wrap($className).closest("tr").find(`[data-cy="${icon}"]`).click().then(()=>{
        cy.wait("@assignment");
      })
      switch (icon) {
        case icons.LCB :
          cy.url().then(url => {
            assert.isTrue(url.includes(`author/classboard/`),"Not redirected to LCB page :")
          })
          break;
        case icons.EXPRESS_GRADER :
          cy.url().then(url => {
            assert.isTrue(url.includes(`author/expressgrader/`),"Not redirected to Express grader page :")
          })
          break;
        case icons.REPORTS :
          cy.url().then(url => {
            assert.isTrue(url.includes(`author/standardsBasedReport/`),"Not redirected to Reports page :")
          })
          break;
        default:
          break;
      }
      cy.get('[data-cy="studentName"]',{timeout: 15000}).should("have.length.greaterThan", 0);
    })
  }

  verifyAssignmentStatusOfClass = (className,status) => {
    this.getClassRows().each(($row) =>{
      if($row.find(`td`).eq(1).text() === className){
        cy.wrap($test).closest(`tr`).find('[status]').should(`have.text`,status)
      }
    })
  };

  selectAllClassesCheckBox = (check = true) => {
    this.getSelectAllCheckBox().then($ele => {
      if (check) {
        if (!$ele.hasClass("ant-checkbox-checked")) cy.wrap($ele).click();
      } else if ($ele.hasClass("ant-checkbox-checked")) cy.wrap($ele).click();
    });
    cy.wait(500)
  };

  selectClassByClassName = (className, check=true) =>{
    this.getClassRows().each(($row) =>{
      if($row.find(`td`).eq(1).text() == className){
        if(check){
          if(!$row.find(`td`).find(`.ant-checkbox`).hasClass(`.ant-checkbox-checked`)){
            cy.wrap($row.find(`td`).find(`.ant-checkbox`)).click()
          }
        }else if($row.find(`td`).find(`.ant-checkbox`).hasClass(`.ant-checkbox-checked`)){
            cy.wrap($row.find(`td`).find(`.ant-checkbox`)).click()
          }
      }
    })
  }

  selectClassByRowNumber = (index, check=true) =>{
    this.getClassRows().eq(index).then(($row) =>{
        if(check){
          if(!$row.find(`td`).find(`.ant-checkbox`).hasClass(`.ant-checkbox-checked`)){
            cy.wrap($row.find(`td`).find(`.ant-checkbox`)).click()
          }
        }else if($row.find(`td`).find(`.ant-checkbox`).hasClass(`.ant-checkbox-checked`)){
            cy.wrap($row.find(`td`).find(`.ant-checkbox`)).click()
          }
    })
  }

  clickNextPage = () =>{
    cy.get(`[title="Next Page"]`).click()
    cy.wait(500)
  }

  verifyAllClassesSelected = (check = true) => {
    this.getClassRows().find(`.ant-checkbox`).each($ele => {
      if (check) {
        assert.isTrue($ele.hasClass("ant-checkbox-checked"),"All classes are not selected : ")
      } else {
        assert.isTrue(!$ele.hasClass("ant-checkbox-checked"),"Classes are selected : ")
      }
    });
  };

  verifyTotalClassesSelected = total =>{
    this.getTotalSelected().then( $ele =>{
      assert.equal($ele.text(),total,"Total selected class does not match :")
    })
  }

  clickTestByID = id => {
    cy.server();
    cy.route("GET", "**/assignments/district/**").as("getClasses");
    this.getTestByID(id).click({ force: true });
    cy.wait("@getClasses");
  };

  verifyAssignmentAttributesTestId = (testId, testName, classes, totalStudents, notStarted, inProgress, submitted,graded) => {
    this.getTestByID(testId).find(`td`).then($ele=>{
      if (testName) expect($ele.eq(1).text().trim(),'verify testing name').to.eq(testName);
      if (classes) expect($ele.eq(3).text().trim(),'verify testing number of classes ').to.eq(classes);
      if (totalStudents) expect($ele.eq(4).text().trim(),'verify number of students').to.eq(totalStudents);
      if (notStarted) expect($ele.eq(5).text().trim(),'verify not started').to.eq(notStarted);
      if (inProgress) expect($ele.eq(6).text().trim(),'verify inProgress').to.eq(inProgress);
      if (submitted) expect($ele.eq(7).text().trim(),'verify submitted').to.eq(submitted);
      if (graded) expect($ele.eq(8).text().trim(),'verify graded').to.eq(graded);
    })
  };

  clickOpenActionButton = (message) => {
    this.getOpenActionButton().click().then(()=>{
      CypressHelper.verifyAntMesssage("Starting Bulk Action Request");
      this.waitForBulkProcess(message)
    });
  };

  clickCloseActionButton = (message) => {
    this.getCloseActionButton().click().then(()=>{
      cy.get(".ant-notification-notice-message",{timeout: 20000}).should("contain", "Starting Bulk Action Request")
          .should("be.visible")
      this.waitForBulkProcess(message)
    });
  };

  clickDoneActionButton = (message) => {
    this.getDoneActionButton().click().then(()=>{
      cy.get(".ant-notification-notice-message",{timeout: 20000}).should("contain", "Starting Bulk Action Request")
          .should("be.visible")
      this.waitForBulkProcess(message)
    });
  };

  clickUnassignActionButton = (message) => {
    this.getMoreActionButton().trigger('mouseover');
    cy.contains("Unassign").click({force:true})
    this.getConfirmationInput().type("UNASSIGN")
    this.getConfirmButton().click().then(()=>{
      cy.get(".ant-notification-notice-message",{timeout: 20000}).should("contain", "Starting Bulk Action Request")
          .should("be.visible")
      this.waitForBulkProcess(message)
    });
  };

  clickPauseActionButton = (message) => {
    this.getPauseActionButton().click().then(()=>{
      CypressHelper.verifyAntMesssage("Starting Bulk Action Request");
      this.waitForBulkProcess(message)
    });
  };

  clickCloseActionButton = (message) => {
    this.getCloseActionButton().click().then(()=>{
      CypressHelper.verifyAntMesssage("Starting Bulk Action Request");
      this.waitForBulkProcess(message)
    });
  };

  waitForBulkProcess= (message) =>{
    cy.server();
    cy.route("GET", "**/assignments/district/**").as("bulkProcess");
    cy.get(".ant-notification-notice-message",{timeout: 30000}).should("contain", message)
    .should("be.visible")
    .then($ele => {
      $ele.detach();
    });
    cy.wait("@bulkProcess").then(xhr =>{
     assert.isTrue(xhr.status === 200,`Bulk process failed`);
    })
  }

  filterBy = filterStatus =>{
    this.getFilterOption(filterStatus).click()
    cy.wait(500)
  }

  verifyNumberofClassesInFilter = (filterStatus,number) =>{
    this.getFilterOption(filterStatus).then($ele =>{
      assert.equal($ele.text(), number, `Unexpected number of classes in the filter :`)
    })
    
  }

  verifyNumberofClassesFiltered = numberOfClasses =>{
    this.getClassRows().then($classRows => {
      assert.equal($classRows.length, numberOfClasses, `Unexpected number of classes filtered: `)
    })
  }

  verifyFilteredClasses = classes =>{
    this.getClassRows().each(($row,index) =>{
      assert.equal($row.find(`td`).eq(1).text(),classes[index],'Class names not matching')
    })
  }

  verifyFilterAndStatusColor = (status) =>{
    let filterColor;
    this.getFilterOption(status).closest(`div`).then($filterOption =>{
      filterColor = $filterOption.css( "background-color")
    })
    this.getClassRows().find(`td > button`).each($row =>{
      assert.equal($row.css( "background-color"),filterColor,'Filter color and classes status color not matching')
    })
  }
}