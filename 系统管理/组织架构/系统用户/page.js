$(document).ready(function(){
    var outLayer = $("#layout"); //最外层的布局div

    //布局，分为头部，底部，左侧栏，中间内容区域
    outLayer.layout({"fit":true, width:"100%"})
        .layout("add",{region: 'north', height:100,border:false})
        .layout("add",{region: 'south', height:100,border:false})
        .layout("add",{
            region: 'west', width:200,
            href:"sideBar.html",
            title:'  ',border:false})
        .layout("add",{region: "center", content:"<div id='centerCotent' style='width:100%;'></div>", border:false});

    //生成左侧菜单
    var header = outLayer.layout("panel","north").css("background","#108AC6");
    var footer = outLayer.layout("panel","south").css("background","#eee");
    var side = outLayer.layout("panel","west");

    //中间内容区域分为左侧部门树，和右侧部门信息
    var centerContentLayer = outLayer.layout("panel","center").find('#centerCotent'); //中间的布局div
    centerContentLayer.layout({fit:true})
        .layout("add",{
            region:"west",
            split:true,
            content:"<div id='departTreeLayer' style='width:100%;padding-top: 10px;'></div>",
            width:260})
        .layout("add",{
            region:"center",
            content:"<div id='tabsLayer' style='width:100%;'></div>"});

    var departTreeLayer = centerContentLayer.layout("panel","west").find("#departTreeLayer");  //加载部门树的容器
    var tabsLayer = centerContentLayer.layout("panel","center").find("#tabsLayer");  //存放部门tab的容器

    //生成部门树
    departTreeLayer.tree({
        url:'departTree.json',
        loadFilter:function(data,parent){
            return data.List;
        },
        animate:true,
        onLoadSuccess:depart.departTreeLoadCallback,
        onSelect:depart.departNodeSelectCallback
    });

    //添加tab按钮
    tabsLayer.tabs({
        fit:true,
        border:false,
        selected:0
    }).tabs("add",{
        title:"人员列表",
        content:"<div class='peopleTab' style='width:100%;'></div>",
        style:{padding:2}
    }).tabs("select",0);
    var peopleTab = tabsLayer.tabs("getTab",0).children(".peopleTab");  //tab内容容器

    //加载人员信息
    peopleTab.datagrid({
        fitColumns:true,
        collapsible:true,
        checkOnSelect:false,
        toolbar:[{
            iconCls: 'icon-add',
            text: '新增成员',
            handler: depart.createMember
            },
            {
                iconCls: 'icon-remove',
                text:'删除成员',
                handler: depart.removeMember
            }
        ],
        columns:[
            [
                {field:'ck',checkbox:true},
                {field:'RealName',title:'姓名',width:10,align:'center'},
                {field:'LoginName',title:'系统账号',width:10,align:'center'},
                {field:'SexText',title:'性别',width:10,align:'center'},
                {field:'UserTypeText',title:'用户类型',width:10,align:'center'},
                {field:'Description',title:'用户描述',width:10,align:'center'},
                {field:'UserGroup',title:'所属单位',width:20,align:'center'},
                {
                    field:'operate',
                    title:'操作',
                    width:10,
                    align:'center',
                    formatter:function(val,rowData){
                        var $btn = $('<a id="modifyPeopleInfo" class="modifyPeopleInfo" href="#" class="easyui-linkbutton" data-options="iconCls:\'icon-add\'"></a>');
                        $btn.linkbutton({
                            iconCls: 'icon-search',
                            plain:true
                        });
                        return $btn.get(0).outerHTML;
                    }
                }
            ]
        ],
        onLoadSuccess: depart.modifyPeopleInfo,
        loadFilter: function(data,parent){
            return data.List;
        }
    });

});