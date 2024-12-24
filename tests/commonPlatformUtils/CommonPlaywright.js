async function Click(locator) 
{
  try {
    await locator.evaluate((element) => {
      element.style.border = "2px solid red";
    });
    await locator.click();
  } catch (error) {
    console.error(`Failed to click the element: ${locator}, error: ${error.message}`);
    throw error; 
 }
}

module.exports = { Click };