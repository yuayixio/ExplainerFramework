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
                console.log(array)
               /* var string = array[0];
                console.log(string)
                console.log(array[1])
                var splittedString = string.split(",");
                console.log(typeof splittedString);
                $('#plotResNet50').append(string);
               */
                for (var i = 0; i < array.length; i++){
                $('#plotResNet50').prepend('<img src="' + array[i] + '" height="300" width="300">');
                }
                $('#rn50-satisfied-yes').show();
                $('#rn50-satisfied-no').show();
                $('#rn50-satisfied-reset').show();
                console.log('ResNet50 Success!!');
            },
        });
     });

    // ask user if he's satisfied with the provided explanation
    $('#rn50-satisfied-yes').click(rn50Click("yes"));
    $('#rn50-satisfied-no').click(rn50Click("no"));
    function rn50Click(yesorno) {
        var countYes;
        var countNo;
        if (window.localStorage.getItem('clickCountYes')){
            countYes = window.localStorage.getItem('clickCountYes');
        } else {
            countYes = 0;
        }
        if (window.localStorage.getItem('clickCountNo')){
            countNo = window.localStorage.getItem('clickCountNo');
        } else {
            countNo = 0;
        }
        if (yesorno == "yes") {
            countYes++;
        }
        if (yesorno == "no") {
            countNo++;
        }
        window.localStorage.setItem('clickCountYes',countYes);
        window.localStorage.setItem('clickCountNo',countNo);
        console.log("Count Yesses: " + countYes);
        $('#plotResNet50').append("Helpful= " + countYes + " | Unhelpful= " + countNo);
    };

    // reset counter variables
    $('#rn50-satisfied-reset').click(function () {
        localStorage.clear();
    });
});
