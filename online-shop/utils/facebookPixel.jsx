import axios from "axios"

class facebookPixel {
  constructor() {
    this.token = 'EAACZBZA8LIcZBkBO39X6OAjIPzeem3txbudXex5d7iNmEDoSxEi4JcWIFsQvFhwZCfUWUI8ZBBa5TkfImT6CtJ5ScQK7Bn8r8bTXUSKjeFGQAmk3vkw9HgQnue5LEamnmyOtYg9PItFUxJOiiNEZAokCD1ldk8TtwAXVGjvrEAxmdI0BUe5ZBEwWTkZAiegpNBULyAZDZD'
    this.pixelId = '1066843291356138'
}


  async postPayload(clientIpAddress, clientUserAgent ) {
    const payload = {
        "data": [
            {
                "event_name": "AddToCart",
                "event_time": Math.floor(Date.now() / 1000),
                "action_source": "website",
                "event_source_url": "https://www.starpack.ph/shop",
                "user_data": {
                    "client_ip_address" : clientIpAddress ,
                    "client_user_agent" : clientUserAgent,

                }
            }
        ]
    }
    await axios.post(`https://graph.facebook.com/v18.0/${this.pixelId}/events?access_token=${this.token}`)
  }

}

export default facebookPixel