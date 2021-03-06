var BackendFacade = (function () {
    var facade = Object.create(null);
    
    var activeCollections = Object.create(null);
    
    facade.pageInfo = function (collectionID) {
        var res = {current: "", total: ""};
        var collection = activeCollections[collectionID];
        if (collection) {
            res.total = collection.collection.length;
            res.current = collection.index;
        }
        return res;
    };
    
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
    
    facade.getPrev = function (collectionID, callback) {
        var collection = activeCollections[collectionID];
        if (!collection) {
            getCollection(collectionID, function (collection) {
                callback(collection.getPrev());
            });
        }
        else {
            callback(collection.getPrev());
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
                AuthService.onInstaLoginCallback = function (instagramObj, url, pagesToLoad) {
                    var req = instagramObj.get(url || "https://api.instagram.com/v1/users/self/feed");
                    req.done(function () {
                        var json = req.responseJSON;
                        var pagination = json.pagination;
                        //document.querySelector("#instagram-load-more").onclick = function() {
                        console.log(pagination, pagesToLoad)
                        if (!pagesToLoad) {
                            pagesToLoad = 1;
                        }
                        if (pagination && pagesToLoad++ < 4) { // 3 pages of comments!
                            console.info("next page: " + pagination.next_url);
                            AuthService.onInstaLoginCallback(instagramObj, pagination.next_url, pagesToLoad);
                        }
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
        if (this.index >= this.collection.length) {
            this.index = 0; 
        }
        return item;
    };
    FunCollection.prototype.getPrev = function() {
        var item = this.collection[this.index--];
        if (this.index < 0) {
            this.index = this.collection.length-1;
        }
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
