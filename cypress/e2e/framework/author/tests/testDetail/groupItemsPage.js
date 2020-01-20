import CypressHelper from "../../../util/cypressHelpers";

export default class GroupItemsPage {
  clickOnAddGroup = () => cy.get('[data-cy="add-group"]').click();

  clickOnDone = () => cy.get('[data-cy="done"]').click();

  // auto select

  getAutoSelectItemForGroup = group => cy.get(`[data-cy="autoselect-${group}"]`);

  checkAutoSelectForGroup = group => this.getAutoSelectItemForGroup(group).check();

  uncheckAutoSelectForGroup = group => this.getAutoSelectItemForGroup(group).uncheck();

  // question delievery
  checkDeliverAllItemForGroup = group => cy.get(`[data-cy="check-deliver-all-${group}"]`).check();

  checkDeliverCountForGroup = group => cy.get(`[data-cy="check-deliver-bycount-${group}"]`).check();

  setItemCountForGroup = (group, count) =>
    cy.get(`[data-cy="input-deliver-bycount-${group}"]`).type(`{selectall}${count}`);

  // filters
  setFilterForGroup = (group, { collection, standard, dok, tags, difficulty, count }) => {
    if (collection) CypressHelper.selectDropDownByAttribute("collection", collection);
    if (standard) CypressHelper.selectDropDownByAttribute("standard", standard);
    if (dok) CypressHelper.selectDropDownByAttribute("dok", dok);
    if (tags) CypressHelper.selectDropDownByAttribute("tags", tags);
    if (difficulty) CypressHelper.selectDropDownByAttribute("difficulty", difficulty);
    if (count) cy.get(`data-cy="count-${group}"`);
  };

  getItemContainerForGroup = group => cy.get(`[data-cy="item-container-${group}"]`);
}
