const config = () => {
    this.DEBUG = true;
    this.DEBUG_HOST = '192.168.178.43';
    this.DEBUG_PORT = 3000;
    this.PRODUCTION_HOST = 'https://dietastatur.de';
    this.PRODUCTION_PORT = 3000;

    this.getHost = () => {
        return this.DEBUG === true ? this.DEBUG_HOST : this.PRODUCTION_HOST;
    };
    this.getPort = () => {
        return this.DEBUG === true ? this.DEBUG_PORT : this.PRODUCTION_PORT;
    };

    return this;
};

module.exports = config;
