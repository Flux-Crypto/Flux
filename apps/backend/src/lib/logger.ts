export default {
    dev: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-dd-mm, h:MM:ss TT",
                ignore: "pid,hostname",
                colorize: true
            }
        }
    },
    test: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-dd-mm, h:MM:ss TT",
                ignore: "pid,hostname",
                colorize: true
            }
        },
        level: "fatal"
    },
    stg: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-dd-mm, h:MM:ss TT",
                ignore: "pid,hostname",
                colorize: true
            }
        },
        level: "warn"
    },
    prd: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-dd-mm, h:MM:ss TT",
                ignore: "pid,hostname",
                colorize: true
            }
        },
        level: "warn"
    }
};
