const express = require('express'),
fs = require('fs'),
app = express(),
formidable = require('formidable'),
path = require('path'),
util = require('util'),
rmdir = require('rmdir');

import React from 'react';
import ReactDOM from 'react-dom/server';

import actions from './client/src/model/actions';
import store from './client/src/model/store';
import EurekaMediaBrowser from './client/src/EurekaMediaBrowser';
import utility from './client/src/utility/utility';



app.set('port', (process.env.PORT || 3001));

/*app.use(formidable({
   multiples: true
}));*/

app.use('/sources',express.static('sources'));



app.get('/', (req, res) => {

  serveIt('/').then((eurekaMarkup) => {
    console.log(path.join(__dirname, 'client/build/index.html'));
    const build = fs.readFileSync(path.join(__dirname, 'client/build/index.html'), 'utf8');
    //const build = '<h1>YOLO</h1>';
    res.end(build);
  });

});

app.use('/',express.static('client/build'));

app.post('/server', (req, res) => {
  console.log('params',req.params);
  console.log('query',req.query);

  const form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req, function(err, fields, files) {
    console.log('fields', fields);
    console.log('PARSE');

    const uploadFiles = files.eureka__uploadFiles;
    console.log(uploadFiles);


    const [cs, cd] = utility.parseMediaSourceOutOfCombinedPath(fields[`eureka__media-browser_${fields.eureka__mediaSourceId}__browsing`], '||');
    const uploadDir = path.join(__dirname, path.join('/sources/filesystem/', fields['eureka__upload-dir']));

    function moveFile(file) {
      fs.renameSync(file.path, path.join(uploadDir, file.name))
    }

    try {
      uploadFiles.map(moveFile)
    } catch (e) { // its a single file not an Array
      if(uploadFiles.name) moveFile(uploadFiles)
    }

    /*files.map((file) => (
      fs.renameSync(file.path, path.join(uploadDir, file.name))
    ));*/

    if(fields.eureka__chosen_item) {
      getMediaSources().then((mediaSources) => {
        //console.log(mediaSources);
        const name = mediaSources.filter((mediaSource) => (
          mediaSource.id == cs
        ))[0].name || undefined;
        //console.log(name);

        res.end(`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title data-site-name="Eureka Media Browser">Eureka!</title>
          </head>
          <body>
            <h1>Eureka!</h1>
            <p>You chose ${path.join(fields['eureka__upload-dir'], fields.eureka__chosen_item)} of the ${name} (${cs}) media&nbsp;source.</p>
            <img src="/sources/filesystem/${path.join(fields['eureka__upload-dir'], fields.eureka__chosen_item)}" alt="/sources/filesystem/${path.join(fields['eureka__upload-dir'], fields.eureka__chosen_item)}" />
          </body>
        </html>`);
      });
    } else {
      serveIt(cd).then((eurekaMarkup) => {
        res.end(`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title data-site-name="Eureka Media Browser">Eureka Media Browser</title>
            <link rel="stylesheet" href="assets/css/main.css">
          </head>
          <body>
            <div id="root">${eurekaMarkup}</div>
          </body>
        </html>`);
      });
    }



  });
});

function serveIt(dir = "/") {
  console.log('serveIt', dir);
  return new Promise((resolve, reject) => {
    store.dispatch(actions.updateConfig({
      uid:"0"
    }));

    getMediaSources().then((mediaSources) => ( // get the media sources
      store.dispatch(actions.fetchMediaSourcesSuccess((
        mediaSources
      )))
    )).then(() => {
      return new Promise((resolve, reject) => { // get the media source tree listing
        const path = `${__dirname}/sources/filesystem/`;
        //const data = [{"name":"assets","cd":"assets","children":[{"name":"img","cd":"assets/img","children":[{"name":"hawaii","cd":"assets/img/hawaii","children":[]},{"name":"redwoods","cd":"assets/img/redwoods","children":[]}]},{"name":"screenshots","cd":"assets/screenshots","children":[]},{"name":"uploads","cd":"assets/uploads","children":[]}]},{"name":"camera","cd":"camera","children":[]},{"name":"foo","cd":"foo","children":[]}];
        recursivelyGetSourceDirectories(path).then((results) => (
          resolve(results)
        )).catch((err) => (
          res.json([])
        ));
      })
    }).then((results) => (
      store.dispatch(actions.updateSourceTreeSuccess(
        results
      ))
    )).then(() => { // get the current directory listing
      return new Promise((resolve, reject) => {
        getDirectoryListing(`${__dirname}/sources/filesystem/`, dir || 'assets/img/hawaii', true, true, `${__dirname}/sources/filesystem/`).then((results) => (
          resolve(results)
        )).catch((err) => (
          res.json([])
        ));

      })
    }).then((results) => (
      store.dispatch(actions.fetchDirectoryContentsSuccess(
        results
      ))
    )).then(() => (
      store.dispatch(actions.updateContent({ // updates the "current directory" of the view right away
        cd: dir
      }))
    )).then(() => {
      const eurekaMarkup = ReactDOM.renderToStaticMarkup(
        <EurekaMediaBrowser currentDirectory={dir} />
      );
      resolve(eurekaMarkup);
    });
  })
}

app.get('/server', (req, res) => {
  serveIt(req.params.dir).then((eurekaMarkup) => {
    res.end(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title data-site-name="Eureka Media Browser">Eureka Media Browser</title>
        <link rel="stylesheet" href="assets/css/main.css">
      </head>
      <body>
        <div id="root">${eurekaMarkup}</div>
      </body>
    </html>`);
  });
});

/*
Retrieve a list of media sources
`GET /sources/`
*/

/*
[{
  name:'assets',
  cd:'assets',
  children:[{
    name:'img',
    cd:'assets/img'
  }]
},{
  name:'uploads',
  cd:'uploads'
}]
*/

function filterFiles(files) {
  return files.filter((file) => (file.charAt(0) !== '.'));
}

function getMediaSources(path = `${__dirname}/sources/`) {
  if(path.slice(-1) !== '/') path = `${path}/`;

  return new Promise((resolve, reject) => {
    const files = filterFiles(fs.readdirSync(path)),
    results = [];

    files.forEach((file, index) => {
      const stat = fs.statSync(`${path}${file}`),
      {size, atime, mtime, ctime} = stat,
      isFile = stat.isFile();

      if(!isFile) {
        results.push({
          name:file,
          id:index
          //cd:`${path}${file}`
        });
      }

    });

    resolve(results);
  });
}

function recursivelyGetSourceDirectories(path) {
  if(path.slice(-1) !== '/') path = `${path}/`;

  return new Promise((resolve, reject) => {
    const files = filterFiles(fs.readdirSync(path)),
    results = [];

    const stat = fs.statSync(`${path}`),
    {size, atime, mtime, ctime} = stat,
    isFile = stat.isFile();

    files.forEach((file) => {
      //console.log(file);
      const stat = fs.statSync(`${path}${file}`),
      {size, atime, mtime, ctime} = stat,
      isFile = stat.isFile();

      if(!isFile) {
        results.push(new Promise((resolve, reject) => {
          recursivelyGetSourceDirectories(`${path}${file}`).then((children) => {
            resolve({
              name:file,
              cd:`${path}${file}`.replace(__dirname, '').replace('/sources/filesystem/', ''),
              children:children.length ? children : [],
              //fcd:`${path}${file}`.replace(__dirname, '')
            })
          })

        }));
      }
    });

    Promise.all(results).then((rs) => {
      //console.log(results);
      resolve(rs);
    });
    //resolve(results);
  });
}

function getSourceDirectories(path) {
  if(path.slice(-1) !== '/') path = `${path}/`;

  return new Promise((resolve, reject) => {
    const files = filterFiles(fs.readdirSync(path)),
    results = [];

    //console.log(path, files.length);

    files.forEach((file) => {
      //console.log(file);
      const stat = fs.statSync(`${path}${file}`),
      {size, atime, mtime, ctime} = stat,
      isFile = stat.isFile();

      if(!isFile) {
        results.push({
          name:file,
          cd:file
          //cd:`${path}${file}`.replace(__dirname, '')
        });
      }

    });

    resolve(results);

  });
}

function getDirectoryListing(baseURL = '', dirPath = '', includeFiles = true, includeDirectories = true) {
  //if(dirPath.slice(-1) !== '/') dirPath = `${dirPath}/`;
  //dirPath = `${baseURL}${dirPath}`;

  dirPath = path.join(baseURL, dirPath);
  //console.log('getDirectoryListing', baseURL, dirPath, includeFiles, includeDirectories);

  return new Promise((resolve, reject) => {
    if(!includeFiles && !includeDirectories) resolve([]); // nothing to do!
    const files = filterFiles(fs.readdirSync(dirPath)),
    results = [];

    //console.log(fs.readdirSync(dirPath));
    //console.log(files);

    files.forEach((file) => {
      const stat = fs.statSync(path.join(dirPath, file)),
      {size, atime, mtime, ctime} = stat,
      isFile = stat.isFile();

      //console.log(file, isFile, size, atime, mtime, ctime);

      //console.log(includeFiles && isFile || includeDirectories && !isFile);

      if(includeFiles && isFile || includeDirectories && !isFile) {
        results.push({
          filename:isFile ? file : undefined,
          foldername:!isFile ? file : undefined,
          directory:isFile ? dirPath.replace(baseURL, '') : path.join(dirPath,file).replace(baseURL, ''),
          absolutePath:path.join(dirPath,file),
          absoluteURL:path.join(dirPath,file).replace(__dirname, ''),
          editedOn:mtime,
          dimensions:[Math.round(Math.random()*420),Math.round(Math.random()*180)],
          fileSize:size
        });
      }

    });
    //console.log('results',results);
    resolve(results);
  });
}


app.get('/core/components/eureka/media/sources/', (req, res) => {

  getMediaSources().then((results) => (
    res.json(results)
  )).catch((err) => (
    res.json([])
  ));

});


/*
Retrieve a list of directory contents
`GET /sources/:id/?dir=/`

Retrieve a list of directories
`GET /sources/:id/`
*/

app.get('/core/components/eureka/media/sources/:source', (req, res) => {
  let dir = req.query.dir,
  source = req.params.source;

  if(dir) {
    if(dir.slice(-1) != '/') dir = `${dir}/`;
    getDirectoryListing(`${__dirname}/sources/filesystem/`,dir, true, true, `${__dirname}/sources/filesystem/`).then((results) => (
      res.json(results)
    )).catch((err) => (
      res.json([])
    ));
  } else {
    const path = `${__dirname}/sources/filesystem/`;
    recursivelyGetSourceDirectories(path).then((results) => (
      res.json(results)
    )).catch((err) => (
      res.json([])
    ));
  }

});

/*

Upload a file
`POST /sources/:id/?dir=/`

*/

app.post('/core/components/eureka/media/sources/:source', (req, res) => {

  const dir = req.query.dir,
  uploadDir = path.join(__dirname, path.join('/sources/filesystem/', dir)),
  form = new formidable.IncomingForm();

  //console.log(dir, uploadDir);

  if (!dir) {
    res.json({
      error: 'Missing required parameter `dir`',
    });
    return;
  }

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  form.on('file', (field, file) => (
    fs.renameSync(file.path, path.join(uploadDir, file.name))
  ));

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  form.on('end', function() { // now that the files have uploaded return JSON of the destination directory's ENTIRE contents (not just what was uploaded)
    getDirectoryListing(`${__dirname}/sources/filesystem/`,dir, true, true, `${__dirname}/sources/filesystem/`).then((results) => (
      res.json(results)
    )).catch((err) => (
      res.json([])
    ));
  });

  form.parse(req);

});

/*
Delete a directory
`DELETE /sources/:id/?dir=foo`
*/

app.delete('/core/components/eureka/media/sources/:source', (req, res) => {
  const absolutePath = req.query.absolutePath,
  source = req.params.source;

  // this is kinda janky but whatever
  let deletePath = absolutePath.includes(__dirname) ? absolutePath :  path.join(path.join(__dirname, 'sources/filesystem'), absolutePath);

  console.log(`delete ${absolutePath} source ${source}`);

  rmdir(deletePath, function (err, dirs, files) {
    if(err) {
      console.log(err);
      res.json(false);
    }
    else res.json(true);
  });



  /*try {
    fs.unlinkSync(deletePath);
  } catch (e) {
    console.log(e);
    res.json(false);
    return;
  } */

  /*if (!dir) {
    res.json({
      error: 'Missing required parameter `dir`',
    });
    return;
  }*/

  // todo: delete the directory
  //res.json(true);

});

/*
Create a new directory
`PUT /sources/:id/?dir=foo`

Rename a directory
`PUT /sources/:id/?dir=foo&name=bar`
*/

app.put('/core/components/eureka/media/sources/:source', (req, res) => {
  const filePath = req.query.path,
  name = req.query.name;

  //console.log(filePath,name);

  if (!filePath && !name) {
    res.json({
      error: 'Missing required parameter `path` or `name`',
    });
    return;
  }

  if (name) {
    // rename directory or file


    const stat = fs.statSync(`${filePath}`),
    {size, atime, mtime, ctime} = stat,
    isFile = stat.isFile(),
    dir = path.parse(filePath).dir;
    console.log(filePath, isFile, path.join(dir, name));

    try {
      fs.renameSync(filePath, path.join(dir, name));
      //function getDirectoryListing(baseURL = '', dirPath = '', includeFiles = true, includeDirectories = true)
      getDirectoryListing(``,dir, true, true).then((results) => (
        res.json(results)
      )).catch((err) => {
        console.log(err);
        res.json([]);
      });

      return;

    } catch(e) {
      console.log(e);
      res.json(false);
      return;
    }

  } else {
    // create new directory
    try {
      fs.mkdirSync(path.join(__dirname, path.join('/sources/filesystem/', filePath))); // #janky maybe change this to be absolute
    } catch (e) {
      console.log(e); // who cares if it failed that just means it already exists. right?
    }
    res.json(true);
    return;

  }

  // todo: delete the directory
  res.json(false);

});


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});