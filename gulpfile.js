const gulp = require(`gulp`);
const sass = require(`gulp-sass`);
sass.compiler = require(`node-sass`);
const sync = require(`browser-sync`).create();
const reload = sync.reload;
const colors = require(`colors/safe`);
const del = require(`del`);
const mustache = require(`gulp-mustache`);
const rename = require(`gulp-rename`);

const SERVER_ROOT = `build/`;

const translates = [
  {
    dest: SERVER_ROOT,
    url: `./src/translate/en.json`
  },
  {
    dest: `${SERVER_ROOT}ru`,
    url: `./src/translate/ru.json`
  },
  {
    dest: `${SERVER_ROOT}de`,
    url: `./src/translate/de.json`
  }
];

// TEMPLATES
const tmplTasks = translates.map(({ dest, url }) => {
  return (done) => {
    gulp.src(`./src/index-src.html`)
      .pipe(mustache(url))
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
