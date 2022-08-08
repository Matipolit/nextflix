import fs from 'fs';
import path from 'path'
import url from 'url';
import https from 'https';
import lnk from 'lnk';
import fg from 'fast-glob';
import './classes'
import { Subtitle } from './classes';

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

function getMovieSubtitles(dir){
  const files = fs.readdirSync(moviesPath + dir).filter(function(file){
    const fileSplit = file.split('.');
    return fileSplit[fileSplit.length-1]=="srt" || fileSplit[fileSplit.length-1]=="vtt";
  })
  let subtitleList = []
  for(const file of files){
    let lang = file.split(']')[0].split('[')[1];
    subtitleList.push(new Subtitle(file, lang));
  }
  return subtitleList;
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

function ensureSymlinkExists(){
  const publicDir = path.join(process.cwd(), 'public')
  
  //fs.symlink(moviesPath, publicDir + "/movies", 'dir', (err) => {
  //if (err)
  //  console.log(err);
  //else {
  //  console.log("\nSymlink created\n");
  //}
  //})
  console.log("moviesPath: " + moviesPath)
  const movies = fg.sync(moviesPath + "*", {onlyDirectories: true});
  
  console.log("movies: " + movies);
  lnk(movies, publicDir + "/movies")
      .then(() => console.log("link created"));

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

export async function refreshAndGetDB(){
  ensureDbExists();
  ensureSymlinkExists();

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
          const filePath = getMovieFilePath(folders[i]); 
          const subtitles = getMovieSubtitles(folders[i]);
          console.log(subtitles);
          const movieFolder = newFolders[i];
          data.filePath = filePath;
          data.movieFolder = movieFolder;
          data.subtitles = subtitles;
          db.movies.push(data); 
        }
        fs.writeFileSync(dbPath, JSON.stringify(db));
        resolve(db);
      })
    }
  })
}
