// version: 0.2

function checkIn(obj) {
	var x = Number(window.event.clientX)
	var y = Number(window.event.clientY)

	var div_x = Number(obj.getBoundingClientRect()
		.left)
	var div_x_width = Number(
		obj.getBoundingClientRect()
		.left + obj.clientWidth
	)

	var div_y = Number(obj.getBoundingClientRect()
		.top)
	var div_y_height = Number(
		obj.getBoundingClientRect()
		.top + obj.clientHeight
	)

	if (x > div_x && x < div_x_width && y > div_y && y < div_y_height) {
		return true
	} else {
		return false
	}
}

var scrollFunc = function(event) {
	var detail = document.querySelectorAll("div#rest-pane.component div.component.note-split.type-text:not(.hidden-ext) div.component.scrolling-container div.note-detail.component ");
	if (detail.length != 0 && checkIn(detail[0]) == false) {
		return;
	}

	var heading = document.querySelectorAll('div#rest-pane.component div.component.note-split.type-text:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.ck-content h2, div#rest-pane.component div.component.note-split.type-text:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.ck-content h3, div#rest-pane.component div.component.note-split.type-text:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.ck-content h4, div#rest-pane.component div.component.note-split.type-text:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.ck-content h5, div#rest-pane.component div.component.note-split.type-text:not(.hidden-ext) div.component.scrolling-container div.note-detail.component div.ck-content h6');
	//console.log("heading.length:",heading.length);
	if (heading.length == 0) {
		return
	}
	var mouseY = event.clientY;
	var minh = 100000;
	var minhi = "";
	for (var i = 0; i < heading.length; i += 1) {
		var objY = parseInt(mouseY) - parseInt(heading[i].getBoundingClientRect()
			.top);
		if (objY > 0 && objY < minh) {
			minh = objY;
			minhi = i;
		}
	}

	var li = document.querySelectorAll("div.toc-widget span.toc li");
	for (var i = 0; i < li.length; i += 1) {
		if (i != minhi) {
			li[i].style.setProperty("color", '');
		} else {
			li[i].style.setProperty("color", '#dc413f');
			li[i].scrollIntoView({
				block: "center",
				behavior: "smooth"
			})

		}

	}


}
$(document)
	.ready(function() {
		function showToc() {
			var detail = document.querySelectorAll("div#rest-pane");
			if (detail.length == 1) {
				detail[0].addEventListener("mouseover", scrollFunc);
				detail[0].addEventListener("mousewheel", scrollFunc);
			} else {
				console.log("detail.length Error");
			}
		}

		setTimeout(showToc, 500);
	});