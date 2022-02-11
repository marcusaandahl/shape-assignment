# shape-assignment
Assignment for Shape

Connects endpoints with 3rd-party-api, and ensures a daily quota is respected.
Error messages and validations are also integrated.

- Attempted to add endpoint usage analytics, in order to spread api quotas to lower time intervals, in meaningful proportions, using a "api endpoint activity distribution map".
- Attempted to implement smarter database, so less api calls were needed.

---

#### Main code is located in the following locations:
- [routes/weatherApi.js](https://github.com/marcusaandahl/shape-assignment/blob/master/routes/weatherApi.js "weatherApi.js")
- [utils/validations/weatherApiValidation.js](https://github.com/marcusaandahl/shape-assignment/blob/master/utils/validations/weatherApiValidation.js "weatherApiValidation.js")
- [utils/si.js](https://github.com/marcusaandahl/shape-assignment/blob/master/utils/si.js "si.js")
- [utils/analytics/apiUsage.js](https://github.com/marcusaandahl/shape-assignment/blob/master/utils/analytics/apiUsage.js "apiUsage.js")
- [db/usage.json](https://github.com/marcusaandahl/shape-assignment/blob/master/db/usage.json "usage.json")
