import { signOut } from "firebase/auth";

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