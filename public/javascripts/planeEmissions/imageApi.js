var keyword = document.getElementById("planeTitle").textContent;
console.log(keyword);
if (keyword === " ") {
    keyword = "404 error";
}
console.log(keyword);
$(document).ready(function () {
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
            tags: keyword,
            tagmode: "any",
            format: "json"
        },
        function (data) {
            var image_src = data.items[0]['media']['m'].replace("_m", "_b");
            console.log("image_src");
            $('.planePicture').css('background-image', "url('" + image_src + "')");
            $('.planePicture').css('background-repeat', "no-repeat");
            $('.planePicture').css('background-size', "100% 100%");
        });

});
