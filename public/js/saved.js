var removeFromSaved = $(".removeFromSaved");
var seeNotes = $(".seeNotes");
var deleteNote = $(".delete");

// remove from saved stories
removeFromSaved.on("click", function(event) {
    console.log("remove")
    event.preventDefault();

    var summary = $(this).prev().text();
    console.log(summary);

    // send summary for the story to be updated
    $.post("/api/unsave", { summary: summary }, function (data) {
        console.log(data);
        // refesh page
        window.location.reload();
    })
})

// view notes
seeNotes.on("click", function (event) {
    var title = $(this).prev().prev().prev().text().trim();
    var id = $(this).parent().parent().parent().parent().data("story-id");
    // var storyId = $(this).parent().parent().parent().parent().data("story-id");

    // get notes for this story
    $.get("/api/notes/" + id, function (data) {
        console.log("get req for notes");
        console.log(data);
        var notes = data;
        if (notes === null) {
            notes = "No notes for this story yet."
        } else {
            // display them as <li>s
            var notesString = "";
            for (var i = 0; i < notes.length; i++) {
                notesString += "<li>" + notes[i] + '<i class="fas fa-times text-danger delete" data-note-id="' + i + '"></i>' + "</li>";
            }
        }

        // show modal window
        Swal.fire({
            title: 'Notes',
            html:
                'Story: ' + title +
                '<br><br>' +
                '<ul data-story-id="' + id + '">' +
                notesString +
                '</ul>',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
                placeholder: "Enter Note Here"
            },
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save Note',
        }).then((result) => {
            console.log(result);
            if (result.dismiss === "backdrop" || result.dismiss === "close" || result.dismiss === "cancel" || result.value === "") {
                console.log("empty");
            } else {
                $.post("/api/savenote/" + id, { newNote: result.value }, function (data) {
                    console.log(data);
                    // refesh page
                    // window.location.reload();
                })
            }
        })
    })


    
})


// delete note
$(document.body).on("click", ".delete", function(event) {
    var noteContent = $(this).parent().text();
    var storyId = $(this).parent().parent().data("story-id");
    var noteId = $(this).data("note-id");
    var $clickedLi = $(this).parent();
    console.log(noteId);
    console.log(storyId);
    // post request to update note in db
    $.post("/api/notes", { storyId: storyId, noteId: noteId, noteContent: noteContent }, function (data) {
        console.log(data);
        // delete the li of the now deleted note
        $clickedLi.remove();
    })
})