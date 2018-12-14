/* Steve jobs' book */
/* flag1 -> Height of the bookCover in px */
/* flag2 -> Height of the bookPages in px */
    

    // begining of Script !!!!!!!!!!!!!!!!!!!!!!!!
        
    function updateDepth(book, newPage, hardCoverWidth, pageWidth, pageDepthHalfWidth, pageHieght, hardCoverHeight) {

        // imagine a rectangeleer, width b = pageDepthHalfWidth. is height is made of 
        // 2 * (b + h) and is equal to the pageHieght

        // TODO: very good but try to fix this bug:
        // i've opened the book (from one side or another)
        // i'm using the slider to quicklly move to the middle of the book
        // i'm relising the slider and the pages start to turn
        // the problem is that even before the pages finished turning the depth appers
        // for 1 second it's not preaty
        // should see if there is an event for when turning the pages has ended
        
            var page = book.turn('page'),
                pages = book.turn('pages'),
                depthWidth = 16*Math.min(1, page * 2/pages); // original depthWidth = 16*Math.min(1, page*2/pages)
        
                newPage = newPage || page;
        
        
            if (newPage<pages-3 && newPage >= 3) {
                $('.sj-book .p111 .depth').css({
                    width: depthWidth,
                    right: 20 - depthWidth
                });
                var horizantalMove = -pageWidth   + ((newPage - 3) / pages) * pageDepthHalfWidth * 0.6; // why is there a factor of 0.6? well, because the depth image is not really the width of it, there is also shdow in the sides
                var absoulteValueHorizantalMove = ((newPage - 3)/ pages) * pageDepthHalfWidth * 0.6;
                var h = (pageHieght - 2 * pageDepthHalfWidth) / 2;
                var alfa = (absoulteValueHorizantalMove  + h + pageDepthHalfWidth) / (pageDepthHalfWidth + h);
                
                var frontAbsoulteValueHorizantalMove = -((newPage - (pages-3)) / pages) * pageDepthHalfWidth * 0.6;
                var frontAlfa = (frontAbsoulteValueHorizantalMove  + h + pageDepthHalfWidth) / (pageDepthHalfWidth + h);


                if (!isNaN(alfa)) {
                    halfDepthWidthBeforeTurn = alfa * pageDepthHalfWidth * 2;
                    depthHeightBeforeTurn = alfa * pageHieght * 1.019;
                    frontHalfDepthWidthBeforeTurn = frontAlfa * pageDepthHalfWidth * 2;
                    frontDepthHeightBeforeTurn = frontAlfa * pageHieght * 1.019;
                     $('.sj-book .back-side .roeyDepthBack').css("background-position", (-(absoulteValueHorizantalMove)-pageDepthHalfWidth)+"px");
                     $('.sj-book .back-side .roeyDepthBack').css("background-size", halfDepthWidthBeforeTurn+"px " + depthHeightBeforeTurn + "px");

                     $('.sj-book .front-side .roeyDepth').css("background-position", (frontAbsoulteValueHorizantalMove)+"px");
                     $('.sj-book .front-side .roeyDepth').css("background-size", frontHalfDepthWidthBeforeTurn+"px " + frontDepthHeightBeforeTurn + "px");

                }
               
            }
            else if (newPage < 3) {
                $('.sj-book .p111 .depth').css({width: 0});
                $('.sj-book .back-side .roeyDepthBack').css("background-position", (-pageDepthHalfWidth)+"px");
                $('.sj-book .back-side .roeyDepthBack').css("background-size", (pageDepthHalfWidth * 2)+"px " + (pageHieght * 1.019) + "px");

            }
            else if (newPage > pages-3){
                $('.sj-book .front-side .roeyDepth').css("background-position", 0+"px");
                $('.sj-book .front-side .roeyDepth').css("background-size", (pageDepthHalfWidth * 2)+"px " + (pageHieght * 1.019) + "px");

            }
                
        
        }
        
        function loadPage(page) {
        
            $.ajax({url: 'newPages/page' + page + '.html'}).
                done(function(pageHtml) {
                    $('.sj-book .p' + page).html(pageHtml.replace('samples/steve-jobs/', ''));
                });
        
        }
        
        function addPage(page, book, flagedHeight, flagedWidth) {
        
            var id, pages = book.turn('pages');
        
            if (!book.turn('hasPage', page)) {
        
                var element = $('<div />',
                    {'class': 'own-size',
                        css: {width: flagedWidth, height: flagedHeight}
                    }).
                    html('<div class="loader"></div>');
        
                if (book.turn('addPage', element, page)) {
                    loadPage(page);
                }
        
            }
        }
        
        function numberOfViews(book) {
        
            return book.turn('pages') / 2 + 1;
        
        }
        
        function getViewNumber(book, page) {
        
            return parseInt((page || book.turn('page'))/2 + 1, 10);
        
        }
        
        function zoomHandle(e) {
        
            if ($('.sj-book').data().zoomIn)
                zoomOut();
            else if (e.target && $(e.target).hasClass('zoom-this')) {
                zoomThis($(e.target));
            }
        
        }
        
        function zoomThis(pic) {
        
            var	position, translate,
                tmpContainer = $('<div />', {'class': 'zoom-pic'}),
                transitionEnd = $.cssTransitionEnd(),
                tmpPic = $('<img />'),
                zCenterX = $('#book-zoom').width()/2,
                zCenterY = $('#book-zoom').height()/2,
                bookPos = $('#book-zoom').offset(),
                picPos = {
                    left: pic.offset().left - bookPos.left,
                    top: pic.offset().top - bookPos.top
                },
                completeTransition = function() {
                    $('#book-zoom').unbind(transitionEnd);
        
                    if ($('.sj-book').data().zoomIn) {
                        tmpContainer.appendTo($('body'));
        
                        $('body').css({'overflow': 'hidden'});
                        
                        tmpPic.css({
                            margin: position.top + 'px ' + position.left+'px'
                        }).
                        appendTo(tmpContainer).
                        fadeOut(0).
                        fadeIn(500);
                    }
                };
        
                $('.sj-book').data().zoomIn = true;
        
                $('.sj-book').turn('disable', true);
        
                $(window).resize(zoomOut);
                
                tmpContainer.click(zoomOut);
        
                tmpPic.load(function() {
                    var realWidth = $(this)[0].width,
                        realHeight = $(this)[0].height,
                        zoomFactor = realWidth/pic.width(),
                        picPosition = {
                            top:  (picPos.top - zCenterY)*zoomFactor + zCenterY + bookPos.top,
                            left: (picPos.left - zCenterX)*zoomFactor + zCenterX + bookPos.left
                        };
        
        
                    position = {
                        top: ($(window).height()-realHeight)/2,
                        left: ($(window).width()-realWidth)/2
                    };
        
                    translate = {
                        top: position.top-picPosition.top,
                        left: position.left-picPosition.left
                    };
        
                    $('.samples .bar').css({visibility: 'hidden'});
                    $('#slider-bar').hide();
                    
                
                    $('#book-zoom').transform(
                        'translate('+translate.left+'px, '+translate.top+'px)' +
                        'scale('+zoomFactor+', '+zoomFactor+')');
        
                    if (transitionEnd)
                        $('#book-zoom').bind(transitionEnd, completeTransition);
                    else
                        setTimeout(completeTransition, 1000);
        
                });
        
                tmpPic.attr('src', pic.attr('src'));
        
        }
        
        function zoomOut() {
        
            var transitionEnd = $.cssTransitionEnd(),
                completeTransition = function(e) {
                    $('#book-zoom').unbind(transitionEnd);
                    $('.sj-book').turn('disable', false);
                    $('body').css({'overflow': 'auto'});
                    moveBar(false);
                };
        
            $('.sj-book').data().zoomIn = false;
        
            $(window).unbind('resize', zoomOut);
        
            moveBar(true);
        
            $('.zoom-pic').remove();
            $('#book-zoom').transform('scale(1, 1)');
            $('.samples .bar').css({visibility: 'visible'});
            $('#slider-bar').show();
        
            if (transitionEnd)
                $('#book-zoom').bind(transitionEnd, completeTransition);
            else
                setTimeout(completeTransition, 1000);
        }
        
        
        function moveBar(yes) {
            if (Modernizr && Modernizr.csstransforms) {
                $('#slider .ui-slider-handle').css({zIndex: yes ? -1 : 10000});
            }
        }
        
        function setPreview(view) {
        
            var previewWidth = 115,
                previewHeight = 73,
                previewSrc = 'pages/preview.jpg',
                preview = $(_thumbPreview.children(':first')),
                numPages = (view==1 || view==$('#slider').slider('option', 'max')) ? 1 : 2,
                width = (numPages==1) ? previewWidth/2 : previewWidth;
        
            _thumbPreview.
                addClass('no-transition').
                css({width: width + 15,
                    height: previewHeight + 15,
                    top: -previewHeight - 30,
                    left: ($($('#slider').children(':first')).width() - width - 15)/2
                });
        
            preview.css({
                width: width,
                height: previewHeight
            });
        
            if (preview.css('background-image')==='' ||
                preview.css('background-image')=='none') {
        
                preview.css({backgroundImage: 'url(' + previewSrc + ')'});
        
                setTimeout(function(){
                    _thumbPreview.removeClass('no-transition');
                }, 0);
        
            }
        
            preview.css({backgroundPosition:
                '0px -'+((view-1)*previewHeight)+'px'
            });
        }
        
        function isChrome() {
        
            // Chrome's unsolved bug
            // http://code.google.com/p/chromium/issues/detail?id=128488
        
            return navigator.userAgent.indexOf('Chrome')!=-1;
        
        }
       
    // End of Script!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

