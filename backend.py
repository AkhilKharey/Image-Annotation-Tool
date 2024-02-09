from ultralytics import YOLO
import cv2 
import os

#Generate a list of all images present in specified folder
images = os.listdir('./dataset/images')

#Create an annotation folder if it doesen't exist already
if not ( os.path.exists('./dataset/annotations/')):
    os.mkdir('./dataset/annotations/')

#LOading trained YOLOv8 model for inferences
model = YOLO('./best.pt')

#Iterating over images in the images folder
for i in images:

    #Creating a string which corresponds to the file name of the image
    file_name = str(i)
    file_name = file_name.split('.')
    file_name = file_name[0]
    file_name = './dataset/annotations/' + file_name + '.txt'

    #Load an image and generate inferences based on it
    image = cv2.imread('./dataset/images/' + i)
    results = model.predict(image,agnostic_nms = True, iou = 0.3)

    #Create a new image with bounding boxes and labels and display it to the user
    new_img = results[0].plot()
    
    cv2.imshow('result',new_img)
    cv2.waitKey(0)

    #Take input from the user to use model generated annotations or use user generated annotations
    confirm = input('Confirm annotations generated by model y/n ')

    #Generate annotations file based on model inference
    if confirm == 'y' or confirm == 'Y':

        with open(file_name,'w') as file:
            annotations = []
            for j in range(len(results[0].boxes.cls)):
                annotation_string = str(int(results[0].boxes.cls[j])) + ' ' + str(round(float(results[0].boxes.xywhn[j][0]),6)) + ' ' + str(round(float(results[0].boxes.xywhn[j][1]),6)) + ' ' + str(round(float((results[0].boxes.xywhn[j][2])),6)) + ' ' + str(round(float(results[0].boxes.xywhn[j][3]),6)) + '\n'
                annotations.append(annotation_string)
        
            file.writelines(annotations)

    #Allow the user to enter bounding boxes in xyxy format and have it automatically converted to Yolo format and made into an annotation file
    elif confirm == 'n' or confirm == 'N':
        
        with open(file_name,'w') as file:
            annotations = []

            instances = int(input('Enter number of instances in the image: '))

            for i in range(instances):
                cls_no = input('Enter class number: ')

                bbox = input('Enter bounding box for the instance: ').split()

                for j in range(len(bbox)):

                    bbox[j] = float(bbox[j])

                w = (bbox[2] - bbox[0])/image.shape[0]
                h = (bbox[3] - bbox[1])/image.shape[1]
                x = (bbox[2] + bbox[0])/(image.shape[0]*2)
                y = (bbox[3] + bbox[1])/(image.shape[1]*2)

                bbox = [x,y,w,h]

                for k in range(len(bbox)):
                    bbox[k] = str(round(bbox[k],6))

                annotation_string = cls_no + ' ' + bbox[0] + ' ' + bbox[1] + ' ' + bbox[2] + ' ' + bbox[3] + '\n'
                annotations.append(annotation_string)
            
            file.writelines(annotations)

    else:
        print('Invalid input')