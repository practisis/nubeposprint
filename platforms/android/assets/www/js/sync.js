//inicio nuevo
var procesocount=0;
var yaesta=false;
var apiURL='https://practisis.net/connectnubepos/api2.php';
function SyncStart(){
	var idbarra = localStorage.getItem('idbarra');
	var categoriasya = localStorage.getItem('categoriasya');
	var productosya = localStorage.getItem('productosya');
	var clientesya = localStorage.getItem('clientesya');
	var presupuestoya = localStorage.getItem('presupuestoya');
	console.log(idbarra+'*'+categoriasya+'*'+productosya+'*'+clientesya);
	if((clientesya||productosya||categoriasya||idbarra)&&presupuestoya==false){
		envia('cloud');
		$('.navbar').slideDown();
	}
	if(presupuestoya){
		$('#fadeRow,#demoGratis').css("display","none");
		yaesta=true;
		$('.navbar').slideDown('slow');
		envia('dashboard');
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){tx.executeSql('SELECT count(*) as cp FROM PRODUCTOS WHERE id_local !=-1',[],function(tx,results){
			if(results.rows.item(0).cp==0||results.rows.item(0).cp==null){
				LaunchBoarding();
			}
		});
		});
		setTimeout(function(){SincronizadorNormal();},30000);
		//setInterval(function(){SincronizadorNormal();},3000);
	}else if(clientesya){
		ExtraeDatosApi(4);
	}else if(productosya){
		ExtraeDatosApi(3);
	}else if(categoriasya){
		ExtraeDatosApi(2);
	}else if(idbarra){
		DatosIniciales(1);
	}
	else{
		ExtraeDatosApi(0);
	}
}

function ExtraeDatosApi(donde){
	console.log("saca datos del api"+donde);
	if(donde==0){
		envia('cloud');
	}else if(donde==1){
		console.log("Datos API 1: Categorias");
		//$(".navbar").slideUp();
		$("#demoGratis,#fadeRow,#finalizado").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("Sincronizando Categorías...");
		var jsoncateg=JSON.parse($('#JSONCategoriasNube').html());
		var jsoncategorias=jsoncateg.Categorias;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('delete from categorias',[],function(tx,results){});
				tx.executeSql("delete from sqlite_sequence where name='categorias'",[],function(tx,results){});
				
			for(var n=0;n<jsoncategorias.length;n++){
				var item=jsoncategorias[n];
				var timeSpanCat=getTimeSpan();
				tx.executeSql("INSERT INTO CATEGORIAS(categoria,activo,existe,timespan,sincronizar)values('"+item.categoria_nombre+"','1','1','"+item.categoria_timespan+"','false');",[],function(tx,results){
					console.log("insertada categ:"+results.insertId);
				});
			}
			},errorCB,function(){
				localStorage.setItem("categoriasya",true);
				$("#theProgress").css("width" , "25%");
				ExtraeDatosApi(2);
			});
			
	}else if(donde==2){
		console.log("Datos API 2: Productos");
		//$(".navbar").slideUp();
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("Sincronizando Productos...");
		var jsonprod=JSON.parse($('#JSONproductosNube').html());
		var jsonproductos=jsonprod.Productos;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('delete from productos',[],function(tx,results){});
				tx.executeSql("delete from sqlite_sequence where name='productos'",[],function(tx,results){});
			for(var n=0;n<jsonproductos.length;n++){
				var item=jsonproductos[n];
				tx.executeSql('INSERT INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio,sincronizar) VALUES("'+item.formulado_nombre+'", "'+item.formulado_codigo+'" ,'+item.formulado_precio+','+item.categoria_timespan+','+item.cargaiva+','+item.formulado_productofinal+','+item.formulado_matprima+',"'+item.formulado_timespan+'",'+item.carga_servicio+',"false")',[],function(tx,results){
				console.log("insertado producto:"+results.insertId);
				});
			}
			},errorCB,function(){
				localStorage.setItem("productosya",true);
				$("#theProgress").css("width" , "50%");
				ExtraeDatosApi(3);
			});
		
	}else if(donde==3){
		console.log("Datos API 3: Clientes");
		//$(".navbar").slideUp();
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("Sincronizando Clientes...");
		var jsoncli=JSON.parse($('#JSONclientesNube').html());
		//{"Clientes":[{"id":"1","nombre":" Consumidor Final","cedula":"9999999999999","telefono":"","direccion":"","email":"","timespan" : "0"}]}
		var jsonclientes=jsoncli.Clientes;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
			tx.executeSql('delete from clientes',[],function(tx,results){});
			tx.executeSql("delete from sqlite_sequence where name='clientes'",[],function(tx,results){});
			for(var n=0;n<jsonclientes.length;n++){
				var item=jsonclientes[n];
				tx.executeSql('INSERT INTO CLIENTES(nombre,cedula,email,direccion,telefono,sincronizar,existe,timespan) VALUES("'+item.nombre+'" , "'+item.cedula+'" , "'+item.email+'" , "'+item.direccion+'" ,  "'+item.telefono+'" ,  "false" , "0" , "0" )',[],function(tx,results){
				console.log("insertado cliente:"+results.insertId);
				});
			}
			},errorCB,function(){
				localStorage.setItem("clientesya",true);
				$("#theProgress").css("width" , "75%");
				ExtraeDatosApi(4);
			});
	}else if(donde==4){
		console.log("Datos API 4: Presupuesto");
		//$(".navbar").slideUp();
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("Sincronizando Presupuesto...");
		var jsonpres=JSON.parse($('#JSONpresupuestoNube').html());
		var jsonpresupuestos=jsonpres.presupuesto;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){
				tx.executeSql('delete from presupuesto',[],function(tx,results){});
				tx.executeSql("delete from sqlite_sequence where name='presupuesto'",[],function(tx,results){});
				for(var n=0;n<jsonpresupuestos.length;n++){
					var item=jsonpresupuestos[n];
					tx.executeSql('INSERT INTO PRESUPUESTO(timespan,valor,fecha,transacciones) VALUES("'+item.timespan+'",'+item.valor+','+item.fecha+','+item.transacciones+')',[],function(tx,results){
					console.log("insertado presupuesto:"+results.insertId);
					});
				}
		},errorCB,function(){
				localStorage.setItem("presupuestoya",true);
				$("#theProgress").css("width" , "100%");
				setTimeout(function(){SyncStart()},1500);
		});
	}
}

function SincronizadorNormal(){
	console.log("sincronizador normal");
	procesocount=1;
	$('#fadeRow,#demoGratis,#finalizado').css("display","none");
	$('#contentStepSincro').fadeIn();
	DatosRecurrentes(0);
}

function registrarUser(){
	newEmpresa=$("#newEmpresa").val();
	newEmail=$("#newEmail").val();
	newPass=$("#newPass").val();
	newConfirm=$("#newConfirm").val();
    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(newEmpresa==''){
        $('.alert-danger').fadeIn('slow');
        $(".alert-danger").html('Debe ingresar el nombre de tu negocio.');
        $("#newEmpresa").val('');
        setTimeout(function(){ $('.alert-danger').fadeOut('slow'); }, 3000);
     }else if(newEmail=='' || !expr.test(newEmail)){
        $('.alert-danger').fadeIn('slow');
        $(".alert-danger").html('Debe ingresar un e-mail valido para tu negocio.');
        $("#newEmail").val('');
        setTimeout(function(){ $('.alert-danger').fadeOut('slow'); }, 3000);
     }else{
    	if(newConfirm == newPass){
			$("#cargandoTabs").fadeIn();
    		var nombre=newEmpresa;
    		var celular='';
    		var email=newEmail;
    		var passw=newPass;
    		var rpassw=newConfirm;
    		var empresa=newEmpresa;
    		var planPrecio=2;
    		var nTerminales=1;
    		var sistema=0;
    		var franquicia=0;
    		var pais=1;
    		var versiones=7;
			var plan=0;
			var iddevice=$('#deviceid').html();
			//alert(iddevice+'/'+nombre+'/'+email+'/'+nombre);
    		$("#btnNewEmp").html('<img src="images/loader.gif"  width="50%" />');
    		$.post("http://practisis.net/registro/registroNubePOS.php", {
    			nombre : nombre,
    			celular : celular,
    			email :newEmail,
    			pass : newPass,
    			rpass : newConfirm,
    			empresa : empresa,
    			planPrecio : planPrecio,
    			nTerminales : nTerminales,
    			sistema : sistema,
    			pais : pais,
    			franquicia : franquicia,
    			versiones : versiones,
				deviceid:iddevice
    		}).done(function(data){
				//alert(data);
                if(data=='existe'){
						$("#cargandoTabs").fadeOut();
                        $('.alert-danger').fadeIn('slow');
                        $(".alert-danger").html('El correo ingresado ya existe en el sistema, vuelva a ingresar otro correo.');
                        $("#newEmail").val('');
                            setTimeout(function(){ $('.alert-danger').fadeOut('slow'); }, 3000);
    			}else{
						var datosback=data.split("||");
						console.log(data);
        				localStorage.setItem("userRegister", newEmail);
        				localStorage.setItem("userPasswod", newPass);
						localStorage.setItem("empresa",datosback[0]);
						localStorage.setItem("idbarra",datosback[1]);
						localStorage.setItem("categoriasya",true);
						localStorage.setItem("clientesya",true);
						localStorage.setItem("productosya",true);
						localStorage.setItem("presupuestoya",true);
						
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(iniciaDB,errorCB,function(){SetDataEmpresa(nombre,celular,newEmail,iddevice,datosback[1],'','',false);});
						
                }
    		});

    	}else{
				$("#cargandoTabs").fadeOut();
    			$('.alert-danger').fadeIn('slow');
                $(".alert-danger").html('Las contraseñas son distintas.');
                $("#newPass").val('');
    			$("#newConfirm").val('');
                setTimeout(function(){ $('.alert-danger').fadeOut('slow'); }, 3000);
    		}
        }
}


function LaunchBoarding(){
	$('#myDash').fadeIn('slow',function(){
        setTimeout(function() {$("#menu_1").effect('highlight',{},1500);},1000);
    });
}

function SetDataEmpresa(nombre,celular,email,deviceid,id_barra_arriba,ruc,direccion,desde_login){
	
	var db2 = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db2.transaction(
		function (tx){
			tx.executeSql('INSERT INTO CONFIG (nombre,razon,telefono,email,ruc,direccion) VALUES(?,?,?,?,?,?)',[nombre,nombre,celular,email,ruc,direccion],function(tx,res){
				$('#msjOk').html('Informacion Ingresada con Éxito');
				$('#msjOk').fadeIn('slow');
				$('#campos').css('display','none');
				setTimeout(function() {
					$('#msjOk').fadeOut('slow');
				}, 3000);
				});
	},errorCB,successCB);
		
	
	db2.transaction(
		function (tx2){
			tx2.executeSql("INSERT INTO empresa (nombre,nombreempresa,id_barra,barra_arriba) VALUES (?,?,?,?)",[nombre,nombre,deviceid,id_barra_arriba],
			function(tx2,res){
				if(!desde_login){
					LaunchBoarding();
					envia("dashboard");
				}else{
					tx2.executeSql('SELECT count(*) as cp FROM PRODUCTOS WHERE id_local !=-1',[],function(tx,results){
						if(results.rows.item(0).cp==0||results.rows.item(0).cp==null){
							LaunchBoarding();
						}
					});
					SyncStart();
				}
								
			});						
									
	},errorCB,successCB);
	
}


function UserLogin(){
	var quien=$("#user2").val();
	var pass=$("#pass2").val();
	var iddevice=$('#deviceid').html();
    auxuser = quien;
    auxpass = pass;
	$('#btnvalida2').html("<img src='images/loader.gif' width='20px'/>");
	$.post(apiURL,{action:"login", user : quien , pass : pass, deviceid : iddevice}).done(function(data){
		//alert(quien+'/'+pass+'/'+iddevice);
		//alert(data);
		if(data=='error'){
			showalert('Los datos son incorrectos.');
		}
		else{
			var datosaux = data.split("||");
			localStorage.setItem("userRegister", quien);
			localStorage.setItem("userPasswod", pass);
			localStorage.setItem("empresa",datosaux[0]);
			localStorage.setItem("idbarra",datosaux[2]);
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(iniciaDB,errorCB,function(){SetDataEmpresa(datosaux[1],datosaux[3],quien,iddevice,datosaux[2],datosaux[4],datosaux[5],true)});
			$('.navbar').slideDown();
			//function SetDataEmpresa(nombre,celular,email,deviceid,id_barra_arriba,ruc,direccion,desde_login)
			//SetDataEmpresa(datosaux[1],datosaux[3],quien,iddevice,datosaux[2],datosaux[4],datosaux[5],true);
		}
		$('#btnvalida2').html("Login");
	});
}

function DatosIniciales(cual){	
	$.post(apiURL,{
		id_emp: localStorage.getItem("empresa"),
		action: 'SincStart',
		id_barra: localStorage.getItem("idbarra"),
		deviceid:$("#deviceid").html()
	}).done(function(response){
		//sincronizacion inicial
		var arraydatos=JSON.parse(response); 
		console.log(">>>>Iniciar >>>"+response);
		JSONproductosNube=arraydatos.productos;
		JSONcategoriasNube=arraydatos.categorias;
		JSONclientesNube=arraydatos.clientes;
		JSONpresupuestoNube=arraydatos.presupuestos;
		
		$("#JSONclientesNube").html(JSONclientesNube);
		$("#JSONCategoriasNube").html(JSONcategoriasNube);
		$("#JSONproductosNube").html(JSONproductosNube);	
		$("#JSONpresupuestoNube").html(JSONpresupuestoNube);
		ExtraeDatosApi(cual);
	});
}
		
function DatosRecurrentes(cual){
	if(cual==0){
		$.post(apiURL,{
		id_emp : localStorage.getItem("empresa"),
		action : 'SincTabla',
		id_barra : localStorage.getItem("idbarra"),
		deviceid:$("#deviceid").html()
		}).done(function(response){
			jsonSync=JSON.parse(response);
			//console.log(jsonSync);
			recurrenteJsonEmpresa=jsonSync.BigJson[0].Empresa;
			$('#JSONproductosNube').html(JSON.stringify(jsonSync.BigJson[1].Productos));
			$('#JSONclientesNube').html(JSON.stringify(jsonSync.BigJson[2].Clientes));
			$('#JSONCategoriasNube').html(JSON.stringify(jsonSync.BigJson[3].Categorias));
			$('#JSONpresupuestoNube').html(JSON.stringify(jsonSync.BigJson[4].Presupuesto));
			console.log( ">>>>>>recurrente");
			DatosRecurrentes(1);
			updateOnlineStatus("ONLINE");
		}).fail(function(){
			updateOnlineStatus("OFFLINE");
			setTimeout(function(){SincronizadorNormal()},60000);
		});
	}
	if(cual==1){
		console.log("Datos Nube 1: Categorias");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("Sincronizando Categorías...");
		if($('#JSONCategoriasNube').html().length>0){
			var jsoncategorias=JSON.parse($('#JSONCategoriasNube').html());
			console.log(jsoncategorias);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsoncategorias.length;n++){
					var item=jsoncategorias[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.idreal+',');
					
					tx.executeSql("INSERT OR IGNORE INTO CATEGORIAS (categoria,activo,existe,timespan,sincronizar)values('"+item.formulado_tipo+"','1','1','"+item.timespan+"','false')",[],function(tx,results){
						console.log("insertada categ:"+results.insertId);
					});
					
					tx.executeSql("UPDATE CATEGORIAS SET categoria = '"+item.formulado_tipo+"' WHERE timespan='"+item.timespan+"'",[],function(tx,results){
						console.log("actualizada categ");
					});
					
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "25%");
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('formulados_tipo')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
							localStorage.setItem("dataupdate","");
							DatosRecurrentes(2);
							updateOnlineStatus("ONLINE");
					}).fail(function(){
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},60000);
					});
					
				});
		}	
	}else if(cual==2){
		console.log("recurrentes 2: Productos");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("Sincronizando Productos...");
		if($('#JSONproductosNube').html().length>0){
			var jsonproductos=JSON.parse($('#JSONproductosNube').html());
			console.log(jsonproductos);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsonproductos.length;n++){
					var item=jsonproductos[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.id+',');
					
					tx.executeSql('INSERT OR IGNORE INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio,sincronizar)VALUES("'+item.formulado+'","'+item.formulado_codigo+'",'+item.precio+',"'+item.formulado_tipo_timespan+'",'+item.ivacompra+','+item.esproductofinal+','+item.esmateria+',"'+item.timespan+'" ,'+item.tieneservicio+',"false")',[],function(tx,results){
						console.log("insertado prod:"+results.insertId);
					});
					
					tx.executeSql('UPDATE PRODUCTOS SET formulado="'+item.formulado+'",codigo="'+item.formulado_codigo+'",precio='+item.precio+',categoriaid="'+item.formulado_tipo_timespan+'",cargaiva='+item.ivacompra+',productofinal='+item.esproductofinal+',materiaprima='+item.esmateria+',timespan="'+item.timespan+'",servicio='+item.tieneservicio+',sincronizar="false" WHERE timespan="'+item.timespan+'"',[],function(tx,results){
						console.log("actualizado prod");
					});
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "50%");
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('formulados','formulados_precios','formulados_impuestos')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						DatosRecurrentes(3);
						updateOnlineStatus('ONLINE');
					}).fail(function(){
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},60000);
					});
				});
		}	
	}else if(cual==3){
		console.log("recurrentes 3: Clientes");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("Sincronizando Clientes...");
		if($('#JSONclientesNube').html().length>0){
			var jsonclientes=JSON.parse($('#JSONclientesNube').html());
			console.log(jsonclientes);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsonclientes.length;n++){
					var item=jsonclientes[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.idreal+',');
					
					tx.executeSql('INSERT OR IGNORE INTO CLIENTES(nombre,cedula,email,direccion,telefono,sincronizar,existe,timespan) VALUES("'+item.nombre+'" , "'+item.cedula+'" , "'+item.email+'" , "'+item.direccion+'" ,  "'+item.telefono+'" ,  "false" , "0" , "0" )',[],function(tx,results){
						console.log("insertado cliente:"+results.insertId);
					});
					
					tx.executeSql('UPDATE CLIENTES SET nombre=  "'+item.nombre+'"  , cedula = "'+item.cedula+'" , email="'+item.email+'"  , direccion = "'+item.direccion+'" , sincronizar="false"  WHERE cedula='+item.cedula,[],function(tx,results){
						console.log("actualizado cliente");
					});
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "75%");
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('clientes','clientes_datos')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						DatosRecurrentes(4);
						updateOnlineStatus('ONLINE');
					}).fail(function(){
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},60000);
					});
		});
		}
	}else if(cual==4){
		console.log("recurrentes 4: Presupuestos");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("Sincronizando Presupuesto...");
		if($('#JSONpresupuestoNube').html().length>0){
			var jsonpresup=JSON.parse($('#JSONpresupuestoNube').html());
			console.log(jsonpresup);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsonpresup.length;n++){
					var item=jsonpresup[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.id+',');
					
					tx.executeSql('INSERT OR IGNORE INTO PRESUPUESTO(timespan,valor,fecha,transacciones) VALUES("'+item.id+'",'+item.valor+','+item.fecha+','+item.transacciones+')',[],function(tx,results){
						console.log("insertado presupuesto:"+results.insertId);
					});
					
					tx.executeSql('UPDATE PRESUPUESTO SET timespan=  "'+item.id+'"  , valor = "'+item.valor+'" , fecha="'+item.fecha+'", transacciones = "'+item.transacciones+'" WHERE timespan='+item.id,[],function(tx,results){
						console.log("actualizado presupuesto");
					});
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "100%");
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('presupuesto')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						SubirDatosaNube(0);
						
						$("#theProgress").css("width" , "0%");
						$("#finalizado").fadeIn();
						$("#contentStepSincro").css("display","none");
						updateOnlineStatus('ONLINE');
					}).fail(function(){
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},60000);
					});
				});
		}
	}
}

function SubirDatosaNube(cual){
	console.log("sincronizador de subida...");
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	if(cual==0){
		db.transaction(function(tx){
			console.log("subida de categorias");
			tx.executeSql('SELECT * FROM CATEGORIAS WHERE sincronizar="true"',[],function(tx,results){
				console.log(results);
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					console.log(itemsasubir);
					PostaLaNube(itemsasubir,cual,"Categorias",0);
				}else{
					SubirDatosaNube(1);
				}
			});
		},errorCB,successCB);
	}if(cual==1){
		db.transaction(function(tx){
			console.log("subida de productos");
			tx.executeSql('SELECT * FROM PRODUCTOS WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"Productos",0);
				}else{SubirDatosaNube(2)}
			});
		},errorCB,successCB);
	}
	/*if(cual==2){
		db.transaction(function(tx){
			console.log("subida de clientes");
			tx.executeSql('SELECT * FROM CLIENTES WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"Clientes",0);
				}else{SubirDatosaNube(3)}
			});
		},errorCB,successCB);
	}*/
	if(cual==2){
		db.transaction(function(tx){
			console.log("subida de facturas");
			tx.executeSql('SELECT * FROM FACTURAS WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"Facturas",0);
				}else{SubirDatosaNube(3)}
			});
		},errorCB,successCB);
	}
	if(cual==3){
		db.transaction(function(tx){
			console.log("subida de EMPRESA");
			tx.executeSql('SELECT * FROM CONFIG WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"Config",0);
				}else{SubirDatosaNube(4)}
			});
		},errorCB,successCB);
	}
	if(cual==4){
		procesocount=0;
		setTimeout(function(){SincronizadorNormal();},60000);
	}
}

function PostaLaNube(arraydatos,cual,accion,t){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	var item=arraydatos.item(t);
	var jsonc='';
	if(accion=='Categorias'){
		jsonc='{"id":"'+item.id+'","categoria":"'+item.categoria+'","activo":"'+item.activo+'","timeSpan":"'+item.timespan+'"}';
	}else if(accion=='Productos'){
		jsonc='{  "id" : "'+item.id_local+'" , "formulado" : "'+item.formulado+'" , "timespan" : "'+item.timespan+'" , "codigo" : "'+item.codigo+'" , "precio" : "'+item.precio+'" , "cargaiva" : "'+item.cargaiva+'" , "categoriaid" : "'+item.categoriaid+'" , "productofinal" : "'+item.productofinal+'" , "materiaprima" : "'+item.materiaprima+'" , "servicio" : "'+item.servicio+'" , "activo" : "'+item.estado+'" }';
	}else if(accion=='Clientes'){
		jsonc='{  "id" : "'+item.id+'" , "cedula" : "'+item.cedula+'" , "nombre" : "'+item.nombre+'"  , "email" : "'+item.email+'" , "direccion" : "'+item.direccion+'" , "telefono" : "'+item.telefono+'" }';
	}else if(accion=='Facturas'){
		jsonc=item.fetchJson;
	}else if(accion=='Config'){
		jsonc='{"nombreempresa":"'+item.nombre+'","razon":"'+item.razon+'","telefono":"'+item.telefono+'","ruc":"'+item.ruc+'","direccion":"'+item.direccion+'","email":"'+item.email+'"}';
		
	}
	
	console.log(jsonc);
	
	$.post(apiURL,{
		id_emp: localStorage.getItem("empresa"),
		action: accion,
		id_barra: localStorage.getItem("idbarra"),
		json:jsonc,
		deviceid:$("#deviceid").html()
	}).done(function(response){
		console.log(response);
		if(parseInt(response)>0){
			db.transaction(function(tx){
				var sentencia='UPDATE '+accion+' SET sincronizar="false" WHERE timespan="'+item.timespan+'"';
				if(accion=='Clientes')
				sentencia='UPDATE '+accion+' SET sincronizar="false" WHERE cedula="'+item.cedula+'"';
				
				if(accion=='Config')
				sentencia='UPDATE '+accion+' SET sincronizar="false" WHERE id=1';

				tx.executeSql(sentencia,[],function(tx,results){});
			},errorCB,function(){
				if(t<arraydatos.length-1){
					t++;
					PostaLaNube(arraydatos,cual,accion,t);
				}else{
					console.log("Subir a la nube 2");
					SubirDatosaNube(cual+1);
				}
			});
		}else{
			if(t<arraydatos.length-1){
				t++;
				PostaLaNube(arraydatos,cual,accion,t);
			}
			else{
				console.log("Subir a la nube 2");
				SubirDatosaNube(cual+1);
			}
		}
		updateOnlineStatus("ONLINE");
	}).fail(function(){
			updateOnlineStatus("OFFLINE");
			setTimeout(function(){SincronizadorNormal()},60000);
	});
} 

//-----------------------------------Fin nuevo---------------