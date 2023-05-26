# GAS OCR (convert image file to doc file)
This is a script written in GAS(Google Apps Script) that converts image file to doc file.
When you have to scan massive amount of written papers to edit them on your text editor, this script comes into play.

<br>

## Getting Started (Setup and Usage)
Here, I introduce you the step by step guide to convert image files to doc file using this script.

<br>

### **Create a GAS Project**
- Open Google Drive (Login to your Google account if needed)
- Press `new` with plus icon on the top left and select `Google Apps Script` in `others`
- Name the GAS project by clicking the title bar on top left (the name doesn't really matter but I suggest you to name it "OCR (image to doc)" if you have no idea for that)

<br>

### **Prepare Folders on Google Drive**
- Create two folders and name it `input` and `output` respectively (the filenames don't need to be exact the same)
- Get `folder id` for each folder that you have created (To get `folder id`, you open the folder and check the URL in the address bar. `The part after final slash (/)` is folder id.)

<br>

### **GAS Setting**
- Copy the whole code of `code.gs` on this repository and overwrite the GAS project with it (You can delete `myFuncton(){}` that is initially displayed on GAS editor)
- Add `Drive(v2) Service` by pressing `service` on the left located below `library` (You select `ver 2` of `Advanced Drive Service`)
- Set the Variables
    - srcFolderId <--- `input` folder ID.
    - dstFolderId <--- `output` folder ID.
    - extension   <--- Specify `file extension` of the files that you extract the text from. For example, if you want to specify the file extension as PNG, replace JPEG with it.

<br>

### **Upload Image Files to Google Drive**
- Upload image files to `input` folder.

<br>

### **Execute GAS**
- Execute the script by clicking the button above looking like `▷ Execute` on GAS editor.
    - First time you execute the script, the popup window saying "Authorization required" appears. You have to follow the steps below to complete script permission setting. allow the script to access to your Google drive. 
        - Click on `Review permissions`
        - Click on the google account of your Google drive that stores image files and the GAS script.
        - Now a message saying "Google hasn't verified this app" appeares so click on `Advanced` displayed on bottom right and click on `Go to ***** (unsafe)` to proceed to permission setting.
        - Click on `allow` button on bottom right.
        - The first attempt to execute the script is likely to fail due to the interruption by this permission setting so please click on `▷ Execute` once again if the process didn't succeed.
- Now you wait a moment until the process completes. When the process finishes, navigate to `output` folder on Google drive and check the doc file that stores all the texts extracted from image file.

<br>


<br>

## Caution
Do not save too many image files in input folder otherwise the ocr process will not complete successfully. If the processing time exceeds more than 6 minutes, the script shuts down automatically due to the limit of gas. The maximum number of image file that you can put in `input` folder depends on how many words the file contains. However, I believe that the process runtime doesn't exceed 6 minutes if you convert `less than 25` files.
