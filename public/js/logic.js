$(document).ready(function () {
    // Initializing sidenav 
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem);
    $('.sidenav').sidenav();
    $('input#topic').characterCounter();
    toggleTextarea()

    //For sidebar styling when clicked (DONE!)
    $(document).on('click', '.note', function () {
        if ($(this).hasClass('selected')) {
            return;
        }

        deactivateFunctions()
        findAndRemoveSelectedTag()
        $('.note').css('background-color', 'white')
        $(this).css('background-color','#a7ffeb')
        $(this).addClass('selected')
        const topic = $(this).children()[0].childNodes[0].data // 
        const id = $(this).attr('id')
        const url = `/api/notes/${id}`
        // Maybe do an ajax call, find it from database, meaning will there would be waiting icon
        toggleTextarea()

        $.ajax({
            url: url,
            type: 'GET',
        }).then(res => {
            // topic and note
            console.log(res)
            if(res.message == 'Data not found'){
                const selectedText = $('.selected').children()[0].childNodes[0].data
                $('#topic').val(selectedText)
                $('#user-notes').attr('placeholder', "WARNING: Please press 'Save Note' before chosing another item")
                $('#user-notes').val('')
                reactivateFunctions()
                return
            }
            setTimeout(function(){
                $('#topic').val(res.topic)
                $('#user-notes').val(res.note)
                $(this).addClass('selected') // Put this as selected
                $(this).css('background-color', '#a7ffeb');
                reactivateFunctions()
            }, 500)
        })
    })

    // Add note button functionality (DONE!)
    $('#add-note').on('click', function () {
        findAndRemoveSelectedTag()
        // Make sure the last item becomes the selected ones! 
        $('.note').css('background-color', 'white') // Set all non-selected item to white background 
        createListItem() // Created the new item and set selected tag to the newly created item
        toggleTextarea()
    })

    // Save note button to database
    $('#save-note').on('click', function () {
        deactivateFunctions()
        const topic = $('#topic').val().trim()

        if (topic.length > 22) {
            alert('Topic cannot be over 22 characters')
            setTimeout(function () {
                $('#save-note').attr('disabled', false)
            }, 1000)
            return
        } else {
            const userNote = $('#user-notes').val()
            const selectedID = $('.selected').attr('id')

            const data = {
                topic,
                userNote,
                selectedID
            }

            $.ajax({
                url: '/api/notes',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data)
            }).then(res => {
                $('.selected').children()[0].childNodes[0].data = topic

                //Show toast 
                M.toast({
                    'html': 'Saved successfully',
                    'displayLength': 1000,
                    'classes': 'toastStyle'
                })

                setTimeout(function () {
                    reactivateFunctions()
                }, 1000)

                console.log(res)
            }).catch(e => console.log(e))
        }
    })

    // Delete note button 
    $(document).on('click', '.delete', function (event) {
        event.stopPropagation()
        const id = $(this).parent().parent().attr('id')
        const url = `/api/notes/${id}`
        deactivateFunctions()

        $.ajax({
            url: url,
            type: 'DELETE',
        }).then(res => {
            //Show toast 
            M.toast({
                'html': 'Deleted successfully',
                'displayLength': 1000,
                'classes': 'toastStyle'
            })

            setTimeout(function () {
                reactivateFunctions()
            }, 1000)

            $(this).parent().parent().remove() // This could be non-selected or selected 
            toggleTextarea()

            console.log(res)
        }).catch(e => console.log(e))

    })

});

function toggleTextarea() {
    // If select is not available then hide it :) 
    var noteList = $('#slide-out').children()
    const selectedItem = $('.selected').text()
    // console.log(noteList.length)
    if (selectedItem == '') {
        $('#textarea').css('display', 'none')
    } else {
        $('#textarea').css('display', 'block')
    }
}

function createListItem() {
    let newNote = $('<li></li>');
    newNote.addClass('note selected') // Maybe selected too
    const randomID = Math.random()
    newNote.attr('id', randomID)
    newNote.css('background-color', '#a7ffeb');
    let a = $('<a></a>')
    let icon = $('<i></i>')
    icon.addClass('material-icons right delete')
    icon.text('delete')
    a.text('New Note')
    $("#topic").val('New Note')
    $('#user-notes').attr('placeholder', "WARNING: Please press 'Save Note' before chosing another item")
    a.append(icon)
    newNote.append(a)
    $('#slide-out').append(newNote)
}

function findAndRemoveSelectedTag() {
    const list = $('#slide-out').children()
    for (var i = 3; i < list.length; i++) {
        const item = list[i]
        if (item.classList.contains('selected')) {
            item.classList.remove('selected')
            return;
        }
    }
}

function reactivateFunctions() {
    $('#save-note').attr('disabled', false)
    $('#loader').css('visibility', 'hidden')
    // $('.delete').css('pointer-events', 'auto')
    // $('.delete').css('cursor', 'pointer')
    // $('.delete').css('opacity', '1')
    $('.note').css('pointer-events', 'auto')
    $('.note').css('cursor', 'pointer')
    $('.note').css('opacity', '1')
}

function deactivateFunctions() {
    $('#save-note').attr('disabled', true)
    $('#loader').css('visibility', 'visible')
    // $('.delete').css('pointer-events', 'none')
    // $('.delete').css('cursor', 'not-allowed')
    // $('.delete').css('opacity', '0.5')
    $('.note').css('pointer-events', 'none')
    $('.note').css('cursor', 'not-allowed')
    $('.note').css('opacity', '0.5')
}