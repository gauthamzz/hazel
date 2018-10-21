import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras import backend as K
from autokeras.preprocessor import OneHotEncoder
from keras.models import load_model
from autokeras import ImageClassifier
import tensorflow
import os
import numpy as np
import re
import cv2
images = []
y=[]
directory ="shoe_data"
for root, dirnames, filenames in os.walk(directory):
	for filename in filenames:
		if re.search('\.(jpg|jpeg|png|bmp|tiff)$', filename):
			try:
				filepath = os.path.join(root, filename)
				img=cv2.imread(filepath)
				resized_image = cv2.resize(img, (30, 30))
				images.append(resized_image)
				string = root[len(directory)+1:]
				y.append(re.match('(.*?)/',string).group())
			except:
				pass
x_train = np.array(images)
y_train = np.array(y)
y_encode = OneHotEncoder()
def transform_y(y_train):
	y_encoder = OneHotEncoder()
	y_encoder.fit(y_train)
	y_train = y_encoder.transform(y_train)
	return y_train
if 'y_test' in locals():
	y_test = transform_y(y_test)
y_train = transform_y(y_train)
model = Sequential()
model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=x_train.shape[1:]))
model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(y_train.shape[1], activation='softmax'))
model.compile(loss=keras.losses.categorical_crossentropy, optimizer=keras.optimizers.Adadelta(), metrics=['accuracy'])
model.fit(x_train, y_train,epochs=20)
score = model.evaluate(x_test, y_test, verbose=0)
print('Test loss:', score[0])
print('Test accuracy:', score[1])
model.save('my_model.h5')
