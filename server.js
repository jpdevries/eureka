const express = require('express'),
fs = require('fs'),
app = express(),
formidable = require('formidable'),
path = require('path'),
util = require('util'),
rmdir = require('rmdir'),
compression = require('compression'),
minifyHTML = require('express-minify-html'),
isProd = (process.env.NODE_ENV == 'production') ? true : false;

const qt = require('quickthumb');

const AdmZip = require('adm-zip');

import sizeOf from 'image-size';

const multiparty = require('multiparty');

import React from 'react';
import ReactDOM from 'react-dom/server';

import { IntlProvider, addLocaleData } from 'react-intl';

import en from 'react-intl/locale-data/en';
import nl from 'react-intl/locale-data/nl';

import localeData from './client/i18n/locales/en.json';

addLocaleData([...en, ...nl]);



/*
import actions from './client/src/model/actions';
import store from './client/src/model/store';
import EurekaMediaBrowser from './client/src/EurekaMediaBrowser';
import utility from './client/src/utility/utility';
*/


/*
import { // load it from the local, ES 6/7 source
  EurekaMediaBrowser,
  actions,
  store,
  utility
} from './client/src/main.js';
*/



import { // load the dist (transpiled)
  EurekaMediaBrowser,
  actions,
  store,
  utility
} from './client/dist/main'; //from 'eureka-browser'; // from 'eureka-browser'; // from './client/src/main'; from './client/dist/main';



if(isProd) {
  app.use(minifyHTML({
    override: true,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: false,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  }));

  app.use(compression({ level: 9, threshold: 0 }));
}

app.set('port', (process.env.PORT || 3001));

/*app.use(formidable({
   multiples: true
}));*/

//app.use('/sources', express.static(path.join(__dirname, '/sources')));
app.use('/sources', qt.static(path.join(__dirname, '/sources'), {
  //quality: .92
}));

store.dispatch(actions.updateConfig({
  allowUploads:true
}));

app.get('/', (req, res) => {

  serveIt('/', req.query.ln || undefined).then((eurekaMarkup) => {
    //console.log(path.join(__dirname, 'client/build/index.html'));
    let build = fs.readFileSync(path.join(__dirname, 'client/build/index.html'), 'utf8').replace('<div id="root" class="eureka-root">',`<div id="root" class="eureka-root">${eurekaMarkup}</div>`).replace(`<html lang="en">`,`<html lang="${req.query.ln || 'en'}">`);
    //const build = '<h1>YOLO</h1>';

    /*if(req.query.ln) {
      const languageWithoutRegionCode = req.query.ln.toLowerCase().split(/[_-]+/)[0];
      build = build.replace('</body>',`
      <script src="https://unpkg.com/react-intl@latest/locale-data/${languageWithoutRegionCode}.js"></script>
      <script>
          ReactIntl.addLocaleData(ReactIntlLocaleData.${languageWithoutRegionCode});
      </script>
      </body>
      `);
    }*/

    res.end(build);
  });

});

app.get('/nued', (req, res) => {

  serveIt('/', req.query.ln || undefined).then((eurekaMarkup) => {
    let build = fs.readFileSync(path.join(__dirname, 'client/build/nued.html'), 'utf8').replace('<div id="root" class="eureka-root">',`<div id="root" class="eureka-root">${eurekaMarkup}</div>`).replace(`<html lang="en">`,`<html lang="${req.query.ln || 'en'}">`);
    res.end(build);
  });

});


app.use('/',express.static('client/build')); // serve the create react app
app.use('/assets/js/i18n/locales', express.static('client/i18n/locales'));


app.post('/', (req, res) => {
  //console.log('params',req.params);
  //console.log('query',req.query);
  const referer = req.header('Referer');
  const isNued = referer.includes('/nued');

  const form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req, function(err, fields, files) {
    //console.log('fields', fields);
    //console.log('PARSE');

    const uploadFiles = files.eureka__uploadFiles;
    //console.log(uploadFiles);


    const [cs, cd] = utility.parseMediaSourceOutOfCombinedPath(fields[`eureka__media-browser_${fields.eureka__mediaSourceId}__browsing`], '||');
    const uploadDir = path.join(__dirname, path.join('/sources/filesystem/', fields['eureka__upload-dir']));

    function moveFile(file) {
      try {
        fs.renameSync(file.path, path.join(uploadDir, file.name))
      } catch (e) { }
    }

    try {
      uploadFiles.map(moveFile)
    } catch (e) { // its a single file not an Array
      try {
        if(uploadFiles.name) moveFile(uploadFiles)
      } catch (e) { }
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
        //console.log(eurekaMarkup);
        let build = fs.readFileSync(path.join(__dirname, `client/build/${isNued ? 'nued' : 'index'}.html`), 'utf8').replace('<div id="root" class="eureka-root">',`<div id="root" class="eureka-root">${eurekaMarkup}</div>`).replace(`<html lang="en">`,`<html lang="${req.query.ln || 'en'}">`);
        res.end(build);
      });
    }



  });
});

function serveIt(dir = "/", lang = undefined) {
  //console.log('serveIt', dir);
  return new Promise((resolve, reject) => {
    store.dispatch(actions.updateConfig({
      uid:"0",
      callbacks: {
        choose: true
      }
    }));

    getMediaSources().then((mediaSources) => ( // get the media sources
      store.dispatch(actions.fetchMediaSourcesSuccess((
        mediaSources
      )))
    )).then(() => {
      return new Promise((resolve, reject) => { // get the Media Source Panel listing
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
        getDirectoryListing(req,`${__dirname}/sources/filesystem/`, dir || '/', true, true, `${__dirname}/sources/filesystem/`).then((results) => (
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


      const language = lang || 'en-US';
      //console.log(language, '.');
      const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
      //console.log('..', languageWithoutRegionCode);

      const messages = (() => {
        //console.log('m.');
        //return localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;
        if(language && languageWithoutRegionCode != 'en') {
          //console.log(path.join(__dirname, `/client/i18n/locales/en.json`));
          //console.log('m..');
          try {
            return JSON.parse(fs.readFileSync(path.join(__dirname, `/client/build/assets/js/i18n/locales/${languageWithoutRegionCode}.json`)))
          } catch(e) {
            //console.log('uh oh', e);
            return localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;
          }
          //console.log('localeData',localeData);
        }
        //console.log('double uh oh');
        return localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;
      })();
      //console.log('...');
      //console.log('time for eurekaMarkup!');
      //console.log(language);
      //console.log(languageWithoutRegionCode);
      //console.log(messages);
      const eurekaMarkup = ReactDOM.renderToString( //<IntlProvider locale={language} messages={messages}>
        <EurekaMediaBrowser messages={messages} currentDirectory={dir} lang={language} />
      );
      resolve(eurekaMarkup);
    });
  })
}



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

      if(!isFile) { // it is a folder
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

function getDirectoryListing(req, baseURL = '', dirPath = '', includeFiles = true, includeDirectories = true) {
  //if(dirPath.slice(-1) !== '/') dirPath = `${dirPath}/`;
  //dirPath = `${baseURL}${dirPath}`;

  dirPath = path.join(baseURL, dirPath);
  const saveData = req.get('Save-Data') !== undefined;
  //console.log('getDirectoryListing', baseURL, dirPath, includeFiles, includeDirectories);
  //console.log('saveData', saveData);

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
          path:path.join(dirPath,file),
          absoluteURL:path.join(dirPath,file).replace(__dirname, ''),
          absolutePreviewURL:`${path.join(dirPath,file).replace(__dirname, '')}?dim=${(saveData) ? '240' : '420'}${(saveData) ? '&quality=0.5' : ''}`,
          editedOn:Math.round(Math.random() * (new Date(mtime).getTime())),
          dimensions:(() => {
            try {
              //return undefined;
              const dimensions = sizeOf(path.join(dirPath, file));
              //console.log('dimensions', dimensions);
              return [dimensions.width, dimensions.height];
            } catch (e) {
              console.log(e);
              return undefined;
              //return [Math.round(Math.random()*420), Math.round(Math.random()*180)]
            }
          })(),
          fileSize:size
        });
      }

    });
    //console.log('results',results);
    resolve(results);
  });
}


app.get('/assets/components/eureka/media/sources/', (req, res) => {

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

app.get('/assets/components/eureka/media/sources/:source', (req, res) => {
  let dir = req.query.path,
  source = req.params.source;

  if(dir) {
    if(dir.slice(-1) != '/') dir = `${dir}/`;
    getDirectoryListing(req, `${__dirname}/sources/filesystem/`,dir, true, true, `${__dirname}/sources/filesystem/`).then((results) => (
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

app.post('/assets/components/eureka/media/sources/:source', (req, res) => {

  const dir = req.query.path,
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
    getDirectoryListing(req, `${__dirname}/sources/filesystem/`,dir, true, true, `${__dirname}/sources/filesystem/`).then((results) => (
      res.json(results)
    )).catch((err) => (
      res.json([])
    ));
  });

  form.parse(req);

});

app.post('/assets/components/eureka/media/attachments/:source', (req, res) => {
  const form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    if(err) {
      console.log(err);
      res.json(err);
      return;
    }

    const dir = Array.isArray(fields.cd) ? fields.cd[0] : fields[cd];
    const cs = Array.isArray(fields.cs) ? fields.cs[0] : fields[cs];
    let relativePath = dir.includes(__dirname) ? dir :  path.join(path.join(__dirname, 'sources/filesystem'), dir);


    var zip = new AdmZip();

    const f = fields['zip_file[]'].map((file) => (
      zip.addLocalFile(path.join(relativePath, file))
    ));
    const filename = `eureka-${cs}.zip`;
    res.set({
        "Content-Disposition": 'attachment; filename="'+filename+'"'
    });

    zip.toBuffer((buffer) => (
      res.end(buffer)
    ), (err) => (
      res.json(err)
    ))
  });
});

/*
Delete multiple files
`DELETE /sources/:id/?dir=foo`
*/

/*
Delete a directory
`DELETE /sources/:id/?dir=foo`
*/

app.delete('/assets/components/eureka/media/sources/:source', function (req, res) {
  var source = req.params.source;

  var dir = req.query.dir;
  if (dir) {

    // this is kinda #janky but whatever
    var deletePath = dir.includes(__dirname) ? dir : path.join(path.join(__dirname, 'sources/filesystem'), dir);

    console.log('delete ' + path + ' source ' + source);

    rmdir(deletePath, function (err, dirs, files) {
      if (err) {
        console.log(err);
        res.json(false);
      } else res.json(true);
    });
  } else {
    console.log('deleting files not the whole folder');

    var form = new multiparty.Form(); // formidable doesn't support multiple input names https://github.com/felixge/node-formidable/issues/33
    //form.multiples = true;

    if(req.query.path) {
      deleteDirectory(req.query.path).then(() => {
        getDirectoryListing(req, __dirname + '/sources/filesystem/', req.query.path, true, true).then(function (results) {
          return res.json(results);
        }).catch(function (err) {
          res.json(err);
        });
      })
    } else {
      form.parse(req, function (err, fields, files) {
        if (err) {
          console.log(err);
          res.json(err);
          return;
        }
        console.log('fields', fields);
        var dir = Array.isArray(fields.cd) ? fields.cd[0] : fields[cd];
        console.log(dir);
        var deletePath = dir.includes(__dirname) ? dir : path.join(path.join(__dirname, 'sources/filesystem'), dir);
        //console.log('fields', fields);
        //console.log(req.body, JSON.stringify(req.body));
        var promises = fields['delete_file[]'].map(function (file) {
          return deleteDirectory(path.join(deletePath, file));
        });

        Promise.all(promises).then(function () {
          console.log('deleted files');
          getDirectoryListing(req, __dirname + '/sources/filesystem/', dir, true, true).then(function (results) {
            return res.json(results);
          }).catch(function (err) {
            res.json(err);
          });
        }).catch(function (err) {
          res.json(err);
        });


      });
    }


  }

  function deleteDirectory(directory) {
    console.log('promising to delete', directory);
    return new Promise(function (resolve, reject) {
      rmdir(directory, function (err, dirs, files) {
        console.log('deleted ' + directory);
        if (err) {
          reject(err);
        } else resolve(directory);
        console.log('directory', directory);
      });
    });
  }

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

app.put('/assets/components/eureka/media/sources/:source', (req, res) => {
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
      getDirectoryListing(req,``,dir, true, true).then((results) => (
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

/* __       __   __ __
/\ \\ \    /'__`\/\ \\ \
\ \ \\ \  /\ \/\ \ \ \\ \
\ \ \\ \_\ \ \ \ \ \ \\ \_
 \ \__ ,__\ \ \_\ \ \__ ,__\
  \/_/\_\_/\ \____/\/_/\_\_/
     \/_/   \/___/    \/*/


app.use(function (req, res) {
 res.redirect('/');
 res.end();
});




app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
