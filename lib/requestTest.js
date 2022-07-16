const http = require('http');
const url = require('node:url');

const requestUrl = url.format({
    protocol: 'http',
    hostname: 'www.omdbapi.com',
    pathname: '/',
    query: {
        t: 'Alien',
        y: '1979',
        apikey: '91022541'
    }
});
  
const req = http.request(requestUrl, res => {

  res.on('data', d=> {
    const data = JSON.parse(d);
    console.log(data);
    return d;
  })
})

req.end();
