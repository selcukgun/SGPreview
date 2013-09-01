/**
 * Created with PyCharm.
 * User: selcuk
 * Date: 8/2/13
 * Time: 7:42 PM
 * To change this template use File | Settings | File Templates.
 */
//This plug-in will generate a table in the following format
//<div id="previewTest">
//Preview Test
//    <div id="SGPreview">
//        <div id="row0" class="SGPreviewRow">
//            <div class="SGPreviewCol col0 firstCol" >Col0</div>
//            <div class="SGPreviewCol col1 " >Col1</div>
//            <div class="SGPreviewCol col2 " >Col2</div>
//            <div class="SGPreviewCol col3 lastCol" >Col3</div>
//        </div>
//    </div>
//</div>

(function ($) {
    $.fn.hideText = function() {
        this.html(function() {
            var $this = $(this);
            if ($this.html()) $this.attr('data-oldtext', $this.html());
            return '';
        });
        return this;
    };
    $.fn.showText = function() {
        this.html(function() {
            var $this = $(this);
            return $this.attr('data-oldtext') || $this.html();
        });
        return this;
    };

    $.fn.SGPreview = function(caption, numShown) {
        var numShownRow = 3;
        if (typeof numShown !== "undefined") numShownRow =   numShown;
        var rowRange = [0,numShownRow];

        var rowHeight = 20.0;
//        $(this).width("900px");
        $(this).css({"display":"none",
        "padding-left":"10px",
        "padding-bottom": "10px",
        "padding-right": "10px",
        "background-color":"#fff",
        "border-radius": "5px 5px 5px 5px",
        "box-shadow": "0 2px 6px rgba(0,0,0,0.5), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.25), inset 0 -15px 30px rgba(0,0,0,0.3)",
        "-o-box-shadow": "0 2px 6px rgba(0,0,0,0.5), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.25), inset 0 -15px 30px rgba(0,0,0,0.3)",
        "-webkit-box-shadow": "0 2px 6px rgba(0,0,0,0.5), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.25), inset 0 -15px 30px rgba(0,0,0,0.3)",
        "-moz-box-shadow": "0 2px 6px rgba(0,0,0,0.5), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.25), inset 0 -15px 30px rgba(0,0,0,0.3);})"});
//        id = $(this).attr('id');
        $(this).append("<div id='SGPreviewCaption'>"+caption+"</div><div id='SGPreview'></div>");
        $("#SGPreview").css({"background-color":"#fff"});

        this.setCaption = function(caption){
            $("#SGPreviewCaption").html(caption);
            $("#SGPreviewCaption").css({"color":"#00f"});
        };

        data = {"content":[["i","j","cij","uij"],["r1n1p","r1n1pp","","60"],["r1n2p","r1n2pp","","60"],["r1n3p","r1n3pp","","60"],["r1n1pp","r1n2p","1","20"],["r1n1pp","r1n3p","8","20"],["r1n2pp","r1n3p","5","20"]],"hash":"15249da664d105774ceb73baf823b2b1"};
        var numRow;
        var numCol;
        this.mdlName = '';
        this.fName = '';
        this.rowHL = [];
        this.colHL = [];
        main = this;
        this.data = {};
        this.highlightAll = function(){
            main.highlight([0,numRow],[1,numCol] );
        }
        this.newData = function(data){
            if (typeof data === "string") data = jQuery.parseJSON(data);
            main.data = data;
            //DEBUGconsole.log(JSON.stringify(data));
            numRow = data["content"].length;
            numCol = data["content"][0].length + 1;
//            //DEBUGconsole.log("Row:" +numRow +" Col:"+numCol);
            var sgPrev = $("#SGPreview");
            sgPrev.html("");
            for (var i=0; i<numRow;i++){
                sgPrev.append("<div id='row"+i + "'></div>");
                var row = $("#row"+i);
                row.addClass("SGPreviewRow");
                for (var j=-1; j<numCol-1;j++){
                    if (data["content"][i][j] == "") data["content"][i][j] = "&nbsp";
                    if (j<0){
                        if (i>0) row.append("<div class='SGPreviewCol col"+j + "'>" +i+ "</div>");
                        else row.append("<div class='SGPreviewCol col"+j + "'>#Row</div>");
                    } else if (j == numCol -1){
                        row.append("<div class='SGPreviewCol col"+j + " lastCol'>"+data["content"][i][j]+ "</div>");
                    } else {
                        row.append("<div class='SGPreviewCol col"+j + "'>"+data["content"][i][j]+ "</div>");
                    }
                }
            }
            var rowW = parseInt($(main).width()) - 40;
            var addPer = 100.0/rowW + 1;
            $(".SGPreviewCol").width((((100.00-addPer)/numCol)-addPer).toString() +"%");
            $(".SGPreviewRow").slice(rowRange[1],numRow).children().hideText();
            $(".SGPreviewRow").mouseenter(function(){
                var id =$(this).attr('id');
                expandRow(parseInt(id.toString().replace("row","")));
            });
            rowRange = [0,numShownRow];
            updateRowView();
            main.highlightAll();

        };
        var self = $(this);

        var updateRowView = function(){
                $(".SGPreviewRow").slice(0,rowRange[0]).children().hideText();
                $(".SGPreviewRow").slice(rowRange[0],rowRange[1]).children().showText();
//                $(".SGPreviewRow").slice(rowRange[0],rowRange[1]).children().height((rowHeight-1)+"px");
                $(".SGPreviewRow").slice(rowRange[0],rowRange[1]).height(rowHeight+"px");
                $(".SGPreviewRow").slice(rowRange[1],numRow).children().hideText();


            for (var i=0; i<numRow;i++){
                if (i<rowRange[0]){
                    var dif =  rowRange[0] - i;
                    $("#row"+i+ ".SGPreviewRow").height(rowHeight/Math.pow(2,dif)+"px");
                } else if (i>=rowRange[1]){
                    var dif =  i-rowRange[1] +1;
                    $("#row"+i+ ".SGPreviewRow").height(rowHeight/Math.pow(2,dif)+"px");
                }
            }
        };
        var expandRow = function(rowInd){
            if (rowInd<rowRange[0]){
                rowRange[0] = rowInd;
                rowRange[1] = rowInd+numShownRow;

            } else if (rowInd>=rowRange[1]){
                rowRange[1] = rowInd+1;
                rowRange[0] = Math.max(0,rowInd-numShownRow+1);
            }
            updateRowView();
//            //DEBUGconsole.log(rowInd);
//            //DEBUGconsole.log("Range:", rowRange);
        };
        this.selected = [];
        this.highlight = function(rowRange, colRange){
            if (typeof rowRange=== 'undefined' ||rowRange== 'null'){
                var rowStart = 0;
                var rowEnd = numRow;
            } else if (rowRange && rowRange.length == 1){
                var rowStart = rowRange[0];
                var rowEnd = rowRange[0]+1;
                if (isNaN(rowRange[0])) {
                    var rowStart = 0;
                    var rowEnd = numRow;
                }
            } else if (rowRange && rowRange.length == 2){
                var rowStart = rowRange[0];
                var rowEnd = rowRange[1]+1;
            } else if (rowRange){
                var rowStart = rowRange[0];
                var rowEnd = rowStart;
            }
            if (typeof colRange=== 'undefined'||colRange== 'null'){
                var colStart = 1;
                var colEnd = numCol;
            } else if (colRange && colRange.length == 1){
                var colStart = colRange[0];
                var colEnd = colRange[0]+1;
                if (isNaN(colRange[0])) {
                    var colStart = 1;
                    var colEnd = numCol;
                }
            } else if (colRange &&colRange.length == 2){
                var colStart = colRange[0];
                var colEnd = colRange[1]+1;
            } else if (colRange){
                var colStart = colRange[0];
                var colEnd = colStart;
            }
            main.selected = [];
            if (main.data){
//                //DEBUGconsole.log("CHECK: colStart=",colStart,"colEnd=",colEnd);
                for (var i=rowStart;i<Math.min(rowEnd, numRow);i++){
                    var newRow = [];
                    for (var j=colStart-1;j<Math.min(colEnd-1, numCol-1);j++){
//                        //DEBUGconsole.log("CHECK: i=",i,"j=",j);
                        if (Math.min(colEnd-1, numCol-1)-colStart+1 == 1) newRow = main.data["content"][i][j];
                        else newRow.push(main.data["content"][i][j]);
                    }
                    main.selected.push(newRow);
                }
            }
            //DEBUGconsole.log("SELECTED:", JSON.stringify(main.selected));
            $(".SGPreviewCol").css({"background-color": "#fff", "vertical-align":"middle"});
            $(".SGPreviewRow").slice(rowStart, rowEnd).each(function(){
//                //DEBUGconsole.log("col",colStart, colEnd);
//                //DEBUGconsole.log("row",rowStart, rowEnd);
               $(this).children().slice(colStart, colEnd).css({"background-color": "rgb(182, 184, 216)"});
            });

        };
        return this;
    };
}(jQuery));
