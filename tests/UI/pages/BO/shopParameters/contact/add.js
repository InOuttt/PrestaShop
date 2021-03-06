require('module-alias/register');
const BOBasePage = require('@pages/BO/BObasePage');

module.exports = class AddContact extends BOBasePage {
  constructor(page) {
    super(page);

    this.pageTitleCreate = 'Contacts •';
    this.pageTitleEdit = 'Contacts •';

    // Selectors
    this.pageTitleLangButton = '#contact_title';
    this.pageTitleLangSpan = lang => `div.dropdown-menu[aria-labelledby='contact_title'] span[data-locale='${lang}']`;
    this.titleInputEN = '#contact_title_1';
    this.titleInputFR = '#contact_title_2';
    this.emailAddressInput = '#contact_email';
    this.enableSaveMessagesLabel = id => `label[for='contact_is_messages_saving_enabled_${id}']`;
    this.descriptionTextareaEN = '#contact_description_1';
    this.descriptionTextareaFR = '#contact_description_2';
    this.saveContactButton = '#save-button';
  }

  /*
  Methods
   */

  /**
   * Change language for selectors
   * @param lang
   * @return {Promise<void>}
   */
  async changeLanguageForSelectors(lang = 'en') {
    await Promise.all([
      this.page.click(this.pageTitleLangButton),
      this.waitForVisibleSelector(`${this.pageTitleLangButton}[aria-expanded='true']`),
    ]);
    await Promise.all([
      this.page.click(this.pageTitleLangSpan(lang)),
      this.waitForVisibleSelector(`${this.pageTitleLangButton}[aria-expanded='false']`),
    ]);
  }

  /**
   * Fill form for add/edit contact
   * @param contactData
   * @returns {Promise<string>}
   */
  async createEditContact(contactData) {
    await this.setValue(this.titleInputEN, contactData.title);
    await this.setValue(this.emailAddressInput, contactData.email);
    await this.setValue(this.descriptionTextareaEN, contactData.description);
    await this.changeLanguageForSelectors('fr');
    await this.setValue(this.titleInputFR, contactData.title);
    await this.setValue(this.descriptionTextareaFR, contactData.description);
    await this.page.click(this.enableSaveMessagesLabel(contactData.saveMessage ? 1 : 0));
    // Save Contact
    await this.clickAndWaitForNavigation(this.saveContactButton);
    return this.getTextContent(this.alertSuccessBlockParagraph);
  }
};
