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
        const isEnglish = lang === 'en';
        const insertionMethod = isEnglish ? 'unshift' : 'push';

        const language_data = {
            name: content.langName,
            code: lang,
        };

        const content_data = {
            content: content,
            dest: SERVER_ROOT + lang,
            path: `..`
        }

        if (isEnglish) {
            // EN needs a different path and also has to be in first place of array
            language_data['code'] = null;
            content_data['dest'] = SERVER_ROOT;
            content_data['path'] = `.`;
        } 
            
        languages[insertionMethod](language_data);
        translates[insertionMethod](content_data)

    });

    return {languages, translates}
};