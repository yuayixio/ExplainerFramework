$(document).ready(function () {
    // Init
    $('.image-section-ResNet50').hide();
    $('.loaderResNet50').hide();
    $('#resultResNet50').hide();
    $('#plotResNet50').hide();

    // Upload Preview
    function readURLResNet50(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreviewResNet50').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreviewResNet50').hide();
                $('#imagePreviewResNet50').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUploadResNet50").change(function () {
        $('.image-section-ResNet50').show();
        $('#btn-predict-ResNet50').show();
        $('#resultResNet50').text('');
        $('#resultResNet50').hide();
        readURLResNet50(this);
    });

    // Predict
    $('#btn-predict-ResNet50').click(function () {
        var form_data = new FormData($('#upload-file-ResNet50')[0]);

        // Show loading animation
        $(this).hide();
        $('.loaderResNet50').show();

        // Make prediction by calling api /predictResNet50
        $.ajax({
            type: 'POST',
            url: '/predictResNet50',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            dataType: 'json',
            success: function (data) {
                console.log(typeof data);
                // Get and display the result
                $('.loaderResNet50').hide();
                $('#plotResNet50').show();
                var array = Object.values(data);
                console.log(array);
                for (var i = 0; i < array.length; i++){
                    $('#plotResNet50').prepend('<img src="' + array[i] + '" height="300" width="300">');
                }
                $('#satisfiedResNet50').show();
                $('#rn50-satisfied-yes').show();
                $('#rn50-satisfied-no').show();
                $('#rn50-satisfied-reset').show();
                $('#satisfactionResultsrn50').show();
                console.log('ResNet50 Success!!');
            },
        });
     });

    // ask user if he's satisfied with the provided explanation
    $('#rn50-satisfied-yes').click(function() {
        var countYes;
        var countNo;
        if (window.localStorage.getItem('clickCountYesRN50')){
            countYes = window.localStorage.getItem('clickCountYesRN50');
        } else {
            countYes = 0;
        }
        if (window.localStorage.getItem('clickCountNoRN50')){
            countNo = window.localStorage.getItem('clickCountNoRN50');
        } else {
            countNo = 0;
        }
        countYes++;
        window.localStorage.setItem('clickCountYesRN50',countYes);
        $('#satisfactionResultsrn50').append("Helpful= " + countYes + " | Unhelpful= " + countNo + "<br>");
    });

    $('#rn50-satisfied-no').click(function() {
        var countYes;
        var countNo;
        if (window.localStorage.getItem('clickCountYes')){
            countYes = window.localStorage.getItem('clickCountYes');
        } else {
            countYes = 0;
        }
        if (window.localStorage.getItem('clickCountNoRN50')){
            countNo = window.localStorage.getItem('clickCountNoRN50');
        } else {
            countNo = 0;
        }
        countNo++;
        window.localStorage.setItem('clickCountNoRN50',countNo);
        $('#satisfactionResultsrn50').append("Helpful= " + countYes + " | Unhelpful= " + countNo + "<br>");
    });

    // reset counter variables
    $('#rn50-satisfied-reset').click(function () {
        localStorage.clear();
        $('#satisfactionResultsrn50').empty();
    });
});
