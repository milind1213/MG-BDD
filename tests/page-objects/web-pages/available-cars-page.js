const PlaywrightActions  = require('../../common-platform-utils/common-playwright.js');
const log = require('../../../utils/logger');

class AvailableCarsPage extends PlaywrightActions {
  constructor(page) 
  {
    super();
    this.page = page;
    this.pincodeInput = page.locator('.css-d38uju'); 
    this.addressSuggestions = page.locator("//*[@class='css-1f6i4lf']//button");
    this.useMyLocationButton = page.locator("button.css-45r56c:has(.css-1lfoa71:has-text('Use my location'))");
    this.currentRetailerLocator = page.locator("//span[@class='css-xalb5k' and contains(text(),'Polestar')]");
    this.selectedRetailerButton = page.locator("//*[@class='css-14olvoq']//*[@class='css-45r56c']");
    this.availableCarsModelYears = page.locator('.css-1lbhuek .css-zyxx5a'); 
    this.availableCarsPrices = page.locator('.css-1ar9meh .css-xalb5k'); 
    this.availableCarsPowertrains =page.locator(".css-e7u0kg .css-xalb5k"); 
    this.changeRaitailerFilterBtn = page.locator(".css-1bc8lfl .css-45r56c");
    this.allRetailers = page.locator(".css-lz82b3 .css-45r56c");
    this.avalableCarsTextLoc = page.locator("//*[@class='css-s1jl81' and text()='Available cars.']");
    this.defaultFilterCarModel =page.locator('label.css-1x7m8lg');
    this.showMoreButton = page.locator("//*[@class='css-1lfoa71' and text()='Show more']");
    this.sortDefaultFilter = page.locator("label.css-9pq9cn");
    this.sortFilterOptions = page.locator("//*[@id='sort-by-list']//button[contains(@id,'sort-by')]");
    this.filterButton = page.locator(".css-1832an4");
    this.closeFilterBtn = page.locator("button[title='close'] span[class='css-62qso3'] svg");
    this.aapliedFiltersLocator = page.locator(".css-15llhoi span:nth-child(1)");
    this.resultsButton = page.locator("//*[@class='css-1lfoa71' and text()='results']");
  }

  async clickOnFilter()
  {
    log("Clicking on Filter Button");
    await this.Click(this.filterButton);
    this.page.waitForTimeout(5000);
  }

  async clickResultButton()
  {
    log("Clicking on Result Button");
    await this.scrollIntoViewAndClick(this.resultsButton);
  }

  async closeFilter()
  {
    log("Clicking on Result Button");
    await this.scrollIntoViewAndClick(this.closeFilterBtn);
    await this.page.waitForSelector('.css-15llhoi span:nth-child(1)', { state: 'visible' });
  }

  async applyFeatureFilter(label, value) {
    try {
        const checkBoxLocator = await this.page.locator(`//p[contains(.,'${label}')]/following::span[contains(.,'${value}')]`).first();
        await checkBoxLocator.waitFor({ state: 'visible', timeout: 60000 });
        await checkBoxLocator.scrollIntoViewIfNeeded();
        
        log("checking the [checkbox]");
        await this.Click(checkBoxLocator);

        await this.page.waitForTimeout(3000); 
        let isChecked = await checkBoxLocator.isChecked();
        if (!isChecked) {
            log("checking the [checkbox]");
            await this.Click(checkBoxLocator); 

            await this.page.waitForTimeout(2000);
            isChecked = await checkBoxLocator.isChecked();
        }
        
        if (isChecked) {
            log(`Successfully Selected: [${value}]`);
        } else {
            throw new Error(`Failed to Click for: ${value}`);
        }
    } catch (error) {
        log(`Error applying filter: ${label} - ${value}`, error);
    }
  }


  async applyExteriorFilter(value) 
  {
   try {
      const exteriorLocator = await this.page.locator(`//p[text()='${value}']`);
      await exteriorLocator.waitFor({ state: 'visible', timeout: 60000 });
      await exteriorLocator.scrollIntoViewIfNeeded(); 
      
      log(`clcking on the [${value}] filter option`);
      await this.Click(exteriorLocator); 

      await this.page.waitForSelector('button[aria-pressed="true"]', { timeout: 10000 });
      log(`Successfully applied exterior filter: ${value}`);

   } catch (error) {
      log(`Error Applying Exterior filter: ${value}`, error);
   }
  }


  async closeFilter()
  {
    log("Clicking on close cross button");
    await this.Click(this.closeFilterBtn);
  }


  async applySortFilter(option) 
  {
    await this.Click(this.sortDefaultFilter);
    await this.page.waitForTimeout(1000);
    const filterOptionLocator = this.page.locator(`//*[@id='sort-by-list']//button[contains(text(),'${option}')]`);
    const isOptionVisible = await filterOptionLocator.isVisible();
    if (isOptionVisible) 
    {
        log(`Clicking on sort filter: [${option}]`);
        await this.Click(filterOptionLocator);
        await this.page.waitForTimeout(3000);
    } else {
        throw new Error(`Sort filter option [${option}] not found`);
    }
  }

  async getDefaultSortFilterText() 
  {
    const sortFilter = this.page.locator('label.css-9pq9cn');
    await sortFilter.waitFor({ state: 'visible' });
    const quickDelivery = await sortFilter.innerText();

    if (!quickDelivery) {
        throw new Error("Quick Delivery label not found");
    }
    return quickDelivery.trim();
  }


  async clickShowMore()
  {
    log(`Clicking on the [Show More] button`);
     await this.scrollIntoViewAndClick(this.showMoreButton);
     await this.page.waitForTimeout(3000);
  }
  
  async clickContiunWithAddressButton()
  {
    await this.Click(this.selectedRetailerButton);
    log("Clicked on Continue Arrow");
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
    log(`Clicking on the [Use My location] button`);
     await this.Click(this.useMyLocationButton);
  }

  async locationErrorText() 
  {
     const errorText = await this.getText(this.page, '.css-3ak29v');
     log(`Location Error :`,errorText);
     return errorText; 
  }
 

  async enterPinCodeAndSelectAddress(pinCode) 
  {
    log(`Entering the pinocde [${pinCode}] in inputfield.`);
    await this.Fill(this.pincodeInput,pinCode);
    
    log(`Pressing the [Space] Key`);
    await this.pincodeInput.press('Space');

    await this.page.waitForTimeout(10000); 
    await this.page.waitForSelector('.css-jxfe2:nth-child(2)', { state: 'visible' });
    const suggestion= await this.addressSuggestions.nth(0).innerText();

    if (!suggestion.includes('No result available'||'Loading')) 
    {
       log('Clicking on valid Suggestion');
       await this.Click(this.addressSuggestions.nth(0));
       return; 
    } else {
       log("Not Found Suggestions");
    }
   }

  async getTitleText()
  {
    const avalableCarsText = await this.getText(this.avalableCarsTextLoc);
    return avalableCarsText;
  }

}

module.exports = { AvailableCarsPage };