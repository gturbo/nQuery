nQ.DatabaseRouter = nQ.SubRouter.extend({
    routes: {
        "/:id": "getDatabase",
        "*hash": "test"
    },
    getDatabase: function(id) {
        $('#footer').html('<b>Get database number ' + id + '</b>');
    },
    test: function(hash) {
        $('#footer').html('<b>undefined route ' + hash + '</b>');
    }
})