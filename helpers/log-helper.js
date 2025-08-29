import fs from 'fs';

class LogHelper {
    constructor() {
        this.filePath               = process.env.LOG_FILE_PATH;
        this.fileName               = process.env.LOG_FILE_NAME;
        this.logToFileEnabled       = process.env.LOG_TO_FILE_ENABLED.toLowerCase() === 'true';
        this.logToConsoleEnabled    = process.env.LOG_TO_CONSOLE_ENABLED.toLowerCase() === 'true';
    }

    logError = (errorObject) => {
        const formattedError = this.formatError(errorObject);
        const fullFileName   = this.getFullFileName();
        if (this.logToFileEnabled) {
            fs.appendFile(fullFileName, formattedError + '\n', (err) => {
                if (err) console.error('LogHelper:', err);
            });
        }
        if (this.logToConsoleEnabled) console.log(formattedError);
    }

    formatError = (errorObject) => {
        const timestamp = new Date().toISOString();
        let formattedError = `${timestamp}: ${errorObject.name} - ${errorObject.message}\n`;
        formattedError += `Stack Trace:\n${errorObject.stack}\n`;
        return formattedError;
    }

    getFullFileName = () => {
        let onlyFileName;
        if (this.fileName == "") {
            onlyFileName = `${this.getCurrentDate()}.log`;
        } else {
            onlyFileName = `${this.getCurrentDate()}-${this.fileName}`;
        }
        return `${this.filePath}${onlyFileName}`;
    }

    getCurrentDate = () => {
        return new Date().toISOString().slice(0, 10); 
    }
}
export default new LogHelper();
