// UTILITIES

const StatusTypes = {
    OK: "ok",
    INVALID_ARGUMENT: "invalid_argument",
    WRONG_LOGIN_INFO: "wrong_login_info",

    USER_ALREADY_EXISTS: "user_already_exists",
    EMAIL_ALREADY_REGISTERED: "email_registered"
};

const MIN_USERNAME_LEN = 6
    , MAX_USERNAME_LEN = 20
    , MAX_NAME_LEN = MAX_SURNAME_LEN = 30
    , MIN_NAME_LEN = MIN_SURNAME_LEN = 2
    , MAX_PASSWORD_LEN = 254
    , MIN_PASSWORD_LEN = 8
    , MIN_EMAIL_LEN = 3
    , MAX_EMAIL_LEN = 254;

// Check if 'email' is a valid e-mail
const email_test = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function validateEmail(email) {
    return email_test.test(email);
}


// AJAX helper

function ledinaAjax(type, url, data, callback, kwargs) {
    if (typeof type === "undefined") {
        type = "POST"
    }
    if (typeof url === "undefined") {
        throw "Missing url"
    }

    // Automatically set Authorization header if logged in
    var token = getUserToken();
    var ajaxHeaders;
    if (typeof token !== "undefined") {
        ajaxHeaders = { "Authorization": getUserToken() };
    }
    else { ajaxHeaders = {} }

    var ajaxOptions = {
        type: type,
        url: url,
        contentType: "application/json",
        async: "false",
        data: JSON.stringify(data),
        headers: ajaxHeaders,
        // disable json parsing
        dataType: "text",

        // attach callback function
        complete: callback
    };

    // this applies additional options
    if (typeof kwargs !== "undefined") {
        ajaxOptions = Object.assign({}, ajaxOptions, kwargs)
    }

    // Show debug data
    console.debug("[ajax] Sending ajax request: type="+type+", url="+url+", token="+(token ? "yes" : "no"));

    $.ajax(ajaxOptions)
}