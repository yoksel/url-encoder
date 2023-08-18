const fs = require(`fs`);
const path = require(`path`);

exports.default = (SERVER_ROOT, TRANSLATES_PATH) => {
    // GENERATE TRANSLATES
    const translateFiles = fs.readdirSync(TRANSLATES_PATH);
    const languages = [];
    const translates = [];

    translateFiles.forEach(translateFile => {
    const fileUrl = TRANSLATES_PATH + translateFile;
    const lang = path.basename(fileUrl, `.json`);
    const content = JSON.parse(fs.readFileSync(fileUrl, `utf8`));

    if (lang === `en`) {
        // EN needs a different path and also has to be in first place of array
        languages.unshift({
        name: content.langName,
        code: null,
        });
    
        translates.unshift({
        content: content,
        dest: SERVER_ROOT,
        path: `.`
        })
    } else {
        languages.push({
        name: content.langName,
        code: lang,
        });
    
        translates.push({
        content: content,
        dest: SERVER_ROOT + lang,
        path: `..`
        })
    }
    });

    return {languages, translates}
};