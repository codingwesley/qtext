export const isMobile = () => {
  return /mobile/i.test(navigator.userAgent);
};

export function getYoutubeVideoId(str: string) {
  var videoid = str.match(
    /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)(?:embed\/([^\s"&]+))/
  );
  if (videoid != null) {
    return videoid[1];
  } else {
    return "";
  }
}
