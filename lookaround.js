;(function(){
    var $contents = [];
    function getSide() {
        return Math.floor(Math.random()*99) % 2 == 0;
    }

    //@todo
    function filterContent(content){
        var res = content.substr(0, 24);
        if(content.length > 24) {
            return res + '###' + filterContent(content.substr(24));
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

        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'content');

        //Create title
        var titleWrapper = document.createElement('div');
        titleWrapper.setAttribute('class', 'ro ro-right');
        titleWrapper.style.left = left;

        var title = document.createElement('h2');
        title.setAttribute('class', 'ro-content');
        var txt = document.createTextNode(source.title);
        title.appendChild(txt);
        titleWrapper.appendChild(title);
        wrapper.appendChild(titleWrapper);

        if(source.title.length > 24) {
            left += 24;
        }

        for (var i in source.sentences) {
            var content = document.createElement('div');
            content.setAttribute('class', 'ro ro-' + (getSide() ? 'right' : 'left'));
            content.style.left = (left += 24) + 'px';

            var sentence = document.createElement('p');
            sentence.setAttribute('class', 'ro-content');
            var txt = document.createTextNode(source.sentences[i]);
            sentence.appendChild(txt);

            content.appendChild(sentence);
            wrapper.appendChild(content);
        }

        var section = document.createElement('section');
        section.setAttribute('class', 'content-wrapper');
        section.appendChild(wrapper);
        return section;
    }
    google.load("feeds", "1");

    function initialize() {
        var feed = new google.feeds.Feed("http://www.oschina.net/news/rss?show=industry");
        feed.load(function(result) {
            var main = document.getElementById('main');
            if (!result.error) {
                for (var i in result.feed.entries) {
                    var entrie = result.feed.entries[i];
                    var content = convertContent(entrie.contentSnippet);
                    var section = createContent({
                        title: entrie.title,
                        sentences: content
                    });
                    main.appendChild(section);
                }
            }
        });
    }
    google.setOnLoadCallback(initialize);
})();
