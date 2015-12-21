function envia(donde){
					var lugar='';
					$('#cargandoTabs').css('display','block');
					if(donde=='dashboard')
					lugar="views/dashboard/dashboard.html";
					if(donde=='puntodeventa')
					lugar="views/nubepos/nubepos.html";
					
					if(donde=='listaproductos')
					lugar="views/productos/listaproductos.html";
					if(donde=='nuevoproducto')
					lugar="views/productos/nuevoproducto.html";
                    if(donde=='inventario')
					lugar="views/productos/inventarioproductos.html";
					if(donde=='listadeclientes'){
						lugar="views/clientes/listaclientes.html"; 
					}if(donde=='nuevocliente')
					lugar="views/clientes/nuevocliente.html";
					if(donde=='historial')
					lugar="views/facturacion/historial.html";
					if(donde=='cloud')
					lugar="views/cloud/indexCloud.html";
                    if(donde=='imprimeotro')
					lugar="indexprint.html";
					//alert(lugar);
					if(donde=='empresa')
					lugar="views/cloud/indexEmpresa.html";
					if(!lugar) lugar="404.html";
					setTimeout(function() {
						$('#cargandoTabs').css('display','none');
						$('#correoMal').fadeOut('slow');
						$('#main').load(lugar,function(){
						$("#simple-menu").click();						
						DOMOnTap();
						loaded();
						});
					}, 1000);
				}
		

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
		
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {
			var parentElement = document.getElementById(id);
			var listeningElement = parentElement.querySelector('.listening');
			var receivedElement = parentElement.querySelector('.received');

			listeningElement.setAttribute('style', 'display:none;');
			receivedElement.setAttribute('style', 'display:block;');

			console.log('Received Event: ' + id);
		}
};




 onDeviceReady();
    function onDeviceReady(){
			window.StarIOAdapter = {};
		var handle_error_callback = function(error_message) {
			alert(error_message);
		};

		/**
		 * Checks the status of the bluetooth printer and returns the string "OK" if the printer is online
		 */
		window.StarIOAdapter.check = function(port_search, success_callback, error_callback) {
			if(error_callback == null) {
				error_callback = handle_error_callback;
			}
			return cordova.exec(success_callback, error_callback, "StarIOAdapter", "check", [port_search]);
		};

		/**
		* Launches a raw print on the printer, it returns a string with "OK" if the sending was fine
		*/
		window.StarIOAdapter.rawprint = function(message, port_search,success_callback, error_callback) {
			if(error_callback == null) {
				error_callback = handle_error_callback;
			}

			return cordova.exec(success_callback, error_callback, "StarIOAdapter", "rawprint", [message, port_search]);
		};
		
		/*Search the availables printers*/
		window.StarIOAdapter.search=function(message,port_search,success_callback,error_callback){
			if(error_callback == null) {
				error_callback = handle_error_callback;
			}

			return cordova.exec(success_callback, error_callback, "StarIOAdapter", "search", [message, port_search]);
		};
        envia('dashboard');
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        db.transaction(iniciaDB, errorCB, successCB);
        console.log(db);

     /*   alert("device Ready>>" + device.model );
         var element = document.getElementById('deviceProperties');
        element.innerHTML = 'Device Model: '    + device.model    + '<br />' +
                        'Device Cordova: '  + device.cordova  + '<br />' +
                        'Device Platform: ' + device.platform + '<br />' +
                        'Device UUID: '     + device.uuid     + '<br />' +
                        'Device Version: '  + device.version  + '<br />';*/
    }

    // Populate the database
    //
    function iniciaDB(tx){
        //console.log("Ana");
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        //tx.executeSql('DROP TABLE IF EXISTS PRODUCTOS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS PRODUCTOS (id_local integer primary key AUTOINCREMENT,id integer, formulado text, codigo text, precio real, categoriaid text,cargaiva integer,productofinal integer,materiaprima integer,timespan text,ppq real default 0,color text,servicio integer default 0,estado integer default 1)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS CONFIG (id integer primary key AUTOINCREMENT, nombre text, razon text , ruc integer, telefono integer , email text , direccion text )');
        tx.executeSql('INSERT INTO PRODUCTOS(id_local,id,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,formulado,estado) VALUES(-1,-1,"-1",0,-1,0,0,0,"-1","Producto NubePOS",0)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CARDEX (id integer primary key AUTOINCREMENT,id_formulado integer, cantidad real, descripcion text, precio_unidad real, fecha integer,ppq_real real,iva numeric,timespan integer,idfactura text)');
        tx.executeSql('SELECT COUNT(id_local) as cuantos FROM PRODUCTOS',[],function(tx,res){
            var existen=res.rows.item(0).cuantos;
            if(existen==0)
                db.transaction(Ingresaproductos,errorCB,successCB);
        });
        
        
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        //tx.executeSql('DROP TABLE IF EXISTS PRODUCTOS');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS empresa (id integer primary key AUTOINCREMENT, nombre integer )');
         tx.executeSql('CREATE TABLE IF NOT EXISTS empresa (id integer primary key AUTOINCREMENT, nombre integer, nombreempresa text )');
        
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        //tx.executeSql('DROP TABLE IF EXISTS PRODUCTOS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS logActualizar (id integer primary key AUTOINCREMENT, tabla text , incicial integer , final integer)');
        tx.executeSql('select count(id) as cuantos from logActualizar',[],function(tx,res){
        var existenD=res.rows.item(0).cuantos;
            if(existenD==0){
                for(var i = 1 ; i <= 5 ; i++){
                    var tabla ='';
                    if(i == 1){
                        tabla ='CAJA_APERTURA_CIERRE';
                    }
                    if(i == 2){
                        tabla ='CATEGORIAS';
                    }
                    if(i == 3){
                        tabla ='CLIENTES';
                    }
                    if(i == 4){
                        tabla ='FACTURAS';
                    }
                    if(i == 5){
                        tabla ='PRODUCTOS';
                    }
                    insertaTablas(tabla);
                }
            }
        });    
        
        
        
        function insertaTablas(tabla){
            console.log(tabla);
            var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
            var inicia =0;
            tx.executeSql('INSERT INTO logActualizar (tabla , incicial ,final) VALUES (?,? ,? );',[tabla , inicia , inicia],function(tx,res){
                console.log("logActualizar :"+res.insertId);
            });    
            
        }
        // tx.executeSql('SELECT COUNT(id_local) as cuantos FROM PRODUCTOS',[],function(tx,res){
            // var existen=res.rows.item(0).cuantos;
            // if(existen==0)
                // db.transaction(Ingresaproductos,errorCB,successCB);
        // });
        
        
        
        
        //tx.executeSql('DROP TABLE IF EXISTS CATEGORIAS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIAS (id integer primary key AUTOINCREMENT, categoria text, activo integer, existe integer , timespan text )');
        tx.executeSql('SELECT COUNT(id) as cuantos FROM CATEGORIAS',[],function(tx,res){
            var existen=res.rows.item(0).cuantos;
            if(existen==0)
                db.transaction(IngresaCategorias,errorCB,successCB);
        });
        //tx.executeSql('DROP TABLE IF EXISTS CLIENTES');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CLIENTES (id integer primary key AUTOINCREMENT,nombre text, cedula text, email text, direccion text, telefono text,existe integer,timespan TEXT)');
        tx.executeSql('SELECT COUNT(id) as cuantos FROM CLIENTES',[],function(tx,res){
            var existen=res.rows.item(0).cuantos;
            if(existen==0)
                db.transaction(IngresaClientes,errorCB,successCB);
        });
        //tx.executeSql('DROP TABLE IF EXISTS FACTURAS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS FACTURAS (id integer primary key AUTOINCREMENT,timespan text ,clientName,RUC,address,tele,fetchJson,paymentsUsed,cash,cards,cheques,vauleCxC,paymentConsumoInterno,tablita,aux,acc,echo,fecha,anulada integer);');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CAJA (id integer primary key AUTOINCREMENT,hora_ingreso text,hora_salida text,activo integer,sobrante_faltante real,total real,establecimiento text,autorizacion text);');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CAJA_APERTURA_CIERRE (id integer primary key AUTOINCREMENT,id_caja integer,valor_apertura real,movimiento integer);',[],function(tx,result){
            //console.log('Ana');
            //$('#myModal').modal('hide');
        });
		tx.executeSql('CREATE TABLE IF NOT EXISTS PRESUPUESTO (id integer primary key AUTOINCREMENT,timespan text,valor real,fecha integer,transacciones integer);');
    }

    function populateDB(tx){
        //tx.executeSql('DROP TABLE IF EXISTS DEMO');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    }

    // Transaction error callback
    //
    function errorCB(err){
        console.log("Error processing SQL: "+err.message);
    }

    // Transaction success callback
    //
    function successCB() {
        console.log("success!");
    }

    function selector(){
         var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
         db.transaction(sacadatos, errorCB, successCB);
    }
    
    function sacadatos(tx){
         tx.executeSql('SELECT COUNT(ID) as cnt FROM DEMO;',[], function (tx,res){
            //console.log("vamos:"+res.rows.item(0).cnt);
         });
         
    }
    
    /*Funciones Ana:*/
    function Ingresaproductos(){
         var json = $('#jsonProductos').html();
            var mijson = eval(''+json+'');
            for(var j in mijson){
                for(var k in mijson[j]){
                    for(i = 0; i < mijson[j][k].length; i++){
                            var item = mijson[j][k][i];
                            InsertaProducto(item);
                    }
                }
            }
    }
    
    function InsertaProducto(itempr){
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        var cargaiva=0;
        var imp=itempr.formulado_tax_id.split('|');
        if(imp.indexOf("1")>=0)
            cargaiva=1;
            db.transaction(
            function (tx){
                    tx.executeSql('INSERT INTO PRODUCTOS (id,formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima) VALUES (?,?,?,?,?,?,?,?);',[itempr.formulado_id,itempr.formulado_nombre,itempr.formulado_codigo,itempr.formulado_precio,itempr.formulado_tipo,cargaiva,1,itempr.formulado_matprima],
                    function(tx,res){
                        //console.log("vamos:"+res.insertId)
                    });                
            },errorCB,successCB);
    }
    
    function IngresaCategorias(){
        /*
        var json = $('#jsonCategorias').html();
            var mijson = JSON.parse(json);
            console.log(mijson);
            for(var j in mijson){
                for(var k in mijson[j]){
                        var item=mijson[j][k];
                        metedatoscat(item);
                }
            }
        */
    }
    
    function metedatoscat(itemc){
        //console.log(itemc);
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        db.transaction(
        function (tx){
                    tx.executeSql('INSERT INTO CATEGORIAS(id,categoria,activo,existe)VALUES(?,?,?,?);',[itemc.categoria_id,itemc.categoria_nombre,1,1],
                    function(tx,res){
                        console.log(res);
                        console.log("vamos:"+res.insertId+"categorias");
                    });                
        },errorCB,successCB);
    }
    
    function IngresaClientes(){
        /*
        var json = $('#jsonmisclientes').html();
            var mijson = JSON.parse(json);
            //console.log(mijson);
            for(var j in mijson){
                for(var k in mijson[j]){
                        var item=mijson[j][k];
                        metedatoscliente(item);
                }
            }
        */
    }
    
    function metedatoscliente(itemc){
        //console.log(itemc);
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        db.transaction(
        function (tx){
                    tx.executeSql('INSERT INTO CLIENTES(id,nombre,cedula,telefono,direccion,email,existe)VALUES(?,?,?,?,?,?,?);',[itemc.id,itemc.nombre,itemc.cedula,itemc.telefono,itemc.direccion,itemc.email,1],
                    function(tx,res){
                        //console.log(res);
                        console.log("vamos:"+res.insertId+"clientes");
                    });                
        },errorCB,successCB);
    }
    
    function VerDatosProducto(id){
    var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
    db.transaction(function(tx){
    tx.executeSql('SELECT p.*,c.categoria as categ FROM PRODUCTOS p, CATEGORIAS c WHERE p.timespan='+id+' and p.categoriaid=c.timespan;',[],function(tx,results){
        var row=results.rows.item(0);
        $('#idproducto').val(row.id_local);
        $('#titulonuevopr').html("Editar Producto");
        $('#nombreproducto').val(row.formulado);
        $('#codigoproducto').val(row.codigo);
        $('#precioproducto').val(row.precio.toFixed(2));
        $('#search-renderitem').val(row.categ);
        $('#idcategoria').val(row.categoriaid);
        $('#mprima').prop('checked',false);
        $('#pfinal').prop('checked',false);
        $('#coniva').prop('checked',false);
        $('#conservicio').prop('checked',false);
        if(row.materiaprima==1)
        $('#mprima').prop('checked',true);
        if(row.productofinal==1)
        $('#pfinal').prop('checked',true);
        if(row.cargaiva==1)
        $('#coniva').prop('checked',true);
		if(row.servicio==1)
        $('#conservicio').prop('checked',true);
    },errorCB,successCB);
    });
    }
    
    function VerDatosCliente(id){
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        db.transaction(function(tx){
        tx.executeSql('SELECT * FROM CLIENTES WHERE id='+id+';',[],function(tx,results){
            var row=results.rows.item(0);
            $('#idcliente').val(row.id);
            $('#titulocliente').html("Editar Cliente");
            $('#nombrecliente').val(row.nombre);
            $('#cedulacliente').val(row.cedula);
            $('#telefono').val(row.telefono);
            $('#direccion').val(row.direccion);
            $('#email').val(row.email);
        },errorCB,successCB);
        });
    }
    
    function VerDatosFactura(id){
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        db.transaction(function(tx){
        tx.executeSql('SELECT * FROM FACTURAS WHERE id='+id+';',[],function(tx,results){
            var inhtml='';
            for (var i=0; i < results.rows.length; i++){
                var row = results.rows.item(i);
                //console.log(row);
                $('#idfactura').val(row.id);
                $('#cliente').val(row.clientName);
                $('#numerofactura').html('Factura N° 00000000'+row.id);
				if(row.anulada=='1'||row.anulada==1){
					$('#btnanularf').css('display','none');
				}
                var timefecha=new Date(row.fecha);
                var mes=timefecha.getMonth()+1;
				var dia=timefecha.getDate();
                if(mes.toString().length<2)
                    mes="0"+mes.toString();
				 if(dia.toString().length<2)
                    dia="0"+dia.toString();
				
                var fechaformat=dia+"-"+mes+"-"+timefecha.getFullYear()+" "+timefecha.getHours()+":"+timefecha.getMinutes()+":"+timefecha.getSeconds();
                //console.log(row);
                $('#fecha').val(fechaformat);
				
                var datosfact=JSON.parse(row.fetchJson);
                var totalf=parseFloat(datosfact.Pagar[0].factura.total).toFixed(2);
				var descAplicado=parseFloat(datosfact.Pagar[0].factura.descuento).toFixed(2);
				console.log('Descuento : '+descAplicado);
				
				
                $('#total').html(totalf);
                $('#invoiceTotal').html(totalf)
                var intabla='';
                var variosprods=(datosfact.Pagar[0].producto);
                for(var n=0;n<variosprods.length;n++){
                    intabla+="<tr><td style='text-align:left;'>"+variosprods[n].nombre_producto+"</td><td style='text-align:right;'>"+parseInt(variosprods[n].cant_prod)+"</td><td style='text-align:right;'>"+parseFloat(variosprods[n].precio_prod).toFixed(2)+"</td><td style='text-align:right;'>"+parseFloat(variosprods[n].precio_total).toFixed(2)+"</td></tr>";
                }
                $('#cuerpodetalle').html(intabla);
				var formaDePago = row.paymentsUsed;
				var totalpagof=0;
				console.log('Forma de pago es :'+formaDePago);
				if(formaDePago == 1){
					$('#detaFormPago').html('Efectivo');
					$('#detaFormPagoValor').html(parseFloat(row.cash).toFixed(2));
					totalpagof+=parseFloat(row.cash);
				}
				if(formaDePago == 2){
					var datocard=row.cards.split('|');
					$('#detaFormPago').html('Tarjeta');
					$('#detaFormPagoValor').html(datocard[2].substring(0,datocard[2].length - 1));
					totalpagof+=parseFloat(parseFloat(datocard[2].substring(0,datocard[2].length - 1)));
				}
				if(formaDePago == 3){
				var datocheque=row.cheques.split('|');
				//alert(datocheque[2].substring(0,datocheque[2].length - 1));
					$('#detaFormPago').html('Cheques');
					$('#detaFormPagoValor').html(datocheque[2].substring(0,datocheque[2].length - 1));
					totalpagof+=parseFloat(datocheque[2].substring(0,datocheque[2].length - 1));
				}
				
				if(formaDePago != 1 && formaDePago != 2 && formaDePago != 3){
					var fpago=row.paymentsUsed.split(',');
					console.log(fpago);
					var c=0;
					for(var t=0;t<fpago.length;t++){
						console.log(t);
						if(fpago[t]==1){
							$('#detaFormPago').html('Efectivo');
							$('#detaFormPagoValor').html(parseFloat(row.cash).toFixed(2));
						}
						if(fpago[t]==2){
							var datocard=row.cards.split('|');
							$('#detaFormPago1').html('Tarjeta');
							//console.log(datocard);
							$('#detaFormPagoValor1').html(datocard[2].substring(0,datocard[2].length - 1));
						}
						
						if(fpago[t]==3){
							var datocheque=row.cheques.split('|');
							$('#detaFormPago2').html('Cheques');
							//console.log(datocard);
							$('#detaFormPagoValor2').html(datocheque[2].substring(0,datocheque[2].length - 1));
						}
					}
                }
				
				var tot=parseFloat($('#total').html());
				if((tot-totalpagof)<0){
					$('#tabladetformaspago').append('<tr><td><b>Vuelto</b></td><td>'+(-1*(tot-totalpagof)).toFixed(2)+'</td></tr>');
				}
				
				if((descAplicado)>0){
					$('#tabladetformaspago').append('<tr><td><b>Descuento</b></td><td>'+descAplicado+'</td></tr>');
				}
				
				
                if(row.anulada==1){
                    $('#factanulada').fadeIn();
                }
            }
        },errorCB,successCB);
        });
    }
    
    function CambiarFormaPagoFactura(){
        var inputs=$('.paymentMethods');
        var cadenapago='';
        var cont=0;
        var efectivo=0;
        var tarjetas=0;
        var cheques=0;
        var cc=0;
        var retencion=0;
        var cortesia=0;
        var otros=0;
        inputs.each(function(){
            if($(this).val()>0){
                var idforma=$(this).attr('idpaymentmethod');
                if(cont>0)
                    cadenapago+=',';
                cadenapago+=idforma;
                /*cantidades de formas de pago*/
                if(idforma==1)
                    efectivo=$(this).val();
                if(idforma==2)
                    tarjetas=$(this).val();
                if(idforma==3)
                    cheques=$(this).val();
                if(idforma==4)
                    cc=$(this).val();
                if(idforma==5)
                    retencion=$(this).val();
                if(idforma==6)
                    cortesia=$(this).val();
                if(idforma==7)
                    otros=$(this).val();
                cont++;
            }    
        });
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        tarjetas='0|0|'+tarjetas+'@';
        db.transaction(function(tx){
            var miid=$('#idfactura').val();
            console.log(tarjetas);
            tx.executeSql("UPDATE FACTURAS SET paymentsUsed=?,cash=?,cards=?,cheques=?,vauleCxC=? WHERE id=?;",[cadenapago,efectivo,tarjetas,cheques,cc,miid],function(tx,results){
                console.log(results);
            },errorCB,successCB);
        });
    }
    
    /**/
    function metedatos(tx,item){
        //console.log(item);
        tx.executeSql('INSERT INTO PRODUCTOS (id,formulado,codigo,precio,categoriaid,cargaiva, productofinal,materiaprima) VALUES (?,?,?,?,?,?,?,?);',[item.formulado_id,item.formulado_nombre,item.formulado_codigo,item.formulado_precio,item.formulado_tipo,cargaiva,1,item.formulado_matprima],function(tx,res){//console.log("vamos:"+res.insertId);
        });
    } 
        
function ajax(cadena){var xmlhttp=false;
/*@cc_on @*/
/*@if (@_jscript_version >= 5)
try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");} catch (e) {try {xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");} 

catch (E) { xmlhttp = false;}}
@end @*/
//console.log(cadena);
if (!xmlhttp && typeof XMLHttpRequest!='undefined') { try {xmlhttp = new XMLHttpRequest(); } catch (e) { xmlhttp=false;}}
if (!xmlhttp && window.createRequest) {    try { xmlhttp = window.createRequest();} catch (e) { xmlhttp=false;}}
xmlhttp.open("GET",cadena,true);
xmlhttp.onreadystatechange=function() {
if (xmlhttp.readyState==4){
    if(xmlhttp.status==200){
        resultDiv = document.querySelector("#results");
    resultDiv.innerHTML=xmlhttp.responseText;    
}}} 
xmlhttp.send(null);
}

function showalert(msg){
    $('#alert').html(msg);
    $('html, body').animate( { scrollTop : 0 },500,function(){
        $('#alert').slideDown('slow',function(){
            setTimeout(function(){hidealert()},1500);
        });
    });
}

function hidealert(){
    $('#alert').html('');
    $('#alert').slideUp('fast');
}

function imprimervprueba(){
  //alert('entra');
  var page = '<h1>Hello Document</h1>';

  cordova.plugins.printer.print(page, 'Document.html', function () {
      alert('printing finished or canceled')
  });

}

function printDiv(divName) {
     var printContents = document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}
