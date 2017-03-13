const express = require('express'),
fs = require('fs'),
app = express(),
formidable = require('formidable'),
path = require('path'),
util = require('util'),
rmdir = require('rmdir');

app.set('port', (process.env.PORT || 3001));

/*app.use(formidable({
   multiples: true
}));*/

app.use('/sources',express.static('sources'));

app.use('/',express.static('client/build'));

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

function getSourceDirectories(path) {
  if(path.slice(-1) !== '/') path = `${path}/`;

  return new Promise((resolve, reject) => {
    const files = filterFiles(fs.readdirSync(path)),
    results = [];

    //console.log(path, files.length);

    files.forEach((file) => {
      console.log(file);
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
  console.log('getDirectoryListing', baseURL, dirPath, includeFiles, includeDirectories);

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
    getSourceDirectories(path).then((results) => (
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

  console.log(dir, uploadDir);

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

  console.log(filePath,name);

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
