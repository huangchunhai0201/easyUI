var depart = {};
(function(){
    depart = {
        departTreeLoadCallback: function(){ //部门树加载成功后的回掉函数
            var departTreeLayer = $("#departTreeLayer");
            var node = departTreeLayer.tree('find',"0");
            departTreeLayer.tree('select',node.target);

            // ----------此处放置左侧部门树的事件方法-----------------------
            $("#createDepartBtn").bind("click",function(){
                $("#tabsLayer").tabs("select",1);
                $("#form").form("clear");
            });
            $("#removeDepartBtn").bind("click",function(){
                var node = departTreeLayer.tree('getSelected');
                departTreeLayer.tree('remove',node.target);
            });
        },
        departNodeSelectCallback: function(node){    //选择部门节点时的回掉函数
            var peopleTab = $(".peopleTab");
            if(node.id === "0"){
                $("#removeDepartBtn").hide();
            }else{
                $("#removeDepartBtn").show();
            }
            $.ajax({
                url: "queryPeople.json",
                data: {},
                dataType: "json", //这里的dataType就是返回回来的数据格式了html,xml,json
                cache: false, //设置是否缓存，默认设置成为true，当需要每次刷新都需要执行数据库操作的话，需要设置成为false
                success: function(ret){
                    peopleTab.datagrid('loadData',ret);
                }
            });
        },
        createMember: function(){    //往部门添加成员
            depart.openPeopleInfo("新增人员",true);
        },
        removeMember: function(){   //删除成员
            alert(11);
        },
        formLoadCallback:function(){    //加载表单成功之后，设置提交事件
            $("#submitDepartInfoBtn").bind("click",function(){
                var form = $("#form");
                form.form("submit",{
                    url:"departTree.json",
                    onSubmit:function(){
                        console.log(arguments)
                    }
                });
                //form.form("submit");
            });
        },
        queryPower:function(){   //查询权限树
            $.ajax({
                url: "pageMenu.json",
                data: {},
                dataType: "json", //这里的dataType就是返回回来的数据格式了html,xml,json
                cache: false, //设置是否缓存，默认设置成为true，当需要每次刷新都需要执行数据库操作的话，需要设置成为false
                success: function(ret){
                    $(".powerTreeTab").treegrid('loadData',ret);
                    $("#configBtn").linkbutton('enable');
                }
            });
        },
        submitPower:function(){   //提交权限
            var rowData = $(".powerTreeTab").treegrid("getData");
            var obj = {str:''};
            createPowerStr(rowData,obj);
            console.log(obj);
        },
        modifyPeopleInfo:function(rowsData){
            var rows = rowsData.rows;
            var total = rowsData.total;
            $(".modifyPeopleInfo").bind("click",function(){
                depart.openPeopleInfo("修改人员信息");
            })
        },
        openPeopleInfo: function(title,isCreate){
            if($("#dlg_modifyPeopleInfo").length>0){
                $("#dlg_modifyPeopleInfo").dialog('setTitle',title).dialog('open');
            }else{
                var $modal = $('<div id="dlg_modifyPeopleInfo"></div>');
                $("body").append($modal);
                $modal.dialog({
                    width:900,
                    height:500,
                    shadow:true,
                    modal:true,
                    title:title,
                    href:"peopleForm.html",
                    buttons: [{
                        text:'提交',
                        iconCls:'icon-ok',
                        handler:function(){
                            alert('添加');
                        }
                    },{
                        text:'取消',
                        iconCls:'icon-cancel',
                        handler:function(){
                            alert('取消');
                        }
                    }],
                    onOpen:function(){
                        var title = $modal.prev().children(".panel-title").text();
                        if(title === '新增人员'){
                            console.log('create');
                            return;
                        }
                        console.log('modify');
                    }
                });
            }
        }
    }
    function createPowerStr(data,strObj){    //当页面权限更改完成后，提交时 生成数据
        if(data && $.isArray(data) && data.length>0){
            for(var i=0;i<data.length;i++){
                if(data[i].checkState !== "unchecked"){
                    if(data[i].children && data[i].children.length>0){

                        arguments.callee(data[i].children,strObj);

                    }else{
                        if(strObj.str !== ''){
                            strObj.str += ';';    //页面之间用 ; 分割，如果是第一个页面，前面就不需要加 ;
                        }
                        strObj.str += data[i].id;

                        if(data[i].power){   //如果该页面下有配置权限
                            var form = $("#power"+data[i].id);
                            var fields = form.find("input");

                            var powerStr = '';
                            for(var j=0;j<fields.length;j++){
                                if(fields.get(j).checked){
                                    powerStr += (powerStr ? ',' : '') + fields.get(j).value;
                                }
                            }
                            if(powerStr !== ''){
                                strObj.str += ':' + powerStr;
                            }
                        }
                    }
                }
            }
        }
    }
})();