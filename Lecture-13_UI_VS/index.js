const $ = require("jquery");
const path = require("path");
const fs = require("fs");
let myMonaco;
require("jstree");
$(document).ready(async function () {


    let editor = await createEditor();
    // console.log(editor);
    let pPath = process.cwd();
    let name = path.basename(pPath);
    let data = [{
        id: pPath,
        parent: "#",
        text: name
    }]

    let childArr = addCh(pPath);
    data = [...data, ...childArr];

    $("#tree").jstree({
        "core": {
            "check_callback": true,
            "data": data
        },
    }).on("open_node.jstree", function (e, onClickdata) {
        console.log(onClickdata);
        // if (data.node.children.length > 0) {
        //     createGC(data.node.children)
        //     return;
        // }
        // let nPath = data.node.id;
        // let arr = addChnGc(nPath);
        // for (let i = 0; i < arr.length; i++) {
        //     $("#tree").jstree().create_node(nPath, arr[i], "last");
        // }
        let children = onClickdata.node.children;
        for (let i = 0; i < children.length; i++) {
            let gcArr = addCh(children[i]);
            for (let j = 0; j < gcArr.length; j++) {
                let doesExist = $('#tree').jstree(true)
                    .get_node(gcArr[j].id);
                if (doesExist) {
                    return;
                }
                // create logic
                $("#tree").jstree().create_node(children[i], gcArr[j], "last");
            }
        }
    }).on("select_node.jstree", function (e, dataObj) {
        let fPath = dataObj.node.id;
        let isFile = fs.lstatSync(fPath).isFile();
        if (isFile) {
            let content = fs.readFileSync(fPath, "utf-8");
            // console.log(content);
            editor.getModel().setValue(content);
            var model = editor.getModel(); // we'll create a model for you if the editor created from string value.
            let ext = fPath.split(".").pop();
            if (ext == "js") {
                ext = "javascript";
            }
        
            myMonaco.editor.setModelLanguage(model, ext);

        }
    })
})
// { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" }
function addCh(parentPath) {
    let isDir = fs.lstatSync(parentPath).isDirectory();
    if (isDir == false) {
        return [];
    }
    let childrens = fs.readdirSync(parentPath);
    let cdata = [];
    for (let i = 0; i < childrens.length; i++) {
        let cPath = path.join(parentPath, childrens[i]);
        // let isDir = fs.lstatSync(cPath).isDirectory();
        // if (isDir) {
        //     let gc = fs.readdirSync(cPath);
        //     for (let j = 0; j < gc.length; j++) {
        //         let gcPath = path.join(cPath, gc[j])
        //         let gcObj = {
        //             id: gcPath,
        //             parent: cPath,
        //             text: gc[j]
        //         }
        //         cdata.push(gcObj);
        //     }
        // }
        let obj = {
            id: cPath,
            parent: parentPath,
            text: childrens[i]
        };
        cdata.push(obj);
    }
    return cdata;
}

function createEditor() {
    const amdLoader = require('./node_modules/monaco-editor/min/vs/loader.js');
    const amdRequire = amdLoader.require;
    const amdDefine = amdLoader.require.define;
    amdRequire.config({
        baseUrl: './node_modules/monaco-editor/min'
    });
    // workaround monaco-css not understanding the environment
    self.module = undefined;
    return new Promise(function (resolve, reject) {
        amdRequire(['vs/editor/editor.main'], function () {
            var editor = monaco.editor.create(document.getElementById('editor'), {
                value: [
                    'function x() {',
                    '\tconsole.log("Hello world!");',
                    '}'
                ].join('\n'),
                language: 'javascript'
            });
            myMonaco = monaco;
            resolve(editor);
        });
    })


}
