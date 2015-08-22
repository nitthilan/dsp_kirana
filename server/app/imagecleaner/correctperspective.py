import sys, json, base64, cv2, numpy, common_functions

# Does only perspective correction
for line in sys.stdin:
    params_json = json.loads(line)
    # get image
    image = common_functions.preProcess(params_json)
    # get the boxcorners for perspective correction
    box_corners = common_functions.getBoxCorners(params_json)
    # get the image dimension
    m,n = image.shape[:2]
    corrected_image = common_functions.correct_perspective(image, box_corners, [n,m]);

    # clean image
    if(int(params_json["enableclean"])):
        corrected_image = common_functions.InvDiffOfGaussian(corrected_image, params_json);

    # Add water mark
    scale_factor = n/512.0;
    cv2.putText(corrected_image, "www.brightboard.co.in", (5,m-int(15*scale_factor)), cv2.FONT_HERSHEY_SCRIPT_SIMPLEX,
        fontScale=scale_factor, color=(0,0,0), thickness=int(scale_factor/2))
    base64_image = common_functions.postProcess(corrected_image)
    print base64_image
    print "\n"
