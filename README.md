Framework for Explainability of CNNs

[[_TOC_]]

# Downloading and using the framework

**Clone** this repository, either by using the **CLI commands** or **Downloading it as ZIP**.

After unpacking, just navigate to the folder and simply start the web application. Feel free to use a virtual environment.

```bash
$ cd ~/DOWNLOADLOCATION/WebAppWithJSndCSS
$ pip install -r requirements.txt ## pip3 for Python3
$ python app.py
```

Navigate to your browser to the localhost and enjoy!

*Deploying on a web-server such as Nginx or Apache is possible too.*

# General Structure

The project is structured into three parts. The main python class **app.py** is stored in the **root** of the directory.

The **html files** are stored in the **templates folder**.

All functional **JavaScript** components, dedicated to the respective models, are stored in the **./static/js folder**.

The overall stylistic features are stored in the **./static/css** folder.

Additional models can uploaded can be stored in the **models** folder.

# How to extend this explainer framework

In order to make this framework easy to  as possible, the construction was executed with the goal of ending up with a cooking recipe like process in the case of extension. This applies for both **new models** as well as **new explainers**

## 1 Adding new models

Here, you're given two options. 

#### 1.1 Adding existing, pre-trained models

This is the easiest case. Simply:


##### app.py class

- import your libraries into the class

```python
from keras.applications.resnet50 import ResNet50
```


- pre-load your model

```py
modelResNet50 = ResNet50(weights='imagenet')
print('ResNet50 Model loaded.')
```

- add an API with the following code (replace the "ResNet50 parts with your models name)
```python
@app.route('/predictResNet50', methods=['GET', 'POST'])
def predictResNet50():
    if request.method == 'POST':
        filenamelist = get_file_path_and_save(request)
        plotList =[]
        for file_path in filenamelist:
            img = image.load_img(file_path, target_size=(224, 224))
            # Preprocessing the image
            x = image.img_to_array(img)
            # x = np.true_divide(x, 255)
            x = np.expand_dims(x, axis=0)

            # Be careful how your trained model deals with the input
            # otherwise, it won't make correct prediction!
            x = preprocess_input_resNet50(x, mode='caffe')

            # Make prediction
            preds = modelResNet50.predict(x)
            pred_class = decode_predictions_resNet50(preds, top=1)  # ImageNet Decode
            result = str(pred_class[0][0][1]) + " (" + str(pred_class[0][0][2]) + ")" # Convert to string

            model_wo_sm = innvestigate.utils.keras.graph.model_wo_softmax(modelResNet50)
            explainer = request.form['explainerResNet50']

            analyzer = innvestigate.create_analyzer(explainer, model_wo_sm)

            analysis = analyzer.analyze(x)

            a = analysis.sum(axis=np.argmax(np.asarray(analysis.shape) == 3))
            a /= np.max(np.abs(a))
            plt.imshow(a[0], cmap="seismic", clim=(-1, 1))
            plt.title('Prediction Result: ' + result)
            plt.savefig(file_path[:-4] + explainer + "RN50Plot.jpg")
            fullPlotFilename = file_path[:-4] + explainer + "RN50Plot.jpg"
            plotList.append(fullPlotFilename)
        plotListJson = json.dumps(plotList)
        return plotListJson
    return None
```
*note: you may need to adjust the image size, as differnet models prefer different image sizes*


##### JavaScript class (static folder)

- create a new .js class, optionally named like the model you imported and add the following code in it. Just **rename** all the variables so that they later match the HTML

```js
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
        $('#satisfactionResultsrn50').append("ResNet50: Helpful= " + countYes + " | Unhelpful= " + countNo + "<br>");
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
        $('#satisfactionResultsrn50').append("ResNet50: Helpful= " + countYes + " | Unhelpful= " + countNo + "<br>");
    });

    // reset counter variables
    $('#rn50-satisfied-reset').click(function () {
        localStorage.clear();
        $('#satisfactionResultsrn50').empty();
    });
});
```

##### index.html class (templates folder)

- Add the following code to the HTML script. **Double check that the variable names match the JS class**

```html
<div class="col-sm-4">
        <form id="upload-file-ResNet50" method="post" enctype="multipart/form-data">
            <label for="imageUploadResNet50" class="upload-label">
               ResNet50 Choose...
            </label>
            <input type="file" name="file" id="imageUploadResNet50" accept=".png, .jpg, .jpeg" multiple>
            <p>
            <h4>Explainer Method:</h4>
            </p>
            <u><b>Function Based</b></u> <br>
                <input type="radio" id="gradientResNet50" name="explainerResNet50" value="gradient">
                <label for="gradientResnet50" title="The gradient of the output neuron with respect to the input">Gradient</label><br>
                <input type="radio" id="smoothgradResNet50" name="explainerResNet50" value="smoothgrad">
                <label for="smoothgradResnet50" title="Averages the gradient over number of inputs with added noise">SmoothGrad</label><br>
            <u><b>Signal Based</b></u> <br>
                <input type="radio" id="deconvnetResNet50" name="explainerResNet50" value="deconvnet">
                <label for="deconvnetResNet50" title="Applies a ReLU in the gradient computation instead of the gradient of a ReLU">DeConvNet</label><br>
                <input type="radio" id="guidedResNet50" name="explainerResNet50" value="guided_backprop">
                <label for="guidedResNet50" title="Applies a ReLU in the gradient computation additionally to the gradient of a ReLU">Guided BackProp</label><br>
                <input type="radio" id="patternNetResNet50" name="explainerResNet50" value="pattern.net">
                <label for="patternNetResNet50" title="Estimates the input signal of the output neuron">PatternNet</label><br>
            <u><b>Attribution Based</b></u> <br>
                <input type="radio" id="deepTaylorResNet50" name="explainerResNet50" value="deep_taylor">
                <label for="deepTaylorResNet50" title="Computes for each neuron a rootpoint, that is close to the input, but which's output value is 0, and uses this difference to estimate the attribution of each neuron recursively">DeepTaylor</label><br>
                <input type="radio" id="LRPResNet50" name="explainerResNet50" value="lrp.*">
                <label for="LRPResNet50" title="Attributes recursively to each neuron's input relevance proportional to its contribution of the neuron output">LRP</label><br>
        </form>
        <p>
        <div class="image-section-ResNet50" style="display:none;">
            <div class="img-preview">
                <div id="imagePreviewResNet50">
                </div>
            </div>
            <div>
                <button type="button" class="btn btn-primary btn-lg " id="btn-predict-ResNet50">ResNet50 Predict!</button>
            </div>
        </div>
        </p>
        <div class="loaderResNet50" style="display:none;"></div>
        <h3 id="resultResNet50">
            <span> </span>
        </h3>
        <div id="plotResNet50"></div>
            <h5 id="satisfiedResNet50" style="display:none;">Are you satisfied with the explanation?</h5>
            <p>
            <button type="button" class="btn btn-primary btn-lg " id="rn50-satisfied-yes" style="display:none;">Yes!</button>
            <button type="button" class="btn btn-primary btn-lg " id="rn50-satisfied-no" style="display:none;">No!</button> <br>
                <p>
                <button type="button" class="btn btn-primary btn-lg " id="rn50-satisfied-reset" style="display:none;">Reset Counter</button>
                </p>
            </p>
            <div id="satisfactionResultsrn50"></div>
    </div>
```
*note: depending on the current state of the framework, you may need to change the explainer accordingly*

#### 1.2 Adding a self-trained model

- Add the model to the ***models*** folder of the framework
- Import the model to the app.py class 
- Follow all the above steps


## 2 Adding new explainers

For explainers, it's fairly easy. However, these are currently, due to the structure of the framework, limited to those implemented in the innvestigate library. It's possible though, to either add new explainer to the innvestigate library ([GitHub](https://github.com/albermax/innvestigate)) or slightly change the app.py class, so that it is differentiated between Innvestigate explainers and others.

All you need to do is adding another entry in each of the models explainer bullet points enumeration in the index.html file. There, just add for each explainer

```html
<input type="radio" id="deconvnetVGG16" name="explainerVGG16" value="deconvnet">
<label for="deconvnetVGG16" title="Applies a ReLU in the gradient computation instead of the gradient of a ReLU">DeConvNet</label><br>
```
Simply replace the "deconvnet" with your explainer name and adjust the model (here "VGG16") everytime in the naming as well. Also change the title to a short description about your explainer.

Any other questions:
utehf@student.kit.edu
