var consumer = {};

consumer.signForm =
function signForm(form, etc) {
    form.action = etc.URL.value;
    var accessor = { consumerSecret: etc.consumerSecret.value
                   , tokenSecret   : etc.tokenSecret.value};
    var message = { action: form.action
                  , method: form.method
                  , parameters: []
                  };
    for (var e = 0; e < form.elements.length; ++e) {
        var input = form.elements[e];
        if (input.name != null && input.name != "" && input.value != null
            && (!(input.type == "checkbox" || input.type == "radio") || input.checked))
        {
            message.parameters.push([input.name, input.value]);
        }
    }
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    //alert(outline("message", message));
    var parameterMap = OAuth.getParameterMap(message.parameters);
    for (var p in parameterMap) {
        if (p.substring(0, 6) == "oauth_"
         && form[p] != null && form[p].name != null && form[p].name != "")
        {
            form[p].value = parameterMap[p];
        }
    }
    return true;
};
