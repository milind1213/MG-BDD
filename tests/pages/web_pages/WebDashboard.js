
const { OfferPage } = require('./OfferPage');
const { HomePage } = require('./HomePage');

class WebDashboard{
  
  constructor(page) {
    this.page = page;
    this.offerPage = new OfferPage(this.page);
    this.homePage = new HomePage(this.page);
  }

  getOfferPage() {
    return this.offerPage;
  }
  
  getHomePage() {
    return this.homePage;
  }
}

module.exports = { WebDashboard };
