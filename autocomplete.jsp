<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta th:remove="tag" th:include="common/common :: common"/>
    <meta th:remove="tag" th:include="common/home/home-public :: home"/>
    <script type="text/javascript">
        $(document).ready(function () {
            function formatItem(row) {
                // TODO:
                return row;
            }

            function selectItem(li) {
                window.location.href = "http://www.51lietou.com/home/search/" +
                        li.selectValue +
                        "/1/all/all/all/all/all/all/true/2%E5%91%A8%E5%86%85/all/all";
                return false;
            }

            $("#keyword").autocomplete("http://www.51lietou.com/home/searchKeyLike", {
                        delay: 10,
                        paramName: "key",
                        onItemSelect: selectItem,
                        formatItem: formatItem
                    }
            );
        });
    </script>
</head>

<body ch="/home/search">
<h5>Search</h5>

<div>
    <ul>
        <li><input type="text" name="keyword" id="keyword"/></li>
        <li><input type="submit" value="搜索"/></li>
    </ul>
</div>
</body>
</html>
