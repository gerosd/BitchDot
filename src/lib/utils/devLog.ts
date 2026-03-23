export class devLog {
    static log(...args: any[]) {
        if (process.env.NODE_ENV === 'development') {
            console.log(...args);
        }
    }

    static warn(...args: any[]) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(...args);
        }
    }

    static error(...args: any[]) {
        if (process.env.NODE_ENV === 'development') {
            console.error(...args);
        }
    }

    static info(...args: any[]) {
        if (process.env.NODE_ENV === 'development') {
            console.info(...args);
        }
    }
}