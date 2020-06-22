from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.applications.vgg16 import preprocess_input
from keras.applications.vgg16 import decode_predictions

# ResNet50
from keras.applications.resnet50 import ResNet50
from keras.applications.imagenet_utils import preprocess_input as preprocess_input_resNet50, decode_predictions as decode_predictions_resNet50
# VGG16
from keras.applications.vgg16 import VGG16
from keras.applications.vgg16 import preprocess_input as preprocess_input_vgg16, decode_predictions as decode_predictions_vgg16
# Xception
from keras.applications.xception import Xception
from keras.applications.xception import preprocess_input as preprocess_input_xception, decode_predictions as decode_predictions_xception

def getPrediction(filename, modeltype):

    image = load_img('Pictures/' + filename, target_size=(224, 224))
    image = img_to_array(image)
    image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))

    if modeltype == 'ResNet50':
        model = ResNet50(weights='imagenet')
        print('ResNet50 Model loaded.')
        image = preprocess_input_resNet50(image)
        yhat = model.predict(image)
        label = decode_predictions_resNet50(yhat)

    if modeltype == 'VGG16':
        model = VGG16(weights='imagenet', include_top=True)
        print('VGG16 Model loaded.')
        image = preprocess_input_vgg16(image)
        yhat = model.predict(image)
        label = decode_predictions_vgg16(yhat)

    if modeltype == 'Xception':
        model = Xception(weights='imagenet', include_top=True)
        print('Xception Model loaded.')
        image = preprocess_input_xception(image)
        yhat = model.predict(image)
        label = decode_predictions_xception(yhat)


    label = label[0][0]
    print('%s (%.2f%%)' % (label[1], label[2]*100))
    return label[1], label[2]*100