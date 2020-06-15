var reduce = require('./reduce').default;

if (!Promise.reduce) Promise.reduce = reduce;
