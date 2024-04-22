# BPP-Backend

Bitcoin Prince Prediction Backend

## Development Setup

### Prerequisites

- Install [Git](https://git-scm.com/downloads)
- Install [Node.js](https://nodejs.org/en/) which includes [Node Package Manager](https://docs.npmjs.com/getting-started/)

### Setting Up the Project

```shell
git clone https://github.com/Hashen11-/bpp-backend.git

cd bpp-backend

npm install
```

### Usage

To start the service

```shell
npm run start
```

To start the service in debug mode

```shell
npm run start:debug
```

To run the service in development mode with HMR

```shell
npm run dev
```

To lint the code

```shell
npm run lint
```

Use `data` folder to store temporary files. Use `public` folder to store static files.

#### Loggers

Supported log levels

* debug - only log if `process.env.DEBUG != false`
* error - use to log errors
* log - use to log other information

No need to `JSON.stringify(object)` values to log

```javascript
const logger = require('./utils/logger')(__filename);

logger.debug('Debug Log'); // [filename][DEBUG] Debug Log
logger.error(new Error('Error Log')); // [filename][ERROR] Error Log
logger.log('Log'); // [filename][LOG] Log

// every log levels support multiple arguments with all data types
logger.log('Log', 'Multiple', 'Arguments'); // [folder/filename][LOG] Log Multiple Arguments
```

#### Actuator endpoints

* `/info` - Displays application information.
* `/metrics` - Shows metrics information for the current application.
* `/health` - Shows application health information.

#### Folder structure

```
/data               - folder to save temporary files
/public             - folder to save static files
/routes             - folder to save routes
    index.js
/services           - folder to save services
    index.js
/tests              - folder to save tests
/utils              - folder to save application level utils
    database.js
    index.js
    logger.js
```

If adding new environment variables please add those environment variables to `env.example` file and `common.yaml` file

## Contributing

### Contributing Guidelines

Read through our [contributing guidelines](CONTRIBUTING.md) to learn about our submission process, coding rules and more.
