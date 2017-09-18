// Ghost Configuration for Heroku

const path = require('path');
const url = require('url');
let config;
let fileStorage;
let storage;

const DB_URL = url.parse(process.env.JAWSDB_MARIA_URL || '');

if (!!process.env.QINIU_BUCKET_NAME) {
  fileStorage = true
  storage = {
    active: 'qn-store',
    // 'ghost-s3': {
    //   accessKeyId:     process.env.S3_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.S3_ACCESS_SECRET_KEY,
    //   bucket:          process.env.S3_BUCKET_NAME,
    //   region:          process.env.S3_BUCKET_REGION,
    //   assetHost:       process.env.S3_ASSET_HOST_URL
    // }
    'qn-store': {
      accessKey: process.env.QINIU_ACCESS_KEY,
      secretKey: process.env.QINIU_SECRET_KEY,
      bucket: process.env.QINIU_BUCKET_NAME,
      origin: process.env.QINIU_DOMAIN,
      // timeout: 3600000, // default rpc timeout: one hour, optional
      // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
      uploadURL: process.env.QINIU_UPLOAD_URL || 'http://up.qiniug.com',

      // file storage key config [optional]
      // if `fileKey` not set, Qiniu will use `SHA1` of file content as key.
      fileKey: {
        // use Qiniu hash as file basename, if set, `safeString` will be ignored
        hashAsBasename: false,
        safeString: true, // use Ghost safaString util to rename filename, e.g. Chinese to Pinyin
        prefix: 'YYYY/MM/', // {String | Function} will be formated by moment.js, using `[]` to escape,
        suffix: '', // {String | Function} string added before file extname.
        extname: true // keep file's extname
      }
      // take `外面的世界 x.jpg` as example,
      // applied above options, you will get an URL like below after uploaded:
      //  http://xx.xx.xx.glb.clouddn.com/2016/06/wai-mian-de-shi-jie-x.jpg
    }
  }
} else {
  fileStorage = false
  storage = {}
}

config = {

  // Production (Heroku)
  production: {
    url: process.env.HEROKU_URL,
    mail: {
      transport: 'SMTP',
      options: {
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_SMTP_LOGIN,
          pass: process.env.MAILGUN_SMTP_PASSWORD
        }
      }
    },
    fileStorage: fileStorage,
    storage: storage,
    database: {
      client: 'mysql',
      connection: {
        host     : DB_URL.hostname,
        user     : DB_URL.auth.split(':')[0],
        password : DB_URL.auth.split(':')[1],
        database : DB_URL.path.split('/')[1],
        charset  : 'utf8'
      },
      debug: false
    },
    server: {
      host: '0.0.0.0',
      port: process.env.PORT
    },
    paths: {
      contentPath: path.join(__dirname, '/content/')
    }
  },

  // Development
  development: {
    url: 'http://localhost:2368',
    database: {
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, '/content/data/ghost-dev.db')
      },
      debug: false
    },
    server: {
      host: '127.0.0.1',
      port: '2368'
    },
    paths: {
      contentPath: path.join(__dirname, '/content/')
    }
  }

};

// Export config
module.exports = config;
