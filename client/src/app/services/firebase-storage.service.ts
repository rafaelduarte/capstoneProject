import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { finalize, from, Observable, switchMap } from 'rxjs';
import { imageFile } from '../models/file-upload';

interface FilesUploadMetadata {
  downloadUrl$: Observable<string>;
  uploadProgress$: Observable<number | undefined>;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  constructor(private fireStorage: AngularFireStorage) {}

  uploadFileAndGetMetadata(
    fileToUpload: imageFile,
    mediaFolderPath: string,
    userName: string
  ): FilesUploadMetadata {
    const filePath = `${mediaFolderPath}/${userName}_profileImage`;
    const storageRef = this.fireStorage.ref(filePath);
    const uploadTask: AngularFireUploadTask = storageRef.put(fileToUpload.file);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            fileToUpload.url = downloadURL;
            fileToUpload.name = fileToUpload.file.name;
          });
        })
      )
      .subscribe();

    return {
      uploadProgress$: uploadTask.percentageChanges(),
      downloadUrl$: storageRef.getDownloadURL(),
    };
  }
}
