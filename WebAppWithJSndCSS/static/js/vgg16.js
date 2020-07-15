$(document).ready(function () {
    // Init
    $('.image-section-VGG16').hide();
    $('.loaderVGG16').hide();
    $('#resultVGG16').hide();

    // Upload Preview
    function readURLVGG16(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreviewVGG16').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreviewVGG16').hide();
                $('#imagePreviewVGG16').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUploadVGG16").change(function () {
        $('.image-section-VGG16').show();
        $('#btn-predict-VGG16').show();
        $('#resultVGG16').text('');
        $('#resultVGG16').hide();
        readURLVGG16(this);
    });

    // Predict
    $('#btn-predict-VGG16').click(function () {
        var form_data = new FormData($('#upload-file-VGG16')[0]);

        // Show loading animation
        $(this).hide();
        $('.loaderVGG16').show();

        // Make prediction by calling api /predictVGG16
        $.ajax({
            type: 'POST',
            url: '/predictVGG16',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            dataType: 'json',
            success: function (data) {
                console.log(typeof data);
                // Get and display the result
                $('.loaderVG166').hide();
                var array = Object.values(data);
                for (var i = 0; i < array.length; i++){
                    $('#plotVGG16').prepend('<img src="' + array[i] + '" height="300" width="300">');
                }
                $('#plotVG166').show();
                $('#satisfiedVGG16').show();
                $('#VGG16-satisfied-yes').show();
                $('#VGG16-satisfied-no').show();
                $('#VGG16-satisfied-reset').show();
                $('#satisfactionResultsVGG16').show();
                console.log('VG166 Success!!');
            },
        });
    });

    // ask user if he's satisfied with the provided explanation
    $('#VGG16-satisfied-yes').click(function() {
        var countYes;
        var countNo;
        if (window.localStorage.getItem('clickCountYesVGG16')){
            countYes = window.localStorage.getItem('clickCountYesVGG16');
        } else {
            countYes = 0;
        }
        if (window.localStorage.getItem('clickCountNoVGG16')){
            countNo = window.localStorage.getItem('clickCountNoVGG16');
        } else {
            countNo = 0;
        }
        countYes++;
        window.localStorage.setItem('clickCountYesVGG16',countYes);
        console.log("Count Yesses VGG16: " + countYes);
        $('#satisfactionResultsVGG16').append("VGG16 Helpful= " + countYes + " | Unhelpful= " + countNo + "<br>");
    });

    $('#VGG16-satisfied-no').click(function() {
        var countYes;
        var countNo;
        if (window.localStorage.getItem('clickCountYesVGG16')){
            countYes = window.localStorage.getItem('clickCountYesVGG16');
        } else {
            countYes = 0;
        }
        if (window.localStorage.getItem('clickCountNoVGG16')){
            countNo = window.localStorage.getItem('clickCountNoVGG16');
        } else {
            countNo = 0;
        }
        countNo++;
        window.localStorage.setItem('clickCountNoVGG16',countNo);
        console.log("Count Yesses VGG16: " + countYes);
        $('#satisfactionResultsVGG16').append("VGG16 Helpful= " + countYes + " | Unhelpful= " + countNo + "<br>");
    });

    // reset counter variables
    $('#VGG16-satisfied-reset').click(function () {
        localStorage.clear();
        $('#satisfactionResultsVGG16').empty();
    });
});
