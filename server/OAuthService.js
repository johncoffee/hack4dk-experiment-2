var AuthService = (function () {
    var that = {};

    OAuth.initialize("HQhgCWlkMGf1LCEbLQyJ3197he4");
    
    var _fields = ['username', 'userID'];
    
    _fields.forEach(function(fieldName) {
        Object.defineProperty(that, fieldName, {
            get: function() {
                return sessionStorage.getItem(fieldName);
            },
            set: function(value) {
                if (typeof value !== 'undefined') {
                    sessionStorage.setItem(fieldName, value);
                }
                else {
                    sessionStorage.removeItem(fieldName);
                }
            },
        });
    });
    
    // to Override
    that.onInstaLoginCallback = function () {
        
    };

    // dev stuff
    that.loginFake = function() {
        that.authenticated = true;
        that.username = "julian";
        that.userID = 5;
    };
    
    Object.defineProperty(that, 'authenticated', {
        get: function() {
            return (sessionStorage.getItem('authenticated') == 1);
        },
        set: function(value) {
            if (value) {
                sessionStorage.setItem('authenticated', 1);
            }
            else {
                that.deAuth();
            }
        },
    });
    
    that.deAuth = function() {
        sessionStorage.removeItem('authenticated');
        _fields.forEach(function(item) {
            sessionStorage.removeItem(item);
        });
    };

    that.authAndRedirect = function(provider, route) {
        OAuth.redirect(provider, route);
    };
    
    that.onRedirectCallback = function (callback) {
        OAuth.callback(function(err, res) {
            if (err) {
                console.warn(err);
                //document.getElementById('nice').innerHTML = err;
            }
            else {  
                callback(res);
            }
            //console.debug(res);
        });
    };

    that.openInstagramPopup = function() {
        OAuth.popup('instagram')
        .done(function(result) {
            console.log(result)
            // do some stuff with result
            that.onInstaLoginCallback(result);
        }).fail(function (err) {
            console.warn(err);
            //document.getElementById("nice").innerHTML = err;
        });
    };
    
    //console.log(OAuth);
    that.openAuthPopup2 = function() {
        OAuth.popup('facebook')
        //OAuth.redirect('facebook', {}, 
            .done(function(result) {

                result.get('/me')
                    .done(function (me) {
                        console.info(me);
                    })
                    .fail(function (err) {
                        console.warn(err);
                        document.getElementById("nice").innerHTML = err;
                    });
            })
            .fail(function (err) {
                console.warn(err);
                document.getElementById("nice").innerHTML = err;
            });  
    };
    
    try {
        if (sessionStorage.wasLoggedIn != null) {
            //that.openAuthPopup();
        }   
    }
    catch (e) {
        console.warn(e);
    }

    return that;
})();
