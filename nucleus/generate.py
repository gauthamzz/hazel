a = [["input", "mnist", "model", ""], ["model", "", "Conv2D", "32"], ["Conv2D", "32", "Conv2D", "64"], ["Conv2D", "64", "MaxPooling2D", ""], ["MaxPooling2D", "", "Dropout", "0.25"], ["Dropout", "0.25", "Flatten", ""], ["Flatten", "", "Dense", ["128", "relu"]], ["Dense", ["128","relu"], "Dropout", "0.5"], ["Dropout", "0.5", "Dense", ["10","softmax"]], ["Dense", ["10","softmax"], "Generate", ""]]
k = []
print(len(a))
for i in range(len(a)):
	if(a[i][0]=="input"):
		k.append(a[i])
	# find(a[i][1]=="input")

# k.append(a[0])
# print(k)
# print(k[-1][2])
f = k[-1][2]
# print(len(a))
for i in range(len(a)):
	for j in range(len(a)):
		f = k[-1][2]
		l = k[-1][3]
		if f == a[j][0] and l== a[j][1]:
		# print(i)
			k.append(a[j])
# print(k)
arr = k
print(arr)


def fun(arr):
	print("test")
	f = open('file.py', "w+")
	# f.write("from __future__ import print_function\n")
	f.write("import keras\n")
	f.write("from keras.datasets import mnist\n")
	f.write("from keras.models import Sequential\n")
	f.write("from keras.layers import Dense, Dropout, Flatten\n")
	f.write("from keras.layers import Conv2D, MaxPooling2D\n")
	f.write("from keras import backend as K\n")
	f.write("from autokeras.preprocessor import OneHotEncoder\n")
	f.write("from keras.models import load_model\n")
	temp = " "

	for x in arr:
		# print("done")
		b = x
		# print(b)
		if b[0] == "input":
			if b[1] == "mnist":
				f.write("(x_train, y_train), (x_test, y_test) = mnist.load_data()\n")
				f.write("x_train = x_train.reshape(x_train.shape+(1,))\n")
				f.write("x_test = x_test.reshape(x_test.shape+(1,))\n")
				f.write("y_encode = OneHotEncoder()\n")
				f.write("def transform_y(y_train):\n")
				f.write("\ty_encoder = OneHotEncoder()\n")
				f.write("\ty_encoder.fit(y_train)\n")
				f.write("\ty_train = y_encoder.transform(y_train)\n")
				f.write("\treturn y_train\n")
				f.write("y_test = transform_y(y_test)\n")
				f.write("y_train = transform_y(y_train)\n")
			if b[2] == "model":
				val = b[3]
				# print(val)			
		if b[0] == "model":
			if b[1] == val:
				f.write("model = Sequential()\n")
				# print(b[2])							
				if b[2] == "Conv2D":
					input = b[3]
					f.write("model.add(Conv2D(" + input + ", kernel_size=(3, 3), activation='relu', input_shape=x_train.shape[1:]))\n")
		if b[0] == "Conv2D":
			val = b[1]
			if val!=input:
				f.write("model.add(Conv2D(" + val + ", kernel_size=(3, 3), activation='relu'))\n")
		if b[0] == "MaxPooling2D":
			f.write("model.add(MaxPooling2D(pool_size=(2, 2)))\n")
		if b[0] == "Dropout":
			input = b[1]
			f.write("model.add(Dropout(" + input + "))\n")
		if b[0] == "Flatten":
			f.write("model.add(Flatten())\n")
		if b[0] == "Dense":
			input = b[1][0]
			in2 = b[1][1]
			f.write("model.add(Dense("+input+", activation='" +in2+ "'))\n")
		if b[2] == "Generate":
			f.write("model.compile(loss=keras.losses.categorical_crossentropy, optimizer=keras.optimizers.Adadelta(), metrics=['accuracy'])\n")
			f.write("model.fit(x_train, y_train, validation_data=(x_test, y_test))\n")
			f.write("score = model.evaluate(x_test, y_test, verbose=0)\n")
			f.write("print('Test loss:', score[0])\n")
			f.write("print('Test accuracy:', score[1])\n")
			f.write("model.save('my_model.h5')\n")
	f.close()

fun(arr)