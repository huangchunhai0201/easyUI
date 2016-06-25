/**
 * Created by user on 2016/6/23.
 */
(function($){
    $.fn.createForm = function(opts){
        var $wrap = $('<form id="'+ opts.id +'" style = "border:1px solid #eee;' + opts.style +'"></form>');
        if(opts.fields && opts.fields.length>0){
            var cellWidth = parseInt(100/opts.fields.length) + "%";
            for(var i=0;i<opts.fields.length;i++){
                if(opts.fields[i].rowlast){
                    cellWidth = parseInt(100/(i+1)) + "%";
                    break;
                }
            }
            for(var i=0;i<opts.fields.length;i++){
                var cell = opts.fields[i];
                var cellField = "";
                if(!cell.rowlast){
                    cellField = '<div class="field_cell" style="width:'+ cellWidth +';">'+
                        '<span class="label_cell" style="width:'+ cell.labelWidth +';">'+ cell.label +'</span>'+
                        '<input style="width:'+ cell.inputWidth +'" class="easyui-'+ cell.type +'" type="text" name="'+ cell.name +'" data-options="'+ cell.opts +'"></input>'+
                    '</div>';
                }else{
                    cellField = '<div class="field_cell" style="width:'+ cellWidth +';">'+
                        '<span class="label_cell" style="width:'+ cell.labelWidth +'">'+ cell.label +'</span>'+
                        '<input style="width:'+ cell.inputWidth +'" class="easyui-'+ cell.type +'" type="text" name="'+ cell.name +'" data-options="'+ cell.opts +'"></input>'+
                        '</div><br>';
                }
                $wrap.append(cellField);
                $(this).append($wrap);
                $.parser.parse($(this));
            }
        }
    }
})(jQuery);