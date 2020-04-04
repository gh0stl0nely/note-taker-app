$(document).ready(function () {
    // Initializing  
    let elem = document.querySelector('.sidenav');
    let instance = new M.Sidenav(elem);
    $('.sidenav').sidenav();
    $('input#topic').characterCounter();
    toggleTextarea()

    // Initializing Timer For Auto Saving 
    let finishedTypingAfter = 2000 // 1 seconds
    let timer;
    let saved = true

    //For sidebar styling when clicked (DONE!)
    $(document).on('click', '.note', function () {
        // If selected does not exist
        // console.log(selected)
        if ($(this).hasClass('selected')) {
            return;
        } else if (!isSelectedItemExist()) {
            // First time and if there is no selected, 
            // Then just this current as selected
            deactivateFunctions()
            $('.note').css('background-color', 'white')
            $(this).css('background-color', '#a7ffeb')
            $(this).addClass('selected')

            const id = $(this).attr('id')
            console.log(id)
            const url = `/api/notes/${id}`

            toggleTextarea()

            $.ajax({
                url: url,
                type: 'GET',
            }).then(res => {
                // topic and note

                if (res.message == 'Data not found') {
                    $(this).children()[0].childNodes[0].data = 'New Note'
                    $('#topic').val('')
                    $('#topic').attr('placeholder', 'New Note')
                    $('#user-notes').attr('placeholder', "Enter New Note")
                    $('#user-notes').val('')
                    setTimeout(reactivateFunctions, 1000)
                    return
                }

                setTimeout(function () {
                    $('#topic').val(res.topic)
                    $('#user-notes').val(res.note)
                    $(this).addClass('selected') // Put this as selected
                    $(this).css('background-color', '#a7ffeb');
                    reactivateFunctions()
                }, 1000)
            })
        } else {
            // This case is when you already have selected
            // But now changing it over to a new one 
            clearTimeout(timer)
            deactivateFunctions()
            let currentItem = $(this)
            savePreviousInput(currentItem)
        }
    })

    // Add note button functionality (DONE!)
    $('#add-note').on('click', function () {
        if (!isSelectedItemExist()) {
            // First time and if there is no selected, 
            // Then just this current as selected
            findAndRemoveSelectedTag()
            // Make sure the last item becomes the selected ones! 
            $('.note').css('background-color', 'white') // Set all non-selected item to white background 
            createListItem() // Created the new item and set selected tag to the newly created item
            toggleTextarea()

        } else {
            // This case is when you already have selected
            // But now changing it over to a new one 
            clearTimeout(timer)
            deactivateFunctions()
            // let currentItem = $(this)
            savePreviousInputFromAddButton()
        }
    })

    $('#textarea').on('keyup', function () {
        clearTimeout(timer)
        if (saved) {
            return;
        } else {
            timer = setTimeout(saveInputFromSaveButton, finishedTypingAfter)
        }
    })

    $('#textarea').on('keydown', function () {
        saved = false
        clearTimeout(timer)
    })

    // Save note button to database
    $('#save-note').on('click', function () {
        clearTimeout(timer)
        saveInputFromSaveButton()
    })

    // Delete note button 
    $(document).on('click', '.delete', function (event) {
        event.stopPropagation()
        // Similar idea 
        // if selected does not exist, then just go ahead then delete the one you choose to
        // If selected exist, you would save the selected, and then delete current
        // alert('Selected no exist')
        const currentItem = $(this).parent().parent() // THIS IS THE ONE U CLICKED ON, NOT SELECTED
        // If This is a new item, just delete no need to ajax
        
        if (currentItem.hasClass('new-note')) {
            if (currentItem.hasClass('selected')) {
                currentItem.remove()
                toggleTextarea()
            } else {
                currentItem.remove()
                return;
            }
        } else {
            // Now to case that is not new         
            if(currentItem.hasClass('selected')){
                // If this is selected, delete it in BACKEND and toggle
                deleteElement(currentItem)
            } else {
                // if this is not selected, delete it
                deleteElement(currentItem)
            }
        }


    })

    function saveInputFromSaveButton() {
        saved = true
        deactivateFunctions()
        let topic = $('#topic').val().trim()

        if (topic.length > 22) {
            alert('Topic cannot be over 22 characters')
            setTimeout(function () {
                reactivateFunctions()
            }, 1000)
            return
        } else {
            let userNote = $('#user-notes').val()
            if (topic == '') {
                topic = 'New Note'
            }
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

                //If selected has new-note (cuz its basically it)
                if ($('.selected').hasClass('new-note')) {
                    $('.selected').removeClass('new-note')
                }

                setTimeout(function () {
                    reactivateFunctions()
                }, 1000)

                console.log(res)
            }).catch(e => console.log(e))
        }
    }

    function savePreviousInput(currentItem) {
        // Still previous
        let topic = $('#topic').val().trim()

        if (topic.length > 22) {
            alert('Topic cannot be over 22 characters. Please fix')
            setTimeout(function () {
                reactivateFunctions()
            }, 1000)
            return
        } else {
            let userNote = $('#user-notes').val()
            const selectedID = $('.selected').attr('id')

            if (topic == '') {
                topic = 'New Note'
            }

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
                // Still previous
                console.log($('.selected').children()[0].childNodes[0].data)
                // const selectedText = $('.selected').children()[0].childNodes[0].data;
                if ($('#topic').val() == '') {
                    $('.selected').children()[0].childNodes[0].data = 'New Note'
                } else {
                    $('.selected').children()[0].childNodes[0].data = topic
                }

                if ($('.selected').hasClass('new-note')) {
                    $('.selected').removeClass('new-note')
                }

                //Show toast 
                M.toast({
                    'html': 'Saved successfully',
                    'displayLength': 1000,
                    'classes': 'toastStyle'
                })

                console.log('Successfully saved previous, now onto next')

                // After this is when already finished saving
                // Now the browser will fire the second one

            }).then(() => {
                saved = true
                findAndRemoveSelectedTag()
                $('.note').css('background-color', 'white')
                currentItem.css('background-color', '#a7ffeb')
                currentItem.addClass('selected')
                const id = currentItem.attr('id')
                const url = `/api/notes/${id}`

                toggleTextarea()

                $.ajax({
                    url: url,
                    type: 'GET',
                }).then(res => {
                    // topic and note
                    // $('.selected').children()[0].childNodes[0].data = topic

                    if (res.message == 'Data not found') {
                        // const selectedText = $('.selected').children()[0].childNodes[0].data
                        $('#topic').val('')
                        $('#topic').attr('placeholder', 'New Note')
                        $('#user-notes').attr('placeholder', "Enter New Note")
                        $('#user-notes').val('')
                        setTimeout(reactivateFunctions, 1000)
                        return
                    }

                    setTimeout(function () {
                        $('#topic').val(res.topic)
                        $('#user-notes').val(res.note)
                        // $(this).addClass('selected') // Put this as selected
                        // $(this).css('background-color', '#a7ffeb');
                        reactivateFunctions()
                    }, 1000)

                })
            })
        }

    }

    function savePreviousInputFromAddButton() {
        // Still previous
        let topic = $('#topic').val().trim()

        if (topic.length > 22) {
            alert('Topic cannot be over 22 characters')
            setTimeout(function () {
                reactivateFunctions()
            }, 1000)
            return
        } else {
            let userNote = $('#user-notes').val()
            const selectedID = $('.selected').attr('id')

            if (topic == '') {
                topic = 'New Note'
            }

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
                // Still previous
                // console.log($('.selected').children()[0].childNodes[0].data)
                // const selectedText = $('.selected').children()[0].childNodes[0].data;
                if ($('#topic').val() == '') {
                    $('.selected').children()[0].childNodes[0].data = 'New Note'
                } else {
                    $('.selected').children()[0].childNodes[0].data = topic
                }

                if ($('.selected').hasClass('new-note')) {
                    $('.selected').removeClass('new-note')
                }

            }).then(() => {
                // Reassining selected class to newly created ones
                saved = true
                findAndRemoveSelectedTag()
                // Make sure the last item becomes the selected ones! 
                $('.note').css('background-color', 'white') // Set all non-selected item to white background 
                createListItem() // Created the new item and set selected tag to the newly created item
                toggleTextarea()
                setTimeout(reactivateFunctions, 1000)
            })
        }

    }
});


//Helpers

function toggleTextarea() {
    // If select is not available then hide it :) 
    // var noteList = $('#slide-out').children()
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
    newNote.addClass('note selected new-note') // Maybe selected too
    const randomID = Math.random()
    newNote.attr('id', randomID)
    newNote.css('background-color', '#a7ffeb');
    let a = $('<a></a>')
    let icon = $('<i></i>')
    icon.addClass('material-icons right delete')
    icon.text('delete')
    a.text('New Note')
    $("#topic").attr('placeholder', 'New Note')
    $("#topic").val('')
    $('#user-notes').attr('placeholder', "Enter Note:")
    $('#user-notes').val('')
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

function isSelectedItemExist() {
    const list = $('#slide-out').children()
    for (var i = 3; i < list.length; i++) {
        const item = list[i]
        if (item.classList.contains('selected')) {
            return true
        }
    }
    return false
}

function reactivateFunctions() {
    $('#user-notes').attr('readonly', false)
    $('#topic').attr('readonly', false)
    $('#save-note').attr('disabled', false)
    $('#loader').css('visibility', 'hidden')
    $('.note').css('pointer-events', 'auto')
    $('.note').css('cursor', 'pointer')
    $('.note').css('opacity', '1')
    $('#add-note').css('pointer-events', 'auto')
    $('#add-note').css('cursor', 'pointer')
    $('#add-note').css('opacity', '1')
}

function deactivateFunctions() {
    $('#user-notes').attr('readonly', true)
    $('#topic').attr('readonly', true)
    $('#save-note').attr('disabled', true)
    $('#loader').css('visibility', 'visible')
    $('.note').css('pointer-events', 'none')
    $('.note').css('cursor', 'not-allowed')
    $('.note').css('opacity', '0.5')
    $('#add-note').css('pointer-events', 'none')
    $('#add-note').css('cursor', 'not-allowed')
    $('#add-note').css('opacity', '0.5')
}

function deleteElement(currentItem) {
    const id = currentItem.attr('id')
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
            currentItem.remove() // This could be non-selected or selected 
            toggleTextarea()
        }, 1000)
    }).catch(e => console.log(e))
}