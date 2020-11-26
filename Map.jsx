import React, { Component } from 'react';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import LayerGroup from 'ol/layer/Group';
import Projection from 'ol/proj/Projection';
import * as olProj from 'ol/proj'
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { Panel } from 'primereact/panel';
import Checkbox from '@material-ui/core/Checkbox';
import '../react-geo.css';
import 'ol/ol.css';
import 'antd/dist/antd.css';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Tree } from 'primereact/tree';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MapService from '../apis/MapService';

import {
    MapComponent
} from '@terrestris/react-geo';

class MapTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            urlGenerico: "http://181.39.104.154/geoserver/globalGad/wms",
            format: 'image/png',
            formatRaster: 'image/gif',
            capaTematica: [],
            grupoTematico: [],
            baseLayers: null,
            projection: null,
            coberturas: null,
            checked: true,
            center: olProj.fromLonLat([-78.566820, -0.511779]),
            layer: null,
            showMap: false,
            map: null,
            satellite: null,
            streetView: null,
            mapView: "street",
            selectedLayers: null,
            layerNodes: null,
            showTree:false,
            nodes: [
                {
                    key: 1,
                    label: "Capa1",
                    data: 'Documents Folder',
                    checked: true
                },
                {
                    key: 2,
                    label: "Capa 2",
                    data: 'Documents Folder',
                    checked: true
                }
            ],
            capasActivas: null,
            baseLayer:null,
        };
    }
    grupoDinamico(titulo, _capa) {
        let capa = new LayerGroup({
            layers: [_capa],
            name: titulo
        });
        return capa;
    }
    capaDinamica = (titulo, capa) => {
        var cap = new TileLayer({
            title: titulo,
            baseLayer: true,
            visible: true,
            source: new TileWMS({
                url: this.state.urlGenerico,
                params: {
                    'FORMAT': this.state.format,
                    'VERSION': '1.1.1',
                    tiled: true,
                    STYLES: '',
                    LAYERS: capa
                }
            })
        });
        return cap;
    };
    configureCoberturas = (grupotematico) => {
        let coberturas = new LayerGroup({
            //layers: capatematica,
            layers: grupotematico,
            name: 'Coberturas'
        });
        return coberturas;
    }
    configureProjection = () => {
        let projection = new Projection({
            code: 'EPSG:32717',
            units: 'm',
            axisOrientation: 'neu',
            global: false
        });
        return projection;
    }

    convertToLayerGroup = (records) => {
        let layers = [];
        records.children.forEach(row => {
            let individualLayer = new TileLayer({
                title: row.title,
                baseLayer: true,
                source: new TileWMS({
                    url: this.state.urlGenerico,
                    params: {
                        'FORMAT': this.state.format,
                        'VERSION': '1.1.1',
                        tiled: true,
                        STYLES: '',
                        LAYERS: row.layers
                    }
                })
            });
            layers.push(individualLayer);
        });

        let baseLayers = new LayerGroup(
        {
            name: records.name,
            title: records.tilte,
            displayInLayerSwitcher: true,
            openInLayerSwitcher: true,
            layers
        });
        return baseLayers;

    }
    configureBaseLayers = () => {


    }
    addDynamicLayer=(object,children)=>{
        let object2={...object};
        let filteredChild=[];
            object.children.forEach(objectChild=>{
                if(children.includes(objectChild.layers))filteredChild.push(objectChild);
        });
        object2.children=[...filteredChild];
        console.log(object2);
        this.state.map.addLayer(this.convertToLayerGroup(object2));
    }
    addLayer = (name) => {
        switch (name) {
            case "Coberturas": {
                this.state.map.addLayer(this.state.coberturas);
                break;
            }
            case "capaBase": {
                this.state.map.addLayer(this.state.baseLayers);
                break;
            }
            case "satellite": {
                this.state.map.addLayer(this.state.satellite);
                break;
            }
            case "streetView": {
                this.state.map.addLayer(this.state.streetView);
                break;
            }
            default: break;
        }


    }
    removeLayer = (layerName) => {
        this.state.map.getLayers().getArray()
            .filter(layer => layer.get('name') === layerName)
            .forEach(layer => this.state.map.removeLayer(layer));
    };
    setTreeNodes=(records)=>{
        let layerNodes=[];
        records.forEach(row=>{
            let children=[];
            if(typeof row.children!=="undefined"){
                row.children.forEach(child=>{
                    let temp={
                        key:   "_"+row.name+"_"+child.layers,
                        label: child.title,
                        data: 'Documents Folder'
                    };
                    children.push(temp);
                }
                );
            }
            let unitNode={
                key:"parent_"+row.name,
                label:row.title,
                data:'Documents Folder',
                children
            };
            layerNodes.push(unitNode);
        });

        this.setState({layerNodes},()=>{
            this.setState({showTree:true});
        })
        
    }
    initLayers=async()=>{
        let baseLayer = [{
            name: "capaBase",
            title: 'Capa Base',
            children: [
                {
                    title: 'Manzanas',
                    layers: 'globalGad:cat_manzana'
                },
                {
                    title: 'Predios',
                    layers: 'globalGad:cat_predio'
                },
                {
                    title:'Piso',
                    layers:'globalGad:cat_piso_unidad_predio'
                }
            ]
        }];
        let coberturaPromise=await MapService.obtenerListaFuente();
        let covert={
            name: "cobertura",
            title: 'Cobertura',
            children:[]
        };
        coberturaPromise.data.forEach(record=>{
            let child={
                title:record.titulo,
                layers:record.layer
            };
            covert["children"].push(child);
        });
        baseLayer.push(covert);

        this.setTreeNodes(baseLayer);
        this.setState({baseLayer});
    }
    componentDidMount(){
        this.initLayers();

        

        let projection = this.configureProjection();
        
        this.setState({
            //baseLayers,
            projection,
        });


        const streetView = new OlLayerTile({
            name: "streetView",
            source: new OlSourceOsm()
        });
        const satellite = new TileLayer({
            name: "satellite",
            source: new XYZ({
                attributions: ['Powered by Esri', 'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
                attributionsCollapsible: false,
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 30
            })
        });
        this.setState({
            streetView,
            satellite
        }, () => {
            const map = new OlMap({
                view: new OlView({
                    center: this.state.center,
                    zoom: 16,
                }),
                layers: [this.state.streetView]
            });
            this.setState({
                map
            }, () => {
                this.setState({ showMap: true });
            });

        });



    }
    handleViewChange = () => {
        switch (this.state.mapView) {
            case "street": {
                this.removeLayer("satellite");
                this.addLayer("street");
                break;
            }
            case "satellite": {
                this.removeLayer("street");
                this.addLayer("satellite");
                break;
            }
            default: break;
        }
    }
    processActiveLayers=(selectionNodes)=>{
        let parents=[];
        let possibleParents=[];
        this.state.baseLayer.forEach(layer=>{
            possibleParents.push(layer.name);
        });
        Object.keys(selectionNodes).forEach(keyRow=>{
            if(keyRow.includes("parent_"))parents.push(keyRow.replace('parent_',''));
            possibleParents.forEach(possible=>{
                if(keyRow.includes("_"+possible+"_"))parents.push(possible);
            });
        });
        let uniqParents = [...new Set(parents)];
        uniqParents.forEach(parent=>{
            this.removeLayer(parent);
            let children=[];
            Object.keys(selectionNodes).forEach(keyRow=>{
                if(keyRow.includes("_"+parent+"_"))children.push(keyRow.replace("_"+parent+"_",''));
            });
            this.state.baseLayer.forEach(layer=>{
                if(layer.name===parent){
                    this.addDynamicLayer(layer,children)
                }
            });
       });
    }
    render() {
        return (
            <React.Fragment>

                <Grid container spacing={0}>
                    <Grid item xs={12} sm={3}>
                        <Panel header="Capas" style={{ maxHeight: "50vh", minHeight: "50vh", minWidth:"100%"}}>
                            <Paper elevation={0} style={{ maxHeight: "40vh", minHeight: "40vh", overflow: 'auto', overflowX: "auto" }} >
                                {this.state.showTree&&
                                <Tree value={this.state.layerNodes} selectionMode="checkbox"
                                    selectionKeys={this.state.selectedLayers}
                                    onSelectionChange={e => {
                                        this.setState({ selectedLayers: e.value },()=>{
                                            this.processActiveLayers(e.value);
                                        });
                                        
                                    }
                                
                                }
                                />
                                }

                            </Paper>
                        </Panel>
                        <Panel header="Vista" style={{ maxHeight: "50vh", minHeight: "50vh"}}>
                            <Paper elevation={0} style={{ maxHeight: "40vh", minHeight: "40vh", overflow: 'auto', overflowX: "auto" }} >
                                <br />

                                <FormControl component="fieldset" style={{marginLeft:'20px'}}>
                                    <FormLabel component="legend">Escoja Vista</FormLabel>
                                    <RadioGroup aria-label="gender"
                                        name="view" value={this.state.mapView}
                                        onChange={(event) => {
                                            this.setState({ mapView: event.target.value }, () => {
                                                this.handleViewChange();
                                            });
                                        }}
                                        color="primary"
                                    >
                                        <FormControlLabel value="street" control={<Radio color="primary" />} label="Vista por Calles" />
                                        <FormControlLabel value="satellite" control={<Radio color="primary" />} label="Satélite" />
                                    </RadioGroup>
                                </FormControl>
                            </Paper>
                        </Panel>
                    </Grid>
                    <Grid item xs={12} sm={9}  style={{ maxHeight: "90vh", minHeight: "90vh"}}>
                        {this.state.showMap &&
                            <MapComponent
                                map={this.state.map}
                            />
                        }
                    </Grid>

                </Grid>



            </React.Fragment>
        );
    }
}
export default MapTest;