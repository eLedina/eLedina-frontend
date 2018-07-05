// UTILITIES

const StatusTypes = {
    OK: "ok",
    INVALID_ARGUMENT: "invalid_argument",
    WRONG_LOGIN_INFO: "wrong_login_info",

    USER_ALREADY_EXISTS: "user_already_exists",
    EMAIL_ALREADY_REGISTERED: "email_registered"
};


// AJAX helper

function ledinaAjax(type, url, data, callback, kwargs) {
    if (typeof type === "undefined") {
        type = "POST"
    }
    if (typeof url === "undefined") {
        throw "Missing url"
    }

    var ajaxOptions = {
        type: type,
        url: url,
        contentType: "application/json",
        async: "false",
        data: JSON.stringify(data),
        // disable json parsing
        dataType: "text",

        // attach callback function
        complete: callback
    };

    // this applies additional options
    if (typeof kwargs !== "undefined") {
        ajaxOptions = Object.assign({}, ajaxOptions, kwargs)
    }

    $.ajax(ajaxOptions)
}