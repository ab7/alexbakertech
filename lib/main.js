import fs from 'fs';

import {toTitleCase, sortPosts, unJunkFiles} from './helpers';


function getAssetFileNames(assets) {
  let jsManifest = JSON.parse(fs.readFileSync(assets + 'js-manifest.json', 'utf8'));
  let cssManifest = JSON.parse(fs.readFileSync(assets + 'css-manifest.json', 'utf8'));
  return {
    jsFile: jsManifest['main.js'],
    cssFile: cssManifest['main.css']
  }
}

function getPostData(postsDir, cb) {
  let postData = {};
  postData.posts = [];
  postData.livePosts = [];

  fs.readdir(postsDir , (err, files) => {
    if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }

    unJunkFiles(files).forEach((file) => {
      fs.readFile(postsDir + file, 'utf-8', (err, content) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        let paramStartMarker = '<!--//',
            paramEndMarker = '//-->',
            snippetMarker = '<!-- snippet -->';

        let paramsStart = content.lastIndexOf(paramStartMarker),
            paramsEnd = content.lastIndexOf(paramEndMarker),
            params = content.substring(paramsStart + paramStartMarker.length, paramsEnd),
            paramLines = params.split('\n'),
            postObj = {};

        for (let i = 0; i < paramLines.length; i++) {
          if (paramLines[i]) {
            let data = paramLines[i].split(':');
            postObj[data[0].trim()] = data[1].trim();
          }
        }

        if (postObj.live === 'true') {
          let filename = file.split('.')[0],
              snippetStart = content.lastIndexOf(snippetMarker);
          postObj.slug = filename;
          let snippet = content.substring(
            snippetStart + snippetMarker.length,
            content.length
          ).split('\n');

          postObj.snippet = snippet[0].split(' ').slice(0, 40).join(' ');
          postData.livePosts.push(postsDir + file);
          postData.posts.push(postObj);
        }

        sortPosts(postData.posts)

        cb(postData);
      });
    });
  });
}

function getNavLinks(pagesDir) {
  let navLinks = [],
      sortOrder = {
    'blog': 0,
    'portfolio': 1,
    'about': 2,
    'contact': 3
  }

  fs.readdir(pagesDir, (err, files) => {
    if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }

    unJunkFiles(files).forEach((file) => {
      let fileParts = file.split('.');

      if (fileParts[1] !== undefined) {
        if (fileParts[1] === 'html') {
          let navObj = {};

          if (file === 'index.html') {
            navLinks.splice(sortOrder.blog, 0, {title: 'Blog', link: '/'});
            return;
          }

          navObj.title = toTitleCase(file.split('.')[0]);
          navObj.link = file.replace('.html', '');

          navLinks.splice(sortOrder[fileParts[0]], 0, navObj);
        }
      }
    });
  });

  return navLinks;
}


export {getAssetFileNames, getPostData, getNavLinks};
