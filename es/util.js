export var isMobile = function isMobile() {
    return (/mobile/i.test(navigator.userAgent)
    );
};
export function getYoutubeVideoId(str) {
    var videoid = str.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)(?:(?:embed\/)?([^\s"&]+))/i);
    if (videoid != null) {
        return videoid[1];
    } else {
        return "";
    }
}
export function getVimeoId(url) {
    var idArr = url.match(/(?:www\.|player\.)?vimeo.com\/([\da-z]+)/i);
    if (idArr !== null) {
        return idArr[1];
    } else {
        return "";
    }
}