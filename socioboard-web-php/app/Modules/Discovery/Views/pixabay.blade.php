@extends('User::dashboard.master')
@section('title')
    <title>SocioBoard | Discovery pixabay</title>
@endsection

@section('style')
    <style type="text/css">
        .video_pixabay {
            position: relative;
            display: block;
            width: 100%;
            padding: 0;
            overflow: hidden;
        }

        .video_pixabay::before {
            display: block;
            content: "";
        }

        .video_width_full {
            width: 100%;
        }

        .pixabay_title {
            font-size: 14px;
            font-weight: 600;
            line-height: 1.4;
            margin-bottom: 5px;
        }
    </style>
@endsection


@section('pixabay')
    <div class="row margin-top-10">
        <div class="col-md-12">
            <h4>pixabay</h4>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="card bg-light border-0 shadow">
                <div class="card-body">
                    <form class="form-inline mb-2" id="pixaForm">
                        <label class="sr-only" for="pixabay_search">Keyword</label>
                        <input type="text" class="form-control col-9 border-0 rounded-pill"  name="keyword" id="pixabay_search"
                               placeholder="keyword">
                        <div class="text-center col-3">
                            <button type="submit" class="btn btn-primary col-12 rounded-pill">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="card-columns mt-5" id="pixa">


    </div>

    <div class="d-flex justify-content-center" >
        <div class="spinner-border" role="status"  id="bootLoader" style="display: none;">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    @include('Discovery::incPostModal')
    @endsection


@section('script')


    <script>
        var val=[];
        var result=[];

        $(document).ready(function(){
            $(document).on('click','.resocio', function(){
                $('.clearimag').remove();
                $('.post-thumb').remove();
                var appenddata="";
                var msg ="";
                msg = $(this).closest('.card').find('.messageSocio').text();
                var image = $(this).closest('.card').find('img').attr('src');
                val = $(this).closest('.card').find('input').val();
                result = val.split(',')
                console.log("hdjshd=> ",result)
                $.each(result, function(key,value) {
                    if(value.indexOf(".jpg") >= 1){
                        appenddata += "<li class='clearimag' id='" +key +"'><img width='100px' height='100px' src='" + value + "' " +
                                "title='image' id='" +key +"' /><div  class='post-thumb'><div class='inner-post-thumb'><a href='javascript:void(0);'  class='remove-pic'><i class='fa fa-times' aria-hidden='true'></i></a><div></div></div>";
                    }else if(value.indexOf(".mp4") >= 1){
                        appenddata +=  "<li class='clearimag' id='" +key +"'><video width='100px' height='100px'  src='" + value + "'" +
                                " id='" +key +"' ></video><div id='" +key +"'  class='post-thumb'><div  class='inner-post-thumb'><a data-id='" + event.target.fileName + "' href='javascript:void(0);' class='remove-pic'><i class='fa fa-times' aria-hidden='true'></i></a><div></div></li>";
                    }else{
                        appenddata += "<li class='clearimag' id='" +key +"'><img width='100px' height='100px'  src='" + value + "'" +
                                "title='image' id='" +key +"' /><div  class='post-thumb'><div class='inner-post-thumb'><a href='javascript:void(0);'  class='remove-pic'><i class='fa fa-times' aria-hidden='true'></i></a><div></div></div>";
                    }

                });

                $('#media-list').prepend(appenddata);

//                        var gg  =$('#appendData').append(  '<div  class='post-thumb'><div class='inner-post-thumb'><a href='javascript:void(0);' data-id='" + event.target.fileName + "' class='remove-pic'><i class='fa fa-times' aria-hidden='true'></i></a><div></div>');
                $('#normal_post_area').data("emojioneArea").setText(msg);
                $('#reimage').attr('src',image);

                $('#postModal').modal('show');

//                    console.log('image===>',image);
            });
            $(document).on('click','.resociovideo', function(){
                var video = $(this).closest('.card').find('source').attr('src');
                val = $(this).closest('.card').find('input').val();
                $('#postModal').modal('show');
//                    console.log('video===>',video);
            });


            $('body').on('click', '.remove-pic', function () {
                $(this).parent().parent().parent().remove();
                var removeItem = $(this).attr('data-id');
                var yet = names.indexOf(removeItem);
                if (yet != -1) {
                    names.splice(yet, 1);
                }
                // return array of file name
                console.log(names);
            });
            $('#hint_brand').on('hide', function (e) {
                names = [];
                z = 0;
            });
        })

        function post(postStatus){

//        var btn = $(this);
//        $(btn).buttonLoader('start');
            var form = document.getElementById('publishForm');

            var formData = new FormData(form);

            var selected = [];
            $('#checkboxes input:checked').each(function() {
                selected.push($(this).attr('name'));
            });
            formData.append('checked',selected);
            formData.append('imagevideos',result);
            formData.append('postStatus',postStatus);

            $.ajax({
                url: "/publish-data-discovery",
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                type: 'POST',
                beforeSend:function(){
                    $('#messageError').text("");

                    if(postStatus == 1){
                        $('#test').show();
                        $('#testText').html('Uploading');
                    }else if(postStatus == 0){
                        $('#draftspinstyle').show();
                        $('#draftspin').html('Uploading');
                    }
                },
                success: function (response) {
                    console.log(response);

                    $('#test').hide();
                    $('#testText').html('Post');

                    console.log(response);
//                document.getElementById("publishForm").reset();
                    $('#publishForm').trigger("reset");
                    $(".emojionearea-editor").text("");
                    $("#hint_brand").css("display","none");
//                    $("#option_upload").css("display","block");
                    $("#test").attr("disabled", true);
                    if(response.code == 404){
                        console.log(response.message)
                        $('#messageError').text(response.message);
                    }else if(response.code == 400){
                        swal(response.message);
                    }else if(response.code == 200){
                        if(response.errors.length != 0){
                            $.each(response.errors, function(key,value) {
                                $.toaster({ priority : 'warning', title : 'Could not publish on account', message : ' '+value.firstName+' '+value.error[0].message});
                            });
                        }
                        swal(response.message);
                        document.getElementById("publishForm").reset();
                        $('#postModal').modal('hide');
                    }else if(response.code == 500){
                        console.log(response.message);

                        swal("Something went wrong... Please try again after sometime")
                        $('#postModal').modal('hide');

                    }
                },
                error:function(error){
                    console.log(error)
                }
            })
        }



    </script>
    <script>
        var data = "a";
        var pageId1 = 1;
        var action = "inactive"
        // normal post emoji
        $("#normal_post_area").emojioneArea({
            pickerPosition: "right",
            tonesStyle: "bullet"
        });
        if(action=='inactive')
        {
            action ="active";

            getPixa(data, pageId1,0);
        }

        // all social list div open
        $('.all_social_div').css({
            'display': 'none'
        });
        $('.all_social_btn').click(function () {
            $('.all_social_div').css({
                'display': 'block'
            });
            $('.all_social_btn').css({
                'display': 'none'
            });
        });



        function getPixa(keyword,pageId,search){
            var pixData = "";
            $.ajax({
                url: "/getPixabay",
                type: 'POST',
                data: {
                    keyword:keyword,
                    pageId: pageId
                },
                beforeSend:function(){
                    $("#bootLoader").css("display","block");
                    if(search == 1) {
                        $("#pixa").children().remove();
                    }

                },
                success: function (response) {

                    if(response.code == 200){
                        console.log(response);
                        pageId1 += 1;
                        console.log("inc after succ ================"+pageId1);
                        $("#bootLoader").css("display","none");
                        if(response.pixaDetails.length == 0){
                            action = "active";
                        }else{
                            action = "inactive";
                        }
                        $.each(response.pixaDetails, function(key,value) {
//                                return 1;
                            if(value.mediaUrl[0] != undefined && value.mediaUrl[0] != ""){

                                var str = value.mediaUrl[0]
                                if (str.indexOf(".jpg") >= 1) {
                                    pixData += ' <div class="card bg-dark text-white border-0 shadow"><input class="multiImages" value='+ value.mediaUrl +' style="display: none">' +
                                            ' <img src="'+ value.mediaUrl + '" class="card-img-top" alt="sample"> <div class="card-body p-2"> <h5 class="card-title pixabay_title messageSocio">'+ value.title +'</h5> <p class="card-text"> <a href="javascript:void(0);" class="text-white float-right resocio"> <span data-toggle="tooltip" data-placement="top" title="Using re-socio you can share this post with your own content."> <i class="fas fa-retweet text-primary"></i> re-socio </span> </a> </p> </div> </div>'
                                } else if (str.indexOf(".mp4") >= 1) {
                                    pixData += ' <div class="card bg-dark text-white border-0 shadow"> <input class="multiImages" value='+ value.mediaUrl +' style="display: none">' +
                                            '<div class="video_pixabay"> <video poster="//ak0.picdn.net/shutterstock/videos/31538110/thumb/4.jpg" muted="muted" autoplay="autoplay" loop="loop" class="video_width_full"> <source src="'+ value.mediaUrl+'" type="video/mp4"> </video> </div> <div class="card-body p-2"> <h5 class="card-title pixabay_title messageSocio">' + value.title + '</h5> <p class="card-text"> <a href="javascript:void(0);" class="text-white float-right resocio"> <span data-toggle="tooltip" data-placement="top" title="Using re-socio you can share this post with your own content."> <i class="fas fa-retweet text-primary"></i> re-socio </span> </a> </p> </div> </div>'
                                } else{
                                    pixData += ' <div class="card bg-dark text-white border-0 shadow"> <input class="multiImages" value='+ value.mediaUrl +' style="display: none">' +
                                            ' <img src="'+ value.mediaUrl + '" class="card-img-top" alt="sample"> <div class="card-body p-2"> <h5 class="card-title pixabay_title messageSocio">'+ value.title +'</h5> <p class="card-text"> <a href="javascript:void(0);" class="text-white float-right resocio"> <span data-toggle="tooltip" data-placement="top" title="Using re-socio you can share this post with your own content."> <i class="fas fa-retweet text-primary"></i> re-socio </span> </a> </p> </div> </div>'
                                }
                            }


                        });

                        $("#pixa").append(pixData);

                    }else if(response.code == 400 || response.code == 500){
                        console.log(response.message)
                    }
                },
                error:function(error){
                    console.log(error)
//                    $('#error').text("Something went wrong.. Not able to create team");
                }
            });
        }

        $(document).ready(function(){

            $(document).on('submit','#pixaForm',function(e){
                e.preventDefault();
                pageId1 = 1
                 data = $('#pixabay_search').val();
                getPixa(data,pageId1,1);
            });

        });
        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() >= $("#pixa").height() && action == 'inactive') {
//                    $('#load_popular_message').html("<button class='btn btn-primary' id='load-popular-button'>Click to get more coupons</button>");
                action = 'active';

                setTimeout(function () {
                    getPixa(data, pageId1,0);
                }, 1000);
            }
        });

    </script>

@endsection
