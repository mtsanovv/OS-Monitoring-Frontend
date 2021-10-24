class UserObjectModel {
    constructor(json) {
        this.message = json.message;
        this.submitErrorMessage = json.submitErrorMessage;
        this.user = {};
    }

    getMessage() {
        return this.message;
    }

    setMessage(message) {
        this.message = message;
    }

    getSubmitErrorMessage() {
        return this.submitErrorMessage;
    }

    setSubmitErrorMessage(message) {
        this.submitErrorMessage = message;
    }

    getUser() {
        return this.user;
    }

    getUsername() {
        return this.user.username;
    }

    setUsername(username) {
        this.user.username = username;
    }

    getPassword() {
        return this.user.password;
    }

    setPassword(password) {
        this.user.password = password;
    }

    getPasswordConfirmation() {
        return this.passwordConfirmation;
    }

    setPasswordConfirmation(password) {
        this.passwordConfirmation = password;
    }
    
    validateUsername() {
        const regex = new RegExp("^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$");
        return regex.test(this.user.username);
    }

    validatePassword() {
        if(!this.user.password || String(this.user.password).length < 8) {
            return false;
        }
        return true;
    }

    validatePasswordConfirmation() {
        if(!this.passwordConfirmation) {
            return false;
        }
        return true;
    }

    validatePasswordAndConfirmationMatch() {
        if(this.user.password != this.passwordConfirmation) {
            return false;
        }
        return true;
    }
}