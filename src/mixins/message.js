export default {
  methods: {
    parserContent(text) {
      if (text) {
        const urls = text.match(
          /(((ftp|http|www|https?):\/\/)[-\w@:%_+.~#?,&//=]+)/g
        );
        if (urls) {
          urls.forEach(function(url) {
            if (
              url.includes(".jpg") ||
              url.includes(".jpeg") ||
              url.includes(".png")
            ) {
              text = text.replace(
                url,
                '<img  class="content-image" src="' + url + '" />'
              );
            } else if (url.includes(".mp4") || url.includes(".bmp")) {
              text = text.replace(
                url,
                '<video class="content-video"  controls>' +
                  '<source src="' +
                  url +
                  '" type="video/mp4">' +
                  '<source src="' +
                  url +
                  '" type="video/mp4">' +
                  "</video>"
              );
            } else {
              const name = url.split("/")[6];
              text = text.replace(
                url,
                '<a target="_blank" class="content-link" href="' +
                  url +
                  '">' +
                  name +
                  "</a>"
              );
            }
          });
        }
        return text;
      }
    },
    async chatScroll(el) {
      let scrollBottom = false;
      const currentScrollPosition = el.target.scrollTop;
      if (currentScrollPosition > this.scrollPosition) scrollBottom = true;

      this.scrollPosition = currentScrollPosition;

      if (this.messages && this.messages.length && this.$refs.content) {
        const elementOffset = this.$refs.content.firstElementChild.getBoundingClientRect()
          .y;
        const elementHeight = this.$refs.content.firstElementChild.getBoundingClientRect()
          .height;

        if (
          elementHeight - elementOffset - 100 < elementHeight &&
          !scrollBottom
        ) {
          await this.$emit("run-pager");
        }
      }
    }
  }
};
