import motorcycle from "./lalamoveDeliveryVehicles/motorcycle";
import sedan from "./lalamoveDeliveryVehicles/sedan";
import mpv from "./lalamoveDeliveryVehicles/mpv";
import pickup from "./lalamoveDeliveryVehicles/pickup";
import van from "./lalamoveDeliveryVehicles/van";
import closedvan from "./lalamoveDeliveryVehicles/closedvan";
import shippingLines from "./lalamoveDeliveryVehicles/shippingLines";

class lalamoveDeliveryVehicles {
    constructor() {
        try{
            this.motorcycle = new motorcycle()
            this.sedan = new sedan()
            this.mpv = new mpv()
            this.pickup = new pickup()
            this.van = new van()
            this.closedvan = new closedvan()
            this.shippingLines = new shippingLines()
        }
        catch{
            return 'No Vehicl'
        }
    }
}

export default lalamoveDeliveryVehicles