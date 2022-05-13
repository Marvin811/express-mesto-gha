const CORS_WHITELIST = ['http://localhost:3001',
  'https://marvin.nomoredomains.xyz',
  'http://marvin.nomoredomains.xyz',
];

const corsOption = {
  credentials: true,
  origin: function checkCorsList(origin, callback) {
    if (CORS_WHITELIST.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

module.exports = corsOption;
