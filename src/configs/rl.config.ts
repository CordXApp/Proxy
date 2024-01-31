export const RatelimitOptions = {
    max: 100,
    timeWindow: "1 minute",
    global: true,
    continueExceeding: false,
    skipOnError: true,
    addHeadersOnExceeding: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true,
        'retry-after': true
    },
    addHeaders: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true,
        'retry-after': true
    },
}