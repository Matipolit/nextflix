import fs from 'fs';
import url from 'url';
import http from 'http';
import https from 'https';

const homedir = require('os').homedir();
const omdbUrl = "www.omdbapi.com";
const configText = fs.readFileSync(homedir + '/.config/nextflix/config.json');
const config = JSON.parse(configText);
const moviesPath = config.moviesPath;
const showsPath = config.showsPath;
const dbPath = config.dbPath;
const omdbKey = config.omdbKey;

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

function getMovieData(movieText) {
  const words = movieText.split('.');
  const year = words.pop();
  const name = words.join(' ');
  const movie = {
    name : name,
    year : year
  };
  return movie;
}

function getMovieFilePath(dir){
  return fs.readdirSync(moviesPath + dir).filter(function (file) {
    const fileSplit = file.split('.');
    return fileSplit[fileSplit.length-1]=="mp4" || fileSplit[fileSplit.length-1]=="mkv";
  })[0];

}

function ensureDbExists(){
  // check if database exitst
  if(!fs.existsSync(dbPath)){
    // write empty db
    const emptyDb = {
      movies : [],
      shows : []
    }
    fs.writeFileSync(dbPath, JSON.stringify(emptyDb));
  }
}

function printMovieData(movieData){
  console.log("name: " + movieData.name);
  console.log("year: " + movieData.year);
}

const getMovieMetadata = async (movieData) => {
  console.log("getting metadata for " + movieData.name);
  
  const requestUrl = new URL("https://" + omdbUrl);
  requestUrl.searchParams.append('t', movieData.name);
  requestUrl.searchParams.append('y', movieData.year);
  requestUrl.searchParams.append('apikey', omdbKey);

  return new Promise((resolve, reject) => {
    const req = https.request(requestUrl, res => {
        
      let data = [];
        
        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          resolve(data.join(""));
        });
    });

    req.on('error', reject);

    req.end();
  });
};


function getMovieMetadataCallback(movieData){

  console.log("getting metadata for " + movieData.name);
  const requestUrl = url.format({
      protocol: 'http',
      hostname: omdbUrl, 
      pathname: '/',
      query: {
          t: movieData.name,
          y: movieData.year,
          apikey: omdbKey
      }
  });

  const req = http.request(requestUrl, res => {
    res.on('data', callbackFun);
  })
  req.end();
   
}

export async function refreshAndGetDB(){

  const folders = getDirectories(moviesPath);
  
  const db = JSON.parse(fs.readFileSync(dbPath));
  const moviesDbData = db.movies;

  let promises = [];
  let newFolders = [];

  for(let i = 0; i < folders.length; i++){
    let movieInDB = false;
    const movie = getMovieData(folders[i])
    for(let y = 0; y < moviesDbData.length; y++){
      if(moviesDbData[y].movieFolder == folders[i]){
        console.log("Movie: " + movie.name + " already in database");
        movieInDB = true;
        break;
      } 
    }
    if(!movieInDB){
      console.log("Movie: " + movie.name + " not in database");
      promises.push(getMovieMetadata(movie));
      newFolders.push(folders[i]);
    }
  }

  return new Promise((resolve, reject) => {
    if(promises.length==0){
      resolve(db);
    }else{
      Promise.all(promises).then((values) => {
        for(let i = 0; i < values.length; i++){
          const d = values[i];
          const data = JSON.parse(d);
          const filePath = moviesPath + newFolders[i] + "/" + getMovieFilePath(folders[i]); 
          const movieFolder = newFolders[i];
          data.filePath = filePath;
          data.movieFolder = movieFolder;
          db.movies.push(data); 
        }
        fs.writeFileSync(dbPath, JSON.stringify(db));
        resolve(db);
      })
    }
  })




  
}
