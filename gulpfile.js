const gulp = require(`gulp`);
const sass = require('gulp-sass')(require('sass'));
const sync = require(`browser-sync`).create();
const reload = sync.reload;
const colors = require(`colors/safe`);
const del = require(`del`);
const mustache = require(`gulp-mustache`);
const rename = require(`gulp-rename`);
const fs = require(`fs`);
const path = require(`path`);

const SERVER_ROOT = `build/`;
const TRANSLATES_PATH = `./src/translate/`;

// GENERATE TRANSLATES
const translates = [];
const translateFiles = fs.readdirSync(TRANSLATES_PATH);
const languages = [];

translateFiles.forEach(translateFile => {
  const fileUrl = TRANSLATES_PATH + translateFile;
  const lang = path.basename(fileUrl, `.json`);
  const content = JSON.parse(fs.readFileSync(fileUrl, `utf8`));

  languages.push({
    name: content.langName,
    code: lang == `en` ? null : lang,
  });

  translates.push({
    content: content,
    dest: lang == `en` ? SERVER_ROOT : SERVER_ROOT + lang,
    path: lang == `en` ? `.` : `..`
  })
});

// TEMPLATES
const tmplTasks = translates.map(({ dest, content }) => {
  return (done) => {
    // ATTACH RESPECTIVE LANG NAV
    const langs = languages.map(lang => ({
      ...lang,
      isActive: lang.name == content.langName
    }));
    gulp.src(`./src/index-src.html`)
      .pipe(mustache({...content, langs}))
      .pipe(rename(`index.html`))
      .pipe(gulp.dest(dest))
      .pipe(reload({ stream: true }));
    done();
  };
});

gulp.task(`tmpl`, gulp.series(...tmplTasks));

// SCSS
gulp.task(`scss`, function () {
  return gulp.src(`src/scss/**/styles.scss`)
    .pipe(sass().on(`error`, sass.logError))
    .pipe(gulp.dest(`${SERVER_ROOT}assets/css`))
    .pipe(reload({ stream: true }));
});

// JS
gulp.task(`js`, function () {
  return gulp.src(`src/js/**/*.js`)
    .pipe(gulp.dest(`${SERVER_ROOT}assets/js`))
    .pipe(reload({ stream: true }));
});

// CLEAN BUILD
gulp.task(`clean`, function (done) {
  del([`${SERVER_ROOT}*`]).then(paths => {
    console.log(`⬤  Deleted files and folders:\n`, paths.join(`\n`));
  });

  done();
});

// CLEAN BUILD & COPY FILES TO IT
gulp.task(`build`, gulp.series([`scss`, `js`, `tmpl`]));

// WATCH FILES
function watchTasks () {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: SERVER_ROOT
    }
  });

  gulp.watch([`src/scss/**/*.scss`], gulp.series(`scss`));
  gulp.watch([`src/index-src.html`, `src/translate/**/*`], gulp.series(`tmpl`));
  gulp.watch([`src/js/**/*`], gulp.series(`js`));
}

gulp.task(`serve`, gulp.series([`build`], watchTasks));

gulp.task(`default`, function () {
  console.log(colors.rainbow(`⬤  ================================ ⬤\n`));
  console.log(`  AVAILABLE COMMANDS:`);
  console.log(`  ` + colors.cyan(`-------------------\n`));
  console.log(`  ` + colors.yellow(`npm start`) +
              ` — run local server with watcher`);
  console.log(`  ` + colors.green(`npm run build`) +
              ` — make build of the project`);
  console.log(`  ` + colors.cyan(`npm run deploy`) +
              ` — make build and publish project to Github Pages`);
  console.log(colors.rainbow(`\n⬤  ================================ ⬤`));
});
