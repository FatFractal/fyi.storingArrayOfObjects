// Imports
var ff = require('ffef/FatFractal');

exports.cleanup = function() {
    var notes = ff.getArrayFromUri("/Notes");
    if (notes == null) return;
    for (var i = 0; i < notes.length; i++) {
        ff.deleteObj(notes[i]);
    }
    var r = ff.response();
    r.result = "<h1> Thanks for visiting</h1><p>We have deleted  " + notes.length + " objects from the tests.</p>";
    r.responseCode="200";
    r.statusMessage = "cleanup has deleted " + notes.length + " objects from your backend.";
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


