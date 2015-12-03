(function ($) {
    var autocomplete = function (input, options) {
        // Create jQuery object for input element
        var $input = $(input).attr("autocomplete", "off");

        // create results and add to body element
        var results = document.createElement("div"), $results = $(results);
        $results.hide().addClass(options.resultsClass).css("position", "absolute");
        if (options.width > 0) {
            $results.css("width", options.width);
        }
        $("body").append(results);

        //
        var timeout = null, prev = "", active = -1, hasFocus = false;
        $input
            .keydown(function (e) {
                switch (e.keyCode) {
                    case 38: // up
                        e.preventDefault();
                        moveSelect(-1);
                        break;
                    case 40: // down
                        e.preventDefault();
                        moveSelect(1);
                        break;
                    case 9:  // tab
                        break;
                    case 13: // enter
                        if (selectCurrent()) {
                            $input.get(0).blur();
                            e.preventDefault();
                        }
                        break;
                    default:
                        active = -1;
                        if (timeout) clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            onChange();
                        }, options.delay);
                        break;
                }
            })
            .focus(function () {
                hasFocus = true;
                var v = $.trim($input.val());
                if (v.length >= 1) {
                    requestData(v);
                }
            })
            .blur(function () {
                hasFocus = false;
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(hideResults, 200);
            })
            .bind("input", function () {
                // fix firefox chinese input
                onChange();
            });

        hideResults();

        function onChange() {
            var v = $.trim($input.val());
            if (v == prev) return;
            (prev = v).length >= 1 ? requestData(v) : hideResults();
        }

        function moveSelect(step) {
            var lis = $("li", results);
            if (!lis) return;

            //
            active += step;
            if (active < 0) {
                active = 0;
            } else if (active >= lis.size()) {
                active = lis.size() - 1;
            }

            //
            lis.removeClass("ac_over");
            $(lis[active]).addClass("ac_over");
            var li = $("li.ac_over", results)[0];
            $input.val($.trim(li.selectValue ? li.selectValue : li.innerHTML));
        }

        function selectCurrent() {
            var li = $("li.ac_over", results)[0];
            if (li) {
                selectItem(li);
                return true;
            } else {
                return false;
            }
        }

        function selectItem(li) {
            var v = $.trim(li.selectValue ? li.selectValue : li.innerHTML);
            prev = v;
            $results.html("");
            $input.val(v);
            hideResults();
            if (options.onItemSelect) {
                setTimeout(function () {
                    options.onItemSelect(li)
                }, 1);
            }
        }

        function showResults() {
            var pos = findPos(input), iWidth = options.width > 0 ? options.width : $input.width();
            $results.css({
                width: parseInt(iWidth) + "px",
                top: (pos.y + input.offsetHeight) + "px",
                left: pos.x + "px"
            }).show();
        }

        function hideResults() {
            if (timeout) clearTimeout(timeout);
            if ($results.is(":visible")) $results.hide();
        }

        function receiveData(data) {
            if (data) {
                results.innerHTML = "";
                if (!hasFocus || data.length == 0) return hideResults();
                results.appendChild(dataToDom(data));
                showResults();
            } else {
                hideResults();
            }
        }

        function dataToDom(data) {
            var ul = document.createElement("ul");
            for (var i = 0, num = data.length; i < num; i++) {
                var row = data[i];
                if (!row) continue;
                var li = document.createElement("li");
                li.innerHTML = options.formatItem ? options.formatItem(row, i, num) : row;
                li.selectValue = row;
                ul.appendChild(li);
                $(li).hover(
                    function () {
                        var lis = $("li", ul);
                        lis.removeClass("ac_over");
                        $(this).addClass("ac_over");
                        active = -1;
                        for (var i = 0, len = lis.length; i < len; i++) {
                            if (lis[i] == $(this).get(0)) {
                                active = i;
                                break;
                            }
                        }
                    },
                    function () {
                        $(this).removeClass("ac_over");
                    }
                ).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    selectItem(this);
                });
            }
            return ul;
        }

        function requestData(q) {
            if ((typeof options.url == "string") && (options.url.length > 0)) {
                var url = options.url + "?" + options.paramName + "=" + encodeURI(q);
                for (var i in options.extraParams) {
                    url += "&" + i + "=" + encodeURI(options.extraParams[i]);
                }
                $.get(url, function (data) {
                    receiveData(data);
                });
            }
        }

        function findPos(obj) {
            var curLeft = obj.offsetLeft || 0, curTop = obj.offsetTop || 0;
            while (obj = obj.offsetParent) {
                curLeft += obj.offsetLeft;
                curTop += obj.offsetTop;
            }
            return {x: curLeft, y: curTop};
        }
    };

    $.fn.autocomplete = function (url, options) {
        options = options || {};
        options.url = url;
        options.resultsClass = options.resultsClass || "ac_results";
        options.delay = options.delay || 400;
        options.paramName = options.paramName || "q";
        options.extraParams = options.extraParams || {};
        options.width = parseInt(options.width, 10) || 0;

        this.each(function () {
            new autocomplete(this, options);
        });

        // Don't break the chain
        return this;
    };
})(jQuery);