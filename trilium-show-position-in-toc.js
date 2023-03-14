// version: 0.1
var scrollFunc = function(event) { 
	var heading = document.querySelectorAll('div#rest-pane.component div.component.note-split.type-text:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.ck-content h2, div#rest-pane.component div.component.note-split.type-text:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.ck-content h3, div#rest-pane.component div.component.note-split.type-text:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.ck-content h4, div#rest-pane.component div.component.note-split.type-text:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.ck-content h5');   
	//console.log("heading.length:",heading.length);
    if (heading.length==0){return
    }
	var mouseY = event.clientY; 
	var minh = 100000;
	var minhi = "";
	for (var i = 0; i < heading.length; i += 1) {
		var objY = parseInt(mouseY) - parseInt(heading[i].getBoundingClientRect().top);
		if (objY > 0 && objY < minh) {
			minh = objY;
			minhi = i;
		}
	}

var li = document.querySelectorAll("div.toc-widget span.toc li");
for (var i = 0; i < li.length; i += 1) {
	if (i != minhi) {
		li[i].style.setProperty("font-weight", 'normal');
	} else {
		li[i].style.setProperty("font-weight", 'bold');
	}

};
}
$(document)
	.ready(function() {
		function showToc() {
			var detail = document.querySelectorAll("div#rest-pane");

			if (detail.length == 1) {
				detail[0].addEventListener("mouseover", scrollFunc);
			} else {
				console.log("detail.length Error");
			}
			window.onmousewheel = document.onmousewheel = scrollFunc;
		}

		setTimeout(showToc, 500);
	});