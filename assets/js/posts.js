window.posts = {
    currentPage: 1,
    pagelen: 15
};

var postTpl = _.template('\
    <div class="media post-item">\
        <div class="media-left"><a href="#"><%= authorLetter %></a></div>\
        <div class="media-body">\
            <p class="date">Created <%= date %></p>\
            <p class="lead content"><%= content %></p>\
            <p class="emotion">I was <%= emotion %></p>\
        </div>\
    </div>\
');

var $postContainer = $('#post-list');

var postModel = function(postData) {
    return {
        id: postData.id,
        date: moment(postData.created_at).fromNow(),
        content: postData.content,
        emotion: postData.emotion,
        authorLetter: getUserData('email').charAt(0).toUpperCase()
    };
};

var renderPostItem = function(postModel) {

    var $postItem = postTpl(postModel);

    return $postItem;

};

var loadPostsProcedure = function() {

    return xhrListPosts(window.posts.currentPage, window.posts.pagelen).done(function(data) {

        _.each(_.map(data.data, postModel), function(postModel) {
            $postContainer.append(renderPostItem(postModel));
        });

    });
};


$(function() {
    $('#edit-post form').submit(function(e) {
        e.preventDefault();

        var $button = $(this).find('input[type="submit"]');
        var $errorBox = $(this).find('.error');

        var content = $(this).find('textarea[name="content"]').val();
        var emotion = $(this).find('select[name="emotion"]').val();

        $errorBox.text('');
        lockButtonProcedure($button);


        xhrCreatePost({
            content: content,
            emotion: emotion
        })
        .done(function(data) {

            var $postItem = renderPostItem(postModel(data.data));
            $postContainer.prepend($postItem);
        })
        .fail(function(resp) {

        })
        .always(function() {
            unlockButtonProcedure($button);
        })

    });
});

