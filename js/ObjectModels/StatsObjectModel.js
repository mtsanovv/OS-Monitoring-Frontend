class StatsObjectModel {
    constructor(json) {
        this.message = json.message;
    }

    getMessage() {
        return this.message;
    }
}