from __future__ import print_function
import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras import backend as K
import numpy as np
from keras.models import load_model
from autokeras.image_supervised import ImageClassifier
from PIL import Image
import sys

file_name = sys.argv[1]


model = load_model('generated/my_model.h5')
pic = Image.open(file_name)
Pic = np.array(pic)
x = Pic.reshape((1,)+Pic.shape+(1,))
val = model.predict(x)
print(val[0].argmax(axis=0))

