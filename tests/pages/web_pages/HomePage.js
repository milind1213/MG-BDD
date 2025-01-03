const utils  = require('../../commonPlatformUtils/CommonPlaywright.js');

class HomePage {
  constructor(page) {
     this.page = page;
     this.viewAllOffersButton = page.locator(".css-2a8qrw");
  }

  async goTo(url) {
    await this.page.goto(url);
  }

  async clickOnOfferButton() {
    if (await this.viewAllOffersButton.isVisible()) {
      await utils.Click(this.viewAllOffersButton);
      console.log("Clicked on [View All Offers] button");
    } else {
      console.log("Not Visible[View All Offer] Button.");
    }
  }

  async handleCookies(action) 
  {
    const buttons = { 
         accept: this.page.locator('#onetrust-accept-btn-handler'),
         reject: this.page.locator('#onetrust-reject-all-handler')
    };
     const dialog = this.page.locator('div[role="dialog"][aria-label="Welcome"]'); // Cookie consent dialog
         
    for(let retries = 3; retries > 0; retries--)
    {
      if(await dialog.isVisible()) 
      {
        console.log("Cookie consent dialog is visible.");
        const button = buttons[action.toLowerCase()];
        if (button) 
        {
          if (await button.isVisible()) {
              await utils.Click(button);
              console.log(`Clicked successfully on ['${action.charAt(0).toUpperCase() + action.slice(1)} All Cookies]' button `);
              return;
            } else {
              console.warn(`Clicked successfully on ['${action.charAt(0).toUpperCase() + action.slice(1)} All Cookies]' button`);
            }
         } else {
              console.error(`Unknown action: ${action}`);
         }
        } else {
              console.log("Cookie Consent Dialog is not visible.");
              await this.page.reload(); 
              console.log(`Reloading the page and retrying...(${retries - 1} retries left)`);
              await this.page.waitForTimeout(2000);
       } 
     }
   }
}

module.exports = { HomePage };
