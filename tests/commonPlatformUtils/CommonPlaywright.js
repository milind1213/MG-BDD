const utils = {
 
  async Click(locator) 
  {
    try {
      await this.highlightLocator(locator);
      await locator.click();
    } catch (error) {
      console.error(`Failed to click the element: ${locator}, error: ${error.message}`);
      throw error; 
    }
  },

  async scrollIntoViewAndClick(locator) 
  {
    try {
      await locator.evaluate((el) => el.scrollIntoView());
      await this.highlightLocator(locator);
      await locator.click();
    } catch (error) {
      console.error(`Failed to click on element: ${locator}, error: ${error.message}`);
      throw error;
    }
  },

  async scrollClickText(page, textVal) 
  {
    const locator = `text=${textVal}`;
    await this.highlightLocator(locator);
    await page.locator(locator).scrollIntoViewIfNeeded();
    await page.locator(locator).click();
  },

  async Fill(locator, text) 
  {
    try {
      await this.highlightLocator(locator);
      await locator.fill(text);  
    } catch (error) {
      console.error(`Failed to send keys to element: ${locator}, error: ${error.message}`);
      throw error;
    }
  },

  async clearAndFill(page, locator, text) 
  {
    try {
        await this.highlightLocator(locator);
        await page.locator(locator).fill('');
        await page.locator(locator).fill(text);
    } catch (error) {
        console.error(`Failed to clear and send keys to element [${locator}]`);
    }
},


async refresh(page) 
{
  try {
      await page.reload();
  } catch (error) {
      console.error("Failed to refresh the page.");
  }
},

async getText(page, locator) 
{
  try {
      await waitForElementDisplay(page, locator);
      await highlight(page, locator);
      return await page.locator(locator).textContent();
  } catch (error) {
      console.error(`Failed to get text from element [${locator}]`);
      return null;
  }
},


async getAttribute(page, locator,attribute) 
{
  try {
      const element = await page.locator(locator);
      return await element.getAttribute(attribute) || "null";
  } catch (error) {
      console.error(`Failed to get attribute [${attribute}] from [${locator}]`);
      return "null";
  }
},

async isLocatorTextDisplayed(page, textVal) 
{
  const locator = `text=${textVal}`;
  try {
      return await page.locator(locator).isVisible();
  } catch (error) {
      return false;
  }
},

async isTextInPage(page, text) 
{
  try {
    const content = await page.content();
    return content.includes(text);
  } catch (error) {
    console.error(`Failed to check if text is in page: ${text}, error: ${error.message}`);
    return false;
  }
},

  async waitLocaterVisibility(locator, timeout = 5000) 
  {
    try {
      await locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
      console.error(`Failed to wait for element visibility: ${locator}, error: ${error.message}`);
      throw error;
    }
  },

  async waitForLocatorClickable(locator, timeout = 5000) 
  {
    try {
      await locator.waitFor({ state: 'attached', timeout }); 
      await locator.waitFor({ state: 'enabled', timeout });
    } catch (error) {
      console.error(`Failed to wait for element to be clickable: ${locator}, error: ${error.message}`);
      throw error;
    }
  },

  async waitForLocatorPresence(locator, timeout = 5000) 
  {
    try {
      await locator.waitFor({ state: 'attached', timeout });
    } catch (error) {
      console.error(`Failed to wait for element presence: ${locator}, error: ${error.message}`);
      throw error;
    }
  },

  async waitForLocatorDisplay(page, locator, timeout = 30000) 
  {
    try {
        await page.waitForSelector(locator, { state: 'visible', timeout: timeout });
    } catch (error) {
        console.error(`Waited for element [${locator}] for ${timeout/1000} seconds`);
    }
  },

  
async isLocatorDisplayed(page, locator) 
{
  try {
      await waitForElementDisplay(page, locator);
      await highlight(page, locator);
      return await page.locator(locator).isVisible();
  } catch (error) {
      console.error(`Failed to check visibility of element [${locator}]`);
      return false;
  }
},

  async isLocatorPresent(locator) 
  {
    try {
      const element = await locator.count();
      return element > 0;
    } catch (error) {
      console.error(`Failed to check if element is present: ${locator}, error: ${error.message}`);
      return false;
    }
  },


  async isSelectorEnabled(page, selector) 
 {
    const element = await page.$(selector);
    return await element.isEnabled();
 },


  async selectDropdownOptionByText(locator, optionText) 
  {
    try {
      await this.highlightLocator(locator);
      await locator.selectOption({ label: optionText });
    } catch (error) {
      console.error(`Failed to select option from dropdown: ${optionText}, error: ${error.message}`);
      throw error;
    }
  },

  async scrollUpto(page, locator) 
  {
    try {
        const element = await page.locator(locator);
        await element.scrollIntoViewIfNeeded();
    } catch (error) {
        console.error(`Failed to scroll to element [${locator}]`);
    }
  },

  async switchToTab(page, tabNo) 
  {
    const pages = await page.context().pages();
    await pages[tabNo].bringToFront();
  },

  async switchBackToParentWindowAndCloseChild(page) 
  {
    const [parentPage] = await page.context().pages();
    const pages = await page.context().pages();
    for (let i = 1; i < pages.length; i++) {
        const childPage = pages[i];
        await childPage.close();
        console.log("Closed child window");
    }
    await parentPage.bringToFront();
    console.log("Switched back to parent window");
},

async scrollDownTillLast(page) 
{
  await page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight);
  });
},

async pressBack(page, times) 
{
  for (let i = 0; i < times; i++) 
  {
      await page.goBack();
  }
},

async uploadFile(page, locator, filePath) 
{
  try {
      const input = await page.locator(locator);
      this.highlightLocator(input);
      await input.setInputFiles(filePath);
      console.log(`File uploaded successfully: ${filePath}`);
  } catch (error) {
      console.error(`File upload failed: ${error.message}`);
  }
},


async getRandomPhoneNumber() 
{
  const part1 = Math.floor(Math.random() * 900) + 100;
  const part2 = Math.floor(Math.random() * 900) + 100;
  const part3 = Math.floor(Math.random() * 9000) + 1000;
  return `+91${part1}${part2}${part3}`;
},

async getRandomEmail() 
{
  const usernameLength = Math.floor(Math.random() * 4) + 3;
  let username = '';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < usernameLength; i++) {
      username += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  const domains = ["gmail.com", "yahoo.com", "hotmail.com", "example.com"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
},

async getRandomNumberInRange(min, max) 
{
  if (min >= max) {
      throw new Error("Max must be greater than min");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
},

async generateRandomText(length) 
{
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
},

async getBrowserConsoleLogs(page) 
{
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  return logs;
},

async handleAlert(page, action = 'accept') 
{
  page.on('dialog', async dialog => {
      if (action === 'accept') {
          await dialog.accept();
      } else if (action === 'dismiss') {
          await dialog.dismiss();
      }
  });
},

async setCookie(page, cookie)
{
  await page.context().addCookies([cookie]);
},

async getCookies(page) 
{
  return await page.context().cookies();
},

async hoverOverElement(page, selector) 
{
  const element = await page.$(selector);
  await element.hover();
},

async waitLocaotorToContainText(page, selector, text, timeout = 5000) 
{
  try {
      await page.waitForSelector(selector, { visible: true, timeout });
      const elementText = await page.$eval(selector, el => el.textContent);
      if (elementText.includes(text)) {
          console.log(`Text "${text}" found in element.`);
      } else {
          console.error(`Text "${text}" not found in element.`);
      }
  } catch (e) {
      console.error(`Failed to find element with text "${text}"`);
  }
},

async switchToIframe(page, iframeSelector) 
{
  const iframeElement = await page.$(iframeSelector);
  const iframe = await iframeElement.contentFrame();
  return iframe;
},

async getLocatorPosition(page, selector) 
{
  const element = await page.$(selector);
  const box = await element.boundingBox();
  return box;
},

async selectDropdown(page, selector, option) 
{
  try {
      await page.waitForSelector(selector);
      if (option.value) {
         await page.selectOption(selector, { value: option.value }); }
      else if
         (option.label) { await page.selectOption(selector, { label: option.label }); }
      else if 
         (option.index !== undefined) { await page.selectOption(selector, { index: option.index }); }
      else
      { throw new Error('Invalid option type. Use "value", "label", or "index".'); }
         console.log(`Successfully selected option: ${JSON.stringify(option)} from ${selector}`);
     } catch (error) {
         console.error(`Error selecting dropdown option: ${error.message}`);
     }
},


async highlightLocator(locator) 
{
  await locator.evaluate((element) => {
    element.style.border = "2px solid red"; // Red border
  });
}

};
module.exports = utils;
