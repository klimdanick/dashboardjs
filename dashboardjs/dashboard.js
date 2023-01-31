const { app, BrowserWindow } = require('electron')
const path = require('path')

const express = require('express')
const webApp = express()
const port = 80

webApp.use('/', express.static('public'))

let dataTypes = ["co2", "hum", "press", "press2"]

let data = {};

webApp.post('/data', (req, res) => {
  if (!req.query) return res.sendStatus(400);
  
	for (let i = 0; i < dataTypes.length; i++) {
		if (req.query[dataTypes[i]]) {
			addData(dataTypes[i], req.query[dataTypes[i]])
			return res.sendStatus(202)
		}
	}
	res.sendStatus(404)
})

function addData(type, value) {
	if (!data[type]) createType(type)
	if (data[type].length > 1 && Math.abs(data[type][data[type].length-1]["y"] - value) < 2 && Math.abs(data[type][data[type].length-2]["y"] - value) < 2 && Math.abs(data[type][data[type].length-3]["y"] - value) < 2) {
		data[type][data[type].length-1] = {"y": value, "x": data[type][data[type].length-1]["x"]+1};
	} else if (data[type].length > 0) {
		data[type].push({"y": value, "x": data[type][data[type].length-1]["x"]+1})
	} else {
		data[type].push({"y": value, "x": 0})
	}
}

function createType(type) {
	data[type] = []
}

webApp.get('/data', (req, res) => {
  if (!req.query.type) return res.sendStatus(400);
  
	for (let i = 0; i < dataTypes.length; i++) {
		if (req.query.type == dataTypes[i]) {
			return res.send({"data": data[dataTypes[i]]})
		}
	}
	res.sendStatus(404)
})

webApp.listen(port, () => {
  console.log(`Dashboard listening on port ${port}`)
})

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
