function isActive(pathname) {
    let rootPath = window.location.pathname
    let path = pathname + "/"
    return pathname === rootPath || path === rootPath;
}

let links = document.querySelectorAll(".nav-link");
for (let link of links) {
    let linkPath = link.getAttribute("href");

    if (isActive(linkPath)) {
        link.className = "active-link nav-link";
    }
}

let mlinks = document.querySelectorAll(".mobile-nav-link");
for (let mlink of mlinks) {
    let mlinkPath = mlink.getAttribute("href");
    if (isActive(mlinkPath)) {
        mlink.className = "moibile-active-link mobile-nav-link";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    var mmenu = document.getElementById("mobile-menu");
    var mmain = document.getElementById("mobile-main");
    var mclose = document.getElementById("mobile-close");
    let change = document.getElementById("theme-change-btn");

    if (!mmenu || !mmain || !mclose || !change) {
        console.error("One or more required elements are not found.");
        return;
    }

    // 设置菜单点击效果
    mmenu.onclick = function () {
        mmain.style.display = "block";
    }

    mclose.onclick = function () {
        mmain.style.display = "none";
    }

    // 定义主题列表
    let changeList = [
        {
            text: "白昼",
            code: "day"
        },
        {
            text: "午夜",
            code: "night"
        },
        {
            text: "饼干",
            code: "cookie"
        }
    ];

    // 初始化当前主题索引
    var currentIndex = 0;

    // 设置主题切换按钮点击事件处理函数
    change.onclick = function () {
        console.log("You clicked change theme button and currentIndex = " + currentIndex);

        // 更新当前主题索引
        currentIndex = (currentIndex + 1) % changeList.length;

        // 更新按钮显示文本和页面主题类名
        this.innerHTML = changeList[currentIndex].text;
        document.body.className = changeList[currentIndex].code;

        // 将当前主题代码存入 localStorage 中
        localStorage.setItem('hexo-white-theme-mode', changeList[currentIndex].code);
    };

    // 初始化主题按钮显示文本、页面主题类名和 localStorage 中存储的主题代码
    let beginCode = localStorage.getItem('hexo-white-theme-mode') || "cookie"; // 默认主题为 "cookie"
    let tmpElement = changeList.find(item => item.code === beginCode); // 查找 localStorage 中存储的主题在主题列表中的对应项
    if (tmpElement) {
        change.innerHTML = tmpElement.text; // 设置切换按钮显示文本
        currentIndex = changeList.indexOf(tmpElement); // 更新当前主题索引
        document.body.className = tmpElement.code; // 设置页面主题类名
    } else {
        // 如果 localStorage 中的主题无效，则使用默认主题
        change.innerHTML = changeList[currentIndex].text; // 设置按钮文本
        document.body.className = changeList[currentIndex].code; // 设置页面主题类名
    }
    localStorage.setItem('hexo-white-theme-mode', document.body.className); // 更新 localStorage 中的主题代码
});


///////////////////////////////////////////////////////////////////////////////////

//设置sort的子目录隐藏显示效果
if (document.getElementById("sort")) {
    var sort = document.getElementById("sort");
    var sortdiv = document.getElementById("sort-div");

    sort.onmouseover = function () {
        sortdiv.style.display = "block";
    }
    sort.onmouseout = function () {
        sortdiv.onmouseover = function () {
            console.log("wuhu");
        }
        sortdiv.onmouseout = function () {
            sortdiv.style.display = "none";
        }
    }
}

// 图片懒加载
var imgs = document.querySelectorAll('img.lazyload-img');
var imgdivs = document.querySelectorAll('.lazyload-img-span');


// 用来判断bound.top<=clientHeight的函数，返回一个bool值
function isIn(el) {
    var bound = el.getBoundingClientRect();
    var clientHeight = window.innerHeight;
    return bound.top <= clientHeight;
}

// 检查图片是否在可视区内，如果在，则加载
function check() {
    for (let p = 0; p < imgs.length; p++) {
        if (isIn(imgs[p])) {
            loadImg(imgs[p]);
            imgs[p].onload = function () {
                let y = Number(p);
                changeClass(y);
            }
        }
    }
}

function changeClass(num) {
    console.log("changeClass(num) num = "+num)
    let tempse = Number(num);
    imgdivs[tempse].className = "lazyload-img-span img-masks";
}

function loadImg(el) {
    console.log("loadImg el.dataset.src = "+el.dataset.src)
    if (!el.src) {
        el.src = el.dataset.src;
    }
}

// onscroll()在滚动条滚动的时候触发
window.onload = window.onscroll = function () {
    check();
}