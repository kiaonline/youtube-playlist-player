(function ( $ ) {
    'use strict';
    var player_api_url  = "http://www.youtube.com/player_api/";
    var globalPLayer    = false;
    var apiLoaded       = false;
    var players         = [];

    var ID = function () {
        return Math.random().toString(36).substr(2, 9);
    };

    function parseUrl(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    $(document).ready(function(){
        $.getScript(player_api_url).done(function(){
            console.log('loaded');
            apiLoaded = true;
        }).fail(function(jqxhr, settings, exception){
            alert(exception);
        });
    });
    
    function init(){
        apiLoaded = true;
        if(players.length === 0) return true;
        $(players).each(function(){
            this.init.call();
        });
    }

    window.onYouTubePlayerAPIReady = init;



    var YTPL = function(el,playlist,options){
        var previousIndex = 0;
        var $el = $(el);
        var id  = $el.attr('id');
        var p   = null;
        var w   = options.width;
        var h   = options.height;
        
        delete(options.width);
        delete(options.height);
        var playerVars = options;
        playerVars.playlist = playlist.join(',');
        
        
        $el.bind('changed',function(){
            console.info('YTPL changed');
        })

        function __initPlayer(){
            
            p = new YT.Player(id, {
                width: w,
                height: h,
                playerVars: playerVars,
                events: {
                    'onReady': __onPlayerReady,
                    'onStateChange': __onPlayerStateChange
                }
            });
            
        }
        
        // autoplay video
        function __onPlayerReady(event) {
            event.target.playVideo();
        }

        var done = false;

        function __onPlayerStateChange(event) {        
            if(event.data == -1) {
                    
                // get current video index
                var index = p.getPlaylistIndex();
                
                // update when playlists do not match
                if(p.getPlaylist().length != playlist.length) {
                    // update playlist and start playing at the proper index
                    p.loadPlaylist(playlist, previousIndex+1);
                }
                
                /*
                keep track of the last index we got
                if videos are added while the last playlist item is playing,
                the next index will be zero and skip the new videos
                to make sure we play the proper video, we use "last index + 1"
                */
                previousIndex = index;
                $el.trigger('changed',index);
            }
        }

        function __stopVideo() {
            //p.stopVideo();
            console.log('parouuu');
        }
    
        return {
            init:function(){
                __initPlayer();
            },
            loadVideoById:function(videoId,options){
                options = $.extend({},{
                    'videoId'           : videoId || bHQqvYy5KYo,
                    'suggestedQuality'  : 'large'
                },options);
                p.loadVideoById(options);
                return this;
            },
            loadPlaylist:function(pl,options){
                options = $.extend({},{
                    playlist            :pl.join(','),
                    listType            :'playlist',
                    'suggestedQuality'  : 'large',
                    events: {
                        'onReady'       : __onPlayerReady,
                        'onStateChange' : __onPlayerStateChange
                    }
                },options);
                
                p.loadPlaylist(options);


            },
            loadVideoByUrl:function(url,options){
                options = $.extend({},{
                    'mediaContentUrl'   : url,
                    'suggestedQuality'  : 'large'
                },options);

                p.loadVideoByUrl(options)
            },
            enqueueVideoId:function(videoId){
                playlist.push(videoId);  
            },
            on:function(ev,callback,data){
                $el.bind(ev,callback,data);
            },
            destroy:function(){},
        }
    }

    
    $.fn.YTPL = function(playlist,options) {
        
        return $(this).each(function(){
            var $this   = $(this);
            var data    = $this.data('YTPL');
            if(data) return data;
            //set element id to reference the player
            if(!$this.attr('id')) $this.attr('id',ID());

            options = $.extend({},$.fn.YTPL.options,options);

            var ytpl = new YTPL(this,playlist,options);
            $this.data('YTPL',ytpl);

            try {
                YT.Player;
            } catch (error) {
                players.push(ytpl);
            }
            return ytpl;
        });

    };

    $.fn.YTPL.options = {
        width:640,
        height:340,
        autoplay:1,
        loop:1, 
        controls: 1,
        iv_load_policy:3,
        modestbranding:1,
        rel:0,
        showinfo:0
    };

}( jQuery ));


/*

var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: '0Bmhjf0rKe8',
        events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        }
    });
}

// autoplay video
function onPlayerReady(event) {
    event.target.playVideo();
}

// when video ends
function onPlayerStateChange(event) {        
    if(event.data === 0) {            
        alert('done');
    }
}
*/