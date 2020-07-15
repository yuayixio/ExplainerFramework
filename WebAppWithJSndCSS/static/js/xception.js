$(document).ready(function () {
    // Init
    $('.image-section-Xception').hide();
    $('.loaderXception').hide();
    $('#resultXception').hide();

    // Upload Preview
    function readURLXception(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreviewXception').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreviewXception').hide();
                $('#imagePreviewXception').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUploadXception").change(function () {
        $('.image-section-Xception').show();
        $('#btn-predict-Xception').show();
        $('#resultXception').text('');
        $('#resultXception').hide();
        readURLXception(this);
    });

    // Predict
    $('#btn-predict-Xception').click(function () {
        var form_data = new FormData($('#upload-file-Xception')[0]);

        // Show loading animation
        $(this).hide();
        $('.loaderXception').show();

        // Make prediction by calling api /predictXception
        $.ajax({
            type: 'POST',
            url: '/predictXception',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            dataType: 'json',
            success: function (data) {
                $('.loaderXception').hide();
                $('#plotXception').show();
                var array = Object.values(data);
                console.log(array);
                for (var i = 0; i < array.length; i++){
                    $('#plotXception').prepend('<img src="' + array[i] + '" height="300" width="300">');
                }
                $('satisfiedXception').show();
                $('#Xception-satisfied-yes').show();
                $('#Xception-satisfied-no').show();
                $('#Xception-satisfied-reset').show();
                $('satisfactionResultsXception').show();
                console.log('Xception Success!!');
            },
        });
    });

    // ask user if he's satisfied with the provided explanation
    $('#Xception-satisfied-yes').click(function() {
        var countYes;
        var countNo;
        if (window.localStorage.getItem('clickCountYesXception')){
            countYes = window.localStorage.getItem('clickCountYesXception');
        } else {
            countYes = 0;
        }
        if (window.localStorage.getItem('clickCountNoXception')){
            countNo = window.localStorage.getItem('clickCountNoXception');
        } else {
            countNo = 0;
        }
        countYes++;
        window.localStorage.setItem('clickCountYesXception',countYes);
        console.log("Count Yesses Xception: " + countYes);
        $('#satisfactionResultsXception').append("Helpful= " + countYes + " | Unhelpful= " + countNo + "<br>");
    });

    $('#Xception-satisfied-no').click(function() {
        var countYes;
        var countNo;
        if (window.localStorage.getItem('clickCountYesXception')){
            countYes = window.localStorage.getItem('clickCountYesXception');
        } else {
            countYes = 0;
        }
        if (window.localStorage.getItem('clickCountNoXception')){
            countNo = window.localStorage.getItem('clickCountNoXception');
        } else {
            countNo = 0;
        }
        countNo++;
        window.localStorage.setItem('clickCountNoXception',countNo);
        console.log("Count Yesses Xception: " + countYes);
        $('#satisfactionResultsXception').append("Helpful= " + countYes + " | Unhelpful= " + countNo + "<br>");
    });

    // reset counter variables
    $('#Xception-satisfied-reset').click(function () {
        localStorage.clear();
        $("satisfactionResultsXception").empty();
    });
});
