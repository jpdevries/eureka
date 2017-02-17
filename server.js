const express = require('express');
const fs = require('fs');
const app = express(),
formidable = require("formidable");

app.set('port', (process.env.PORT || 3001));

app.use('/sources',express.static('sources'));

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
    
    console.log(path, files.length);
    
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

function getDirectoryListing(baseURL = '', path = '', includeFiles = true, includeDirectories = true) {
  if(path.slice(-1) !== '/') path = `${path}/`;
  path = `${baseURL}${path}`;
  
  return new Promise((resolve, reject) => {
    if(!includeFiles && !includeDirectories) resolve([]); // nothing to do!
    const files = filterFiles(fs.readdirSync(path)),
    results = [];
    
    files.forEach((file) => {
      const stat = fs.statSync(`${path}${file}`),
      {size, atime, mtime, ctime} = stat,
      isFile = stat.isFile();
      
      //console.log(file, isFile, size, atime, mtime, ctime);
      
      if(includeFiles && isFile || includeDirectories && !isFile) {
        results.push({
          filename:isFile ? file : undefined,
          foldername:!isFile ? file : undefined,
          directory:isFile ? path.replace(baseURL, '') : `${path}${file}`.replace(baseURL, ''),
          absolutePath:`${path}${file}`,
          absoluteURL:`http://localhost:${app.get('port')}${path}${file}`.replace(__dirname, ''),
          editedOn:mtime,
          dimensions:[420,150],
          fileSize:size
        });
      }
      
    });
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
  
  var form = new formidable.IncomingForm();
  
  form.parse(req, function (err, fields, files) {
    console.log(fields);
    console.log(files);
  });
  
  
  const dir = req.query.dir;

  if (!dir) {
    res.json({
      error: 'Missing required parameter `dir`',
    });
    return;
  }
  
  // todo: upload the file
  res.json(true);
  
});

/*
Delete a directory
`DELETE /sources/:id/?dir=foo`
*/

app.delete('/core/components/eureka/media/sources/:source', (req, res) => {
  const dir = req.query.dir;

  if (!dir) {
    res.json({
      error: 'Missing required parameter `dir`',
    });
    return;
  }
  
  // todo: delete the directory
  res.json(true);
  
});

/*
Create a new directory
`PUT /sources/:id/?dir=foo`

Rename a directory
`PUT /sources/:id/?dir=foo&name=bar`
*/

app.put('/core/components/eureka/media/sources/:source', (req, res) => {
  const dir = req.query.dir,
  name = req.query.name;
  
  if (!dir) {
    res.json({
      error: 'Missing required parameter `dir`',
    });
    return;
  }

  if (name) {
    // rename directory
  } else {
    // create new directory
  }
  
  // todo: delete the directory
  res.json(true);
  
});


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});