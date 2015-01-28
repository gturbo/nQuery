var nQ = (modules && modules.exports) ? modules.exports : window.nQ;
if (!nQ) nQ = window.nQ = {};

var Column = nQ.Column =  BackBone.Model.extend({
    defaults:{

    }
})

var Columns = nQ.Columns = BackBone.Collection.extend({
    defaults:{

    }
    ,model: Column
})

var Table = nQ.Columns = BackBone.Model.extend({
    defaults:{

    }
    ,parse: function(resp, options) {
        if (resp.columns) {
            resp.columns = new Columns(resp.columns)
        }
    }
})

var Tables = models.Tables = BackBone.Collection.extend({
    defaults:{

    }
    ,model: Table
})


var DatabaseExtend = nQ.DatabaseExtend = {
    defaults: {
        retrieved: false
        ,connectionOpt: {
            host     : 'localhost',
            port     : 50000,
            user     : 'monetdb',
            password : 'monetdb'
        }
    }
}
