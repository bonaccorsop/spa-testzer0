
function resolveApiUrl(urlSegment) {
    return window.envConfig.API_URL + '/' + urlSegment;
}

function encodePassword(password) {
    return window.btoa(password);
}

function showError(e) {

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

function xhrUserInfo(token) {
    return $.ajax(xhrTemplate({
        type: "GET",
        url: resolveApiUrl('me')
    }));
}

