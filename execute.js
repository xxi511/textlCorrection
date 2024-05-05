edit();

function edit() {
    // document.getElementById("e_switchercheck").click();
    let textArea = document.getElementsByName("message")[0];
    if (textArea) {
        let lines = articleSplit(textArea.value);
        let article = compose(lines);

        chrome.storage.local.get(["dic"], function(result) {
            let dic = result["dic"];
            if (dic === undefined || dic.length === 0) {
                alert("字庫是空的，請對icon點擊右鍵開啓option進行設定");
                return;
            }

            let newArticle = correct(dic, article);
            textArea.value = newArticle;
        });
    }
}

/**
 * split the content and trim then filter out empty line
 * @param {string} article the chapter content
 * @returns {string[]} lines
 */
function articleSplit(article) {
    let lines = article.split("\n");
    lines = lines.map(line => line.trim()).filter(lines => lines != "");
    return lines;
}

/**
 * compose lines back to an article with good format
 * @param {string[]} lines
 * @returns {string} article
 */
function compose(lines) {
    return lines
        .map((line, idx) => (idx === 0 ? line : `　　${line}`))
        .join("\n\n");
}

/**
 *
 * @param {string} dic a 2-D array to record word need to be replace. [[old, new]]
 * @param {string} article novel article
 * @returns {string} atricle corrected
 */
function correct(dic, article) {
    let arr = dic.split("\n").map(line => line.split(" "));
    let newArticle = article;
    arr.forEach(val => {
        if (val.length != 2) {
            return;
        }

        let oldStr = val[0];
        let newStr = val[1];
        if (newArticle.includes(oldStr)) {
            let _new = newStr === "!@#$%" ? "" : newStr;
            let _old = oldStr.replace(/\*/g, "\\*");
            newArticle = newArticle.replaceAll(_old, _new);
        }
    });
    return newArticle;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};
