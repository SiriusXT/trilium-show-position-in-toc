 /*
trilium-show-position-in-toc
https://github.com/SiriusXT/trilium-show-position-in-toc
version:0.4
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
        .component.scrolling-container .ck.ck-content{
        overflow: visible;
        }
        </style>
        `);
        return this.$widget;

    }

    async refreshWithNote() {
        this.showTocPosition();
    }
    showTocPosition() {
        let listenScroll = true;
        var toogleTimeout;
        function toggleFalse(){
            clearTimeout(toogleTimeout);
            listenScroll = false;
            toogleTimeout = setTimeout(function () {
                listenScroll = true;
            },1500);
        };
        function toggleTrue(){
            clearTimeout(toogleTimeout);
            listenScroll = true;
        };
        const noteContext = this.noteContext;
        $(document).ready(async function () {
            setTimeout(async function () { // Wait for scroll-container and toc to load
                $("#right-pane").off("click", toggleFalse);
                $("#right-pane").on("click", toggleFalse);
                var getNoteContainer = async function () {
                    const isReadOnly = await noteContext.isReadOnly();
                    if (isReadOnly) {
                        return await noteContext.getContentElement();
                    } else {
                        const textEditor = await noteContext.getTextEditor();
                        return $(textEditor.editing.view.domRoots.values().next().value);
                    }
                }
                var $scrollingContainer = (await getNoteContainer()).closest('.component.scrolling-container');
                //window.scrollingContainer=$scrollingContainer
                var scrollHandlerTimeout;
                var scrollHandler = async function (event = undefined) {
                    clearTimeout(scrollHandlerTimeout);
                    scrollHandlerTimeout = setTimeout(async function () {
                        let headerIndex = -1;
                        (await getNoteContainer()).find(':header').each(function () {
                            headerIndex++;
                            var distance = $(this).offset().top - $scrollingContainer.offset().top;
                            if (distance >= -20) {
                                if (distance > $scrollingContainer.height() / 2) {
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
                                //Don't scroll toc when mouse is over toc
                                if (listenScroll) {
                                    li[i].scrollIntoView({
                                        block: "center",
                                        behavior: "instant"
                                    });
                                }

                            }
                        }
                    }, 10);
                };

                if ($scrollingContainer.length > 0) {
                    $scrollingContainer.off('scroll', scrollHandler);
                    $scrollingContainer.on('scroll', scrollHandler);
                    scrollHandler();
                }
            }, 1000);
        })
    }

}

module.exports = new ShowTocPosition();