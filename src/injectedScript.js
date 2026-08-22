// react-native-webview の injectedJavaScript として使用。
// window.ReactNativeWebView.postMessage 経由でRN側にデータを渡す。

export const injectedScript = `
(function () {
  if (window.__xMediaCollectorInstalled) { return true; }
  window.__xMediaCollectorInstalled = true;
  window.__watchedAccounts = window.__watchedAccounts || [];
  window.__seenTweetIds = window.__seenTweetIds || [];

  function extractAuthor(article) {
    var links = article.querySelectorAll('a[role="link"][href^="/"]');
    var ignore = ['home', 'explore', 'notifications', 'messages'];
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href') || '';
      var m = href.match(/^\\/([A-Za-z0-9_]{1,15})$/);
      if (m && ignore.indexOf(m[1].toLowerCase()) === -1) {
        return m[1].toLowerCase();
      }
    }
    return null;
  }

  function scan() {
    var accounts = (window.__watchedAccounts || []).map(function (a) {
      return a.toLowerCase();
    });
    if (accounts.length === 0) return;

    var articles = document.querySelectorAll('article[data-testid="tweet"]');
    var collected = [];

    articles.forEach(function (article) {
      var link = article.querySelector('a[href*="/status/"]');
      if (!link) return;
      var m = link.href.match(/status\\/(\\d+)/);
      if (!m) return;
      var tweetId = m[1];
      if (window.__seenTweetIds.indexOf(tweetId) !== -1) return;

      var author = extractAuthor(article);
      if (!author || accounts.indexOf(author) === -1) return;

      var tweetUrl = 'https://x.com/' + author + '/status/' + tweetId;
      var found = false;

      article.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(function (img) {
        collected.push({
          id: tweetId + '-' + img.src,
          tweetId: tweetId,
          account: author,
          type: 'image',
          mediaUrl: img.src,
          tweetUrl: tweetUrl,
          capturedAt: Date.now()
        });
        found = true;
      });

      article.querySelectorAll('video').forEach(function (video) {
        if (video.poster) {
          collected.push({
            id: tweetId + '-video',
            tweetId: tweetId,
            account: author,
            type: 'video',
            mediaUrl: video.poster,
            tweetUrl: tweetUrl,
            capturedAt: Date.now()
          });
          found = true;
        }
      });

      if (found) {
        window.__seenTweetIds.push(tweetId);
      }
    });

    if (collected.length > 0 && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'media', items: collected }));
    }
  }

  setInterval(scan, 1500);
  scan();
  true;
})();
`;
