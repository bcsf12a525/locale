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
    self.addComment = function (data,event) {
        // alert("AddComment");
        if (event.keyCode === 13 ) {
            var id = document.getElementById("id1");
            //alert(id);
            id = id.value;

            self.hub.server.addComment({ "PostId": self.PostId, "Message": self.newCommentMessage(),"CommentedBy":id }).done(function (comment) {
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
function Group(data)
{
    var self = this;
    data = data || {};
    self.Name = data.Name;
    self.Privacy = data.Privacy;
    self.User_Id = data.User_Id;
    self.Url = data.Url;
    

    
}
function Members(data)
{
    var self = this;
    data = data || {};
    self.Name = data.Name;
    self.Image = data.Image;
    self.Date = data.Date;
    self.Url = data.Url;
}

function myModel() {
    //alert("ViewModel123");
    var self = this;
    //var id = document.getElementById("id1");
    //id = id.value;

    

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
                        var name = $('#name').val();
                        var privacy = $("input[name='privacy']:checked").val()

                        self.hub.server.addGroups({ "Name": name, "Privacy": privacy, "User_Id":id }).fail(function (err) {
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
    self.members = ko.observableArray();
    self.groups = ko.observableArray();
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
        if (1) {

            //alert("if");
            self.error(null);
            self.hub.server.getGroupPosts(value).fail(function (err) {
                self.error(err);
            });
             self.hub.server.getGroupMembers(value).fail(function (err) {
                self.error(err);
            });
            //self.hub.server.getGroups(id).fail(function (err) {
            //    self.error(err);
            //});

        }
        else
        {
            //alert("else");
            self.error(null);
            self.hub.server.getMyPosts(value).fail(function (err) {
                self.error(err);
            });
        }
    }

    self.addPost = function () {
        self.error(null);
        //alert("here");
        var id = document.getElementById("id1");
        ////alert(id);
        id = id.value;
        //alert(id);

        var id1 = document.getElementById("Gid");
        id1 = id1.value;
        //alert(id1);
       // alert("there");
        var msg = document.getElementById("txtMessage");
        msg = msg.value;
        //alert(msg);
        self.hub.server.addGroupPost({ "Message": msg, "PostedBy":id },id1).fail(function (err) {
            self.error(err);
            $('#txtMessage').val("");
        });
    }
    self.Func = function () {
        self.error(null);
        //alert("here");
        var user = GetURLParameter('id');
        alert(user);
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
        var mappedPosts = $.map(data, function (item)
        {
            return new Post(item, self.hub);
        });
        self.posts(mappedPosts);
    }
    self.hub.client.loadGroupMembers = function (data) {
        alert("here");
        var memb = $.map(data, function (item) {

            return new Members(item, self.hub);
        });
        self.members(memb);
    }
    self.hub.client.loadGroups = function (data) {
        var mappedPosts = $.map(data, function (item) {
            return new Group(item, self.hub);
        });
        self.groups(mappedPosts);
    }

    self.hub.client.addPost = function (post) {
        self.posts.splice(0, 0, new Post(post, self.hub));
        self.newMessage('');
    }
    self.hub.client.addGroup = function (group) {
        self.groups.splice(0, 0, new Group(group, self.hub));
        
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
    var id = document.getElementById("Gid");
    id = id.value;
    //alert(id);
    vmPost.init(id);
});
