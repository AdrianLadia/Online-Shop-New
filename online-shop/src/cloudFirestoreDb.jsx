import cloudFirestoreFunctions from "./cloudFirestoreFunctions";
import axios from "axios";

class cloudFirestoreDb extends cloudFirestoreFunctions {
    constructor() {
        super();
    }

    async checkIfUserIdAlreadyExist(userId) {
        try {
            console.log('RAN')
            const response = await axios.get(`http://127.0.0.1:5001/online-store-paperboy/us-central1/checkIfUserIdAlreadyExist?userId=${userId}`)
            console.log(response.data)
            return response.data;
        }
        catch (error){
        throw new Error(error);
        }
    }

}

export default cloudFirestoreDb;