;(function () {
	'use strict';
	$(function () {
		var $addSubmit=$('.add-task')
		,tasklist={}
		,$delete=null
		,$task_detail_bg=$('.task-detail-bg')
		,$task_detail=$('.task-detail')
		,$task_detail_btn=null
		,$updataform
		,$task_content
		,$checkbox_complete
		;
		init();
		$addSubmit.on('submit', function() {
			var newtask={};
			event.preventDefault();
			newtask.content=$addSubmit.find('input[name="content"]').val();
			if(!$.trim(newtask.content)){
				$addSubmit.find('input[name="content"]').val("");
				return;
			};
			addtask(newtask);
			render_task();
			$addSubmit.find('input[name="content"]').val("");
		});
		/*当点击弹出的空白图层隐藏详情页*/
		function hide_detail () {
			$task_detail_bg.hide();
			$task_detail.hide();
		}
		function listen_render_task () {
			$delete.on('click', function() {
			var $index=$(this).parent().data('index');
			var state=confirm("你确定要删除吗");
			state==true?delete_task($index):null;
			});
		};
		function listen_render_detail () {
			$task_detail_btn.on('click',function(){
				var $index=$(this).parent().data('index');
				show_detail($index);
			});
		}
		function listen_checkbox_complete(){
			$checkbox_complete.on('click',function(){
				var $this=$(this);
				var $index=$this.parent().parent().data('index');
				var data=store.get('tasklist')[$index];
				if(data.completed==true){
					update_task($index,{completed:false});
				}else{
					update_task($index,{completed:true});
				}
			})
		}
		function show_detail ($index) {
			$task_detail_bg.show();
			render_detail($index);
			$task_detail.show();
			$task_detail_bg.on('click', function() {
				hide_detail();				
			});
		}
		function update_task(index,data){
			if(index==undefined||!tasklist[index])return;
			tasklist[index]=$.extend({},tasklist[index],data);
			refresh_task();
		}
		function render_detail (index) {
			var data=tasklist[index];
			var templ=`
			<form>
				<div class="task-content">${data.content}</div>
				<input type="text" name="content" value="${data.content}" style="display:none;">
			<div>
				<div class="task-desc">
					<textarea name="desc">${data.desc||''}</textarea>
				</div>
			</div>
			<div class="remain">
				<input type="date" name="date" value="${data.date}">
				<button type="submit">更新</button>
			</div>
			</form>
			`;
			$task_detail.html(templ);
			$task_content=$('.task-content');
			$updataform=$task_detail.find('form');
			$updataform.on('submit',function(e){
				e.preventDefault();
				var data={};
				data.content=$(this).find('input[name=content]').val();
				data.desc=$(this).find('textarea[name=desc]').val();
				data.date=$(this).find('input[name=date]').val();
				update_task(index,data);
				hide_detail();
			})
			$task_content.on('dblclick',function(){
				$(this).hide();
				$(this).next("input[name=content]").show();
			})
		}
		function init() {
			tasklist=store.get('tasklist')||[];
			if (!tasklist.length) return;
			render_task();
		}
		function addtask (newtask) {
			tasklist.push(newtask);
			store.set('tasklist',tasklist);
		}
		function delete_task (index) {
			if(index==undefined||!tasklist[index])return;
			delete tasklist[index];
			refresh_task();
		}
		function refresh_task () {
			store.set('tasklist',tasklist);
			render_task();
		}
		function render_task () {
			var $tasklist=$('.task-list');
			$tasklist.html("");
			var completedData=[];
			for (var i = 0; i < tasklist.length; i++) {
				var item=tasklist[i];
				if(item&&item.completed){
					completedData[i]=item;
				}else{
					var result=render_templ(item,i);
					$tasklist.prepend(result);
				}
			}
			for(var j=0;j<completedData.length;j++){
				
				var result=render_templ(completedData[j],j);
				$tasklist.append(result);
			}
			$checkbox_complete=$tasklist.find('input[type=checkbox]');
			$delete=$('.fr.delete');
			$task_detail_btn=$('.fr.detail');
			listen_render_task();
			listen_render_detail();
			listen_checkbox_complete();
		}
		function render_templ (data,index) {
			if(!data||!index)return;
			var templ=`
				<div class="task-item" data-index="${index}">
				<span><input type="checkbox" ${data.completed?'checked':''}></span>
				<span>${data.content}</span>
				<span class="fr delete">删除</span>
				<span class="fr detail">详情</span>
			</div>
			`;
			return $(templ);
		}		
	});
})();