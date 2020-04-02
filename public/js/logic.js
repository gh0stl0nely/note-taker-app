$(document).ready(function () {
    // Initializing sidenav 
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem);
    $('.sidenav').sidenav();
    $('input#topic').characterCounter();

    toggleTextarea()

    //For sidebar styling when clicked (DONE!)
    $(document).on('click', '.note', function () {
        // Delete all selected tag
        findAndRemoveSelectedTag()
        $('.note').css('background-color', 'white')
        const topic = $(this).children()[0].childNodes[0].data // 
        $('#topic').val(topic)
        $(this).addClass('selected') // Put this as selected
        $(this).css('background-color', '#a7ffeb');
        toggleTextarea()
    })

    // Add note button functionality (DONE!)
    $('#add-note').on('click', function () {
        findAndRemoveSelectedTag()
        // Make sure the last item becomes the selected ones! 
        $('.note').css('background-color', 'white') // Set all things 
        createListItem() // Created the new item and set it to the new one! 
        toggleTextarea()
    })

    // Save note button to database
    $('#save-note').on('click', function(){
        // Do some validation first (topic limit)
    
        // Send ajax data to delete in database

        // THEN(), set the selected to the received response from database
    })

    // Delete note button 
    $(document).on('click', '.delete', function (event) {   
        event.stopPropagation()

        // Send ajax data to delete in database

        // THEN()        
        $(this).parent().parent().remove() // This could be non-selected or selected 
        toggleTextarea()
    })

});

function toggleTextarea(){
    // If select is not available then hide it :) 
    var noteList = $('#slide-out').children()
    const selectedItem = $('.selected').text()
    // console.log(noteList.length)
    if(selectedItem == ''){
        $('#textarea').css('display', 'none')
    } else {
        $('#textarea').css('display', 'block')
    }
}

function createListItem(){
    let newNote = $('<li></li>');
    newNote.addClass('note selected') // Maybe selected too
    const randomID = Math.random()
    newNote.attr('id', randomID)
    newNote.css('background-color', '#a7ffeb');
    let a = $('<a></a>')
    let icon = $('<i></i>')
    icon.addClass('material-icons right delete')
    icon.text('delete')
    a.text(randomID)
    $("#topic").val(randomID)
    a.append(icon)
    newNote.append(a)
    $('#slide-out').append(newNote)
}

function findAndRemoveSelectedTag(){
    const list = $('#slide-out').children()
    for(var i = 3; i <list.length;i++){
        const item = list[i]
        if(item.classList.contains('selected')){
            item.classList.remove('selected')
            return;
        }
    }
}
