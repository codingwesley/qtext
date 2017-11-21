"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobile = function () {
    return /mobile/i.test(navigator.userAgent);
};
function getYoutubeVideoId(str) {
    var videoid = str.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)(?:(?:embed\/)?([^\s"&]+))/i);
    if (videoid != null) {
        return videoid[1];
    }
    else {
        return "";
    }
}
exports.getYoutubeVideoId = getYoutubeVideoId;
function getVimeoId(url) {
    var idArr = url.match(/(?:www\.|player\.)?vimeo.com\/([\da-z]+)/i);
    if (idArr !== null) {
        return idArr[1];
    }
    else {
        return "";
    }
}
exports.getVimeoId = getVimeoId;
