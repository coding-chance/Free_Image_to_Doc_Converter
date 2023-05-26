function convertJPGtoGoogleDocs() {
  var srcFolderId = "idOfFolderContainingImageFiles";       // <--- Please input folder ID.
  var dstFolderId = "idOfFolderWhereOutputFIleWillBeSaved"; // <--- Please input folder where output file wants to be saved
  var extension = MimeType.JPEG                             // <--- Files with the extensions specified here are subject to OCR processing.

    /************************************************************
     * To get id of the folder, you open the folder on google drive.
     * Look at the address bar and you must see the URL like this.
     * https://drive.google.com/drive/u/1/folders/thisPartIsFolderId
     * The part after final slash (/) is the id.
     * **********************************************************/

  Logger.log(`Get all the image files stored in the input folder (${DriveApp.getFolderById(srcFolderId).getName()}).`);
  var files = DriveApp.getFolderById(srcFolderId).getFilesByType(extension); 
  Logger.log(`Start OCR process (Target extension: ${extension})`);
  var docBodies = [];     // Array that holds all the text from image files
  var fileNames = [];     // Array that holds the name of the file name of each image

  /** OCR acquired image files and convert them to Doc file */
  while ( files.hasNext() ) {
    let file = files.next();
    let fileId = file.getId();
    let fileName = file.getName();
    fileNames.push(fileName);  // Store the name of the image file currently being processed in an array
    // Convert the image to a Docs file (OCR process)
    let convertedDocumentData = Drive.Files.insert(
      {
        title: fileName,
        parents: [
          {
            id: dstFolderId
          }
        ]
      }, 
      file.getBlob(),
      {
        ocr: true
      }
    );
    console.log(`Converted ${fileName} to Doc file。`);
    // Get the currently created Doc file
    let doc = DocumentApp.openById(convertedDocumentData.id);
    // Retrieve the body text and store it in a variable
    var body = doc.getBody();

    /** Replace line breaks in the text with spaces */
    // Erase line breaks in the text
    let replacedText = body.getText().replace( /\n/g, "" );
    docBodies.push(replacedText);    // Add the text extracted from the image to the array "docBodies"
    Logger.log(`Removed line breaks in the body of ${fileName}.`);
    body.setText(replacedText);      // Rewrite sentences in the document as sentences without line breaks
    
    /** Delete Doc file temporarily generated when OCRing images */
    Logger.log(`Extraction of the body text has been completed.`);
    DriveApp.getFileById(doc.getId()).setTrashed(true);   // Delete Doc file
    Logger.log(`${fileName}. has been deleted.`);
  }
  console.log("OCR processing of all image files has been completed.");
  Logger.log(`List of OCR-processed file names: ${fileNames}`);

  /************************************************* 
   * Reverse the order of the elements (the text extracted from each image) stored in 'docBodies' 
   * (since the text of the last saved image file in Drive is stored in the array as the first element)
   ***********************************************/
  docBodies = docBodies.reverse();
  Logger.log(`Reversed the order of elements in 'docBodies'.\n${docBodies.join()}`);

  /** Save all extracted text in a Doc file */
  let integratedDoc = DocumentApp.create(`Integrated OCR Output File (${fileNames[ fileNames.length - 1 ]} - ${fileNames[0]})`); //　docファイルを新規作成 (保存先: ルートフォルダ)
  let integratedDocUrl = integratedDoc.getUrl();
  let integratedDocId = integratedDoc.getId();
  let integratedDocName = integratedDoc.getName();
  Logger.log(`Created a new doc file\ndocUrl: ${integratedDocUrl}\ndocId: ${integratedDocId}`);
  let intDocBody = integratedDoc.getBody();

  /** Format the extracted text for pasting */
  var finalFormattedBody = [];
  docBodies.forEach( (body, index) => {
    /** Add formatted body text with blank lines to the array */
    finalFormattedBody.push(body);
    finalFormattedBody.push("\n\n");    // Insert blank line in body text (The boundary between the text and the image will be clearer, and it will be easier to determine which part of the text was extracted from which image.)
  });

  /** Paste the extracted text (formatted with blank lines) into Doc file */
  intDocBody.appendParagraph(finalFormattedBody.join());
  let integratedDocTextObject = intDocBody.editAsText(); // Obtain an object for changing font style
  integratedDocTextObject.setAttributes({                // Specify font style
      [DocumentApp.Attribute.FONT_FAMILY]: 'Georgia',
      [DocumentApp.Attribute.FONT_SIZE]: 14,
  });
  integratedDocTextObject.setForegroundColor('#000000');  // Specify font color
  integratedDoc.saveAndClose();                           // Save configuration changes
  Logger.log(`Configuration of ${integratedDocName} is complete.`);

  /** Move the created Doc file to the output folder */
  DriveApp.getFileById(integratedDocId).moveTo( DriveApp.getFolderById(dstFolderId) );
  Logger.log(`The created document file ( ${integratedDocName} ) is now moved to the output folder ( ${DriveApp.getFolderById(dstFolderId).getName()} ).`);
  Logger.log(`The document file is stored in the following folder.\n${DriveApp.getFolderById(dstFolderId).getUrl()}`);
  Logger.log(`The Doc file with the aggregated text can be opened directly from the following link URL.\n${integratedDocUrl}`);
}