
const { OfferPage } = require('./OfferPage');

class WebDashboard{
  
  constructor(page) {
    this.page = page;
    this.offerPage = new OfferPage(this.page);
  }

   getOfferPage() {
    return this.offerPage;
  }

}

module.exports = { WebDashboard };
