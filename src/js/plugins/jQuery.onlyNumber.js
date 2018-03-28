
/* jQuery Only Number - TODO: Description
 * TODO: usage
 * 
 * Copyright (c) 2012 Mateus das Chagas Moura
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

$.fn.onlyNumber=function(settings){ // Campo permitir somente números
	var defaults={
		except:"-.A"
	},
	settings=$.extend({},defaults,settings||{}),
	except=[];
	for(var i=0;i<settings.except.length;i++){
		except.push(settings.except.charCodeAt(i));
	}

	return this.each(function(){
		$(this).keypress(function(e){
			if(e.which!=8&&e.which!=0&&(e.which<48||e.which>57)&&$.inArray(e.which,except)==-1)
			return false;
		});
	});
}