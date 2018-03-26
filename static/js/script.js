var CurrentPage = 0;

function ParseLinkHeader(link)
{
    var entries = link.split(",");
    var links = { };
    for (var i in entries)
    {
        var entry = entries[i];
        var link = { };
        link.name = entry.match(/rel=\"([^\"]*)/)[1];
        link.url = entry.match(/<([^>]*)/)[1];
        link.page = entry.match(/page=(\d+).*$/)[1];
        links[link.name] = link;
    }
    return links;
}

function DoGithubComments(comment_id, page_id)
{
    var repo_name = "frenck/frenck.nl";

    if (page_id === undefined)
        page_id = 1;

    var api_url = "https://api.github.com/repos/" + repo_name;
    var api_issue_url = api_url + "/issues/" + comment_id;
    var api_comments_url = api_url + "/issues/" + comment_id + "/comments" + "?page=" + page_id;

    var url = "https://github.com/frenck/frenck.nl/issues/" + comment_id;

    $(document).ready(function ()
    {
        $.getJSON(api_issue_url, function(data) {
            NbComments = data.comments;
        });

        $.ajax(api_comments_url, {
            headers: {Accept: "application/vnd.github.v3.html+json"},
            dataType: "json",
            success: function(comments, textStatus, jqXHR) {

                // Add post button to first page
                if (page_id == 1)
                    $("#gh-comments-list").append("<a href='" + url + "#new_comment_field' rel='nofollow' class='btn'>Post a comment on Github</a>");

                // Individual comments
                $.each(comments, function(i, comment) {

                    var date = new Date(comment.created_at);

                    var t = "<div class='gh-comment'>";
                    t += "<hr>";
                    t += "<div class='gh-author'>";
                    t += "<img class='gh-avatar' src='" + comment.user.avatar_url + "' width='28px'>";
                    t += "<b><a href='" + comment.user.html_url + "' rel='nofollow external'>github.com/" + comment.user.login + "</a></b>";
                    t += "<div class='date'>" + date.toUTCString() + "</div>";
                    t += "</div>";
                    t += "<hr>";
                    t += comment.body_html;
                    t += "</div>";
                    $("#gh-comments-list").append(t);
                });

                // Setup comments button if there are more pages to display
                var links = ParseLinkHeader(jqXHR.getResponseHeader("Link"));
                if ("next" in links)
                {
                    $("#gh-load-comments").attr("onclick", "DoGithubComments(" + comment_id + "," + (page_id + 1) + ");");
                    $("#gh-load-comments").show();
                }
                else
                {
                    $("#gh-load-comments").hide();
                }
            },
            error: function() {
                $("#gh-comments-list").append("<br /><i>Comments on this post are not yet available.</i>");
            }
        });
    });
}

(function($){
    var toTop = ($('#sidebar').height() - $(window).height()) + 60;
    // Caption
    $('.article-entry').each(function(i){
        $(this).find('img').each(function(){
            if ($(this).parent().hasClass('fancybox')) {
                return;
            }
            var alt = this.alt;
            if (alt) {
                $(this).after('<span class="caption">' + alt + '</span>');
            }

            $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
        });

        $(this).find('.fancybox').each(function(){
            $(this).attr('rel', 'article' + i);
        });
    });
    if ($.fancybox){
        $('.fancybox').fancybox();
    }

    // Profile card
    $(document).on('click', function () {
        $('#profile').removeClass('card');
    }).on('click', '#profile-anchor', function (e) {
        e.stopPropagation();
        $('#profile').toggleClass('card');
    }).on('click', '.profile-inner', function (e) {
        e.stopPropagation();
    });

    // To Top
    if ($('#sidebar').length) {
        $(document).on('scroll', function () {
            if ($(document).width() >= 800) {
                if(($(this).scrollTop() > toTop) && ($(this).scrollTop() > 0)) {
                    $('#toTop').fadeIn();
                    $('#toTop').css('left', $('#sidebar').offset().left);
                } else {
                    $('#toTop').fadeOut();
                }
            } else {
                $('#toTop').fadeIn();
                $('#toTop').css('right', 20);
            }
        }).on('click', '#toTop', function () {
            $('body, html').animate({ scrollTop: 0 }, 600);
        });
    }

})(jQuery);
