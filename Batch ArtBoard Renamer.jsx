/**
 * @@@BUILDINFO@@@ Batch-ArtBoard-Renamer.jsx 1.0.0 Jan 09 2025 12:34:56 GMT+0000
 */
/*
<javascriptresource>
<about>$$$/JavaScripts/BatchArtBoardRenamer/About=Batch ArtBoard Renamer - By Abdul Karim Mia.^r^rCopyright 2025 Abdul Karim Mia.^r^rBatch renaming of Illustrator artboards with options for prefix, suffix, and auto-numbering in different formats.^r</about>
<category>Abdul's Scripts</category>
</javascriptresource>

Batch-ArtBoard-Renamer
This Adobe Illustrator script automates the renaming of artboards in a document in batch with customizable options for prefix, suffix, and auto-numbering.

Date: Jan 09 2025
Author: Abdul Karim Mia
Mail: akmia51@gmail.com
Website: [https://www.abdulkarimmia.com/]
GitHub: [https://github.com/abdul-karim-mia]

Release Notes:
- 1.0.0: Initial version
  - Provides an interface to rename artboards in batch.
  - Options for prefix, suffix, and numbering formats (1, 2, 3... or 01, 02, 03... or 001, 002, 003...).
  - Preview feature to visualize changes before applying.
  - Tested on Illustrator CC 2015 to CC 2024.

How to Use:
1. Open the script in Adobe Illustrator.
2. Launch the "Batch ArtBoard Renamer" dialog.
3. Select the artboards you wish to rename or choose to rename all.
4. Set the desired prefix, suffix, and numbering format.
5. Optionally, use the preview feature to see how artboard names will change.
6. Click "OK" to apply the changes.

Features:
- Prefix: Add a custom prefix to the artboard name.
- Suffix: Add a custom suffix to the artboard name.
- Numbering Format: Choose from 3 formats:
  - 1, 2, 3, 4, ...
  - 01, 02, 03, 04, ...
  - 001, 002, 003, 004, ...
- Auto-numbering: The script automatically numbers artboards sequentially.
- Preview: A preview option allows you to see changes before applying.

Note: Ensure that Adobe Illustrator is running before executing the script.

Feel free to contribute, report issues, or suggest enhancements! Happy renaming!

Donate (optional):
If you find this script helpful, you can support the author:
- via PayPal: [https://paypal.me/akmia51]

NOTICE:
This script is provided "as is" without warranty of any kind.
Free to use, not for sale.
Released under the GNU General Public License (GPL).
https://opensource.org/licenses/gpl-license

Check other scripts by the author:
[https://github.com/abdul-karim-mia]
*/


// ARTBOARDRENAMER
// ===============
var artboardRenamer = new Window("dialog");
artboardRenamer.text = "Batch ArtBoard Renamer";
artboardRenamer.orientation = "column";
artboardRenamer.alignChildren = ["left", "top"];
artboardRenamer.spacing = 15;
artboardRenamer.margins = 15;

// PLCG
// ====
var plcG = artboardRenamer.add("group", undefined, { name: "plcG" });
plcG.orientation = "row";
plcG.alignChildren = ["left", "center"];
plcG.spacing = 10;
plcG.margins = [18, 0, 0, 0];

var chkAllPre = plcG.add("checkbox", undefined, undefined, { name: "prefix" });
chkAllPre.text = "Prefix";
chkAllPre.preferredSize.width = 68;

var artNmT = plcG.add("statictext", undefined, undefined, { name: "artNmT" });
artNmT.text = "Artboard Name";

var tabList = artboardRenamer.add('group');
tabList.orientation = 'column';
// SCROLLWIN
// =========
var scrollWin = tabList.add('group');
scrollWin.alignChildren = 'fill';
var pageListPanel = scrollWin.add('panel');
pageListPanel.alignChildren = 'left';


var doc = app.activeDocument;
var doards = doc.artboards;
var allItms = [];
if (doards.length <= 10) { // Without scroll
    for (var i = 0; i < doards.length; i++) {
        rowItem = pageListPanel.add('group');
        rowItem.margins = [3, 0, 0, 0];
        addNewRow(i, rowItem);
    }
} else { // With scroll
    pageListPanel.maximumSize.height = 350;
    var smallList = pageListPanel.add('group');
    smallList.orientation = 'column';
    smallList.alignment = 'left';
    smallList.maximumSize.height = doards.length * 40;

    var scroll = scrollWin.add('scrollbar');
    scroll.stepdelta = 30;
    scroll.preferredSize.width = 16;
    scroll.maximumSize.height = pageListPanel.maximumSize.height;
    for (var i = 0; i < doards.length; i++) {
        rowItem = smallList.add('group');
        rowItem.alignChildren = ["left", "center"];
        addNewRow(i, rowItem);
    }
    scroll.maxvalue = (doards.length * 31);
    scroll.onChanging = function () {
        smallList.location.y = -1 * this.value;
    }
}


function addNewRow(ind, addTo) {
    var obj = {
        artinCb: addTo.add("checkbox", undefined, undefined, { name: "artinCb" }),
        indNum: addTo.add("statictext", undefined, undefined, { name: "indNum" }),
        oldArtName: addTo.add('edittext {properties: {name: "oldArtName"}}'),
        artboard: doards[ind]
    }
    obj.oldArtName.onChange = function () {
        if (this.text == '') this.text = this.orginalText;
    }
    obj.oldArtName.text = doards[ind].name;
    obj.oldArtName.orginalText = doards[ind].name;
    obj.oldArtName.preferredSize.width = 350;
    obj.indNum.preferredSize.width = 40;
    obj.indNum.text = ind + 1;
    obj.artinCb.cbFor = ind;
    allItms.push(obj);
}
chkAllPre.onClick = function () {
    for (var i = 0; i < allItms.length; i++) {
        allItms[i].artinCb.value = this.value;
    }
    previewClick();
}

// PRESUG
// ======
var preSuG = artboardRenamer.add("group", undefined, { name: "preSuG" });
preSuG.orientation = "row";
preSuG.alignChildren = ["left", "center"];
preSuG.spacing = 10;
preSuG.margins = 0;

var prefixT = preSuG.add("statictext", undefined, undefined, { name: "prefixT" });
prefixT.text = "Prefix";
prefixT.preferredSize.width = 50;

var prefixV = preSuG.add('edittext {properties: {name: "prefixV"}}');
prefixV.preferredSize.width = 150;
prefixV.onChange = previewClick;
var postT = preSuG.add("statictext", undefined, undefined, { name: "postT" });
postT.text = "Suffix";
postT.preferredSize.width = 50;

var suffV = preSuG.add('edittext {properties: {name: "suffV"}}');
suffV.preferredSize.width = 150;
suffV.onChange = previewClick;
// ARTBOARDRENAMER
// ===============
var divider1 = artboardRenamer.add("panel", undefined, undefined, { name: "divider1" });
divider1.alignment = "fill";

// NUMFG
// =====
var numFG = artboardRenamer.add("group", undefined, { name: "numFG" });
numFG.orientation = "row";
numFG.alignChildren = ["left", "top"];
numFG.spacing = 10;
numFG.margins = 0;

var nubfT = numFG.add("statictext", undefined, undefined, { name: "nubfT" });
nubfT.text = "Numbering Format";
nubfT.preferredSize.width = 125;

// FORMATG
// =======
var forMatG = numFG.add("group", undefined, { name: "forMatG" });
forMatG.orientation = "column";
forMatG.alignChildren = ["left", "center"];
forMatG.spacing = 10;
forMatG.margins = 0;

var need = forMatG.add("radiobutton", undefined, undefined, { name: "need" });
need.text = "1,2,3,4,5, ...";
need.value = true;
need.onClick = previewClick;
var oneZ = forMatG.add("radiobutton", undefined, undefined, { name: "oneZ" });
oneZ.text = "01,02,03,04,05,06, ...";
oneZ.onClick = previewClick;
var tZero = forMatG.add("radiobutton", undefined, undefined, { name: "tZero" });
tZero.text = "001,002,003,004,005,006, ...";
tZero.onClick = previewClick;
// MAINUIG
// =======
var mainuiG = artboardRenamer.add("group", undefined, { name: "mainuiG" });
mainuiG.orientation = "row";
mainuiG.alignChildren = ["left", "center"];
mainuiG.spacing = 10;
mainuiG.margins = 0;
mainuiG.alignment = ["fill", "top"];

var preview = mainuiG.add("checkbox", undefined, undefined, { name: "preview" });
preview.text = "Preview";
preview.onClick = previewClick;

function previewClick() {
    for (i = 0; i < allItms.length; i++) {
        if (!preview.value) {
            allItms[i].oldArtName.text = allItms[i].oldArtName.orginalText;
            continue;
        }
        var itm = allItms[i];
        if (itm.artinCb.value) {
            if (need.value) {
                var num = i + 1;
            } else if (oneZ.value) {
                var num = zeroPad(i + 1, 2);
            } else {
                var num = zeroPad(i + 1, 3);
            }

            allItms[i].oldArtName.text = prefixV.text + num + suffV.text;
        }
    }
}
// MAING
// =====
var mainG = mainuiG.add("group", undefined, { name: "mainG" });
mainG.preferredSize.width = 350;
mainG.orientation = "row";
mainG.alignChildren = ["right", "fill"];
mainG.spacing = 10;
mainG.margins = 0;

var cancel = mainG.add("button", undefined, undefined, { name: "cancel" });
cancel.text = "Cancel";

var ok = mainG.add("button", undefined, undefined, { name: "ok" });
ok.text = "Ok";

function zeroPad(number, size) {
    var minus = (number < 0) ? '-' : '',
        str = '00000000000' + Math.abs(number);

    return minus + str.slice(str.length - size);
}
ok.onClick = function () {
    for (i = 0; i < allItms.length; i++) {
        if (allItms[i].artinCb.value) {
            var itm = allItms[i];
            if (need.value) {
                var num = i + 1;
            } else if (oneZ.value) {
                var num = zeroPad(i + 1, 2);
            } else {
                var num = zeroPad(i + 1, 3);
            }
            itm.artboard.name = prefixV.text + num + suffV.text;
        }
    }
    artboardRenamer.close();
}
artboardRenamer.show();