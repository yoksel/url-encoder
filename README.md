# Url encoder for SVG

http://yoksel.github.io/url-encoder

## Usage

1. Take `svg`.
2. Encode it with [url-encoder](http://yoksel.github.io/url-encoder/).
3. Use code as `background-image` or `border-image` or `mask`.
4. Enjoy!

Demo: https://codepen.io/yoksel/full/WNrLpYW.

## How to add translate

1. Create translation file (use `src/translate/en.json` as example) and place it to `src/translate/`
2. Add new language to section `langs` in all translation files
3. Add item with your language to section `translates` in `gulpfile.js`.
4. Run `npm start` in console (wait until project will be opened in browser) and check all pages:
    * Link to new page must appear in all pages
    * In the page with new translate new language in list must looks like current (bold and black)
