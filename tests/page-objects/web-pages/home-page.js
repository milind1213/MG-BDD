const utils  = require('../../common-platform-utils/common-playwright.js');

class HomePage {
  constructor(page) {
    this.page = page;
    
    this.buttons = { 
    accept: this.page.locator('#onetrust-accept-btn-handler'),
    reject: this.page.locator('#onetrust-reject-all-handler')};
    this.viewAllOffersButton = page.locator(".css-2a8qrw");
    this.dialog = page.locator('div[role="dialog"][aria-label="Welcome"]'); // Cookie consent dialog
  }  

  async goTo(url) 
  {
    await this.page.goto(url);
  }

  async clickHeader(header) 
  {
    const headerLocator = this.page.locator(".css-1lfoa71", { hasText: header });
    await utils.Click(headerLocator);
  }
  
  async clickShoppingToolOption(option) 
  {
    try {
        await utils.Click(this.page.locator(`//a[@class='css-4c83wv' and contains(text(),'${option}')]`));
    } catch (error) {
        console.error(`Option "${option}" not found:`, error);
    }
  }

  
  async checkPageTitleContains(expectedText) 
  {
    const title = await this.page.title();
    if (title.includes(expectedText)) {
        console.log(`Page title contains the expected text: "${expectedText}"`);
    } else {
        console.error(`Page title does not contain the expected text. Actual title: "${title}"`);
    }
  }

  async clickOnOfferButton() 
  {
    if (await this.viewAllOffersButton.isVisible()) 
    {
        await utils.Click(this.viewAllOffersButton);
        console.log("Clicked on [View All Offers] button");
     } else {
        console.log("Not Visible [View All Offers] Button.");
    }
  }

  async handleCookies(action) 
  {
    const button = this.buttons[action.toLowerCase()];
    if (!button)
    {
      console.error(`Unknown action: ${action}`);
      return;
    }

    for (let retries = 3; retries > 0; retries--)
    {
      if (await this.dialog.isVisible()) 
      {
           console.log("Cookie consent dialog is visible.");
        if (await button.isVisible())
        {
           await utils.Click(button);
           console.log(`Clicked successfully on ['${action.charAt(0).toUpperCase() + action.slice(1)} All Cookies]' button`);
           return;
         } else {
           console.warn(`Button for action '${action}' is not visible, retrying...`);
         }
       } else {
           console.log("Cookie consent dialog is not visible.");
        if (retries > 1) {
           console.log(`Reloading the page and retrying...(${retries - 1} retries left)`);
           await this.page.reload();
           await this.page.waitForTimeout(2000);
        } else {
          console.log("Max retries reached. Unable to handle cookies.");
        }
       }
      }
    }


}

module.exports = { HomePage };
