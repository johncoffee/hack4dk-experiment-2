var BackendFacade = (function () {
    var facade = Object.create(null);
    
    var activeCollections = Object.create(null);
    
    facade.getNext = function (collectionID, callback) {
        var collection = activeCollections[collectionID];
        if (!collection) {
            getCollection(collectionID, function (collection) {
                callback(collection.getNext());
            });
        }
        else {
            callback(collection.getNext());
        }
    };
    
    /**
     *  get collection instance by map key
     * @param  {string} key
     * @param  {Function} callback
     * @returns {FunCollection}
     */
    function getCollection(key, callback) {
        var newCollection = new FunCollection(key);
        newCollection.initCollection(callback);
        activeCollections[key] = newCollection;
        return newCollection;
    }

    /**
     * FunCollection
     * @param type
     * @constructor
     */
    function FunCollection (type) {
        var collection = [];
        var type = type;
        this.onChange = function () {
            
        };
        this.index = 0;

        Object.defineProperties(this, {
            type: {
                get: function() {
                    return type;
                },
            },
            collection: {
                set: function(newItems) {
                    collection.length = 0;
                    for (var i in newItems) {
                        collection.push(newItems[i]);
                    }
                    if (collection.length > 0) {
                        this.notifyOnChange();
                    }
                },
                get: function() {
                    return collection;
                }
            },
        });
    }
    FunCollection.prototype.notifyOnChange = function() {
        this.onChange(this);
    };
    
    FunCollection.prototype.addItems = function(newItems) {
        this.collection = this.collection.concat(newItems);
    };
    
    FunCollection.prototype.initCollection  = function(callback) {
        var collection = this;
        switch (this.type) {
            case "white":
                AuthService.onInstaLoginCallback = function (instagramObj) {
                    var req = instagramObj.get("https://api.instagram.com/v1/users/self/feed");
                    req.done(function () {
                        var json = req.responseJSON;
                        // pagination
                        //document.querySelector("#load-more").onclick = function() {
                        //    var pagination = json.pagination;
                        //    if (pagination) {
                        //        console.info("next page: " + pagination.next_url);
                        //        fetchTags(instagramObj, pagination.next_url);
                        //    }
                        //};
                        // data
                        console.debug(json);
                        var posts = [];
                        json.data.forEach(function (item) {
                            var comments = item.comments.data.map(function (comment) {
                                return {
                                    name: comment.from.full_name,
                                    text: comment.text,
                                };
                            });
                            if (comments.length) {
                                posts.push({
                                    comments: comments,
                                });    
                            }
                        });
                        
                        var funItems = posts.map(function (post) {
                            return new FunItem(collection.type, post);
                        });
                        console.log(funItems);
                        collection.collection = funItems;
                        callback(collection);
                    });
                };
                AuthService.openInstagramPopup();
                break;
            case "oldPeople":
                var oldPeople = new OldPeople();
                oldPeople.getData(function (data) {
                    collection.collection = data.map(function (item) {
                        return new FunItem(collection.type, item);
                    });
                    callback(collection);    
                });
                break;
        }
    };

    /**
     * get next item in collection, the item will trigger onData
     * @returns {FunCollection}
     */
    FunCollection.prototype.getNext = function() {
        var item = this.collection[this.index++];
        this.index = (this.index >= this.collection.length) ? 0 : this.index;
        return item;
    };

    /**
     * entity
     * @param type
     * @constructor
     */
    function FunItem (type, body) {
        this.body = body || null;
        this.loaded = false;
        this.type = type;
        this.onDataCallback = null;
    }
    FunItem.prototype.onData = function (callback) {
        this.onDataCallback = callback;
        if (this.loaded) {
            this.notifyOnData();
        }
    };
    FunItem.prototype.notifyOnData = function () {
        this.onDataCallback(this);
    };
    
    return facade;
})();
