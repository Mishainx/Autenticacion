export default class CurrentDTO{
    constructor(user){
            this.user= user.email,
            this.first_name = user.first_name,
            this.last_name = user.last_name
            this.role= user.role
    }
}