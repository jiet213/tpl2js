define(function(){
return ['<div class="b2b_mask fn-store-type">',
'    <div class="store-type">',
'        <div class="choice J_choice_btn">',
'            <span>取消</span>',
'            <span>确定</span>',
'        </div>',
'        <div class="detail_type">',
'            <div class="bus">',
'                <ul class="J_tab">',
'                    {{~ it:value:index}}',
'                        <li class="{{? index == 0}} cur {{?}}" data-cid="{{= value.cid}}">{{= value.pname}}</li>',
'                    {{~}}',
'                </ul>',
'            </div>',
'            {{~ it:value:index}}',
'            <div class="bus_detail J_tab_detail {{? index != 0}} hide {{?}}">',
'                <ul>',
'                    {{~ value.child:value2:index2}}',
'                        <li data-cid="{{= value2.cid}}" class="{{? index2 == 0}} on {{?}}">',
'                            <h4>{{= value2.pname}}</h4>',
'                            <p>{{= value2.deatil}}</p>',
'                        </li>',
'                    {{~}}',
'                </ul>',
'            </div>',
'            {{~}}',
'        </div>',
'    </div>',
'</div>'].join('');
});
