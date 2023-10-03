class conversionsApi {
  constructor(clientIpAddress, clientUserAgent) {
    this.accessTokem =
      'EAACZBZA8LIcZBkBO4niaqx9FHvZAHqLCWIdyvJIl2RbnhVc75aeg1ZAh1OVMvqaHzdUH2xi7ZCNHxiMBO8ZADTQ5pqpBo3xLen9X620kGO2iYgyZB5YlWl335ZAdwtCEfoM7bviOwFWcQbID7aDtO5JGf0ZBuJxeXNYLY3q8S7ZAVa2aumnJGUGxEJTwnt46q1syUZAQbAZDZD';
    this.apiVersion = 'v18.0';
    this.pixelId = '699964975514234';
    this.clientIpAddress = clientIpAddress;
    this.clientUserAgent = clientUserAgent;
  }

  post(event_name) {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.pixelId}/events?access_token=${this.accessTokem}`;
    
    // create hash 256 function
    function sha256(message) {
      // encode as UTF-8
      const msgBuffer = new TextEncoder('utf-8').encode(message);

      // hash the message
      return crypto.subtle.digest('SHA-256', msgBuffer).then((hash) => {
        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hash));

        // convert bytes to hex string
        const hashHex = hashArray
          .map((b) => ('00' + b.toString(16)).slice(-2))
          .join('');
        return hashHex;
      });
    }

    console.log(sha256('US'))
    
    const payload = {
      data: [
        {
          event_name: event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: 'https://www.starpack.ph/shop',
          user_data: {
            client_ip_address: this.clientIpAddress,
            client_user_agent: this.clientUserAgent,
            country: 
          },
        },
      ],
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        console.log(data.error.error_user_msg)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

export default conversionsApi;
