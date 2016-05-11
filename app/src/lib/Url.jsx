
export default class Url {
    static maybeRelative(href) {
        if(typeof document !== 'undefined' && document.domain && (new RegExp('^https?://' + document.domain, 'i').test(href))) {
            return href.replace(new RegExp('^https?://' + document.domain + '(/|$)', 'i'), '/');
        }
        return href;
    }
}