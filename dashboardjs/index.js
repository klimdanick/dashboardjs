var EnvironmentData;

window.onload = function () {

TempData = new CanvasJS.Chart("TempData", {
	backgroundColor: "transparent",
	animationEnabled: false, // change to true
	zoomEnabled: true,
	exportEnabled: false,
	axisY :{
		gridThickness: 0,
		labelFontColor: "#bbbbbb",
		lineColor: "#bbbbbb"
	},
	axisX :{
		gridThickness: 0,
		labelFontColor: "#bbbbbb",
		lineColor: "#bbbbbb"
	},
	toolTip: {
		backgroundColor: "#ffffff",
		borderThickness: 0,
		cornerRadius: 0,
		fontColor: "#424242"
	},
	data: [{
		color: "#FF3D3D",	//171D20
		name: "Temperature",
		showInLegend: false,
		fillOpacity: 0.3,
		lineColor: "#FF3D3D",
		lineThickness: 6,							
		markerSize: 0,
		type: "line",
		dataPoints: TempDataPoints
	}, ]
});
PressData = new CanvasJS.Chart("PressData", {
	backgroundColor: "transparent",
	animationEnabled: true, // change to true	
	zoomEnabled: true,
	exportEnabled: false,
	axisY :{
		gridThickness: 0,
		labelFontColor: "#bbbbbb",
		lineColor: "#bbbbbb"
	},
	axisX :{
		gridThickness: 0,
		labelFontColor: "#bbbbbb",
		lineColor: "#bbbbbb"
	},
	toolTip: {
		backgroundColor: "#ffffff",
		borderThickness: 0,
		cornerRadius: 0,
		fontColor: "#424242"
	},
	data: [{
		color: "#5FCE68",
		name: "Pressure",
		showInLegend: false,
		fillOpacity: 0.3,
		lineColor: "#5FCE68",
		lineThickness: 6,							
		markerSize: 0,
		type: "line",
		dataPoints: PressDataPoints
	}]
});
HumData = new CanvasJS.Chart("HumData", {
	backgroundColor: "transparent",
	animationEnabled: true, // change to true	
	zoomEnabled: true,
	exportEnabled: false,
	axisY :{
		gridThickness: 0,
		labelFontColor: "#bbbbbb",
		lineColor: "#bbbbbb"
	},
	axisX :{
		gridThickness: 0,
		labelFontColor: "#bbbbbb",
		lineColor: "#bbbbbb"
	},
	toolTip: {
		backgroundColor: "#ffffff",
		borderThickness: 0,
		cornerRadius: 0,
		fontColor: "#424242"
	},
	data: [{
		color: "#6071D1",	//171D20
		name: "Humidity",
		showInLegend: false,
		fillOpacity: 0.3,
		lineColor: "#6071D1",
		lineThickness: 6,							
		markerSize: 0,
		type: "line",
		dataPoints: HumDataPoints
	}]
});
//genData();

setTimeout(() => {
	let updateFreq = 0.1;
	let dataFreq = 0.1;
	let mainFreq = 0.1;
	//setInterval(genData, dataFreq*1000);
	setInterval(()=>{TempData.render(); HumData.render(); PressData.render();}, updateFreq*1000);
	setInterval(mainLoop, mainFreq*1000);
}, 1300);
}
let interval;

let TempDataPoints = [{x: 0, y:10}, {x: 1, y: 11}];
let PressDataPoints = [{x: 0, y:10}];
let HumDataPoints = [{x: 0, y:10}];

function genData() {
	TempDataPoints.push({
		x: new Date().toISOString(),
		y: Math.abs(TempDataPoints[TempDataPoints.length-1]["y"]-10 + Math.random()-0.5)+10
	});
	if (TempDataPoints.length > 50) TempDataPoints.shift();
	
	PressDataPoints.push({
		x: new Date().toISOString(),
		y: Math.abs(PressDataPoints[PressDataPoints.length-1]["y"]-10 + Math.random()-0.5)+10
	});
	if (PressDataPoints.length > 50) PressDataPoints.shift();
	
	HumDataPoints.push({
		x: new Date().toISOString(),
		y: Math.abs(HumDataPoints[HumDataPoints.length-1]["y"]-10 + Math.random()-0.5)+10
	});
	if (HumDataPoints.length > 50) HumDataPoints.shift();
}

function mainLoop() {
	
	let days = ["Maandag",
				"Dinsdag",
				"Woensdag",
				"Donderdag",
				"Vrijdag",
				"Zaterdag",
				"Zondag"]
				
	let months = ["Januari",
				"Februari",
				"Maart",
				"April",
				"Mei",
				"Juni",
				"Juli",
				"Augustus",
				"September",
				"Oktober",
				"November",
				"December"]
				
	let d = new Date();
	
	document.getElementById("time").innerHTML = d.getHours() + ":" + d.getMinutes();
	document.getElementById("date").innerHTML = days[d.getDay()] + "<br><h5>" + (d.getDate()) + " " + months[d.getMonth()] + " " + (d.getFullYear()) + "</h5>";
	//document.getElementById("temp").innerHTML = "Temperature: " + Math.round(TempDataPoints[TempDataPoints.length-1]["y"]*10)/10;
	//document.getElementById("press").innerHTML = "Pressure: " + Math.round(PressDataPoints[PressDataPoints.length-1]["y"]*10)/10;
	//document.getElementById("hum").innerHTML = "Humidity: " + Math.round(HumDataPoints[HumDataPoints.length-1]["y"]*10)/10;
	
	fetch("http://localhost/data?type=co2")
		.then(res => res.json())
		.then(out => {
			while(TempData.data[0].dataPoints.length > 0) TempData.data[0].dataPoints.pop();
			for (let i = 0; i < out.data.length; i++) TempData.data[0].dataPoints.push({x: out.data[i]["x"], y: parseFloat(out.data[i]["y"])});
		}).catch(err => { throw err });
		
	fetch("http://localhost/data?type=press")
		.then(res => res.json())
		.then(out => {
			while(PressData.data[0].dataPoints.length > 0) PressData.data[0].dataPoints.pop();
			for (let i = 0; i < out.data.length; i++) PressData.data[0].dataPoints.push({x: out.data[i]["x"], y: parseFloat(out.data[i]["y"])});
		}).catch(err => { throw err });

	fetch("http://localhost/data?type=hum")
		.then(res => res.json())
		.then(out => {
			while(HumData.data[0].dataPoints.length > 0) HumData.data[0].dataPoints.pop();
			for (let i = 0; i < out.data.length; i++) HumData.data[0].dataPoints.push({x: out.data[i]["x"], y: parseFloat(out.data[i]["y"])});
		}).catch(err => { throw err });
}