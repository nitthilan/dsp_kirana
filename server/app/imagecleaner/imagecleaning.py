import cv2;
import numpy as np;
import sys;
from matplotlib import pyplot as plt
import math

#plt.subplots_adjust(left=0.0, right=1.0, top=1.0, bottom=0.0,wspace=0.0,hspace=0.0)

if len(sys.argv) != 9:
	# http://stackoverflow.com/questions/2949974/how-to-exit-a-program-sys-stderr-write-or-print
	sys.exit("Error: Num arguments should be 2. Actual arguments are "+''.join(sys.argv));

# Reading file names
input_file  = sys.argv[1]
output_file = sys.argv[2]
# r1 = 11
# r2 = 3
# threshold_high = 230
# threshold_low = 180
radius = sys.argv[3].split(",")
r1 = 2*int(radius[0])+1
r2 = 2*r1+1
# Thresholds found by hit and trial
# if(r2 >= 45):
# 	r2 = 45
# if(r1 >= 43):
# 	r1 = 43
#r2 = int(radius[1])

threshold = sys.argv[4].split(",")
t1 = int(threshold[0])
t2 = int(threshold[1])
if(t1 >= t2):
	t2 = t1+1;
topleft = sys.argv[5].split(",")
topright = sys.argv[6].split(",")
bottomleft = sys.argv[7].split(",")
bottomright = sys.argv[8].split(",")
box_corners = [[int(float(topleft[0])),int(float(topleft[1]))],
			   [int(float(topright[0])),int(float(topright[1]))],
			   [int(float(bottomright[0])),int(float(bottomright[1]))],
			   [int(float(bottomleft[0])),int(float(bottomleft[1]))]]

# Reading images
#input_image = cv2.imread(input_file, cv2.IMREAD_GRAYSCALE)
input_image = cv2.imread(input_file)
#print input_image_rgb.shape
m,n = input_image.shape[:2]

print r1, r2, t1, t2, m, n, box_corners


# plt.subplot(1,3,1),plt.imshow(imgYCC[:,:,0],cmap = 'gray')
# plt.title('Org Y'), plt.xticks([]), plt.yticks([])
# plt.subplot(1,3,2),plt.imshow(imgYCC[:,:,1],cmap = 'gray')
# plt.title('Org Cr'), plt.xticks([]), plt.yticks([])
# plt.subplot(1,3,3),plt.imshow(imgYCC[:,:,2],cmap = 'gray')
# plt.title('Org Cb'), plt.xticks([]), plt.yticks([])

# plt.show()




# 4.jpg [1,3], 99, 225 Black
# 10.jpg [1,3], 99, 225 Black
# 8.jpg [1,3], 99, 240 Blue
# 9.jpg [1,3], 99, 225 Black
# 7.jpg [1,3], 99, 225 Black
# epic tutorial: using gimp http://matthew.mceachen.us/blog/how-to-clean-up-photos-of-whiteboards-with-gimp-403.html
# corresponding script in imagemagik: [https://gist.github.com/lelandbatey/8677901]
#!/bin/bash
# convert "$1" -morphology Convolve DoG:15,100,0 -negate -normalize -blur 0x1 -channel RBG -level 60%,91%,0.1 "$2"
# for 4.jpg image filter of 48 and 10 works - histogram equalisation is yet to be clearly defined
# for 8.jpg image filter is 7 and 2/3 works
#probable efficient implementation
#http://stackoverflow.com/questions/14191967/opencv-efficient-difference-of-gaussian
#Gaussian kernal size is picked three times the value of sigma [http://homepages.inf.ed.ac.uk/rbf/HIPR2/gsmooth.htm]
#Radius of gaussian is given by the sigma value [http://en.wikipedia.org/wiki/Gaussian_blur]
def InvDiffOfGaussian(input_image, r1, r2, t1, t2):
	#probable efficient implementation
	#http://stackoverflow.com/questions/14191967/opencv-efficient-difference-of-gaussian
	#Gaussian kernal size is picked three times the value of sigma [http://homepages.inf.ed.ac.uk/rbf/HIPR2/gsmooth.htm]
	#Radius of gaussian is given by the sigma value [http://en.wikipedia.org/wiki/Gaussian_blur]
	# Gimp implementation of DoG
	# https://github.com/piksels-and-lines-orchestra/gimp/blob/master/plug-ins/common/edge-dog.c
	# radius = fabs (radius) + 1.0;
  	# std_dev = sqrt (-(radius * radius) / (2 * log (1.0 / 255.0)));
	# sigma1 = math.sqrt(r1*r1/2) Making automatice sigma calculation gives better result
	# sigma2 = math.sqrt(r2*r2/2)
	# print r1, sigma1, r2, sigma2
	b1 = cv2.GaussianBlur(input_image, (r1,r1), 0)
	b2 = cv2.GaussianBlur(input_image, (r2,r2), 0)
	# http://stackoverflow.com/questions/26678132/python-numpy-subtraction-no-negative-numbers-4-6-gives-254
	diff = b2.astype(np.int32) - b1.astype(np.int32)
	diff[diff<0] = 0
	max_val = np.amax(diff)
	scale_factor = 1.0
	if(max_val):
		scale_factor = (255.0/max_val)
	# print max_val, scale_factor, np.amax(cv2.absdiff(b1,b2))
	invert = 255 - (diff*scale_factor)
	DoG = np.zeros(invert.shape, dtype=np.uint8)
	scaled = 255.0*(invert - t1)/(t2 - t1)
	np.clip(scaled, 0, 255, out=DoG)
	# DoG[DoG<=threshold_low] = 0
	# DoG[DoG>=threshold_high] = 255
	#DoG_O = np.zeros(DoG.shape)
	#cv2.normalize(DoG, DoG_O, 0, 255, cv2.NORM_MINMAX);

	# plt.subplot(2,2,1),plt.imshow(cv2.absdiff(b1,b2)[:,:,0],cmap = 'gray')
	# plt.title('abs_diff'), plt.xticks([]), plt.yticks([])
	# plt.subplot(2,2,2),plt.imshow(diff[:,:,0],cmap = 'gray')
	# plt.title('diff'), plt.xticks([]), plt.yticks([])
	# plt.subplot(2,2,3),plt.imshow(b1[:,:,0],cmap = 'gray')
	# plt.title('b1'), plt.xticks([]), plt.yticks([])
	# plt.subplot(2,2,4),plt.imshow(b2[:,:,0],cmap = 'gray')
	# plt.title('b2'), plt.xticks([]), plt.yticks([])
	# plt.show()
	return DoG

# correcting the image perspective
def correct_perspective(image, box_corners, size):
	#print box_corners, size
	output_corners = [[0,0],[size[0],0], size, [0,size[1]]]
	pts1 = np.float32(box_corners)
	pts2 = np.float32(output_corners)

	M = cv2.getPerspectiveTransform(pts1,pts2)

	dst = cv2.warpPerspective(image,M,(size[0],size[1]))
	return dst

CP = correct_perspective(input_image, box_corners, [n,m]);
DoG = InvDiffOfGaussian(CP, r1, r2, t1, t2);

scale_factor = n/512.0;
cv2.putText(DoG, "www.brightboard.co.in", (5,m-int(15*scale_factor)), cv2.FONT_HERSHEY_SCRIPT_SIMPLEX, 
	fontScale=scale_factor, color=(0,0,0), thickness=int(scale_factor/2))


cv2.imwrite(output_file, DoG, [cv2.IMWRITE_JPEG_QUALITY, 100]) 

# plt.subplot(1,3,1),plt.imshow(input_image,cmap = 'gray')
# plt.title('Original'), plt.xticks([]), plt.yticks([])
# plt.subplot(1,3,2),plt.imshow(DoG,cmap = 'gray')
# plt.title('DoG'), plt.xticks([]), plt.yticks([])
# plt.subplot(1,3,3),plt.imshow(thresh1,cmap = 'gray')
# plt.title('Threshold'), plt.xticks([]), plt.yticks([])

# plt.show()
