/*
trilium-show-position-in-toc
https://github.com/SiriusXT/trilium-show-position-in-toc
version:0.6
*/

let centerPane, rightPane;

module.exports = class extends api.NoteContextAwareWidget {
    get position() {
        return 50;
    }

    static get parentWidget() {
        return 'note-detail-pane';
    }

    isEnabled() {
        return super.isEnabled() && this.note.type === 'text';
    }

    doRender() {
        this.$widget = $('');
        return this.$widget;
    }
    
    get rightPane() {
        if (!rightPane) {
            rightPane = document.querySelector("#right-pane");
        }
        return rightPane;
    }
    get centerPane() {
        if (!centerPane) {
            centerPane = document.querySelector("#center-pane");
        }
        return centerPane;
    }

    scrollHandler = () => {
        clearTimeout(this.scrollHandlerTimeout);

        this.scrollHandlerTimeout = setTimeout(() => {
            const headers = this.scrollingContainer.querySelectorAll(':not(section.include-note) h1, :not(section.include-note) h2, :not(section.include-note) h3, :not(section.include-note) h4, :not(section.include-note) h5, :not(section.include-note) h6');

            let headerIndex = -1;

            for (let i = 0; i < headers.length; i++) {
                const element = headers[i];
                headerIndex++;
                const distance = element.getBoundingClientRect().top - this.scrollingContainer.getBoundingClientRect().top;

                if (distance >= -20) {
                    if (distance > this.scrollingContainer.clientHeight / 2) {
                        headerIndex--;
                    }
                    break;
                }
            }

            this.tocScrollTo(headerIndex);
        }, 50);
    }

    tocScrollTo(headerIndex) {
        const liElements = this.rightPane.querySelectorAll("div.toc-widget span.toc li");

        liElements.forEach((li, index) => {
            if (index !== headerIndex) {
                li.style.color = '';
            } else {
                li.style.color = '#C70039';
                // Don't scroll toc when mouse is over toc
                const card = this.rightPane.querySelector('.toc-widget')?.parentElement;
                if (!this.disableTocScroll || (card && card.scrollHeight > card.clientHeight)) {
                    li.scrollIntoView({
                        block: "center",
                        behavior: "smooth" 
                    });
                }
            }
        });
    }

    handleRPclick = () => {
        clearTimeout(this.dLTimeout);
        this.disableTocScroll = true;
        this.dLTimeout = setTimeout(() => {
            this.disableTocScroll = false;
        }, 300);
    }


    async refreshWithNote() {
        this.scrollingContainer = this.centerPane.querySelector(`.note-split[data-ntx-id="${this.noteContext.ntxId}"]`).querySelector('.scrolling-container');


        this.scrollingContainer?.removeEventListener('scroll', this.scrollHandler);
        this.scrollingContainer?.addEventListener('scroll', this.scrollHandler);

        this.rightPane?.removeEventListener("click", this.handleRPclick);
        this.rightPane?.addEventListener("click", this.handleRPclick);        
    }
}
