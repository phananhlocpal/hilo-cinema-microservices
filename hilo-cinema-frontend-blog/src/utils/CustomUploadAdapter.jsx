class Base64UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({ default: reader.result });
                };
                reader.onerror = error => {
                    reject(error);
                };
                reader.readAsDataURL(file);
            }));
    }

    abort() {
        // Handle aborting the upload process if necessary
    }
}

export default Base64UploadAdapter;