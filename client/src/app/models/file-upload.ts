export class imageFile {
  key!: string;
  name!: string;
  url!: string;
  file!: File;

  constructor(file: File) {
    this.file = file;
  }
}
