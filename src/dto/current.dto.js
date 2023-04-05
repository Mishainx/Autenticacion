export default class CurrentDTO{
    constructor(user){
            this.user= user.email,
            this.role= user.role
            this.cart = user.cart
    }
}