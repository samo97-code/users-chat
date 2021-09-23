export const functions = {
  formData(data, files) {
    const apiData = data;
    const formData = new FormData();
    if (apiData) {
      Object.keys(apiData).forEach(key => {
        formData.append(key, apiData[key]);
      });
    }
    if (files) {
      Object.keys(files).forEach(item => formData.append(item, files[item]));
    }

    return formData;
  },
  filesHeaders() {
    return {
      Accept: "application/json",
      "Content-Type": "multipart/form-data"
    };
  },
  async prepareChunk(chunk, file) {
    const done = await this.readChunk(chunk);
    return new File([done], file.name);
  },
  readChunk(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(file);
    });
  }
};
