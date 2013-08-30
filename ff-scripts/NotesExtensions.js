// Imports
var ff = require('ffef/FatFractal');

exports.cleanup = function() {
    var count = 0;
    count += ff.deleteAllForQuery("/Notes", "system");
    count += ff.deleteAllForQuery("/Mazes", "system");
    count += ff.deleteAllForQuery("/RefMazes", "system");
    count += ff.deleteAllForQuery("/Locations", "system");
    var r = ff.response();
    r.result = "<h1> Thanks for visiting</h1><p>We have deleted  " + count + " objects from the tests.</p>";
    r.responseCode="200";
    r.statusMessage = "cleanup has deleted " + count + " objects from your backend.";
    r.mimeType = "text/html";
}
exports.storeArrayOfNotes = function() {
    var notes = JSON.parse(ff.getExtensionRequestData().httpContent.data);
    print("storeArrayOfNotes received: " + JSON.stringify(notes));
    var r = ff.response();
    r.mimeType = "application/json";
    if (notes == null || notes.length <=0) {
        r.result = null;
        r.responseCode = "400";
        r.statusMessage = "No Note objects supplied";
        return;
    }
    var createdNotes = [];
    for (var i = 0; i < notes.length; i++) {
        print("storeArrayOfNotes found user: " + ff.getExtensionRequestData().ffUser);
        var note = ff.createObjAtUri(notes[i], "/Notes", ff.getExtensionRequestData().ffUser);
        createdNotes.push(note);
    }
    r.result = createdNotes;
    r.responseCode="200";
    r.statusMessage = "storeArrayOfNotes has created " + createdNotes.length + " objects to your backend.";
}

exports.storeRefMaze = function() {
    var maze = ff.getExtensionRequestData().httpContent;
    print("storeRefMaze received: " + JSON.stringify(maze));
    var r = ff.response();
    r.mimeType = "application/json";
    if (maze == null) {
        r.result = null;
        r.responseCode = "400";
        r.statusMessage = "No Maze object supplied";
        return;
    }
    function RefMaze(obj) {
        this.clazz = "RefMaze";
        this.mazeName = null;
        this.locations = null;
        if(obj) {
            this.subject = obj.mazeName;
            this.locations = obj.locations;
        }
        return this;
    }
    function Location(obj) {
        this.clazz = "Location";
        this.gridX = null;
        this.gridY = null;
        this.gridLabel = null;
        if(obj) {
            this.gridX = obj.gridX;
            this.gridY = obj.gridY;
            this.gridLabel = obj.gridLabel;
        }
        return this;
    }
    var m = new RefMaze();
    m.mazeName = maze.mazeName;
    m = ff.createObjAtUri(m, "/RefMazes", ff.getExtensionRequestData().ffUser);
    print("storeRefMaze m.ffUrl is " + m.ffUrl);
    var locations = [];
    print("storeRefMaze will store " + maze.locations.length + " locations");
    for (var i = 0; i < maze.locations.length; i++) {
    	var loc = new Location(maze.locations[i]);
        var l = ff.createObjAtUri(loc, "/Locations", ff.getExtensionRequestData().ffUser);
        print("storeRefMaze l.ffUrl is " + l.ffUrl);
        ff.grabBagAdd(l.ffUrl, m.ffUrl, "locations");
    }
    m = ff.getObjFromUri(m.ffUrl);
    r.result = m;
    r.responseCode="200";
    r.statusMessage = "storeRefMaze has created " + m + " to your backend.";
}


