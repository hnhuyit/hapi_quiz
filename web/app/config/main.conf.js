'use strict';

let config = {};

config.web = {
    
    port: process.env.FRONT_PORT || 9076,
    sessionKey: '6ketaq3cgrggdfgdfgdfgdfgo315rk9',
    cookieOptions: {
        ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
        encoding: 'none',    // we already used JWT to encode
        path: '/',
        //isSecure: true,      // warm & fuzzy feelings
        isHttpOnly: false,    // prevent client alteration
        clearInvalid: true, // remove invalid cookies
        strictHeader: true   // don't allow violations of RFC 6265
    },
    paging: {
        defaultPageSize: 7,
        numberVisiblePages: 5,
        itemsPerPage: 7
    },
    db: {
        uri: 'mongodb://localhost/db_bzcms',
        options: {
            user: '',
            pass: ''
        }
    },
    mailer: {
        options: {
            pool: true,
            service: 'Gmail',
            auth: {
                user: 'chung.gkh@gmail.com',
                pass: 'iii3studi1'
            },
            logger: false, // log to console
            debug: false // include SMTP traffic in the logs
        },
        defaults: {
            from: 'info <sender@gmail.com>'
        }
    },
    email: {
        from: {
            "name": "info",
            "address": "chung.gkh@gmail.com"
        },
        to: [{ //for admin
            "name": "admin",
            "address": "chung.gkh@gmail.com"
        }],
        cc: [],
        bcc: []

    },
    log: {
        options: {
            transport: 'console',
            logFilePath: BASE_PATH + '/var/bunyan-log.log'
        }
    },
    redisOptions: {
        host: '127.0.0.1',
        // host: '118.69.108.107',
        port: 6379,
        detect_buffers: true
    },
    upload: {
        path: process.cwd() + '/public/files',
        bannerPath: process.cwd() + '/public/files/banner/',
        postPath: process.cwd() + '/public/files/post/',
        productPath: process.cwd() + '/public/files/product/'
    },
    connections: [
        {
            port: process.env.CMS_WEB_PORT || 9076,
            labels: ['web'],
            routes: {
                cors: {
                    origin: ['*'],
                    credentials: true
                }
            },
            router: {
                stripTrailingSlash: false
            }
        },
        {
            port: process.env.CMS_ADMIN_PORT || 9072,
            labels: ['admin'],
            routes: {
                cors: {
                    origin: ['*'],
                    credentials: true
                },
                auth: {
                    scope: ['admin']
                }
            }
        },
        {
            port: process.env.CMS_API_PORT || 9071,
            labels: 'api',
            routes: {
                cors: {
                    origin: ['*'],
                    credentials: true
                }
            }
        }
    ],
    jwt: {
        secret: process.env.JWT_SECRET_CMS || 'jKErFlFEktfafasfaKLfghLoPrlafasflsdf0werr'
    },

    error: {
        notfound: {
            url: '/error404' //404 URL
        },
        user: {
            login: '/login' // Login URL
        }
    },
    
    context: {
        app: {
            title: 'Web',
            description: '',
            keywords: ''
        },
        settings: {
            services: {
                userApi: 'http://localhost:9071/v1',
                contactApi: 'http://localhost:9071/v1',
                socketApi: 'http://localhost:9071/v1',
                uploadApi: 'http://localhost:9071/v1',
                webUrl: 'http://localhost:9076/v1'
            }

        }
    }

};

module.exports = config;