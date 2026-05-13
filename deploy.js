require('dotenv').config();

const path = require('path');
const fs = require('fs');
const FtpDeploy = require('ftp-deploy');
const ftp = require('basic-ftp');

const ftpDeploy = new FtpDeploy();

const baseConfig = {

  user: process.env.FTP_USER,
  password: process.env.FTP_PASS,
  host: process.env.FTP_HOST,

  port: 21,

  remoteRoot: '/www/',

  forcePasv: true,

  sftp: false,

};


// =========================
// FICHIERS LOCAUX
// =========================

function getLocalFiles(dir, base = dir){

  let results = [];

  const files = fs.readdirSync(dir);

  files.forEach(file => {

    const fullPath = path.join(dir, file);

    const stat = fs.statSync(fullPath);

    if(stat.isDirectory()){

      results = results.concat(
        getLocalFiles(fullPath, base)
      );

    } else {

      results.push(
        path.relative(base, fullPath)
          .replace(/\\/g, '/')
      );
    }

  });

  return results;
}


// =========================
// NETTOYAGE FTP
// =========================

async function cleanupRemote(){

  console.log('🧹 Nettoyage intelligent FTP...');

  const client = new ftp.Client();

  client.ftp.verbose = false;

  await client.access({

    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,

    secure: false,

  });

  const localFiles = getLocalFiles(
    path.join(__dirname, 'dist')
  );

  async function scanRemote(dir){

    let results = [];

    const list = await client.list(dir);

    for(const item of list){

      const remotePath =
        `${dir}/${item.name}`;

      // ignore fichiers cachés
      if(item.name.startsWith('.')){
        continue;
      }

      if(item.isDirectory){

        results = results.concat(
          await scanRemote(remotePath)
        );

      } else {

        results.push(
          remotePath.replace('/www/', '')
        );

      }

    }

    return results;
  }

  const remoteFiles =
    await scanRemote('/www');



  for(const remoteFile of remoteFiles){

    if(!localFiles.includes(remoteFile)){

      console.log(`🗑 ${remoteFile}`);

      try {

        await client.remove(
          `/www/${remoteFile}`
        );

      } catch(err){

        console.log(
          `⚠ Impossible de supprimer ${remoteFile}`
        );

      }

    }

  }

  client.close();

  console.log('✅ Nettoyage terminé');

}


// =========================
// DEPLOY
// =========================

async function deploy(){

  try {

    // =========================
    // 1. Maintenance ON
    // =========================

    console.log('🟡 Activation maintenance...');

    await ftpDeploy.deploy({

      ...baseConfig,

      localRoot: path.join(__dirname, 'maintenance'),

      include: ['index.html'],

      deleteRemote: false,

    });

    console.log('✅ Maintenance activée');


    // =========================
    // 2. Nettoyage intelligent
    // =========================

    await cleanupRemote();


    // =========================
    // 3. Upload site
    // =========================

    console.log('🚀 Upload du site...');

    await ftpDeploy.deploy({

      ...baseConfig,

      localRoot: path.join(__dirname, 'dist'),
      include: ['*', '**/*'],

      exclude: ['index.html'],

      deleteRemote: false,

    });

    console.log('✅ Fichiers uploadés');


    // =========================
    // 4. Publication index
    // =========================

    console.log('🟢 Publication du site...');

    await ftpDeploy.deploy({

      ...baseConfig,

      localRoot: path.join(__dirname, 'dist'),

      include: ['index.html'],

      deleteRemote: false,

    });

    console.log('🎉 Déploiement terminé');

  }

  catch(err){

    console.error(err);

    console.log('❌ Erreur déploiement');

  }
}


// =========================
// START
// =========================

deploy();
