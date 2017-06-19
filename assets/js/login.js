var authProcedure = function() {
    return xhrUserInfo().done(function(data) {
        setUserData(data.data);
        $('#preloader').hide();
        $('#app-container').fadeIn(400);

        $('.ph-username').text(getUserData('email'));
        loadPostsProcedure();
    });
};

var logoutProcedure = function() {
    unsetAuthCookie();
    window.location.reload();
};

$(function() {

    $('#login-modal a.register').click(function(e) {
        e.preventDefault();
        $('#login-container').hide();
        $('#signup-container').show();
    });

    $('#login-modal a.login').click(function(e) {
        e.preventDefault();
        $('#signup-container').hide();
        $('#login-container').show();
    });

    // ---------------------------------------------------------------------

    //Login Form Submission
    $('#login-container form').submit(function(e) {
        e.preventDefault();
        var $button = $(this).find('input[type="submit"]');
        var $errorBox = $(this).parent().find('.error');

        var username = $(this).find('input[name="user"]').val();
        var password = $(this).find('input[name="pass"]').val();

        $errorBox.text('');
        lockButtonProcedure($button);


        xhrLogin(username, password)
            .done(function(data) {
                setAuthToken(data.data.token);

                authProcedure();

                $('#login-modal').modal('hide');
            })
            .fail(function(resp) {
               var msg = resp.responseJSON.message;
               $errorBox.text(msg);
            })
            .always(function() {
                unlockButtonProcedure($button);
            });
    });

    // ---------------------------------------------------------------------

    $('#signup-container form').submit(function(e) {
        e.preventDefault();
        var $button = $(this).find('input[type="submit"]');
        var $errorBox = $(this).parent().find('.error');

        var username = $(this).find('input[name="user"]').val();
        var password = $(this).find('input[name="pass"]').val();
        var retypedPass = $(this).find('input[name="retype-pass"]').val();

        $errorBox.find('.error').text('');

        if(password !== retypedPass) {
            $(this).parent().find('.error').text('Passwords don\'t match');
            return;
        }

        lockButtonProcedure($button);

        xhrSignup(username, password)
            .done(function(data) {

                xhrLogin(username, password)
                    .done(function(data) {
                        setAuthToken(data.data.token);
                        authProcedure();
                        unlockButtonProcedure($button);
                        $('#login-modal').modal('hide');
                    });

            })
            .fail(function(resp) {
               var msg = resp.responseJSON.message;
               $errorBox.text(msg);
            })
            .always(function() {
                unlockButtonProcedure($button);
            });
    });

    // ---------------------------------------------------------------------

    $('a#logout').click(function(e) {
        e.preventDefault();
        logoutProcedure();
    });

});


//Check if session is set and is valid
if(! hasAuthCookie()) {
    $('#login-modal').modal('show');
} else {
    authProcedure()
        .fail(function() {
            $('#login-modal').modal('show');
        });
}

