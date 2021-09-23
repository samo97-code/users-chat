export default {
  data() {
    return {
      message: "",
      filesList: [],
      mediaList: [],
      files: [],
      medias: [],
      acceptVideoOrImage: ".jpg, .jpeg, .png, .bmp, .mp4",
      acceptFiles: ".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf",
      loader: "/../../img/loader.svg",
      loading: false
    };
  },
  watch: {
    newWebsocketMessage() {
      console.log(this.newWebsocketMessage);
    }
  },
  methods: {
    isVideo(url) {
      return new Promise(function(res, rej) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = function(evt) {
          res(!!(video.videoHeight && video.videoWidth));
          video.src = null;
        };
        video.onerror = function(event) {
          video.src = null;
          res(false);
        };
        video.onabort = function(event) {
          video.src = null;
          res(false);
        };
        video.src = url;
      });
    },
    onImageFileInputChange(e) {
      const media = Object.values(e.target.files);
      media.map(async item => {
        const data = {
          url: null,
          file: item,
          isVideo: false
        };
        this.mediaList.push(data);
        await this.prepareMedia(data);
        e.target.files.forEach(async item => {
          const resp = await this.uploadMedia(item);
          this.medias.push(resp.output_url);
        });
      });

      setTimeout(() => {
        e.target.value = "";
      }, 500);
    },
    onDocumentFileInputChange(e) {
      this.filesList.push(...Object.values(e.target.files));

      e.target.files.forEach(async item => {
        const resp = await this.uploadMedia(item);
        this.files.push(resp.output_url);
      });

      setTimeout(() => {
        e.target.value = "";
      }, 500);
    },
    async uploadMedia(file) {
      try {
        this.loading = true;
        const data = {
          file,
          uploadCallback: this.calcProgress
        };
        return await this.$store.dispatch("media/upload", data);
      } catch (e) {}
    },
    calcProgress(current, totals, formObject, progressEvent) {
      const totalLoaded = (progressEvent.loaded * 100) / progressEvent.total;
      if (totalLoaded === 100) this.loading = false;
    },
    async prepareMedia(item) {
      const reader = new FileReader();

      reader.onload = async e => {
        const source = e.target.result;
        const isVideo = item.file.name.endsWith(".mp4");
        item.url = source;
        item.isVideo = isVideo;
      };
      reader.readAsDataURL(item.file);
    },
    extractUrls(text) {
      if (text) {
        const urls = text.match(
          /(((ftp|http|www|https?):\/\/)[-\w@:%_+.~#?,&//=]+)/g
        );
        if (urls) {
          urls.forEach(function(url) {
            text = text.replace(
              url,
              '<a target="_blank" href="' + url + '">' + url + "</a>"
            );
          });
        }
        return text;
      }
    },
    removeFile(index) {
      this.filesList.splice(index, 1);
      this.files.splice(index, 1);
    },
    removeMedia(index) {
      this.mediaList.splice(index, 1);
      this.medias.splice(index, 1);
    },
    async sendMessage(e) {
      if (e.keyCode === 13) {
        this.loading = true;
        await this.$emit("sendMessage", this.medias, this.files, this.message);

        this.message = "";
        this.filesList = [];
        this.files = [];
        this.mediaList = [];
        this.medias = [];
      }
      this.loading = false;
    }
  }
};
