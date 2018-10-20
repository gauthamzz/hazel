    function useless(){
        var instance = jsPlumb.getInstance({
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            PaintStyle: { stroke: '#666' },
            EndpointHoverStyle: { fill: "orange" },
            HoverPaintStyle: { stroke: "orange" },
            EndpointStyle: { width: 20, height: 16, stroke: '#666' },
            Endpoint: "Rectangle",
            Anchors: ["TopCenter", "TopCenter"],
            Container: "canvas"
        });
    
        // suspend drawing and initialise.
        instance.batch(function () {
    
            // bind to connection/connectionDetached events, and update the list of connections on screen.
            instance.bind("connection", function (info, originalEvent) {
                updateConnections(info.connection);
            });
            instance.bind("connectionDetached", function (info, originalEvent) {
                updateConnections(info.connection, true);
            });
    
            instance.bind("connectionMoved", function (info, originalEvent) {
                //  only remove here, because a 'connection' event is also fired.
                // in a future release of jsplumb this extra connection event will not
                // be fired.
                updateConnections(info.connection, true);
            });
    
            instance.bind("click", function (component, originalEvent) {
                // alert("click!")
            });
    
            // configure some drop options for use by all endpoints.
            var exampleDropOptions = {
                tolerance: "touch",
                hoverClass: "dropHover",
                activeClass: "dragActive"
            };
    
            //
            // first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint),
            // and it's both a source and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection
            // starting from this Endpoint is of type 'exampleConnection' and can only be dropped on an Endpoint target
            // that declares 'exampleEndpoint' as its drop scope, and also that
            // only 'exampleConnection' types can be dropped here.
            //
            // the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a strokeWidth of
            // 5 pixels, and a gradient.
            //
            // there is a 'beforeDrop' interceptor on this endpoint which is used to allow the user to decide whether
            // or not to allow a particular connection to be established.
            //
            var exampleColor = "#00f";
            var exampleEndpoint = {
                endpoint: "Rectangle",
                paintStyle: { width: 8, height: 8, fill: exampleColor },
                isSource: true,
                anchor: "Right",
                reattach: true,
                scope: "blue",
                connectorStyle: {
                    gradient: {stops: [
                        [0, exampleColor],
                        [0.5, "#09098e"],
                        [1, exampleColor]
                    ]},
                    strokeWidth: 5,
                    stroke: exampleColor,
                    dashstyle: "2 2"
                },
                isTarget: true,
                beforeDrop: function (params) {
                    return confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
                },
                dropOptions: exampleDropOptions
            };
    
            var example3Color = "rgba(229,219,61,0.5)";
            var exampleEndpoint3 = {
                endpoint: ["Dot", {radius: 8} ],
                anchor: "Left",
                paintStyle: { fill: example3Color, opacity: 0.5 },
                isSource: true,
                scope: 'blue',
                connectorStyle: {
                    stroke: example3Color,
                    strokeWidth: 4
                },
                connector: "Straight",
                isTarget: true,
                dropOptions: exampleDropOptions,
                beforeDetach: function (conn) {
                    return confirm("Detach connection?");
                },
                onMaxConnections: function (info) {
                    // alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
                }
            };
    
            var example2Color = "rgba(0,219,61,0.5)";
            var exampleEndpoint2 = {
                endpoint: ["Dot", {radius: 8} ],
                anchor: [0,0.8,1,0],
                paintStyle: { fill: example2Color, opacity: 0.5 },
                isSource: true,
                scope: 'blue',
                connectorStyle: {
                    stroke: example2Color,
                    strokeWidth: 4
                },
                connector: "Straight",
                isTarget: true,
                dropOptions: exampleDropOptions,
                beforeDetach: function (conn) {
                    return confirm("Detach connection?");
                },
                onMaxConnections: function (info) {
                    // alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
                }
            };
    
       
            var anchors = [
                    [1, 0.2, 1, 0],
                    [0.8, 1, 0, 1],
                    [0, 0.8, -1, 0],
                    [0.2, 0, 0, -1]
                ],
                maxConnectionsCallback = function (info) {
                    // alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
                };
    
            // make .window divs draggable
            instance.draggable(jsPlumb.getSelector(".drag-drop-demo .window"));
    
            // add endpoint of type 3 using a selector.
            instance.addEndpoint(jsPlumb.getSelector(".drag-drop-demo .window"), exampleEndpoint3);
            instance.addEndpoint(jsPlumb.getSelector(".drag-drop-demo .window"), exampleEndpoint);
            instance.addEndpoint(jsPlumb.getSelector(".drag-drop-demo .window"), exampleEndpoint2);
            var hideLinks = jsPlumb.getSelector(".drag-drop-demo .hide");
    
            instance.on(hideLinks, "click", function (e) {
                instance.toggleVisible(this.getAttribute("rel"));
                jsPlumbUtil.consume(e);
            });
    
            var dragLinks = jsPlumb.getSelector(".drag-drop-demo .drag");
            instance.on(dragLinks, "click", function (e) {
                var s = instance.toggleDraggable(this.getAttribute("rel"));
                this.innerHTML = (s ? 'disable dragging' : 'enable dragging');
                jsPlumbUtil.consume(e);
            });
    
            var detachLinks = jsPlumb.getSelector(".drag-drop-demo .detach");
            instance.on(detachLinks, "click", function (e) {
                instance.deleteConnectionsForElement(this.getAttribute("rel"));
                jsPlumbUtil.consume(e);
            });
    
            instance.on(document.getElementById("clear"), "click", function (e) {
                instance.detachEveryConnection();
                showConnectionInfo("");
                jsPlumbUtil.consume(e);
            });
        });
    
        jsPlumb.fire("jsPlumbDemoLoaded", instance);
    
    }
    
    var listDiv = document.getElementById("list"),

    showConnectionInfo = function (s) {
        listDiv.innerHTML = s;
        listDiv.style.display = "block";
    },
    hideConnectionInfo = function () {
        listDiv.style.display = "none";
    },
    connections = [],
    updateConnections = function (conn, remove) {
        if (!remove) connections.push(conn);
        else {
            var idx = -1;
            for (var i = 0; i < connections.length; i++) {
                if (connections[i] == conn) {
                    idx = i;
                    break;
                }
            }
            if (idx != -1) connections.splice(idx, 1);
        }
        if (connections.length > 0) {
            var s = "<span><strong>Connections</strong></span><br/><br/><table><tr><th>Scope</th><th>Source</th><th>Target</th></tr>";
            for (var j = 0; j < connections.length; j++) {
                s = s + "<tr><td>" + connections[j].scope + "</td>" + "<td>" + connections[j].sourceId + "</td><td>" + connections[j].targetId + "</td></tr>";
            }
            showConnectionInfo(s);
        } else
            hideConnectionInfo();
    };

jsPlumb.ready(function () {

    var instance = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        PaintStyle: { stroke: '#666' },
        EndpointHoverStyle: { fill: "orange" },
        HoverPaintStyle: { stroke: "orange" },
        EndpointStyle: { width: 20, height: 16, stroke: '#666' },
        Endpoint: "Rectangle",
        Anchors: ["TopCenter", "TopCenter"],
        Container: "canvas"
    });

    // suspend drawing and initialise.
    instance.batch(function () {

        // bind to connection/connectionDetached events, and update the list of connections on screen.
        instance.bind("connection", function (info, originalEvent) {
            updateConnections(info.connection);
        });
        instance.bind("connectionDetached", function (info, originalEvent) {
            updateConnections(info.connection, true);
        });

        instance.bind("connectionMoved", function (info, originalEvent) {
            //  only remove here, because a 'connection' event is also fired.
            // in a future release of jsplumb this extra connection event will not
            // be fired.
            updateConnections(info.connection, true);
        });

        instance.bind("click", function (component, originalEvent) {
            // alert("click!")
        });

        // configure some drop options for use by all endpoints.
        var exampleDropOptions = {
            tolerance: "touch",
            hoverClass: "dropHover",
            activeClass: "dragActive"
        };

        //
        // first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint),
        // and it's both a source and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection
        // starting from this Endpoint is of type 'exampleConnection' and can only be dropped on an Endpoint target
        // that declares 'exampleEndpoint' as its drop scope, and also that
        // only 'exampleConnection' types can be dropped here.
        //
        // the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a strokeWidth of
        // 5 pixels, and a gradient.
        //
        // there is a 'beforeDrop' interceptor on this endpoint which is used to allow the user to decide whether
        // or not to allow a particular connection to be established.
        //
        var exampleColor = "#00f";
        var exampleEndpoint = {
            endpoint: "Rectangle",
            paintStyle: { width: 8, height: 8, fill: exampleColor },
            isSource: true,
            anchor: "Right",
            reattach: true,
            scope: "blue",
            connectorStyle: {
                gradient: {stops: [
                    [0, exampleColor],
                    [0.5, "#09098e"],
                    [1, exampleColor]
                ]},
                strokeWidth: 5,
                stroke: exampleColor,
                dashstyle: "2 2"
            },
            isTarget: true,
            beforeDrop: function (params) {
                return confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
            },
            dropOptions: exampleDropOptions
        };

        var example3Color = "rgba(229,219,61,0.5)";
        var exampleEndpoint3 = {
            endpoint: ["Dot", {radius: 8} ],
            anchor: "Left",
            paintStyle: { fill: example3Color, opacity: 0.5 },
            isSource: true,
            scope: 'blue',
            connectorStyle: {
                stroke: example3Color,
                strokeWidth: 4
            },
            connector: "Straight",
            isTarget: true,
            dropOptions: exampleDropOptions,
            beforeDetach: function (conn) {
                return confirm("Detach connection?");
            },
            onMaxConnections: function (info) {
                // alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
            }
        };

        var example2Color = "rgba(0,219,61,0.5)";
        var exampleEndpoint2 = {
            endpoint: ["Dot", {radius: 8} ],
            anchor: [0,0.8,1,0],
            paintStyle: { fill: example2Color, opacity: 0.5 },
            isSource: true,
            scope: 'blue',
            connectorStyle: {
                stroke: example2Color,
                strokeWidth: 4
            },
            connector: "Straight",
            isTarget: true,
            dropOptions: exampleDropOptions,
            beforeDetach: function (conn) {
                return confirm("Detach connection?");
            },
            onMaxConnections: function (info) {
                // alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
            }
        };

   
        var anchors = [
                [1, 0.2, 1, 0],
                [0.8, 1, 0, 1],
                [0, 0.8, -1, 0],
                [0.2, 0, 0, -1]
            ],
            maxConnectionsCallback = function (info) {
                // alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
            };

        // make .window divs draggable
        instance.draggable(jsPlumb.getSelector(".drag-drop-demo .window"));

        // add endpoint of type 3 using a selector.
        instance.addEndpoint(jsPlumb.getSelector(".drag-drop-demo .window"), exampleEndpoint3);
        instance.addEndpoint(jsPlumb.getSelector(".drag-drop-demo .window"), exampleEndpoint);
        instance.addEndpoint(jsPlumb.getSelector(".drag-drop-demo .window"), exampleEndpoint2);
        var hideLinks = jsPlumb.getSelector(".drag-drop-demo .hide");

        instance.on(hideLinks, "click", function (e) {
            instance.toggleVisible(this.getAttribute("rel"));
            jsPlumbUtil.consume(e);
        });

        var dragLinks = jsPlumb.getSelector(".drag-drop-demo .drag");
        instance.on(dragLinks, "click", function (e) {
            var s = instance.toggleDraggable(this.getAttribute("rel"));
            this.innerHTML = (s ? 'disable dragging' : 'enable dragging');
            jsPlumbUtil.consume(e);
        });

        var detachLinks = jsPlumb.getSelector(".drag-drop-demo .detach");
        instance.on(detachLinks, "click", function (e) {
            instance.deleteConnectionsForElement(this.getAttribute("rel"));
            jsPlumbUtil.consume(e);
        });

        instance.on(document.getElementById("clear"), "click", function (e) {
            instance.detachEveryConnection();
            showConnectionInfo("");
            jsPlumbUtil.consume(e);
        });
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);

});



$(document).ready(function() {
    $("#dash").click(function(){
        $("#canvas").append("<div class='window' id='dash1'>dash<input class='input' type='text' placeholder='Text input'></div>");
        useless();
    })
    $("#input").click(function(){
        $("#canvas").append("<div class='window' id='Input'>Input<input class='input' type='text' placeholder='Text input'></div>");
        useless();
    })
    $("#model").click(function(){
        $("#canvas").append("<div class='window' id='model'>Model</div>");
        useless();
    })
    $("#conv2D").click(function(){
        $("#canvas").append("<div class='window' id='Conv2D'>Conv2D<input class='input' type='text' placeholder='Text input'></div>");
        useless();
    })
    $("#maxPooling2D").click(function(){
        $("#canvas").append("<div class='window' id='MaxPooling2D'>MaxPooling2D<input class='input' type='text' placeholder='Text input'></div>");
        useless();
    })
    $("#dropout").click(function(){
        $("#canvas").append("<div class='window' id='Dropout'>Dropout<input class='input' type='text' placeholder='Text input'></div>");
        useless();
    })
    $("#flatten").click(function(){
        $("#canvas").append("<div class='window' id='Flatten'>Flatten<input class='input' type='text' placeholder='Text input'></div>");
        useless();
    })
    $("#dense").click(function(){
        $("#canvas").append("<div class='window' id='Dense'>Dense<input class='input' type='text' placeholder='Text input'></div>");
        useless();
    })
    $("#generate").click(function(){
        $("#canvas").append("<div class='window' id='Generate'>Generated Labels<input class='input' type='text' placeholder='Text input'></div>");
        useless();

    })
    $("#label").click(function(){
        $("#canvas").append("<div class='window' id='Label'>Label<input class='input' type='text' placeholder='Text input'></div>");
        useless();
    })
    $("#output").click(function(){
        $("#canvas").append("<div class='window' id='Output'>Output<input class='input' type='text' placeholder='Text input'></div>");
        useless();
    })
    $("#automl").click(function(){
        $("#canvas").append("<div class='window' id='AutoML'>Image Classifier<input class='input' type='text' placeholder='Text input'></div>");
        useless();
    })
    $("#train").click(function(event){
        event.preventDefault()
                // console.log(connections)
        
    var connects = []
    for(let j =0;j<connections.length;j++){
        var val1="";
        var val2="";
        $(`#${connections[j].sourceId}`).find('input[type=text]').each(function(){
            val1=$(this).val();
          });
          $(`#${connections[j].targetId}`).find('input[type=text]').each(function(){
            val2=$(this).val();
          });
        connects.push([connections[j].sourceId,val1,connections[j].targetId,val2])
        // console.log(connections[j].sourceId + " to " + connections[j].targetId)
        console.log(connects)
}

         $.ajax({
              type:"POST",
              url:"http://localhost:8000/submit/",
              data:  {'connects':JSON.stringify(connects)},
              success: function(){
                 console.log("Train Model")
              }
         });
         return true; //<---- move it here
    });
    
    $("#test").click(function(event){
        event.preventDefault();
        var fu1 = document.getElementById("fileOutput");
        res = fu1.value.slice(12, );
        // alert("You selected " + res);


        $.ajax({
            type:"POST",
            url:"http://localhost:8000/test/",
            data:  {
                'file': res
            },
            success: function(){
               console.log("Test Model")
            }
       });
       return true; //<---- move it here
    
    })

});