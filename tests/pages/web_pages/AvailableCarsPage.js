const utils  = require('../../commonPlatformUtils/CommonPlaywright.js');
class AvailableCarsPage {
  constructor(page) {
    this.page = page;
    this.pincodeInput = page.locator('.css-d38uju'); 
    this.addressSuggestions = page.locator("//*[@class='css-1f6i4lf']//button");
    this.useMyLocationButton = page.locator("button.css-45r56c:has(.css-1lfoa71:has-text('Use my location'))");
    this.currentRetailerLocator = page.locator("//span[@class='css-xalb5k' and contains(text(),'Polestar')]");
    this.selectedRetailerButton = page.locator("//*[@class='css-14olvoq']//*[@class='css-45r56c']");
    this.availableCarsModelYears = page.locator('.css-1lbhuek .css-zyxx5a'); 
    this.availableCarsPrices = page.locator('.css-1srzivb');
    this.availableCarsPowertrains =page.locator("//*[@class='css-1srzivb']//ancestor::div[@class='css-1vz7d2x']//h2"); 
    this.changeRaitailerFilterBtn = page.locator(".css-1bc8lfl .css-45r56c");
    this.allRetailers = page.locator(".css-lz82b3 .css-45r56c");
    this.defaultFilterCarModel =page.locator('label.css-1x7m8lg');
    this.showMoreButton = page.locator("//*[@class='css-1lfoa71' and text()='Show more']");
    this.sortDefaultFilter = page.locator("label.css-9pq9cn");
    this.sortFilterOptions = page.locator("//*[@id='sort-by-list']//button[contains(@id,'sort-by')]");
  }
  

  async applySortFilter(option) 
  {
    await utils.Click(this.sortDefaultFilter);
    const filterOptionLocator = this.page.locator(`//*[@id='sort-by-list']//button[contains(text(),'${option}')]`);
    const isOptionVisible = await filterOptionLocator.isVisible();
    if (isOptionVisible) {
        await utils.Click(filterOptionLocator);
        console.log(`Applied sort filter: ${option}`);
    } else {
        throw new Error(`Sort filter option "${option}" not found`);
    }
  }

  async getDefaultSortFilterText()  
  {
    await this.page.waitForSelector('label.css-9pq9cn', { state: 'attached' }); 
    const quickDelivery = await utils.getText(this.sortDefaultFilter);
    if (!quickDelivery) 
    { 
       throw new Error("Quick Delivery label not found");
    }
     return quickDelivery.trim();
  }

   async clickShowMore()
   {
     await utils.scrollIntoViewAndClick(this.showMoreButton); //scrollClickText();
     await this.page.waitForTimeout(3000);
   }
  
  async clickContiunWithAddressButton()
  {
    await utils.Click(this.selectedRetailerButton);
    console.log("Clicked on Continue Arrow");
  }

  
  async getDefaultFilterCarModel()  
 {
    await this.page.waitForSelector('label.css-1x7m8lg', { state: 'attached' }); 
    const modelText = await this.page.locator('label.css-1x7m8lg').textContent();
    if (!modelText) 
     { 
       throw new Error("Car model label not found");
     }
     return modelText.trim();
  }
  

  async clickMyLocationButton()
  {
     await utils.Click(this.useMyLocationButton);
  }

  async locationErrorText() 
  {
     const errorText = await utils.getText(this.page, '.css-3ak29v');
     return errorText; 
  }
 

  async enterPinCodeAndSelectAddress(pinCode) 
  {
    await utils.Fill(this.pincodeInput,pinCode);
    await this.pincodeInput.press('Space');
    await this.page.waitForTimeout(5000); 
    
    const suggestion= await this.addressSuggestions.nth(0).innerText();
     if (!suggestion.includes('No result available'||'Loading')) 
     {
       await utils.Click(this.addressSuggestions.nth(0));
       console.log('Clicked on valid suggestion');
       return; 
     } else {
       console.log("Not Found Suggestions");
     }
   }

}

module.exports = { AvailableCarsPage };