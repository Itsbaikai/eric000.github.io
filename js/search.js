function searchFunc(path, searchId, contentId) {
    'use strict';
    $.ajax({
        url: path,
        dataType: 'xml',
        success: function (xmlResponse) {
            // 数据处理
            var datas = $("entry", xmlResponse).map(function () {
                return {
                    title: $("title", this).text(),
                    content: $("content", this).text(),
                    url: $("url", this).text()
                };
            }).get();

            var $input = document.getElementById(searchId);
            var $resultContent = document.getElementById(contentId);
            var $resultList = document.getElementById('search-results-list');
            var $prevPage = document.getElementById('prev-page');
            var $nextPage = document.getElementById('next-page');
            var $searchContainer = document.getElementById('search-container');
            var $form = document.getElementById('search-form');

            $form.addEventListener('submit', function (event) {
                event.preventDefault();
                performSearch();
            });

            $input.addEventListener('input', function () {
                performSearch();
            });

            function performSearch() {
                var str = '';
                var keywords = $input.value.trim().toLowerCase().split(/\s+/);
                $resultContent.innerHTML = '<ul class="search-result-list"></ul>';
                var resultList = $resultContent.firstChild;

                if ($input.value.trim().length <= 0) {
                    return;
                }

                // 搜索功能
                var count = 0;
                datas.forEach(function (data) {
                    var isMatch = true;
                    var content_index = [];
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
                    var data_url = data.url;
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    if (data_title !== '') {
                        keywords.forEach(function (keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);

                            if (index_title < 0 && index_content < 0) {
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i === 0) {
                                    first_occur = index_content;
                                }
                            }
                        });
                    }

                    // 匹配成功
                    if (isMatch) {
                        str += "<li><a href='" + data_url + "' class='search-result-title'>" + data_title + "</a>";
                        var content = data.content.trim().replace(/<[^>]+>/g, "");
                        if (first_occur >= 0) {
                            var start = first_occur - 20;
                            var end = first_occur + 80;
                            if (start < 0) {
                                start = 0;
                            }
                            if (start === 0) {
                                end = 100;
                            }
                            if (end > content.length) {
                                end = content.length;
                            }
                            var match_content = content.substr(start, end);
                            keywords.forEach(function (keyword) {
                                var regS = new RegExp(keyword, "gi");
                                match_content = match_content.replace(regS, "<span class='search-keyword'>" + keyword + "</span>");
                            });

                            str += "<p class='search-result'>" + match_content + "...</p>"
                        }
                        str += "</li>";
                        count++;
                    }
                });

                resultList.innerHTML = str;
                paginateResults(resultList);

                // 将搜索框移到左上角
                $searchContainer.classList.add('search-fixed');
            }

            function paginateResults(resultList) {
                var items = $(resultList).find('li');
                var numItems = items.length;
                var perPage = 10;
                var currentPage = 0;

                items.slice(perPage).hide();

                if (numItems > perPage) {
                    $nextPage.disabled = false;
                }

                $prevPage.onclick = function () {
                    if (currentPage > 0) {
                        currentPage--;
                        var start = currentPage * perPage;
                        items.hide().slice(start, start + perPage).show();

                        $nextPage.disabled = false;
                        if (currentPage === 0) {
                            $prevPage.disabled = true;
                        }
                    }
                };

                $nextPage.onclick = function () {
                    if ((currentPage + 1) * perPage < numItems) {
                        currentPage++;
                        var start = currentPage * perPage;
                        items.hide().slice(start, start + perPage).show();

                        $prevPage.disabled = false;
                        if ((currentPage + 1) * perPage >= numItems) {
                            $nextPage.disabled = true;
                        }
                    }
                };
            }
        }
    });
}
