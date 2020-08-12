import React, { Component, createRef } from 'react';
import TablaDinamica from '../comun/TablaDinamica/TablaDinamica';
import MenuBarComponent from './comun/MenuBarComponent';
import Grid from '@material-ui/core/Grid';
import { Panel } from 'primereact/panel';
import { Tree } from 'primereact/tree';
import { connect } from 'react-redux';
import EtlServicio from '../../../api/EtlServicio';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { NotificationManager } from 'react-notifications';
import moment from "moment";
class Operaciones extends Component {
    constructor(props) {
        super(props);
        this.detalleRef = createRef();
        this.subdetalleRef = createRef();
        this.state = {
            treeData: [],
            nodoSeleccionado: null,
            mostrarOperaciones: false,
            operaciones: [],
            mostrarSubdetalle: false,
            subdetalleCabecera: [],
            contenidoSubdetalle: [],
            detalle: [],
            detalleCabecera: [],
            mostrarDetalle: false,
            estado: null,
            fecha: null,
            campoFiltro: null
        };
        this.iniciarOperaciones(this.obtenerCodigoComponente(this.props.breadcrumb.breadcrumb));
    }
    obtenerCodigoComponente=(componente)=>
    {
        var codigoOperacion=0;
        switch(componente)
        {
        case "costDriversUnidad":{
            codigoOperacion=3000;
            break;
        }
        case "costDriversProducto":{
            codigoOperacion=4000;
            break;
        }
        case "costos":{
            codigoOperacion=7000;
            break;
        }
        case "clientes":{
            codigoOperacion=2000;
            break;
        }
        case "factorRentabilidad":{
            codigoOperacion=5000;
            break;
        }
        case "valorFrenCarga":{
            codigoOperacion=6000;
            break;
        }
        case "transaccionPorCanal":{
            codigoOperacion=8000;
            break;
        }
        case "transaccionPorProducto":{
            codigoOperacion=9000;
            break;
        }
        case "operaciones":{
            codigoOperacion=1000;
            break;
        }
        default:break;
        }
        return codigoOperacion;
    }
    iniciarOperaciones = (codigo) => {
        const operacionesPromise = EtlServicio.ObtenerOperaciones(codigo);
        operacionesPromise.then(resultado => {
            let operaciones = [];
            const informacion = resultado.data;
            let claveRegistro = 0;
            informacion.forEach(registro => {
                const fila = {
                    key: claveRegistro,
                    label: registro.nombre,
                    data: 'Documents Folder',
                    icon: registro.campo1 === 1 ? 'pi pi-fw pi-check success_icon' : 'pi pi-fw pi-times error_icon'
                };
                let hijos = [];
                let subClave = 0;
                registro.estadoProcesoLista.forEach(estadoProceso => {
                    const estado = {
                        key: estadoProceso.codigo,
                        label: estadoProceso.descripcion,
                        data: 'Work Folder',
                        icon: registro.campo1 === 1 ? 'pi pi-fw pi-check success_icon' : 'pi pi-fw pi-times error_icon'
                    };
                    hijos.push(estado);
                    subClave = subClave + 1;
                });
                if (hijos.length > 0) fila.children = hijos;
                operaciones.push(fila);
                claveRegistro = claveRegistro + 1;
            });
            this.setState({
                operaciones,
                mostrarOperaciones: true,
                mostrarDetalle: false,
                mostrarSubdetalle: false
            }
            );
        }
        );
    }

    actualizar = () => {
        this.setState({ 
            mostrarOperaciones: false ,
            mostrarDetalle:false,
            mostrarSubdetalle:false
        }, () => {
            this.iniciarOperaciones(this.obtenerCodigoComponente(this.props.breadcrumb.breadcrumb));
        });
    }
    ejecutar = () => {
        var resultadoEjecucion = EtlServicio.ejecutarProceso(this.props.breadcrumb.breadcrumb);
        resultadoEjecucion.then(resultado => {
            var informacion = resultado.data;
            if (informacion === "Exito") NotificationManager.success(`Proceso Iniciado`);
            else NotificationManager.error('Error', informacion, 5000, () => {

            });
        });

    }
    cargarDetalles = () => {
        if (this.state.fecha !== null) {
            var esHomologacion = false;
            switch (this.state.nodoSeleccionado) {
                case 3301:
                case 3302:
                case 3303:
                case 3399: {
                    esHomologacion = true;
                    break;
                }
                default: break;
            }

            //const cargarDetalle = esHomologacion ? EtlServicio.ObtenerDetalleHomologacion(this.state.nodoSeleccionado, this.state.fecha) : EtlServicio.ObtenerDetalles(this.state.nodoSeleccionado, this.state.fecha);
            
            const cargarDetalle =EtlServicio.ObtenerDetalles(this.state.nodoSeleccionado, this.state.fecha);
           
            cargarDetalle.then(resultado => {

            //const resultado= {data:cabecera};  //comentar esta linea
            //console.log("esto se debe revisar",resultado);
                let detalle = [];
                let detalleCabecera = [];




                this.setState({
                    mostrarDetalle: false,
                    mostrarSubdetalle: false
                }, () => {
                    if (typeof resultado.data.metadataCabeceraLista !== "undefined") {
                        resultado.data.metadataCabeceraLista.sort(function (a, b) {
                            return parseFloat(a.orden) - parseFloat(b.orden);
                        });
                        this.setState({
                            campoFiltro: null
                        }, () => {
                            resultado.data.metadataCabeceraLista.forEach(cabecera => {
                                var esEstado = false;
                                if (cabecera.campo === "estado") esEstado = true;
                                const cabeceraInfo = {
                                    title: cabecera.titulo,
                                    field: cabecera.campo
                                };
                                var campoFiltro = null;
                                if (typeof cabecera.campoFiltro !== "undefined")
                                    if (cabecera.campoFiltro) {
                                        campoFiltro = cabecera.campo;
                                        this.setState({
                                            campoFiltro
                                        });
                                    }
                                        
                                if (esEstado) {
                                    cabeceraInfo.width="10px";
                                    cabeceraInfo.render = (rowData) => {
                                        var icono = null;
                                        switch (rowData.estado) {
                                            case 1:
                                            case 0: {
                                                icono = <CheckIcon />;
                                                break;
                                            }
                                            case -1: {
                                                icono = <ClearIcon />;
                                                break;
                                            }
                                            default: break;
                                        }

                                        return icono;
                                    }
                                }
                                switch (cabecera.tipo){
                                    case "fecha":{
                                        cabeceraInfo.render=(rowData)=>{
                                            return moment(eval("rowData."+cabecera.campo)).format("DD-MM-YYYY");
                                        }   
                                        break;
                                    }
                                    case "texto":{
                                        cabeceraInfo.width="200px";
                                        break;
                                    }
                                    default:break;
                                }
                                if(typeof cabecera.mostrar!=="undefined"){
                                    if (cabecera.mostrar)detalleCabecera.push(cabeceraInfo);
                                }
                                else detalleCabecera.push(cabeceraInfo);
                            });
                        });
                        detalle = resultado.data.registroEtlLista;
                        var esPrimeraEjecucion = !this.state.mostrarDetalle;
                        this.setState({
                            detalle,
                            detalleCabecera,
                            mostrarDetalle: true,
                            mostrarSubdetalle: false
                        }, () => {
                            if (!esPrimeraEjecucion) {
                                this.detalleRef.current.refrescar();
                            }
                        }
                        );
                    }
                });
            }
            );
        }
    }
    exportarExcelExtraccion =() =>{
        this.detalleRef.current.exportarExcel();
    }
    exportarExcelDetalle =() =>{
        this.subdetalleRef.current.exportarExcel();
    }
    cargarSubdetalles = () => {
        if (this.state.fecha !== null) {
            const cargarSubdetalle = EtlServicio.ObtenerSubdetalle(this.state.nodoSeleccionado, this.state.fecha, this.state.estado);
            cargarSubdetalle.then(resultado => {
                let subdetalleCabecera = [];
                const informacion = resultado.data;
                //const informacion = subdetalle;
                if (typeof informacion.metadataDetalleLista !== "undefined") {
                    informacion.metadataDetalleLista.forEach(registro => {
                        const columna = { title: registro.titulo, field: registro.campo };
                        switch (registro.tipo){
                            case "fecha":{
                                columna.render=(rowData)=>{
                                    return moment(eval("rowData."+columna.campo)).format("DD-MM-YYYY");
                                }
                                break;
                            }
                            default:break;
                        }
                        if(typeof registro.mostrar!=="undefined"){
                            if (registro.mostrar)subdetalleCabecera.push(columna);
                        }
                        else subdetalleCabecera.push(columna);
                        
                    });
                    var subdetalleActivo = this.state.mostrarSubdetalle;
                    this.setState({
                        subdetalleCabecera,
                        contenidoSubdetalle: informacion.registroEtlLista,
                        mostrarSubdetalle: true
                    }, () => {
                        if (subdetalleActivo) this.subdetalleRef.current.refrescar();
                    });
                }
                else {
                    this.setState({
                        mostrarSubdetalle: false
                    });
                }
            }
            );
        }
    }
    obtenerObjetoValidacion = () => {
        return [];
    }
    obtenerParametros = () => {
        const parametros = {
            cabecera: this.state.subdetalleCabecera,
            componente: 'ComponenteDinamico',
            obtenerInformacion: () => { return this.state.contenidoSubdetalle; },
            objetoValidacion: this.obtenerObjetoValidacion(),
            nombreArchivo: "extraccion",
            excluirFunciones: ["Copiar", "Importar"],
            botonesEdicion: { editar: false, eliminar: false },
            activarToolBar: false,
            toolbar: false,
            search: false
        };
        return parametros;
    }
    setFecha = (fecha) => {
        var mes = (fecha.getUTCMonth() + 1) < 10 ? "0" + (fecha.getUTCMonth() + 1).toString() : (fecha.getUTCMonth() + 1).toString(); //months from 1-12
        var dia = fecha.getUTCDate() < 10 ? "0" + fecha.getUTCDate().toString() : fecha.getUTCDate().toString();
        var anio = fecha.getUTCFullYear().toString();
        this.setState({
            fecha: anio + mes + dia,
            mostrarDetalle: false,
            mostrarSubdetalle: false
        });
    }
    ObtenerParametrosDetalle = () => {
        const parametros = {
            cabecera: this.state.detalleCabecera,
            componente: 'ComponenteDinamico',
            obtenerInformacion: () => { return this.state.detalle; },
            objetoValidacion: this.obtenerObjetoValidacion(),
            nombreArchivo: "detalle",
            excluirFunciones: ["Copiar", "Importar"],
            botonesEdicion: { editar: false, eliminar: false },
            activarToolBar: false,
            toolbar: false,
            search: false,
            paging: false,
            clickFila: (evt, selectedRow) => {

                this.setState({ estado: this.state.campoFiltro !== null ? eval("selectedRow." + this.state.campoFiltro) : selectedRow.campo1 },
                    () => {

                        this.cargarSubdetalles();
                    });
            },
        };
        return parametros;
    }
    obtenerHeaderOPeraciones(titulo) {
        var nombre = "";
        switch (titulo) {
            case "costDriversUnidad": {
                nombre = "Cost Drivers Unidad";
                break;
            }
            case "costDriversProducto": {
                nombre = "Cost Drivers Producto";
                break;
            }
            case "costos": {
                nombre = "Costos";
                break;
            }
            case "clientes": {
                nombre = "Clientes";
                break;
            }
            case "factorRentabilidad": {
                nombre = "Factor Rentabilidad";
                break;
            }
            case "valorFrenCarga": {
                nombre = "Valor Fren Carga";
                break;
            }
            case "transaccionPorCanal": {
                nombre = "Transacción por Canal";
                break;
            }
            case "transaccionPorProducto": {
                nombre = "Transacción por Producto";
                break;
            }
            case "operaciones": {
                nombre = "Operaciones";
                break;
            }
            default: break;
        }

        return nombre;

    }

    shouldComponentUpdate(nextProps, nextState)
    {
        if(this.props.breadcrumb.breadcrumb!==nextProps.breadcrumb.breadcrumb)
        {
            this.setState(
                {
                    mostrarOperaciones:false,
                    mostrarSubdetalle:false,
                    mostrarDetalle:false
                },()=>{
                    this.iniciarOperaciones(this.obtenerCodigoComponente(nextProps.breadcrumb.breadcrumb)); 
                }
            );
        }
        return true;
    }
    render() {
        return (
            <React.Fragment>
                <MenuBarComponent setFecha={this.setFecha} actualizar={this.actualizar} ejecutar={this.ejecutar} 
                exportarExcelExtraccion={this.exportarExcelExtraccion} exportarExcelDetalle={this.exportarExcelDetalle}
                />
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <Panel header={this.obtenerHeaderOPeraciones(this.props.breadcrumb.breadcrumb)} style={{ height: '100%' }}>
                            {this.state.mostrarOperaciones &&
                                <Tree style={{ textAlign: 'left', border: '0px', width: '268px' }} value={this.state.operaciones} selectionMode="single" selectionKeys={this.state.selectedNodeKey}
                                    onSelectionChange={(e) => {
                                        this.setState({ nodoSeleccionado: e.value }, () => {
                                            this.cargarDetalles();
                                        });
                                    }} />
                            }

                        </Panel>
                    </Grid>
                    <Grid item xs={9}>
                        <Panel header="Extracción">
                            {this.state.mostrarDetalle &&
                                <TablaDinamica ref={this.detalleRef} parametros={this.ObtenerParametrosDetalle()} />
                            }
                        </Panel>
                        <Panel header="Detalle de Registro de Operaciones">
                            {this.state.mostrarSubdetalle &&
                                <TablaDinamica ref={this.subdetalleRef} parametros={this.obtenerParametros()} />
                            }

                        </Panel>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        breadcrumb: state.breadcrumb
    };
}

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(Operaciones);
