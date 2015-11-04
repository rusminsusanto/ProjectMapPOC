var diagram;
var nodes = [];
var links = [];

function init() {
	var $ = go.GraphObject.make;
	
	diagram =  $(go.Diagram, "myDiagram",
				 {
					initialContentAlignment: go.Spot.Center,
					initialAutoScale: go.Diagram.Uniform
//					"toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom
				 });


    // enable Ctrl-Z to undo and Ctrl-Y to redo
    diagram.undoManager.isEnabled = false;
	//jQuery.getJSON("http://localhost:8000/data/model.json", load);
	parseXML('http://localhost:8000/data/ProjectMap.xml');

	diagram.nodeTemplate =
		$(go.Node, "Vertical",
 	    $(go.Picture,
		 { maxSize: new go.Size(40, 40) },
		   new go.Binding("source", "Image")),
		  new go.Binding("location", "position", go.Point.parse).makeTwoWay(go.Point.stringify),
       $(go.TextBlock,
		 {margin : 2 },
		 { isMultiline: true, width: 60, textAlign: "center", wrap: go.TextBlock.WrapFit  },
		 { font: "9px sans-serif" },
         new go.Binding("text", "Text"))
	   );

	// Add double click handler
	diagram.addDiagramListener("ObjectDoubleClicked", function(e) {
		var part = e.subject.part;
		if (!(part instanceof go.Link)) {
			alert('Should call objC to open : ' + part.data.Text + '\nguid is : ' + part.data.key);
		}
	});

	// Add Context Menu handler
	diagram.addDiagramListener("ObjectContextClicked", function(e) {
		var part = e.subject.part;
		if (!(part instanceof go.Link)) {
		   alert('Context menu on : ' + part.data.Text + '\nguid is : ' + part.data.key);
		}
	});

	diagram.linkTemplate =
	$(go.Link,
	  $(go.Shape),                           // this is the link shape (the line)
	  $(go.Shape, { toArrow: "Standard" }),  // this is an arrowhead
	  $(go.Panel, "Auto",  // this whole Panel is a link label
		$(go.Shape, "rectangle", { fill: "white", stroke: "white" }),
		$(go.TextBlock,
		  { font: "9px sans-serif", stroke : "blue" },
		  new go.Binding("text", "association"))
		)
	  );

	var slider = document.getElementById('zoom');
	slider.value = 1.0;
}

function load(jsondata) {
	// create the model from the data in the JavaScript object parsed from JSON text
	nodes = jsondata["nodes"];
	links = jsondata["links"];

	diagram.model = new go.GraphLinksModel(nodes, links);
}

function softDeleteNode() {
	var node = diagram.model.findNodeDataForKey("c38cb9d5-66c5-49e6-accc-e508e20625c0");
	if (node) {
		diagram.model.startTransaction("Soft delete memo");
 		diagram.model.setDataProperty(node, "Image", "images/memo_grayscale.ico");
		diagram.model.commitTransaction("Soft delete memo");
	}
}

function hardDeleteNode() {
	var node = diagram.findNodeForKey("c38cb9d5-66c5-49e6-accc-e508e20625c0");
	if (node) {
		diagram.remove(node);
	}
}

function toJSON() {
	var model = diagram.model.toJson();
	console.log(model);
}

function findNodeInfo() {
	var node = diagram.selection.first();
	if (node && !(node instanceof go.Link)) {
		alert('Name : ' + node.data.Text + '\nGuid : ' + node.data.key + '\nPosition : ' + node.data.position);
	}
}

function addNode() {
	var node1 = { "Text":"New Node", "key" : "f5023adb-0f56-4f6e-becc-daba035f9d63", "Image" : "images/node.ico", "ItemType" : "16", "position" : "150 200"};
	var link1 = { "from":"f5023adb-0f56-4f6e-becc-daba035f9d63", "to":"48a4a549-aba5-4ab2-b5cc-cb4368b001e6", "association":"Codes"}
	diagram.model.addNodeData(node1);
	diagram.model.addLinkData(link1);
}

function addMemo() {
	var node1 = { "Text":"My Memo", "key" : "10dbc3d5-d3e5-4b86-90cc-e33c797ef949", "Image" : "images/memo.ico", "ItemType" : "3", "position" : "300 100"};
	var link1 = { "from":"48a4a549-aba5-4ab2-b5cc-cb4368b001e6", "to":"10dbc3d5-d3e5-4b86-90cc-e33c797ef949", "association":"Memo Link"}
	diagram.model.addNodeData(node1);
	diagram.model.addLinkData(link1);

}

function hideMemoLinks() {
	var filteredLinks = links.filter(function(link) {
		return (link.association === "Memo Link");
	});

	for(var link in filteredLinks) {
		diagram.model.removeLinkData(filteredLinks[link]);
	}
}

function showMemoLinks() {
	var filteredLinks = links.filter(function(link) {
									 return (link.association === "Memo Link");
									 });

	for(var link in filteredLinks) {
		diagram.model.addLinkData(filteredLinks[link]);
	}
}

function circularLayout() {
	diagram.layout = new go.CircularLayout();
}

function forceDirectedLayout() {
	diagram.layout = new go.ForceDirectedLayout();
}

function zoomChange() {
	var slider = document.getElementById('zoom');
	if (slider) {
		diagram.scale = parseFloat(slider.value);
	}
}

function parseXML(xmlPath) {
	$.get(xmlPath, function(xml) {
		  var $modelInfo = $(xml).find('Model'),
		  LastUsedLayout = $modelInfo.attr('LastUsedLayout');

		  console.log('Last used layout : ' + LastUsedLayout);
		 $(xml).find('ProjectItemElement').each(function() {
			var $node = $(this);
			var ItemId = $node.find("ItemId").text();
			var ItemType = $node.find("ItemType").text();
			var Text = $node.find("Text").text();
			var Location = $node.find("Location").text();
			var Image;
			switch(ItemType)
			{
				case '32': Image = 'images/video.ico';	break;
				case '16': Image = 'images/node.ico';	break;
				case '3': Image = 'images/memo.ico';	break;
				default: Image = 'images/angrybird.jpg'; break;
			};
			nodes.push({'Text' : Text, 'key' : ItemId, 'ItemType' : ItemType, 'position' : Location, 'Image' : Image} );
		});

		  $(xml).find('Link').each(function() {
			 var $node = $(this);
			 var FromItemKey = $node.find("FromItemKey").text();
			 var ToItemKey = $node.find("ToItemKey").text();
			 var AssociationType = $node.find("AssociationType").text();
			var association;
			switch(AssociationType)
		    {
			   case '1': association = 'Codes';	break;
			   case '3': association = 'Child'; break;
			   case '10': association = 'Memo Link'; break;
			   default: association = 'zzz'; break;
		    };

			 links.push({'from' : FromItemKey, 'to' : ToItemKey, 'association' : association});
		});

    	diagram.model = new go.GraphLinksModel(nodes, links);
	});
}