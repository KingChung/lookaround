;(function(){
    $(document).on('ready', function(){
        $('#rssForm').on('submit', function(){
            chrome.storage.sync.set({'lookaround_rss': $('#rss').val()});
            return false;
        });
    });
})();
