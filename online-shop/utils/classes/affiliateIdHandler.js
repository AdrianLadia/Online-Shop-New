class affiliateHandler {
  constructor(cookieAffiliateId, urlAffiliateId, userAffiliateId, affiliateUsers) {
    this.urlAffiliateId = urlAffiliateId; //priority
    this.userAffiliateId = userAffiliateId; //second priority
    this.cookieAffiliateId = cookieAffiliateId; //third priority
    this.affiliateUsers = affiliateUsers;
  }

  async getAffiliateUserIdByTheirAffiliateLink(affiliateLinkCode) {
    for (let i of this.affiliateUsers) {
      if (i.affiliateId == affiliateLinkCode) {
        return i.uid;
      }
    }
    return null;
  }

  async runMain() {
    if (this.urlAffiliateId) {
      return this.getAffiliateUserIdByTheirAffiliateLink(this.urlAffiliateId);
    } else if (this.userAffiliateId) {
      return this.userAffiliateId;
    } else if (this.cookieAffiliateId) {
      return this.getAffiliateUserIdByTheirAffiliateLink(this.cookieAffiliateId);
    }
    return null;
  }
}

export default affiliateHandler;
