window.posts = {
    nextPage: 1,
    pagelen: 15,
    exclude: []
};

var postTpl = _.template('\
    <div class="media post-item">\
        <div class="media-left"><a href="#"><%= authorLetter %></a></div>\
        <div class="media-body">\
            <p class="head">\
                <span class="date">Created <%= date %></span>\
                <a class="delete">Delete this post</a>\
            </p>\
            <p class="lead content"><%= content %></p>\
            <p class="emotion">I was <%= emotion %></p>\
        </div>\
        <div class="actions">\
            <div class="rate"></div>\
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
        rate: postData.rate,
        authorLetter: getUserData('email').charAt(0).toUpperCase()
    };
};

var renderPostItem = function(postModel) {

    var $postItem = $(postTpl(postModel));

    //console.log(postModel.rate);

    $postItem.find('.rate').raty({
        score: postModel.rate,
        click: function(rate) {xhrRatePost(postModel.id, rate);}
    });

    $postItem.find('.delete').click(function(e) {
        e.preventDefault();
        xhrDeletePost(postModel.id);
        $postItem.fadeOut(400);
    });

    return $postItem;

};

var loadPostsProcedure = function() {

    $loadButton = $('#load-more');

    lockButtonProcedure($loadButton);

    return xhrListPosts(window.posts.nextPage, window.posts.pagelen, window.posts.exclude).done(function(data) {

        if(! _.isEmpty(data.data)) {

            _.each(_.map(data.data, postModel), function(postModel) {
                $postContainer.append(renderPostItem(postModel));
            });

            window.posts.nextPage++;
            unlockButtonProcedure($loadButton);

        } else {
            $loadButton.val('NO MORE POSTS!');
            $loadButton.unbind('click');
            $loadButton.hide(2000);
        }


    });
};


$(function() {

    $('#load-more').click(function(e) {
        e.preventDefault();
        loadPostsProcedure();
    });

    $(window).scroll(function() {

        $loadButton = $('#load-more');

        if($loadButton.is(':visible') && $(window).scrollTop() > $(document).height() - 800) {
            $loadButton.trigger('click');
        }
    });

    $('#edit-post form').submit(function(e) {
        e.preventDefault();

        var $form = $(this);
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
            $form.find('textarea, select, input').val('');
            window.posts.exclude.push(data.data.id);
        })
        .fail(function(resp) {

        })
        .always(function() {
            unlockButtonProcedure($button);
        })

    });
});

