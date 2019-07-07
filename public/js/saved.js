var removeFromSaved = $(".removeFromSaved");
var seeNotes = $(".seeNotes");

removeFromSaved.on("click", function(event) {
    console.log("remove")
})


seeNotes.on("click", function (event) {
    var title = $(this).prev().prev().prev().text().trim();
    var id = $(this).parent().parent().parent().parent().data("id");

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
                notesString += "<li>" + notes[i] + "</li>";
            }
        }

        // show modal window
        Swal.fire({
            title: 'Notes',
            html:
                'Story: ' + title +
                '<br><br>' +
                '<ul>' +
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
            // showLoaderOnConfirm: true,
            // preConfirm: (login) => {
            //     return fetch(`//api.github.com/users/${login}`)
            //         .then(response => {
            //             if (!response.ok) {
            //                 throw new Error(response.statusText)
            //             }
            //             return response.json()
            //         })
            //         .catch(error => {
            //             Swal.showValidationMessage(
            //                 `Request failed: ${error}`
            //             )
            //         })
            // },
            // allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            console.log(result);
            if (result.dismiss === "backdrop" || result.dismiss === "close" || result.value === "") {
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