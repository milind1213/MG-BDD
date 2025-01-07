
const { OfferPage } = require('./offer-page');
const { HomePage } = require('./home-page');
const { AvailableCarsPage } = require('./available-cars-page');

class WebDashboard{
  constructor(page) 
  {
    this.page = page;
    this.offerPage = new OfferPage(this.page);
    this.homePage = new HomePage(this.page);
    this.availableCarsPage = new AvailableCarsPage(this.page);
  }

  getAvailableCarsPage() 
  {
    return this.availableCarsPage;
  }

  getOfferPage() 
  {
    return this.offerPage;
  }
  
  getHomePage()
  {
    return this.homePage;
  }
}

module.exports = { WebDashboard };
