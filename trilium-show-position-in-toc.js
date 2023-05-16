/*
trilium-show-position-in-toc
https://github.com/SiriusXT/trilium-show-position-in-toc
version:0.3
*/


class ShowTocPosition extends api.NoteContextAwareWidget {

    get position() {
        return 100;
    }
    get parentWidget() {
        return 'center-pane';
    }
    doRender() {
        this.$widget = $(`<style type="text/css">
	.component.scrolling-container .note-detail-editable-text-editor.ck.ck-content{
    overflow: visible;
    }
</style>`);
        return this.$widget;
    }


    async refreshWithNote() {
        await this.showTocPosition();
    }
    scrollForToc(event, scrollingContainer = $(this)) {
        let headerIndex = -1;
        scrollingContainer.find(':header:not(section.include-note :header):not(div.note-list-widget.component :header)').each(function () {
            headerIndex++;
            var distance = $(this).offset().top - scrollingContainer.offset().top;
            if (distance >= -20) {
                if (distance > scrollingContainer.height() / 2) {
                    headerIndex--;
                }
                return false;
            }
        });

        var li = document.querySelectorAll("div.toc-widget span.toc li");
        for (var i = 0; i < li.length; i += 1) {
            if (i != headerIndex) {
                li[i].style.setProperty("color", '');
            } else {
                li[i].style.setProperty("color", '#C70039');
                li[i].scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                })
            }
        }
    }
    showTocPosition() {
        const noteContext = this.noteContext;
        const scrollForToc = this.scrollForToc;
        $(document).ready(async function () {
            setTimeout(async function () {
                const isReadOnly = await noteContext.isReadOnly();
                if (isReadOnly) {
                    const $noteContainer = await noteContext.getContentElement();
                    const scrollingContainer = $noteContainer.closest('.component.scrolling-container'); if (scrollingContainer.length > 0) {
                        scrollingContainer.off('scroll', scrollForToc);
                        scrollingContainer.on('scroll', scrollForToc);
                        scrollForToc(undefined, scrollingContainer);
                    }
                } else {
                    const textEditor = await noteContext.getTextEditor();
                    const $noteContainer = $(textEditor.editing.view.domRoots.values().next().value);
                    const scrollingContainer = $noteContainer.closest('.component.scrolling-container');
                    if (scrollingContainer.length > 0) {
                        scrollingContainer.off('scroll', scrollForToc);
                        scrollingContainer.on('scroll', scrollForToc);
                        scrollForToc(undefined, scrollingContainer);
                    }
                }
            }, 300);
        })
    }

}

module.exports = new ShowTocPosition();


