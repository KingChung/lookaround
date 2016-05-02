;(function(){
    $(document).on('ready', function(){
        var date = (new Date()).getDate()%10;
        $('.home-background').css('background-image', 'url(https://momentumdash.com/backgrounds/0' + date + '.jpg)')
    });

    var $contents = [];
    var getRotate = function() {
        getRotate.count || (getRotate.count = 0);
        var result = Math.floor(Math.random()*9) % 2 == 0;
        if(result == getRotate.current) {
            if(getRotate.count > 2) {
                result = !result;
            } else {
                getRotate.count++;
            }
        }
        return getRotate.current = result;
    }

    function isChinese(char) {
        var pattern = /^[\u0391-\uFFE5]+$/g;
        return pattern.test(char);
    }

    function isEnglish(char) {
        var pattern = /[a-zA-Z]+/;
        return pattern.test(char);
    }

    function filterContent(content){
        var separator = 24, lastChar = content[separator];
        if(isEnglish(lastChar)) {
            while(separator < content.length) {
                separator++;
                if(content[separator] == ' ' || isChinese(content[separator])) {
                    break;
                }
            }
        }

        var res = content.substr(0, separator);
        if(content.length > separator) {
            return res + '###' + filterContent(content.substr(separator));
        } else {
            return res;
        }
    }

    function filterHelper(content){
        return content.split('###');
    }

    function convertContent(content){
        return filterHelper(filterContent(content));
    }

    function createContent(source) {
        var left = 0;
        var $wrapper = $('<div class="content">');

        // Create title
        var $title = $('<div class="ro ro-right">');
        $title.css('left', left);
        var titleText = '<a class="ro-title" target="_blank" href="' + source.link + '">';
            titleText += source.title;
            titleText += '</a>';
        $title.html(titleText).appendTo($wrapper);

        if(source.title.length > 32) {
            left += 32
        }

        // Create content
        for (var i in source.sentences) {
            var rotate = getRotate() ? 'right' : 'left';
            var $content = $('<div class="ro ro-' + rotate + '">');
            $content
                .css('left', left+=24)
                .appendTo($wrapper);

            var $sentence = $('<p class="ro-content">');
            $sentence
                .text(source.sentences[i])
                .appendTo($content);
        }

        $wrapper.css('width', left + 24);
        return $('<section class="animated fadeIn">').append($wrapper);
    }

    function renderFeeds(entries) {
        var $wrapper = $('#wrapper');
        $('#wrapper')
            .fadeOut(function(){
                $(this).empty();
                for (var i in entries) {
                    var entrie = entries[i];
                    var sentences = convertContent(entrie.contentSnippet);
                    var section = createContent({
                        title: entrie.title,
                        link: entrie.link,
                        date: entrie.publishedDate,
                        sentences: sentences
                    });
                    $(this).append(section);
                }
            })
            .fadeIn();
    }

    function loadFeeds(url, callback) {
        var feed = new google.feeds.Feed(url);
        feed.load(function(result) {
            if (!result.error) {
                callback && callback(result.feed);
            }
        });
    }

    function toggleTitle(toLoading) {
        var $title = $('#title');
        if(toggleTitle.current != void(0) && toggleTitle.current == toLoading) {
            return true;
        }
        toggleTitle.current = toLoading;
        $title.fadeOut(function(){
            $(this).toggleClass('loading rotate infinite animated', toLoading).fadeIn(3e3);
        });
    }

    google.load("feeds", "1");

    function initialize() {
        chrome.storage.sync.get('lookaround_rss', function(items){
            var url = items.lookaround_rss || 'http://www.oschina.net/news/rss?show=industry';
            loadFeeds(url, function(feed){
                toggleTitle(false);
                renderFeeds(feed.entries);
            });
        });
    }

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        toggleTitle(true);
        loadFeeds(changes.lookaround_rss.newValue, function(feed){
            toggleTitle(false);
            renderFeeds(feed.entries);
        });
    });

    google.setOnLoadCallback(initialize);
})();
