import sys, json, base64, cv2, numpy


def preProcess(params_json):
    image = params_json['image'].decode('base64')
    image_buffer = numpy.frombuffer(image, dtype=numpy.uint8)
    decoded_image = cv2.imdecode(image_buffer, 1)
    return decoded_image

def postProcess(image):
    encoded_image = cv2.imencode('.jpeg',image,
        [cv2.IMWRITE_JPEG_QUALITY, 100])
    return base64.b64encode(encoded_image[1])


# correcting the image perspective
def correct_perspective(image, box_corners, size):
    #print box_corners, size
    output_corners = [[0,0],[size[0],0], size, [0,size[1]]]
    pts1 = numpy.float32(box_corners)
    pts2 = numpy.float32(output_corners)

    M = cv2.getPerspectiveTransform(pts1,pts2)

    dst = cv2.warpPerspective(image,M,(size[0],size[1]))
    return dst

def getBoxCorners(params):
    return [[int(float(params['topleft'][0])),int(float(params['topleft'][1]))],
        [int(float(params['topright'][0])),int(float(params['topright'][1]))],
        [int(float(params['bottomright'][0])),int(float(params['bottomright'][1]))],
        [int(float(params['bottomleft'][0])),int(float(params['bottomleft'][1]))]]


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
def InvDiffOfGaussian(input_image, params):
    r1 = 2*int(float(params["radius"]))+1;
    r2 = 2*r1+1
    t1 = int(float(params["threshold"]));
    t2 = t1+1
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
    diff = b2.astype(numpy.int32) - b1.astype(numpy.int32)
    diff[diff<0] = 0
    max_val = numpy.amax(diff)
    scale_factor = 1.0
    if(max_val):
        scale_factor = (255.0/max_val)
    # print max_val, scale_factor, numpy.amax(cv2.absdiff(b1,b2))
    invert = 255 - (diff*scale_factor)
    DoG = numpy.zeros(invert.shape, dtype=numpy.uint8)
    scaled = 255.0*(invert - t1)/(t2 - t1)
    numpy.clip(scaled, 0, 255, out=DoG)
    # DoG[DoG<=threshold_low] = 0
    # DoG[DoG>=threshold_high] = 255
    #DoG_O = numpy.zeros(DoG.shape)
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
