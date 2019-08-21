import * as React from "react";
// import Trashcan from "../../images/icons/trash.png";
// import DocSettings from "../../images/icons/docSettings.png";
// import Gear from "../../images/icons/gear.png";
// import Lock from "../../images/icons/lock.png";
// import PaintBucket from "../../images/icons/paintBucket.png";
// import Plus from "../../images/icons/plus.png";
// import ZoomIn from "../../images/icons/zoomIn.png";
// import ZoomOut from "../../images/icons/zoomOut.png";
import { connect } from "react-redux";
import { saveCanvas, getCanvasById, deleteProject, setDeleteState, setSimulationState } from "../../actions";
import DeleteModal from "../DeleteModal.js";
import SimulationModal from "../SimulationModal.js";

import createEngine, {
  DiagramModel,
  DefaultNodeFactory,
  DefaultLinkFactory,
  DefaultLinkModel,
  PointModel
} from "@projectstorm/react-diagrams";
import { JSCustomNodeFactory } from "./custom-node-js/JSCustomNodeFactory";
import { JSCustomNodeModel } from "./custom-node-js/JSCustomNodeModel";
import { BodyWidget } from "./BodyWidget";

import Swatches from '../Swatches/Swatches';

// create an instance of the engine
let engine = createEngine();

// register the two engines
engine.getNodeFactories().registerFactory(new JSCustomNodeFactory());
engine.getNodeFactories().registerFactory(new DefaultNodeFactory());
engine.getLinkFactories().registerFactory(new DefaultLinkFactory());

// create a diagram model
const model = new DiagramModel();

// install the model into the engine
engine.setModel(model);
engine.setMaxNumberPointsPerLink(0);

// ------------- SERIALIZING ------------------
let str = JSON.stringify(model.serialize());

// ------------- DESERIALIZING ----------------
let cerealBox = new DiagramModel();
cerealBox.deserializeModel(JSON.parse(str), engine);
engine.setModel(cerealBox);

class CustomExample extends React.Component {
  constructor(props){
    super(props);
    this.ENTER_KEY = 13;
    this.state = {
      selectedColor: "#B80000",
      canvas_stop: false,
      project_title: null,
      project_title_class: false,
      delete_project: false,
      simulate_project: false
    }
  }

  componentDidMount(){
    this.getCanvas();
  }

  componentDidUpdate(prevProps, prevState){
    // If canvas is Saved retrieve new canvas
    if(this.props.saving_canvas !== prevProps.saving_canvas && this.props.saving_canvas === false){
      this.getCanvas();
    }

    // Handle Project title update on initial load
    if(((this.state.project_title !== this.props.project_title && this.state.project_title === null) || prevProps.project_title !== this.props.project_title)){
        this.setState({
          ...this.state,
          project_title: this.props.project_title
        });
      }

    // Handle Project canvas update on initial load
    if(this.props.fetching !== prevProps.fetching && this.props.fetching === false && this.props.graph_json !== null){
      setTimeout(()=>{
        cerealBox = new DiagramModel();
        cerealBox.deserializeModel(this.props.graph_json, engine);
        engine.setModel(cerealBox);
      },0);
    }
  //       // Handle Project canvas update on initial load
  //       if(this.props.project_id !== prevProps.project_id && this.props.fetching !== prevProps.fetching && this.props.fetching === false && this.props.graph_json !== null){
  //         setTimeout(()=>{
  //           cerealBox = new DiagramModel();
  //           cerealBox.deserializeModel(this.props.graph_json, engine);
  //           // engine.setDiagramModel(cerealBox);
  //           engine.setModel(cerealBox);
  //           engine.repaintCanvas();
  //         },0);
  //       }

  //       // Handle Project canvas update on initial load
        if(this.props.project_id !== prevProps.project_id && this.props.fetching !== prevProps.fetching && this.props.fetching === false && this.props.graph_json !== null && this.props.graph_json !== prevProps.graph_json){
          setTimeout(()=>{
            cerealBox = new DiagramModel();
            cerealBox.deserializeModel(this.props.graph_json, engine);
            engine.setModel(cerealBox);
          },0);
        }

        if(this.props.graph_json !== null && this.props.graph_json !== prevProps.graph_json){
          setTimeout(()=>{
            cerealBox = new DiagramModel();
            cerealBox.deserializeModel(this.props.graph_json, engine);
            engine.setModel(cerealBox);
          },0);
        }

        if(this.props.graph_json === null){
          cerealBox = new DiagramModel();
          engine.setModel(cerealBox);
        }
  }

  handleChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  }

  handleEdit = (name) => {
    if (name === "project_title") {
      this.setState({
        ...this.state,
        project_title_class: !this.state.project_title_class
      });
  }
  }

  handleKeyDown = (event) => {
    if (event.which === this.ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  handleSubmit = (event) => {
  if (event.target.name === "project_title") {
    this.setState({
      ...this.state,
      project_title: this.state[event.target.name],
      project_title_class: !this.state.project_title_class
    });
    this.updateTitle();
  }
  }

  updateTitle = () => {
    const objUpdate = {
        "project_title": this.state.project_title,
    }
    this.props.saveCanvas(objUpdate, this.props.project_id);
  }

  updateSelectedColor = selectedColor => {
    let selectedItems = cerealBox.getSelectedItems();
    this.setState({selectedColor}, () => this.changeColor(selectedItems))
  };

  createNode = () => {
    let newItem = new JSCustomNodeModel();
    newItem.nameNode("Enter Node Name...");
    newItem.provideDescription("Enter Description...");
    newItem.setPosition(0, 0);
    cerealBox.addNode(newItem);
    this.saveCanvas();

  };

  deleteItem = (item) => {
    // Checks if a node or wire is selected
    if (item.length !== 0) {
      for(let i = 0; i < item.length; i++){
        if (item[i] instanceof JSCustomNodeModel) {
          // Delete Nodes
          let promise = new Promise((resolve, reject)=>{
            resolve(item[i].removePorts(engine));
          });
          promise.then(()=>{
            cerealBox.removeNode(item[i]);
          });
          promise.then(()=>{
            engine.repaintCanvas();
          });
        } else if (item[i] instanceof PointModel) {
          // cerealBox.removeLink(item[i].parent);
          // engine.repaintCanvas();
          let promise = new Promise((resolve, reject)=>{
            resolve(cerealBox.removeLink(item[i].parent));
          });
          promise.then(()=>{
            engine.repaintCanvas();
          });
        } else if (item[i] instanceof DefaultLinkModel) {
          // Delete Links
          
          // engine.repaintCanvas();
          let promise = new Promise((resolve, reject)=>{
            resolve(cerealBox.removeLink(item[i]));
          });
          promise.then(()=>{
            engine.repaintCanvas();
          });
        }
      }
    } 
  };

  changeColor = (item) => {
    // Checks if a node or wire is selected
    // console.log(item[0])
    // console.log('line 78: item[0].constructor.name', item[0].constructor.name)
    if (item.length !== 0) {
      if (item[0] instanceof JSCustomNodeModel) {
        // console.log('JSCustomNodeModel detected');
        // Change Node Color
        // item[0].removePorts();
        // engine.repaintCanvas();
      } else if (item[0] instanceof PointModel) {
        // console.log('PointModel detected');
        // Change Link Color
        // console.log("----");
        item[0].parent.setColor(this.state.selectedColor);
        engine.repaintCanvas();
      } else if (item[0] instanceof DefaultLinkModel) {
        // console.log('Link detected');
        // Change Link Color
        item[0].setColor("#FCCB00");
        engine.repaintCanvas();
      }
    } 
  };

  zoomOut = () => {
    let zoomLevel = cerealBox.getZoomLevel()
    zoomLevel += 10;
    cerealBox.setZoomLevel(zoomLevel);
    cerealBox.fireEvent({ zoomLevel }, 'zoomUpdated');
    engine.repaintCanvas();
  };

  zoomIn = () => {
    let zoomLevel = cerealBox.getZoomLevel()
    zoomLevel -= 10;
    cerealBox.setZoomLevel(zoomLevel);
    cerealBox.fireEvent({ zoomLevel }, 'zoomUpdated');
    engine.repaintCanvas();
  };

  getCanvas = () => {
    this.props.getCanvasById(this.props.project_id);
  }

  saveCanvas = () => {
    let savedCanvas = cerealBox.serialize();
    console.log("savedCanvas------------", savedCanvas);
    let count = 0, key, objUpdate;
    for (key in savedCanvas.layers[1].models) {
      if (savedCanvas.layers[1].models.hasOwnProperty(key)) count++;
    }
    if(count === 0){
      objUpdate = {
        project_title: this.props.project_title,
        graph_json: savedCanvas,
        user_id: this.props.user_id,
        initial_node_id: null 
      }
    }
    else if(count > 0 /* &&savedCanvas.layers[1].models[0].id*/){
      objUpdate = {
          project_title: this.props.project_title,
          graph_json: savedCanvas,
          user_id: this.props.user_id,
          initial_node_id: null
      }
    }
    this.props.saveCanvas(objUpdate, this.props.project_id);
  }

  render() {
    engine.repaintCanvas();
    return (
      <div className="diagram-page">
        <DeleteModal props={this.props.props}/>
        <SimulationModal props={this.props.props}/>
        <section className="title-and-buttons">
          <h2
            title="Double Click to Edit Title"
            className={this.state.project_title_class ? "hidden" : ""}
            onDoubleClick={()=>this.handleEdit("project_title")}>
            {this.state.project_title}
          </h2>
            <input
              name="project_title"
              placeholder="Enter something..."
              className={this.state.project_title_class ? "" : "hidden"}
              value={this.state.project_title}
              onChange={this.handleChange}
              onKeyDown={(event)=>{
                this.handleKeyDown(event)
                }}
              onKeyUp={(event) => {
              event.stopPropagation()
            }}
            />
          <div className="project-buttons">
            <button
              className="cursor"
              onClick={(event) => {
                this.saveCanvas(event);
              }}
            >
              Save
            </button>
            <button
              className="cursor"
              onClick={() => {
                this.props.setSimulationState(this.props.simulate_project);
              }}
            >
              Simulate App
            </button>
            <button
              onClick={() => {
                console.log("Publish");
              }}
            >
              Publish
            </button>
            <button
              className="cursor"
              onClick={() => {
                this.props.setDeleteState(this.props.delete_project);
              }}
            >
              Delete Project
            </button>
          </div>
        </section>

        <section className="taskbar">
        <div className="taskbar-container">
            <div className="taskbar-section">
              <i 
                className="fas fa-plus-square"
                title="Add Screen"
                onClick={() => {
                  this.createNode();
                }}
              ></i>
            </div>
               <div className="taskbar-section">
              <i 
                className="fas fa-search-plus"
                title="Zoom In"
                onClick={() => {
                  this.zoomOut();
                }}
              ></i>
            </div>
            <div className="taskbar-section">
               <i 
                className="fas fa-search-minus"
                title="Zoom Out"
                onClick={() => {
                  this.zoomIn();
                }}
               ></i>
               </div>
            <div className="taskbar-section">
              <i 
                className="fas fa-trash-alt"
                title="Delete Selected Items"
                onClick={() => {
                  let model = engine.getModel();
                  let selectedItems = model.getSelectedEntities();
                  this.deleteItem(selectedItems);
                }}
              ></i>
            </div>
            </div>

        </section>
        
        {
        (this.props.delete_project || this.props.fetching)?(
          <></>
        ):(
        <BodyWidget engine={engine} />
        )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user_id: state.user_id,
  project_id: state.project_id,
  project_title: state.project_title,
  graph_json: state.graph_json,
  fetching: state.fetching,
  error: state.error,
  loggedIn: state.loggedIn,
  saving_canvas: state.saving_canvas,
  delete_project: state.delete_project,
  simulate_project: state.simulate_project
});

export default connect(
  mapStateToProps,
  { saveCanvas, getCanvasById, deleteProject, setDeleteState, setSimulationState }
  )(CustomExample); 


      // Handle Project canvas update on initial load not the same json object
    // if(this.props.graph_json !== prevProps.graph_json && this.props.graph_json !== null){
    //   console.log("if ---------- 2");
    //   setTimeout(()=>{
    //     cerealBox.deSerializeDiagram(this.props.graph_json, engine);
    //     engine.setDiagramModel(cerealBox);
    //     engine.repaintCanvas();
    //   },0);
    // }
    // else{
    //   engine.setDiagramModel(model);
    //   engine.repaintCanvas();
    // }

    // {/* <div className="taskbar-section">
    //           <img 
    //             src={PaintBucket} 
    //             alt="alt text" 
    //             // onClick={() => {
    //             //   let selectedItems = cerealBox.getSelectedItems();
    //             //   console.log('SELECTED ITEM', selectedItems)
    //             //   this.changeColor(selectedItems);
    //             // }}
    //           />
    //           <Swatches cerealBox={cerealBox} changeColor={this.changeColor} updateSelectedColor={this.updateSelectedColor} />
    //         </div>
    //         <div className="taskbar-section">
    //           <img src={Lock} alt="alt text" />
    //           <img src={Gear} alt="alt text" />
    //         </div> */}

    // {/* <div className="taskbar-section">
    //           <img src={DocSettings} alt="alt text" />
    //         </div> */}