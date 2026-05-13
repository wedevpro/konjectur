require('dotenv').config();

const path = require('path');
const FtpDeploy = require('ftp-deploy');

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

async function deploy(){

  try {

    console.log('🟡 Activation maintenance...');

    // 1. Upload maintenance.html -> index.html
    await ftpDeploy.deploy({

      ...baseConfig,

      localRoot: path.join(__dirname, 'maintenance'),

      include: ['index.html'],

      deleteRemote: false,

    });

    console.log('✅ Maintenance activée');



    console.log('🚀 Upload du site...');

    // 2. Upload du site complet
    await ftpDeploy.deploy({

      ...baseConfig,

      localRoot: path.join(__dirname, 'dist'),
      include: ["*", ".htaccess"], 
      exclude: ['index.html'],

      deleteRemote: false,

    });

    console.log('✅ Fichiers uploadés');



    console.log('🟢 Publication du site...');

    // 3. Upload du vrai index.html
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

deploy();