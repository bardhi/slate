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
        
        updateHeaderIds();

        function updateHeaderIds() {
            var headers = $( ":header" );
            var lastH1 = null;
            for (var i = 0; i < headers.length; i++) {
                var h = headers[i];
                if (h.tagName == "H1") {
                    lastH1 = h.id;
                } else {
                    if (lastH1 != null) {
                        h.id = createId(lastH1, h.id);
                    }
                }
            }
        }
        
        function createId(apiName, methodName) {
            return apiName + "_" + methodName;
        }
        
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
            'anchorName': function (i, heading, prefix) { //custom function for anchor name
                return heading.id;
            },
            'onHighlight': function (el) {
                var sectionId = getSectionId(el[0]);
                updateLocationHash(el);
                toggleTocView(sectionId);
                prevSelectedId = sectionId;
            }, //called when a new section is highlighted 

        });

        function updateLocationHash(el) {
            var liNode = el[0];
            var aNode = liNode.childNodes[0];
            var hash = aNode.hash.substring(1);
            if (window.location.hash != hash) {
                window.location.hash = "_" + hash;
            }
        }

        function getHash(sectionId) {
            return sectionId;
        }

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

        function findTocH2(sectionId) {
            return $(".toc-h2." + TOC_GROUP_PREFIX + sectionId);
        }

        $("#nav-button").click(function () {
            $(".tocify-wrapper").toggleClass('open');
            $("#nav-button").toggleClass('open');
            return false;
        });

        $(".page-wrapper").click(closeToc);

        scrollToAnchor();

        function scrollToAnchor() {
            var hash = window.location.hash;
            if (hash != null && hash.indexOf("#_") == 0) {
                var realHash = hash.substring(2);
                window.location.hash = realHash;
            }
        }
    };

    $(makeToc);

})(window);