# OS-Monitoring-Frontend
An OpenUI5 web client for the Perl REST API that monitors Linux OS status & manages users, [OS-Monitoring-Backend](https://github.com/mtsanovv/OS-Monitoring-Backend).

## Prerequisites
- A web server (for example, nginx)

## Notes
- Do not forget to configure your config.js file accordingly.
- To avoid issues with cross domain requests, make sure that both the web UI and the Dancer2 REST API are available under the same host name. This does not necessarily mean that they should be on the same host, something that is both a web and a proxy server like nginx can be really helpful.

*M. Tsanov, 2021*