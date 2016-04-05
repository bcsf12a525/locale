function getTimeAgo(varDate) {
    if (varDate) {
        return $.timeago(varDate.toString().slice(-1) == 'Z' ? varDate : varDate + 'Z');
    }
    else {
        return '';
    }
}

// Model
function Post(data, hub) {
    //alert("Post");
    var a = $(this).data('id');
    var self = this;
    data = data || {};
    self.PostId = data.PostId;
    self.Message = ko.observable(data.Message || "");
    self.PostedBy = data.PostedBy || "";
    self.PostedByName = data.PostedByName || "";
    self.PostedByAvatar = data.PostedByAvatar || "";
    self.PostedDate = getTimeAgo(data.PostedDate);
    self.error = ko.observable();
    self.PostComments = ko.observableArray();
    self.NewComments = ko.observableArray();
    self.newCommentMessage = ko.observable();
    self.hub = hub;
    self.addComment = function (data, event) {
        // alert("AddComment");
        if (event.keyCode === 13) {
            var id = document.getElementById("id1");
            //alert(id);
            id = id.value;

            self.hub.server.addComment({ "PostId": self.PostId, "Message": self.newCommentMessage(), "CommentedBy": id }).done(function (comment) {
                self.PostComments.push(new Comment(comment));
                self.newCommentMessage('');
            }).fail(function (err) {
                self.error(err);
            });
        }
    }

    self.loadNewComments = function () {
        self.PostComments(self.PostComments().concat(self.NewComments()));
        self.NewComments([]);
    }
    self.toggleComment = function (item, event) {
        $(event.target).next().find('.publishComment').toggle();
    }


    if (data.PostComments) {
        var mappedPosts = $.map(data.PostComments, function (item) { return new Comment(item); });
        self.PostComments(mappedPosts);
    }

}



function Comment(data) {
    // alert("Comment");
    var self = this;
    data = data || {};

    // Persisted properties
    self.CommentId = data.CommentId;
    self.PostId = data.PostId;
    self.Message = ko.observable(data.Message || "");
    self.CommentedBy = data.CommentedBy || "";
    self.CommentedByAvatar = data.CommentedByAvatar || "";
    self.CommentedByName = data.CommentedByName || "";
    self.CommentedDate = getTimeAgo(data.CommentedDate);
    self.error = ko.observable();
}
function Group(data) {
    var self = this;
    data = data || {};

    self.Name
}


function myModel() {
    //alert("ViewModel123");
    var self = this;
    

    self.select1 = function () {
        //alert("sdf");

        bootbox.dialog({

            title: "This is a form in a modal.",
            message: '<div class="row">' + '<div class="col-md-12">' + '<form class="form-horizontal">' + '<div class="form-group">' + '<label class="col-md-4 control-label" for="name">Clas Name</label> ' + '<div class="col-md-4">' + '<input id="name" name="name" type="text" placeholder="Class name" class="form-control input-md"> ' + '<span class="help-block">Here goes your name</span></div> ' + '</div> ' + '<div class="form-group">' + '<label class="col-md-4 control-label" for="awesomeness">Privacy</label> ' + ' <div class="col-md-4"><div class="radio"><label for="awesomeness-0">' + '<input type="radio" name="privacy" id="awesomeness-0" value="Public" checked="checked"> ' + 'Public </label> ' + '</div><div class="radio"><label for="awesomeness-1">' +
                '<input type="radio" name="privacy" id="awesomeness-1" value="Private"> Private </label> ' + '</div> ' + '</div></div>' + '</form></div></div>',
            buttons: {
                success: {
                    label: "Save",
                    className: "btn-success",
                    callback: function () {

                        self.hub.server.addGroups().fail(function (err) {
                            self.error(err);
                        });

                        //alert("aaaaaa");
                        //var name = $('#name').val();
                        //var privacy = $("input[name='privacy']:checked").val()
                        //$.getJSON("/Home/Create_Group?Name=" + name + "&Privacy=" + privacy, function (data) {

                        //    if (data) {
                        //        window.location = "/Home/Index";

                        //    }
                        //    else {
                        //        alert("Username does not exist!!!")
                        //        $('#user').val("");
                        //        $('#pass').val("");
                        //        $("input[name='btn']").prop("checked", false);

                        //    }

                        //});
                    }
                }
            }
        });

    }

    self.posts = ko.observableArray();
    self.newMessage = ko.observable();
    self.error = ko.observable();

    //SignalR related
    self.newPosts = ko.observableArray();
    // Reference the proxy for the hub.  
    self.hub = $.connection.postHub;
    //alert("connection created");

    self.init = function (value) {
        //alert("init f");
    

            //alert("if");
            self.error(null);
            self.hub.server.getPosts(value).fail(function (err) {
                self.error(err);
            });

        
    }

    self.addPost = function () {
        self.error(null);
        //alert("here");
        var id = document.getElementById("id1");
        //alert(id);
        id = id.value;
        //alert(id);
        self.hub.server.addPost({ "Message": self.newMessage(), "PostedBy": id }).fail(function (err) {
            self.error(err);
        });
    }
    self.Func = function () {
        self.error(null);
        //alert("here");
        var user = GetURLParameter('id');
        //alert(user);
        var id = document.getElementById("id1");
        //alert(id);
        id = id.value;
        //alert(id);
        self.hub.server.addPost({ "Message": self.newMessage(), "PostedBy": id }).fail(function (err) {
            self.error(err);
        });
    }

    self.loadNewPosts = function () {
        self.posts(self.newPosts().concat(self.posts()));
        self.newPosts([]);
    }

    //functions called by the Hub
    self.hub.client.loadPosts = function (data) {
        var mappedPosts = $.map(data, function (item) {
            return new Post(item, self.hub);
        });
        self.posts(mappedPosts);
    }

    self.hub.client.addPost = function (post) {
        self.posts.splice(0, 0, new Post(post, self.hub));
        self.newMessage('');
    }

    self.hub.client.newPost = function (post) {
        alert("adf");
        self.newPosts.splice(0, 0, new Post(post, self.hub));
    }

    self.hub.client.error = function (err) {
        self.error(err);
    }

    self.hub.client.newComment = function (comment, postId) {
        //check in existing posts
        var posts = $.grep(self.posts(), function (item) {
            return item.PostId === postId;
        });
        if (posts.length > 0) {
            posts[0].NewComments.push(new Comment(comment));
        }
        else {
            //check in new posts (not displayed yet)
            posts = $.grep(self.newPosts(), function (item) {
                return item.PostId === postId;
            });
            if (posts.length > 0) {
                posts[0].NewComments.push(new Comment(comment));
            }
        }
    }
    return self;
};

//custom bindings
//textarea autosize
ko.bindingHandlers.jqAutoresize = {
    init: function (element, valueAccessor, aBA, vm) {
        if (!$(element).hasClass('msgTextArea')) {
            $(element).css('height', '1em');
        }
        $(element).autosize();
    }
};

var vmPost = new myModel();
//alert("hi");
ko.applyBindings(vmPost, window.document.getElementById("my-container"));
//alert("bye");
$.connection.hub.start().done(function () {
    var id = document.getElementById("frId");
    id = id.value;

    vmPost.init(id);
});
