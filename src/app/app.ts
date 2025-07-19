import { Component, signal } from '@angular/core';
import Tesseract from 'tesseract.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  title = 'extract_text_from_image';

  extracted_text = signal<string>('');
  error_message = signal<string>('');
  isLoading=signal<boolean>(false)

  onImageUpload(event: any) {
    const file = event.target?.files[0];
   
    if (file) {
       this.isLoading.set(true);
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        if (imageData) {
          this.performOCR(imageData);
        } else {
         this.isLoading.set(false);
          this.error_message.set('Could not read image data');
        }
      };
      reader.onerror = () => {
        this.isLoading.set(false); 
        this.error_message.set('Error reading file');
      };
      reader.readAsDataURL(file);
    } else {
      this.error_message.set('No file selected');
    }
  }

  performOCR(imageData: any) {
    Tesseract.recognize(imageData)
      .then((result:any) => {
       
        this.extracted_text.set(result.data.text);
         this.isLoading.set(false);
      })
      .catch((error:any) => {
         this.isLoading.set(false);
        this.error_message.set('OCR failed. Please try another image.');
      });
  }
}
