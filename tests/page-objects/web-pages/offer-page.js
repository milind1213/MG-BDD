const PlaywrightActions  = require('../../common-platform-utils/common-playwright.js');
const log = require('../../../utils/logger');
class OfferPage extends PlaywrightActions {
  constructor(page) {
    super();
    this.page = page;
    this.acceptAllCookiesButton = page.locator("//*[@id='onetrust-accept-btn-handler' and text()='Accept All Cookies']");
    this.newVehicleButton = page.locator("//*[@class='css-k52nb0' and text()='Pre-owned offers']");
    this.preOwnedVehicleButton = page.locator('button:has-text("Pre-owned offers")');
    this.filterButton = page.locator('button:has-text("Filter")').nth(0);
    this.viewBtn = page.locator("//*[@class='css-1p2wkou' ]//parent::button[@class='css-i96fc']");
  }

  
  async click_FilterButton() 
  {
    await new Promise(resolve => setTimeout(resolve, 1000));
    log(`Clicking on the [Filter] button`);
    await this.Click(this.filterButton);

  }

  async clickOnPreOwnedVehicleButton() 
  {
      await this.page.evaluate(() => {
        window.scrollBy(0, 400); 
      });
      const preOwnedButton = this.preOwnedVehicleButton;
      
      log(`Clicking on the [Pre-Owned] button`);
      await this.Click(preOwnedButton);
      let ariaSelected = await preOwnedButton.getAttribute('aria-selected');
     
      let attempts = 0;
      while (ariaSelected !== 'true' && attempts < 3) 
      {
         log(`Pre-Owned Button Click Action Retrying...`);
         attempts++;
         await this.Click(preOwnedButton);
         await this.page.waitForTimeout(2000); 
         ariaSelected = await preOwnedButton.getAttribute('aria-selected');
       }
      if (ariaSelected !== 'true') {
         throw new Error('Failed to select Pre-owned offers button');
      }
    }
  

    async applyFilter(filterText, value) 
    {
        const filterLocator = this.page.locator(`//label[contains(@class,'css-c4oe05') and normalize-space(text())='${filterText}']`);
        const checkboxLocator = this.page.locator(`//input[@type="checkbox" and @value='${value}']`);
       
        log(`Clicking on the [${filterText}] Locator`);
        await this.Click(filterLocator);

        await checkboxLocator.waitFor({ state: 'visible', timeout: 60000 });
        await checkboxLocator.scrollIntoViewIfNeeded();

        log(`Clicking on the [${value}] checkbox`);
        await this.Click(checkboxLocator);
        await this.page.waitForTimeout(3000);
        let isChecked = await checkboxLocator.isChecked();
      
        if (!isChecked) {
          log(`Clicking on the [${value}] checkbox`);
          await this.Click(checkboxLocator);

          await this.page.waitForTimeout(500);
          isChecked = await checkboxLocator.isChecked();
        }
        if (isChecked) {
             log(`Checked for value :[${value}]`);
        } else {
             console.error(`Failed to Click CheckBox for value: ${value}`);
             throw new Error(`Checkbox was not checked for value: ${value}`);
        }
     }
    
    
  async clickOnNewVehicleButton() 
  {
    try {
         await this.page.evaluate(()=>{
             window.scrollBy(0, 400);
        });
    
       utils.Click(this.newVehicleButton);
      
      } catch (error) {
        log(`Error clicking on New Vehicle Button:`,error);
        console.error("Error clicking on New Vehicle Button:", error);
        throw error;
      }
    }
      
  async clickOnViewButton() 
  {
    await this.Click(this.viewBtn);
  }
  
  async getResults() 
  {
    try {
     if (await this.page.locator(".css-4kqkq9").isVisible()) {
          const notFoundText = await this.page.locator(".css-4kqkq9").innerText();
          log(`No offers found [: ${notFoundText}]`);
          return [notFoundText]; 
       }
          const filterLocator = this.page.locator("//*[@class='css-7iasm6']//p");
          const isFilterVisible = await filterLocator.first().isVisible();
       if (isFilterVisible)
       {
          const texts = await filterLocator.allInnerTexts();
          if (!texts || texts.length === 0) {
              console.warn("No filter results found.");
              log(`No filter results found.`);
              return [];
           }
          log("Found results :", texts);
          return texts;
       }
         console.warn("No offers or results found.");
         return [];
      } catch (error) {
         console.error("Error Occurred :", error);
         return []; 
     }
  }
  
  async getOfferResults() 
  {
    const results = await this.page.locator(".offer-results").innerText();
    return results;
  }

}

module.exports = { OfferPage };