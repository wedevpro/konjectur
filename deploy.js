require('dotenv').config();
const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();

const config = {
    user: process.env.FTP_USER,
    // Password optional, prompted if none given
    password: process.env.FTP_PASS,
    host: process.env.FTP_HOST,
    port: 21,
    localRoot: __dirname + "/dist",
    remoteRoot: "/www/",
    include: ["*", ".htaccess"],      // this would upload everything except dot files
    // include: ["*.php", "dist/*", ".*"],
    // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
    // exclude: [
    //     "dist/**/*.map",
    //     "node_modules/**",
    //     "node_modules/**/.*",
    //     ".git/**",
    // ],
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: true,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: true,
    // use sftp or ftp
    sftp: false,
};

console.log(`🚀 Envoi des fichiers depuis ${config.localRoot.replace('/', '\\')}`);

ftpDeploy
    .deploy(config)
    .then((res) => {
      console.log(res);
      console.log("✅ Déploiement terminé !");
    })
    .catch((err) => {
      console.error(err);
      console.log("❌ Erreur de déploiement");
    });