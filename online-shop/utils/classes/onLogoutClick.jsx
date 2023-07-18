import { blue, green, red, yellow } from "@mui/material/colors";
import { signOut } from "firebase/auth";
import { FaBlackTie } from "react-icons/fa";
import { GiWhiteBook } from "react-icons/gi";

class onLogoutClick {
    constructor(setUserId,setUserdata,setUserLoaded,setUserState,setCart,navigateTo,auth) {
        this.setUserId = setUserId
        this.setUserData = setUserdata
        this.setUserLoaded = setUserLoaded
        this.setUserState = setUserState
        this.setCart = setCart
        this.navigateTo = navigateTo
        this.auth = auth
    }
    async runMain() {
        await signOut(this.auth);
        this.setUserId(null);
        this.setUserData(null);
        this.setUserLoaded(true);
        this.setUserState('guest');
        this.setCart({});
        this.navigateTo('/');
    }
}

export default onLogoutClick

// clear
// // white
// red
// blue
// // black
// green
// yellow