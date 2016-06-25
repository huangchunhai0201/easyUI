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
            content:"<div class='treeButtons' style='padding: 5px;border-bottom:1px solid #ccc;'></div><div id='departTreeLayer' style='width:100%;'></div>",
            width:260})
        .layout("add",{
            region:"center",
            content:"<div id='tabsLayer' style='width:100%;'></div>"});

    var treeButoons = centerContentLayer.layout("panel","west").find(".treeButtons"); //操作部门树的按钮
    var departTreeLayer = centerContentLayer.layout("panel","west").find("#departTreeLayer");  //加载部门树的容器
    var tabsLayer = centerContentLayer.layout("panel","center").find("#tabsLayer");  //存放部门tab的容器

    //加载树操作按钮
    treeButoons.append(
        '<a id="createDepartBtn" href="#" class="easyui-linkbutton" data-options="iconCls:\'icon-add\'">新增单位</a>'+
            '&nbsp<a id="removeDepartBtn" style="display: none;" href="#" class="easyui-linkbutton" data-options="iconCls:\'icon-remove\'">删除单位</a>'
    );
    $.parser.parse(treeButoons);

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
    }).tabs("add",{
        id:"depart",
        title:"单位信息",
        content:"<div class='departTab' style='width:100%;'></div>",
        style:{padding:2}
    }).tabs("add",{
        title:"权限资源",
        content:"<div class='powerTreeTab' style='width:100%;'></div>",
        style:{padding:2}
    }).tabs("select",0);
    var peopleTab = tabsLayer.tabs("getTab",0).children(".peopleTab");  //tab内容容器
    var infoTab = tabsLayer.tabs("getTab",1).children(".departTab");
    var treeTab = tabsLayer.tabs("getTab",2).children(".powerTreeTab");

    //加载人员信息
    peopleTab.datagrid({
        fitColumns:true,
        collapsible:true,
        singleSelect:true,
        columns:[
            [
                {field:'RealName',title:'姓名',width:10,align:'center'},
                {field:'LoginName',title:'系统账号',width:10,align:'center'},
                {field:'SexText',title:'性别',width:10,align:'center'},
                {field:'UserTypeText',title:'用户类型',width:10,align:'center'},
                {field:'Description',title:'用户描述',width:10,align:'center'},
                {field:'UserGroup',title:'所属单位',width:20,align:'center'}
            ]
        ],
        loadFilter: function(data,parent){
            return data.List;
        }
    });
    infoTab.panel({
        border:false,
        href:"form.html",
        onLoad: depart.formLoadCallback
    });
    treeTab.treegrid({
        url1: 'pageMenu.json',
        fitColumns:true,
        style:{margin:'0 auto'},
        method: 'get',
        idField: 'id',
        treeField: 'name',
        checkbox:true,
        columns:[[
            {title:'页面名称',field:'name',width:30},
            {
                field:'power',
                title:'控件权限',
                width:70,
                align:'left',
                formatter:function(val,rowData){
                    var str = '';
                    if(val && $.isArray(val) && val.length>0){
                        var fieldName = 'power'+ rowData.id;
                        str += '<form id='+ fieldName +'>';
                        for(var i=0;i<val.length;i++){
                            str += '<input type="checkbox" name='+ fieldName +' value='+ val[i].id +'>'+ val[i].name +'&nbsp&nbsp'
                        }
                        str += '</form>';
                    };
                    return str;
                }
            }
        ]],
        toolbar: [
            {
                iconCls: 'icon-search',
                text: "查询权限",
                handler: depart.queryPower
            },
            {
                id:"configBtn",
                iconCls: 'icon-save',
                text:"提交配置",
                disabled:true,
                handler: depart.submitPower
            }
        ]
    });

});
function modifyPeopleInfo(){
    alert(11)
}