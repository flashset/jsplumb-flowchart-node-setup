import React, { Component } from "react";
import { jsPlumb } from "jsplumb";
import { Link } from "gatsby";
import { Button } from "react-bootstrap";

const JSPLUMB_ID = "jsplumb_box";

// #region Arrow

const arrowCommon = {
    foldback: 0.5,
    width: 14,
};
const overlays = [
    [
        "Arrow",
        {
            location: 1,
        },
        arrowCommon,
    ],
];
const jsPlumbSettings = {
    ConnectionOverlays: overlays,
};

// #endregion

//#region  edges and nodes
let edges = [
    {
        sourceId: 1,
        targetId: 2,
    }
];

let nodes = [
    {
        id: "1",
        type: "rectangle",
        name: "Node 1",
        style: { left: "100px", top: "100px" },
    },
    {
        id: "2",
        type: "diamond",
        name: "Node 2",
        style: { left: "450px", top: "50px" },
    },
    {
        id: "3",
        type: "circle",
        name: "Node 3",
        style: { left: "800px", top: "75px" },
    },
];
//#endregion

//#region endpoint styles
let sourceEndpointStyle = {
    fill: "#1fb139",
    fillStyle: "#1fb139",
};
let targetEndpointStyle = {
    fill: "#f65d3b",
    fillStyle: "#f65d3b",
};
let endpoint = [
    "Dot",
    {
        cssClass: "endpointClass",
        radius: 5,
        hoverClass: "endpointHoverClass",
    },
];
let connector = [
    "Flowchart",
    {
        cssClass: "connectorClass",
        hoverClass: "connectorHoverClass",
    },
];
let connectorStyle = {
    lineWidth: 2,
    stroke: "#15a4fa",
    strokeStyle: "#15a4fa",
};
let hoverStyle = {
    stroke: "#1e8151",
    strokeStyle: "#1e8151",
    lineWidth: 2,
};
let anSourceEndpoint = {
    endpoint: endpoint,
    paintStyle: sourceEndpointStyle,
    hoverPaintStyle: {
        fill: "#449999",
        fillStyle: "#449999",
    },
    isSource: true,
    maxConnections: -1,
    anchor: ["BottomCenter"],
    connector: connector,
    connectorStyle: connectorStyle,
    connectorHoverStyle: hoverStyle,
};
let anTargetEndpoint = {
    endpoint: endpoint,
    paintStyle: targetEndpointStyle,
    hoverPaintStyle: {
        fill: "#449999",
        fillStyle: "#449999",
    },
    isTarget: true,
    maxConnections: -1,
    anchor: ["TopCenter"],
    connector: connector,
    connectorStyle: connectorStyle,
    connectorHoverStyle: hoverStyle,
};
//#endregion

class Demo1 extends Component {
    state = {
        edges,
        nodes,
        jsPlumbInstance: null,
        isJsPlumbInstanceCreated: false,
        dragging: false, // Whether to trigger canvas drag
        nodeDragging: false, // Whether to trigger node drag
        _ratio: 0.25, // Roller ratio
        _scale: 1, // Canvas zoom ratio
        _left: 0, // Canvas Left position
        _top: 0, // Top position of the canvas
        _initX: 0, // Drag the X position when the mouse is pressed
        _initY: 0, // Drag the Y position when the mouse is pressed
    };
    componentDidUpdate() {
        if (this.state.jsPlumbInstance) {
            //#region endpoint styles
            //Draw a point
            let nodes = this.state.nodes;
            for (let i = 0; i < nodes.length; i++) {
                let nUUID = nodes[i].id;
                this.state.jsPlumbInstance.addEndpoint(
                    nUUID,
                    anSourceEndpoint,
                    {
                        uuid: nUUID + "-bottom",
                        anchor: "Bottom",
                        maxConnections: -1,
                    }
                );
                this.state.jsPlumbInstance.addEndpoint(
                    nUUID,
                    anTargetEndpoint,
                    {
                        uuid: nUUID + "-top",
                        anchor: "Top",
                        maxConnections: -1,
                    }
                );
                this.state.jsPlumbInstance.draggable(nUUID);
            }

            //Draw a line
            let edges = this.state.edges;
            for (let j = 0; j < edges.length; j++) {
                let connection = this.state.jsPlumbInstance.connect({
                    uuids: [
                        edges[j].sourceId + "-bottom",
                        edges[j].targetId + "-top",
                    ],
                });
                connection.setPaintStyle({
                    stroke: "#8b91a0",
                    strokeStyle: "#8b91a0",
                });
            }
            //#endregion
        }
    }

    componentDidMount() {
        jsPlumb.ready(() => {
            const jsPlumbInstance = jsPlumb.getInstance(jsPlumbSettings || {});
            jsPlumbInstance.setContainer(document.getElementById(JSPLUMB_ID));

            this.setState({
                isJsPlumbInstanceCreated: true,
                jsPlumbInstance,
            });
        });
    }

    render() {
        const nodesDom = this.state.nodes.map((node) => {
            const style = node.style || {};

            switch (node.type) {
                case "diamond":
                    return (
                        <div
                            className="sf-diamond"
                            key={node.id}
                            style={style}
                            id={node.id}
                        >
                            <div className="sf-diamond-inner">
                                <h3 className="sf-node-title">{node.name}</h3>
                            </div>
                        </div>
                    );

                case "circle":
                    return (
                        <div
                            className="sf-circle"
                            key={node.id}
                            style={style}
                            id={node.id}
                        >
                            <div className="sf-circle-inner">
                                <h3 className="sf-node-title">{node.name}</h3>
                            </div>
                        </div>
                    );
                default:
                    return (
                        <div
                            className="sf-rectagle"
                            key={node.id}
                            style={style}
                            id={node.id}
                        >
                            <div className="sf-rectagle-inner">
                                <h3 className="sf-node-title">{node.name}</h3>
                            </div>
                        </div>
                    );
            }
        });

        let translateWidth =
            (document.documentElement.clientWidth * (1 - this.state._scale)) /
            2;
        let translateHeight =
            ((document.documentElement.clientHeight - 60) *
                (1 - this.state._scale)) /
            2;

        return (
            <>
                <Link to="/blog/jsplumb-flowchart-node-setup">
                    <Button
                        variant="primary"
                        className="btn btn-primary btn-md m-2 float-right"
                    >
                        Go to Article
                    </Button>
                </Link>
                <div className="jsplumb-canvas-container">
                    <div key={JSPLUMB_ID} className="jsplumb-box">
                        <div
                            className="jsplumb-canvas"
                            ref={JSPLUMB_ID}
                            id={JSPLUMB_ID}
                            style={{
                                transformOrigin: "0px 0px 0px",
                                transform: `translate(${translateWidth}px, ${translateHeight}px) scale(${this.state._scale})`,
                            }}
                        >
                            {nodesDom}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Demo1;
