class StatsObjectModel {
    constructor(json) {
        this.message = json.message;
        this.stats = {
            cpu: json.cpu,
            ram: json.ram,
            swap: json.swap,
            disk: json.disk
        };
        this.isStatsResponse = 0;
    }

    getMessage() {
        return this.message;
    }

    getStats() {
        return this.stats;
    }

    getCpu() {
        return this.stats.cpu;
    }

    getRam() {
        return this.stats.ram;
    }

    getSwap() {
        return this.stats.swap;
    }

    getDisk() {
        return this.stats.disk;
    }

    getIsStatsResponse() {
        return this.isStatsResponse;
    }

    setAsStatsResponse() {
        this.isStatsResponse = 1;
    }
}