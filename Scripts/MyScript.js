$document.ready( function jj() {

    $('#fileupload').fileupload({
        dataType: 'json',
        url: 'UploadFiles',
        autoUpload: true,
        done: function (e, data) {
            alert("ssss");
            $('.file_name').html(data.result.name);
            $('.file_type').html(data.result.type);
            $('.file_size').html(data.result.size);
        }
    });

});

$document.ready( $('#pst').click(function (e) {
    e.preventDefault();
    var status = document.getElementById("status").value;
    alert("OOOOOOO");
    if (status == "") {
        return;
    }
    var today = new Date();

    h = today.getHours();
    if (h < 10) {
        h = "0" + h;
    }
    else if (h > 12) {
        h = h - 12;
    }
    m = today.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }
    var id = null;
    var a = $(this).data('id');
    $.getJSON("/Home/Update_Status?status=" + status, function (data) {

        if (data) {

            id = data;

            alert(id);
            var chk = '<div id=' + id + ' ><div class="user-block"> <img class="img-circle img-bordered-sm" src="/Images/' + a + '" alt="user image"><span class="username"><a href="#">Jonathan Burke Jr.</a><a href="#" class="pull-right btn-box-tool"><i class="fa fa-times"></i></a></span><span class="description">Shared publicly - ' + h + ':' + m + ' today</span>';
            chk = chk + "</div><p >" + status + "</p></div>";
            chk = chk + '<ul class="list-inline">';
            chk = chk + '<li><a href="#" class="link-black text-sm"><i class="fa fa-share margin-r-5"></i> Share</a></li>';
            chk = chk + '<li><a href="#" class="link-black text-sm"><i class="fa fa-thumbs-o-up margin-r-5"></i> Like</a></li>';
            chk = chk + '<li class="pull-right"><a href="#" class="link-black text-sm"><i class="fa fa-comments-o margin-r-5"></i> Comments (5)</a></li></ul>';
            chk = chk + '<div id="' + id + '"><input class="form-control input-sm" onKeyDown="key()" id="bttn" type="text" placeholder="Type a comment"></div></div>';
            $("#post1").prepend(chk);
            $("#status").val("");
            $("button").closest("div").attr("id");
            alert("OOOOOOO");
        }
        else {




        }

    });









}));
function key() {
    document.getElementById('bttn').onkeydown = function (event) {
        if (event.keyCode == 13) {
            $("bttn").closest("div").attr("id");
        }
    }
}