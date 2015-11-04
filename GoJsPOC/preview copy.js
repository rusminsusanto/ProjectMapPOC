var diagram;

function init() {
	var $ = go.GraphObject.make;
	
	diagram =  $(go.Diagram, "myDiagram");

    diagram.initialContentAlignment = go.Spot.Center;

    // enable Ctrl-Z to undo and Ctrl-Y to redo
    diagram.undoManager.isEnabled = true;

// diagram.nodeTemplate =
//     $(go.Node, "Vertical",
//       $(go.Shape, "Ellipse",
//         { width : 30, height : 30, fill: "lightblue",
//            portId: "",  // now the Shape is the port, not the whole Node
//         }),
//       $(go.TextBlock,
//       	{margin:5},
// //        { font: "10px sans-serif" },
//         new go.Binding("text", "key"))
//     );
// 
//   var nodeDataArray = [
//     { key: "Alpha" },
//     { key: "Beta" }
//   ];
//   var linkDataArray = [
//     { from: "Alpha", to: "Beta" }
//   ];
//   diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
   diagram.initialContentAlignment = go.Spot.Center;
   diagram.nodeTemplate =
     $(go.Node, "Vertical",
	   $(go.Picture,
		 { maxSize: new go.Size(40, 40) },
		 new go.Binding("source", "img")),
//	   $(go.Shape,
//		 {width : 50, height : 50},
//         new go.Binding("figure", "fig"),
//         new go.Binding("fill", "color")),
       $(go.TextBlock,
		 {margin : 2 },
		 { isMultiline: true, width: 60, textAlign: "center", wrap: go.TextBlock.WrapFit  },
		 { font: "9px sans-serif" },
         new go.Binding("text", "key"))
     );
 
   diagram.model.nodeDataArray = [
     { key: "Due to Water quality decline", color: "lightblue", fig: "RoundedRectangle", img: "images/case.ico"  },
     { key: "Beta", color: "lightblue", fig: "Ellipse", img: "images/attribute.ico" },
     { key: "Gamma", color: "lightblue", fig: "Hexagon", img: "images/angrybird.jpg"  },
     { key: "Delta", color: "lightblue", fig: "FramedRectangle", img: "images/matrix.ico"  },
     { key: "Epsilon", color: "lightblue", fig: "Cloud", img: "images/memo.ico"  },
     { key: "Zeta", color: "lightblue", fig: "Procedure", img: "images/node.ico"  }
   ];   
/*  diagram.nodeTemplate =
    $(go.Node, "Vertical",
      $(go.Picture,
        { maxSize: new go.Size(50, 50) },
        new go.Binding("source", "img")),
      $(go.TextBlock,
        { margin: new go.Margin(3, 0, 0, 0),
          maxSize: new go.Size(100, 30),
          isMultiline: false },
        new go.Binding("text", "text"))
    );

  diagram.model.nodeDataArray = [
    { text: "Angry bird", img: "images/angrybird.jpg" }
  ];*/
}

function deleteNode() {
	var node = diagram.model.findNodeDataForKey("Zeta");
	if (node) {
 		diagram.model.setDataProperty(node, "img", "images/node_grayscale.ico");
// 		diagram.model.setDataProperty(node, "price", "1250");
//		diagram.model.removeNodeData(node);
	}
}

function insertNode() {
  var node = { key: "Grrrr", color: "pink", fig: "RoundedRectangle" };
	diagram.model.addNodeData(node); 
	diagram.layoutDiagram();
}

function loadFromJSON() {
 var str = '{ "class": "go.GraphLinksModel", \
  "nodeDataArray": [  \
{"key":"Alpha", "color":"lightblue"}, \
{"key":"Beta", "color":"orange"}, \
{"key":"Gamma", "color":"lightgreen"}, \
{"key":"Delta", "color":"pink"} \
 ], \
  "linkDataArray": [  \
{"from":"Alpha", "to":"Beta"}, \
{"from":"Alpha", "to":"Gamma"}, \
{"from":"Beta", "to":"Beta"}, \
{"from":"Gamma", "to":"Delta"}, \
{"from":"Delta", "to":"Alpha"} \
 ]}';
  
  diagram.model = go.Model.fromJson(JSON.parse(str));
 }

function toJSON() {
	var model = diagram.model.toJson();
	console(model);
}