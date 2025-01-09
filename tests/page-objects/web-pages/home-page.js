const utils  = require('../../common-platform-utils/common-playwright.js');
const log = require('../../../utils/logger');

class HomePage {
  constructor(page) {
    this.page = page;
    
    this.buttons = { 
    accept: this.page.locator('#onetrust-accept-btn-handler'),
    reject: this.page.locator('#onetrust-reject-all-handler')};
    this.viewAllOffersButton = page.locator(".css-2a8qrw");
    this.dialog = page.locator('div[role="dialog"][aria-label="Welcome"]'); // Cookie consent dialog
    this.availablecars = page.locator("#LRik6sCsS2a9j9B-FsyNbw")
  } 

  async goTo(url) 
  {
    log(`[Navigating to URL] - ${url}`);
    await this.page.goto(url);
  }

  async clickHeader(header) 
  {
    const headerLocator = this.page.locator(".css-1lfoa71", { hasText: header });
    await utils.waitLocaterVisibility(headerLocator);
    await utils.Click(headerLocator); 
  }
  
  // async clickShoppingToolOption(option) {
  //   try {
  //       const locator = `//a[@class='css-4c83wv' and contains(text(),'${option}')]`;
  //       const element = this.page.locator(locator);
  //       await element.waitFor({ state: 'visible' });
  //       await utils.clickWithRetries(element);
  //   } catch (error) {
  //       log(`Option "${option}" not found or could not be clicked:`, error);
  //   }
  // }



  async clickShoppingToolOption(option) {
    try {
        const locator = `//a[@class='css-4c83wv' and contains(text(),'${option}')]`;
        const element = this.page.locator(locator);

        // Wait for the element to be attached to the DOM and stable
        await element.waitFor({
            state: 'attached',
            timeout: 10000, // Increase timeout if needed
        });

        // Scroll the element into view explicitly (Playwright does this automatically, but adding for safety)
        await element.scrollIntoViewIfNeeded();

        // Check if the element is blocked by any other element
        const isIntersected = await element.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const elementFromPoint = document.elementFromPoint(centerX, centerY);
            return elementFromPoint === el || el.contains(elementFromPoint);
        });

        if (!isIntersected) {
            throw new Error('Element is obstructed by another element.');
        }

        // Attempt click with retries for dynamic elements
        await element.click({ timeout: 10000, force: false });

        log(`Successfully clicked the "${option}" option.`);
    } catch (error) {
        log(`Option "${option}" not found or could not be clicked:`, error);
        throw error; // Optionally, rethrow the error for further handling
    }
}


  async checkPageTitleContains(expectedText) 
  {
    const title = await this.page.title();
    if (title.includes(expectedText)) {
        log(`Page title contains the expected text: "${expectedText}"`);
    } else {
        log(`Page title does not contain the expected text. Actual title: "${title}"`);
    }
  }

  async clickOnOfferButton() 
  {
    if (await this.viewAllOffersButton.isVisible()) 
    {
        await utils.Click(this.viewAllOffersButton);
        log("Clicked on [View All Offers] button");
     } else {
        log("Not Visible [View All Offers] Button.");
    }
  }

  async handleCookies(action) 
  {
    const button = this.buttons[action.toLowerCase()];
    if (!button)
    {
      log(`Unknown action: ${action}`);
      console.error(`Unknown action: ${action}`);
      return;
    }

    for (let retries = 3; retries > 0; retries--)
    {
      if (await this.dialog.isVisible()) 
      {
         log("Cookie consent dialog is visible.");
        if (await button.isVisible())
        {
           await utils.Click(button);
           log(`Clicked successfully on ['${action.charAt(0).toUpperCase() + action.slice(1)} All Cookies]' button`);
           return;
         } else {
           console.warn(`Button for action '${action}' is not visible, retrying...`);
         }
       } else {
           log("Cookie consent dialog is not visible.");
        if (retries > 1) {
           log(`Reloading the page and retrying...(${retries - 1} retries left)`);
           await this.page.reload();
           await this.page.waitForTimeout(2000);
        } else {
           log("Max retries reached. Unable to handle cookies.");
        }
       }
      }
    }

}

module.exports = { HomePage };
