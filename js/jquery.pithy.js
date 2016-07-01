//type为grid
//grid有 class 和 wrap 来控制样式和上层的div
//同时也有 参数target
//对于create_easyui来说可以处理单个field 单个grid[中包括多个field] 多个grid 但不可以处理多个field
//多个直接通过fields来
/*==========================================*/
(function ($) {
    $.fn.grid = grid;
    $.fn.grid.INDEX = 0;
    function grid(options) {
        var gridIndex = $.fn.grid.INDEX++;
        var jControl = $(this);
        if (options.fields) {
            var jRow;
            for (var k = 0, len = options.fields.length; k < len; k++) {
                var field = options.fields[k];
                if (!field) {
                    continue;
                }
                if (options.common) {
                    for (var m in options.common) {
                        if (field[m] || field[m] === 0) {

                        } else {
                            field[m] = options.common[m];
                        }
                    }
                }
                field._id = gridIndex + '_' + field.name;
                console.log(field);
                //行构建
                if (k === 0 && !field.row) {
                    field.row = true;
                }
                if (field.row || !jRow) {
                    jRow = $('<tr>');
                    jControl.append(jRow);
                }
                var td = '<td ';
                if (field.colspan) {
                    td += ' colspan=' + field.colspan;
                }
                if (field.rowspan) {
                    td+=' rowspan='+ field.rowspan
                }
                if (field.align) {
                    td += ' align=' + field.align;
                }
                if (field.valign) {
                    td+= ' valign' + field.valign;
                }
                if (field.outer) {
                    td += ' style="width: '+field.outer+'"';
                }
                td += '>';
                var jTd = $(td);
                jRow.append(jTd);
                
                //解析
                buildField(field, jTd);
            }
            function buildField(field,jParent) {
                if (!field.type) {
                    field.type = 'input';
                }
                $.pithy.create_easyui(field,jParent);
                if (field.hide) {
                    jParent.hide();
                }
            }
        }
    }

})(jQuery);

/*==========================================*/
$.pithy = {
    create_easyui: function () {
        if ($.isArray(arguments[0])) {
            for (var i = 0, len = arguments[0].length; i < len; i++) {
                $.pithy.create_easyui(arguments[0][i], arguments[1]);
            }
        } else {
            var jParentDiv;
            if (arguments.length > 1) {
                jParentDiv = arguments[arguments.length - 1];
            }
            if (typeof jParentDiv === 'string') {
                jParentDiv = $(jParentDiv);
            }
            jParentDiv[arguments[0].type](arguments[0]);
            return jParentDiv[arguments[0].type];
        }
    }
}