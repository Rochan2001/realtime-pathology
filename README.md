# Realtime-Pathology
This project was submitted as a code challenge for GSOC 2021 and the organisation was [CaMicroscope](https://github.com/camicroscope/caMicroscope)

## Purpose
The purpose of this prototype was to show how pathologists from different regions can collaborate and work together.

## Description
In this project we use WSI(whole slide images) to represent the tissue in a digital format. We are able to visualize these tissue slide images in browser using [openseadragon](https://github.com/openseadragon/openseadragon) api. If we open the index.html page we can see the tissue image and below a chat window.

If we open index.html in multiple browsers to mimic two pathologists using our web app, we can observe that these WSI images are synced. By sync we mean that if you move the WSI image in any one of the index.html instance in a browser the changes are visible in all the other index.html instances. A chat window is also provided so that the pathologists can chat while working on the WSI. A annotation page is also provided so multiple pathologists can annotate on a common WSI image and view the changes of annotation in real-time made by the other pathologists.

To make the sync of WSI instances work we have used sockets.io library and for viewing the WSI and doing annotations on it we have used openseadragon library.


## Demo
* Click here to see the demo https://youtu.be/wMPQcVvc6yg

## setup

```
$ git clone [https://github.com/Rochan2001/sorting-visualizer.git](https://github.com/Rochan2001/realtime-pathology.git)
$ cd realtime-pathology
$ npm install

```
Open up `public/index.html` on two or more separate tabs in a browser to see the prototype of real-time collaborative pathology in action.
