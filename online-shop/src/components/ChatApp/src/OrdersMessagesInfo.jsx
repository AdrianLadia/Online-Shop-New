class OrdersMessagesInfo {
    constructor() {}
  
    getMessageDetails(messages) {
      const messageDetails = Object.keys(messages).reduce((acc, messageName) => {
        const messageValue = messages[messageName];
        const messageValues = Object.keys(messageValue).reduce((acc, messageValueName) => {
          const mess = messageValue[messageValueName];
          return acc.concat(mess);
        }, []);
        return acc.concat(messageValues);
      }, []);
      return messageDetails;
    }
    
  }
  
  export default OrdersMessagesInfo;