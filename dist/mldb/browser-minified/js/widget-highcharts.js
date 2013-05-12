
com=window.com||{};com.marklogic=window.com.marklogic||{};com.marklogic.widgets=window.com.marklogic.widgets||{};com.marklogic.widgets.highcharts=function(container){this.container=container;this.aggregateFunction="mean";this.nameSource="title";this.valueSource="value";this.categorySource="category";this.categoryOrdering="month";this.autoCategories=false;this.categories=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];this.series=new Array();this._updateOptions();this._refresh();};com.marklogic.widgets.highcharts.prototype._updateOptions=function(){this.options={chart:{type:'line',renderTo:this.container,},title:{text:'Title'},subtitle:{text:'Subtitle'},xAxis:{categories:this.categories},yAxis:{title:{text:'Y Axis'}},tooltip:{enabled:true,formatter:function(){return'<b>'+this.series.name+'</b><br/>'+
this.x+': '+this.y;}},plotOptions:{line:{dataLabels:{enabled:true},enableMouseTracking:false}},series:this.series};mldb.defaultconnection.logger.debug("highcharts.prototype._updateOptions(): Options now: "+JSON.stringify(this.options));};com.marklogic.widgets.highcharts.prototype.setAggregateFunction=function(fn){this.aggregateFunction=fn;};com.marklogic.widgets.highcharts.prototype._refresh=function(){mldb.defaultconnection.logger.debug("Options: "+JSON.stringify(this.options));this.chart=new Highcharts.Chart(this.options);};com.marklogic.widgets.highcharts.prototype.setAutoCategories=function(bv){this.autoCategories=bv;};com.marklogic.widgets.highcharts.prototype.setSeriesSources=function(nameSource,categorySource,valueSource){this.nameSource=nameSource;this.categorySource=categorySource;this.valueSource=valueSource;};com.marklogic.widgets.highcharts.prototype.updateResults=function(results){var seriesNames=new Array();var seriesValues=new Array();var seriesCounts=new Array();var allCategories=new Array();if(undefined!=results&&undefined==results.results){results={results:results};}
for(var r=0;r<results.results.length;r++){var result=results.results[r].content;var name="";if(this.nameSource.startsWith("#")){name=this.nameSource.substring(1);}else{name=jsonExtractValue(result,this.nameSource);}
var value=jsonExtractValue(result,this.valueSource);var category=jsonExtractValue(result,this.categorySource);if(!allCategories.contains(category)){allCategories.push(category);}
if(!seriesNames.contains(name)){seriesNames.push(name);seriesValues[name]=new Array();seriesCounts[name]=new Array();}
var categoryValueArray=seriesValues[name][category];if(undefined==categoryValueArray){seriesValues[name][category]=new Array();seriesCounts[name][category]=0;}
seriesValues[name][category].push(value);seriesCounts[name][category]+=1;}
if(this.autoCategories){mldb.defaultconnection.logger.debug("updateResults(): Auto categories enabled");this.categories=allCategories;}
mldb.defaultconnection.logger.debug("Series names: "+JSON.stringify(seriesNames));mldb.defaultconnection.logger.debug("Series Values: "+JSON.stringify(seriesValues));var sum=function(arr){var sum=0;for(var i=0;i<arr.length;i++){sum+=arr[i];}
return sum;};var mean=function(arr){if(undefined==arr){return 0;}
var sum=0;for(var i=0;i<arr.length;i++){sum+=arr[i];}
return sum/arr.length;};var min=function(arr){var min=arr[0];for(var i=1;i<arr.length;i++){if(arr[i]<min){min=arr[i];}}
return min;};var max=function(arr){var max=arr[0];for(var i=1;i<arr.length;i++){if(arr[i]>max){max=arr[i];}}
return max;};var count=function(arr){return arr.length;};var func=sum;if("mean"==this.aggregateFunction){func=mean;}else if("min"==this.aggregateFunction){func=min;}else if("max"==this.aggregateFunction){func=max;}else if("count"==this.aggregateFunction){func=count;}
var series=new Array();for(var n=0;n<seriesNames.length;n++){var name=seriesNames[n];var orderedData=new Array();for(var p=0;p<this.categories.length;p++){orderedData[p]=func(seriesValues[name][this.categories[p]]);}
series[n]={name:name,data:orderedData};}
this.options.series=series;this.options.xAxis.categories=this.categories;this._refresh();};