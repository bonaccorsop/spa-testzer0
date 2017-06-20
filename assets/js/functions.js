
function resolveApiUrl(urlSegment) {
    return window.envConfig.API_URL + '/' + urlSegment;
}

function encodePassword(password) {
    return window.btoa(password);
}

// ------------------------------------------------------

var tokenCookieName = window.const.TOKEN_COOKIE_NAME;

function getAuthToken() {
    var cookie = Cookies.get(tokenCookieName);
    return ! _.isEmpty(cookie) ? cookie : null;
}

function setAuthToken(token) {
    return Cookies.set(tokenCookieName, token, {expires: 30});
}

function unsetAuthCookie() {
    return Cookies.remove(tokenCookieName);
}

function hasAuthCookie() {
    return ! _.isEmpty(getAuthToken());
}

function setUserData(data) {
    window.userData = data;
}

function getUserData(key) {
     return ! _.isEmpty(window.userData[key]) ? window.userData[key] : null;
}

function htmlDecode(input) {
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

// ------------------------------------------------------

var lockButtonProcedure = function($button) {
    $button.attr('disabled', 'disabled');
    $button.data('previousText', $button.val());
    $button.val('Loading');
};

var unlockButtonProcedure = function($button) {
    $button.removeAttr('disabled');
    $button.val($button.data('previousText'));
};

// ------------------------------------------------------

var xhrTemplate = function(dataToExtend) {
    return _.extend({
        headers: {token: getAuthToken()},
        dataType: 'json',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "Negotiate");
        }
    }, dataToExtend);
};

function xhrLogin(username, password) {
    return $.ajax(xhrTemplate({
        type: "POST",
        url: resolveApiUrl('login'),
        data: JSON.stringify({
            username: username,
            password: encodePassword(password)
        })
    }));
}

function xhrSignup(username, password) {
    return $.ajax(xhrTemplate({
        type: "POST",
        url: resolveApiUrl('signup'),
        data: JSON.stringify({
            username: username,
            password: encodePassword(password)
        })
    }));
}

function xhrUserInfo() {
    return $.ajax(xhrTemplate({
        type: "GET",
        url: resolveApiUrl('me')
    }));
}

function xhrListPosts(page, pagelen, exclude) {

    var excludeStr = exclude.join(',');

    return $.ajax(xhrTemplate({
        type: "GET",
        url: resolveApiUrl('me/posts?page='+page+'&pagelen='+pagelen+'&exclude='+excludeStr)
    }));
}

function xhrFindPost(postId) {
    return $.ajax(xhrTemplate({
        type: "GET",
        url: resolveApiUrl('me/posts/'+postId)
    }));
}

function xhrCreatePost(postData) {
    return $.ajax(xhrTemplate({
        type: "POST",
        url: resolveApiUrl('me/posts'),
        data: JSON.stringify(postData)
    }));
}

function xhrUpdatePost(postId, postData) {
    return $.ajax(xhrTemplate({
        type: "PUT",
        url: resolveApiUrl('me/posts/'+postId),
        data: JSON.stringify(postData)
    }));
}

function xhrDeletePost(postId) {
    return $.ajax(xhrTemplate({
        type: "DELETE",
        url: resolveApiUrl('me/posts/'+postId)
    }));
}

function xhrRatePost(postId, rate) {
    return $.ajax(xhrTemplate({
        type: "PATCH",
        url: resolveApiUrl('me/posts/'+postId+'/rate'),
        data: JSON.stringify({rate: rate})
    }));
}

