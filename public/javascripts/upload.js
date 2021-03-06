var serverListFiles=null;
$( document ).ready(function() {
    console.log( "ready!" );
    $.ajax({
        url: '/list',
        type: 'GET',
        data: false,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
            serverListFiles=JSON.parse(data).list;
        },
        xhr: function() {
            // create an XMLHttpRequest
            var xhr = new XMLHttpRequest();

            // listen to the 'progress' event
            xhr.upload.addEventListener('progress', function(evt) {

                if (evt.lengthComputable) {
                    // calculate the percentage of upload completed
                    var percentComplete = evt.loaded / evt.total;
                    percentComplete = parseInt(percentComplete * 100);

                    // update the Bootstrap progress bar with the new percentage
                    console.log('percentComplete: ',percentComplete);

                }

            }, false);

            return xhr;
        }
    });
});
$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    console.log('archivos que se cargaran');
    var filesToUpload=0;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (serverListFiles.indexOf(file.name)==-1){
          console.log(file.name);
          filesToUpload++;
          // add the files to formData object for the data payload
          formData.append('uploads[]', file, file.name);
      }
    }
    if (filesToUpload>0){
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data){
                console.log('upload successful!\n' + data);
            },
            xhr: function() {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();

                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function(evt) {

                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('.progress-bar').text(percentComplete + '%');
                        $('.progress-bar').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('.progress-bar').html('Done');
                        }

                    }

                }, false);

                return xhr;
            }
        });
    }else{
        console.log("No hay archivos nuevos para copiar");
    }


  }
});
