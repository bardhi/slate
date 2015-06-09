(function (global) {
    'use strict';

    const TOC_GROUP_PREFIX = "toc-group-";
    const TOC_PREFIX_LENGTH = TOC_GROUP_PREFIX.length;

    var prevSelectedId = null;

    var closeToc = function () {
        $(".tocify-wrapper").removeClass('open');
        $("#nav-button").removeClass('open');
    };

    var makeToc = function () {
        global.toc = $('#toc').toc({
            'selectors': 'h1,h2', //elements to use as headings
            'itemClass': function (i, heading, $heading, prefix) { // custom function for item class
                var groupName = TOC_GROUP_PREFIX + heading.parentNode.id;
                var lowerTag = $heading[0].tagName.toLowerCase();
                var classes = groupName + " " + prefix + "-" + lowerTag;
                if (lowerTag == "h2") {
                    classes = classes + " hidden";
                }
                return classes;
            },
            'onHighlight': function (el) {
                var sectionId = getSectionId(el[0]);
                toggleTocView(sectionId);
                prevSelectedId = sectionId;
            }, //called when a new section is highlighted 

        });

        $(".toc-h1").click(function () {
            var sectionId = getSectionId(this);
            if (sectionId == null) {
                console.error("Could not get sectionId. Item is:");
                console.error(this);
            } else {
                if (prevSelectedId != sectionId) {
                    toggleTocView(sectionId);
                    //                        toggleSectionView(sectionId);
                    prevSelectedId = sectionId;
                }
            }
        });

        function getSectionId(listItem) {
            for (var i = 0; i < listItem.classList.length; i++) {
                var tocGroupName = listItem.classList[i];
                if (tocGroupName.indexOf(TOC_GROUP_PREFIX) == 0) {
                    return tocGroupName.substring(TOC_PREFIX_LENGTH);
                }
            }
        }

        function toggleTocView(sectionId) {
            if (prevSelectedId != null && prevSelectedId != sectionId) {
                findTocH2(prevSelectedId).addClass("hidden");
            }
            findTocH2(sectionId).removeClass("hidden");
        }

        //        function toggleSectionView(sectionId) {
        //            if (prevSelectedId != null) {
        //                $(".api-section#" + prevSelectedId).addClass("hidden");
        //            }
        //            $(".api-section#" + sectionId).toggleClass("hidden");
        //        }

        function findTocH2(sectionId) {
            return $(".toc-h2." + TOC_GROUP_PREFIX + sectionId);
        }

        $("#nav-button").click(function () {
            $(".tocify-wrapper").toggleClass('open');
            $("#nav-button").toggleClass('open');
            return false;
        });

        $(".page-wrapper").click(closeToc);
        $(".tocify-item").click(closeToc);
    };

    $(makeToc);

})(window);