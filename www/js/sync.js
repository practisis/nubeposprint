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
	if(presupuestoya){
		yaesta=true;
		envia('dashboard');
		//setInterval(function(){SincronizadorNormal();},3000);
	}else if(clientesya){
		ExtraeDatosApi(4);
	}else if(productosya){
		ExtraeDatosApi(3);
	}else if(categoriasya){
		ExtraeDatosApi(2);
	}else if(idbarra){
		ExtraeDatosApi(1);
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
		$(".navbar").slideUp();
		$("#fadeRow").css("display","none");
		$("#contentStepSincro").fadeIn();
	}
}

function SincronizadorNormal(){
	
	console.log("sincronizador normal");
}

function SetResultados(donde){
	console.log("set resultados "+donde);
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
						db.transaction(iniciaDB,errorCB,successCB);
						SetDataEmpresa(nombre,celular,newEmail,iddevice,datosback[1],'','',false);
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
					ExtraeDatosApi(1);
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
	$.get(apiURL,{action:"login", user : quien , pass : pass, deviceid : iddevice},function(data){
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
			//function SetDataEmpresa(nombre,celular,email,deviceid,id_barra_arriba,ruc,direccion,desde_login)
			//SetDataEmpresa(datosaux[1],datosaux[3],quien,iddevice,datosaux[2],datosaux[4],datosaux[5],true);
		}
		$('#btnvalida2').html("Login");
	});
}

//-----------------------------------Fin nuevo---------------
function LoginEmpresa(id_emp,nombreempresa){
    $.post(apiURL,{
    		id_emp : localStorage.getItem("empresa"),
    		action : "loginempresa",
    		id_barra : localStorage.getItem("idbarra"),
    		/*yaConectado : yaConectado,
    		idBarraSync : idBarraSync*/
    }).done(function(response){
    		if(response=='block'){
    		  document.getElementById('linklogin').href='https://www.practisis.net/index3.php?rvus='+auxuser+'&rvpas='+auxpass;
    		  $('#bloqueo').fadeIn();
              $("#fadeRow").fadeOut();
    		}else{
			  //cuenta con licencia activa
    		  $('.navbar').fadeIn('fast');
    		  $("#fadeRow").fadeOut();
    			 $("#contentStepSincro").fadeIn();
    				empresa = localStorage.getItem('empresa');
    				$('#id_emp').html('Emp'+empresa);
    				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
    				db.transaction(function(tx){
    					tx.executeSql('SELECT COUNT(id) as cuantos FROM empresa',[],function(tx,res){
    						var existen=res.rows.item(0).cuantos;
    						if(existen==0){
    							db.transaction(
    								function (tx){
    									tx.executeSql('INSERT INTO empresa (nombre,nombreempresa,id_barra) VALUES ('+id_emp+',"'+nombreempresa+'","'+localStorage.idbarra+'");',[],
    									 function(tx,res){

    										console.log("Insert ID Empresa Sql:"+res.insertId);
    										console.log(res);
    									});
    								},errorCB,successCB
    							);
    						}
    						ExtraerDatosApi(1);
    					});

    				},errorCB,successCB);
    		}
    });
    //return false;

}


var barra_arriba='';
var auxuser = '';
var auxpass = '';
if(!barra_arriba){
	/*var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		 			db.transaction(function(tx){
					tx.executeSql('SELECT barra_arriba,id FROM empresa ',[],function(tx,results){
								
											for (var i=0; i <= results.rows.length-1; i++){
												var row = results.rows.item(i);
												var id = row.id;
												barra_arriba = row.barra_arriba;
											}
					});
					},errorCB ,successCB);*/
}

	
	var idBarraSync=0;
	var id_barra=$.trim($("#deviceid").html());  //"pJosueTerminsaxxczal4x20"; //deviceid
	if(!id_barra) id_barra='a383bc4552bfb701f96a17a4541b5565';
	//alert(id_barra);
	var TokenRequest='a383bc4552bfb701f96a17a4541b5565';
	var empresa;
	//apiURL='https://practisis.net/connectnubepos/api.php';
	var apiFolder='https://practisis.net/connectnubepos/';
	var globalContProductosNube=-1;
	var globalTSNube="";








/*-----------
		Process:
		    0.1.sincronizarProcess();
			0.2 obtenerDatosNube();
		1.1  compararJSONproductos();
		1.2	sincronizacionCategorias();
	------------>
	*/
	
var globalContProductosLocal=-1;		

	function sincronizarProcess2(){
			empresa = localStorage.getItem('empresa');
			obtenerDatosNube2(empresa);
			//muestraJSONLOCALCategorias();					
	}



	function saberIdBarraLocal(){
	
	}
	
	function saberIdBarra(jsonProductos){
		obj=$.parseJSON(jsonProductos);
        console.log(obj.Productos[0]);
        if(obj.Productos[0] != null){
    		idBarraSync= obj.Productos[0].id_barra;
    		db.transaction(function(tx){
    		tx.executeSql('SELECT barra_arriba,id FROM empresa ',[],function(tx,results){

    								for (var i=0; i <= results.rows.length-1; i++){
    									var row = results.rows.item(i);
    									var id = row.id;
    									barra_arriba = row.barra_arriba;
    								}
    								if(!barra_arriba){

    										db.transaction(function(tx){
    										tx.executeSql('UPDATE empresa SET barra_arriba=?' ,[idBarraSync],function(tx,results){
    										});
    										},errorCB ,successCB);

    								}
    		});
    		},errorCB ,successCB);
        }else{
          location.reload(true);
        }
	}
		function existeCategoria(formulado_tipo,id_formulado_tipo,formulado_tipo_timespan){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				tx.executeSql('SELECT * FROM CATEGORIAS',[],function(tx,results){
				if(formulado_tipo_timespan=='0') formulado_tipo_timespan='8';
					
								for (var i=0; i <= results.rows.length-1; i++){
									var row = results.rows.item(i);
									var idCat = row.id;
									var timeSpan = row.timespan;
									var categoria = row.categoria;
									var activo = row.activo;
									var existe = row.existe;
									if(timeSpan==formulado_tipo_timespan || timespan == id_formulado_tipo ){
										return true;
									}else{
										return false;
									}
								}
							
								
							
			},errorCB ,successCB);
		});
						
			

		}	
		var productosJsonActualizar='';
		var contProductosActualizar=-1;

		function nuevoProductoAbajo(jsonSync){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			contProductosActualizar++;
			i=contProductosActualizar;
			if(contProductosActualizar > (jsonSync.Productos.length-1)){
				idBarraSync=barra_arriba;
				contInterval=0;
				limpiarSincronizaDatos();
				$("#theProgress").css("width" , "25%");
				sincronizarFacturas();
				return;	
			}
			prc=( 12.5 / jsonSync.Productos.length ) * (contProductosActualizar +1) ;
			$("#theProgress").css("width" , prc + "%");
			//$("#theProgress").css("width" , "25%");
			//for(i=0; i<=(jsonSync.Productos.length-1); i++  ){
				row=jsonSync.Productos[i];
				id=row.id;
		 		formulado=row.formulado;

		 		formulado_timespan=row.timespan;
		 		activo=row.activo;
		 		ivacomprareal=row.ivacomprareal;
		 		id_formulado_tipo=row.id_formulado_tipo;
		 		formulado_tipo=row.formulado_tipo;
		 		formulado_codigo=row.formulado_codigo;
		 		formulado_tipo_timespan=row.formulado_tipo_timespan;
		 		precio=row.precio;
		 		if(!barra_arriba){
		 			db.transaction(function(tx){
					tx.executeSql('SELECT barra_arriba,id FROM empresa ',[],function(tx,results){
								
											for (var i=0; i <= results.rows.length-1; i++){
												var row = results.rows.item(i);
												var id = row.id;
												barra_arriba = row.barra_arriba;
											}
					});
					},errorCB ,successCB);	
		 		}
		 		
		 		
		 				db.transaction(function(tx2){
						tx2.executeSql('SELECT * FROM CATEGORIAS',[],function(tx2,results){
							//if(formulado_tipo_timespan=='0') formulado_tipo_timespan='8';
							
								var hayCategory= false;
								for (var i=0; i <= results.rows.length-1; i++){
									var row = results.rows.item(i);
									var idCat = row.id;
									var timeSpan = row.timespan;
									var categoria = row.categoria;
									var activo = row.activo;
									var existe = row.existe;
									if(timeSpan==formulado_tipo_timespan ){
										hayCategory=true;
									}
								}
								//alert(formulado + "<<" + hayCategory + "<<");
								if(!hayCategory){
									db.transaction(function(tx3){
											tx3.executeSql('INSERT INTO CATEGORIAS(categoria,timespan,activo,existe,sincronizar) VALUES("'+formulado_tipo+'" , "'+id_formulado_tipo+'",1,0,"false")',[],function(tx3,results){
												$.post(apiURL,{ KeyRequest : "UpdateTimeSpanCategory" , id_formulado_tipo: id_formulado_tipo , empresa : empresa , id_barra : id_barra , barra_arriba : barra_arriba  }).done(function(data){
														
														db.transaction(function(tx3){
														tx3.executeSql('INSERT INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio,activo) VALUES("'+formulado+'", "'+codigo+'" , '+precio+', '+id_formulado_tipo+' , 1,1,1,"'+formulado_timespan+'" , 1 , '+activo+' ) ',[],function(tx3,results){
																
																nuevoProductoAbajo(jsonSync);

														},errorCB ,successCB);
														});	


												});
											
										},errorCB ,successCB);
										});

								}else{
									if(formulado_timespan==0){
										/* Formulado Nuevo creado desde arriba sin timespan */
									
										db.transaction(function(tx3){
											tx3.executeSql('INSERT INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio) VALUES("'+formulado+'", "'+formulado_codigo+'" , '+precio+', '+id_formulado_tipo+' , 1,1,1,"'+formulado_timespan+'" , 1  ) ',[],function(tx3,results){

												nuevoProductoAbajo(jsonSync);

										},errorCB ,successCB);
										});
												}else{
													console.log('UPDATE PRODUCTOS SET formulado ="'+formulado+'" ,codigo="'+formulado_codigo+'", precio='+precio+' , categoriaid='+id_formulado_tipo+',cargaiva=1,productofinal=1,materiaprima=1 WHERE timespan =' + formulado_timespan );
													/*Formulado Con timespan, puede ser creado desde otro terminal nubepos*/
											db.transaction(function(tx3){
											tx3.executeSql('UPDATE PRODUCTOS SET formulado ="'+formulado+'" ,codigo="'+formulado_codigo+'", precio='+precio+' , categoriaid='+id_formulado_tipo+',cargaiva=1,productofinal=1,materiaprima=1 WHERE timespan =' + formulado_timespan,[],function(tx3,results){
													
															nuevoProductoAbajo(jsonSync);

										},function(err){console.log(err + "algo fallo en este formulado" + formulado);} ,successCB);
										});
													/*db.transaction(function(tx3){
													tx3.executeSql('SELECT * FROM PRODUCTOS WHERE timespan=' + formulado_timespan,[],function(tx3,results){
													if(formulado_tipo_timespan=='0') formulado_tipo_timespan='8';
										
													for (var i=0; i <= results.rows.length-1; i++){
														var row = results.rows.item(i);
														var idCat = row.id;
														var timeSpan = row.timespan;
														var categoria = row.categoria;
													}
												},errorCB ,successCB);
												});*/
												}
											}
							
														
							},errorCB ,successCB);
						});

	}




	/* Start proceso recurrente */
	var contClientesSync=-1;
	var contCategoriasSync=-1;
	var contProductosSync=-1;

	function productosAbajo(json){

		contProductosSync++;
		if( contProductosSync >=  (json.length) ){
			console.log("End Productos 3.4 Sinc Facturas y Presupuestos" );
			$("#theProgress").css("width" , "75%");
			objLocalCategory='';
			syncLocal();
			return;
		}
		/*
					formulado_codigo": "00000001",
                    "id": "20",
                    "formulado": "Josue Producto 001",
                    "timespan": "0",
                    "activo": "1",
                    "ivacomprareal": "",
                    "id_formulado_tipo": "20",
                    "formulado_tipo": "JosueProductos",
                    "formulado_tipo_timespan": "0",
                    "impuestos": " 1|IVA|0.12@2|Servicio|0.1"
		*/
		prc=( 75 / json.length ) * (contProductosSync + 1) ;
		$("#theProgress").css("width" , (50 + prc )+ "%");
		$("#txtSincro").html("Sincronizando Productos("+contProductosSync+"/"+json.length+")");
		precio=json[contProductosSync].precio;
		formulado_codigo=json[contProductosSync].formulado_codigo;
		id=json[contProductosSync].id;
		formulado=json[contProductosSync].formulado;
		timespan=json[contProductosSync].timespan;
		activo=json[contProductosSync].activo;
		ivacomprareal=json[contProductosSync].ivacomprareal;

		id_formulado_tipo=json[contProductosSync].id_formulado_tipo;
		formulado_tipo_timespan=json[contProductosSync].formulado_tipo_timespan;
		impuestos=json[contProductosSync].impuestos;
		expImpuestos=impuestos.split("@");
		servicio=0;
		for(x=0; x<=(expImpuestos.length-1); x++){
			currentImpuestos=expImpuestos[x];
			expPipes=currentImpuestos.split("|");
			idImpuesto=$.trim(expPipes[0]);
			if(idImpuesto=='2')	servicio=1
		}

		esmateriaprima=json[contProductosSync].esmateria;
		esproductofinal=json[contProductosSync].esproductofinal;
		if(!ivacomprareal) ivacomprareal=0;
		if(!esmateriaprima) esmateriaprima=0;
		if(!esproductofinal) esproductofinal=0;
		
		/* valida si tiene formulado tipo */
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
					db.transaction(function(tx){
						tx.executeSql('SELECT * FROM CATEGORIAS WHERE timespan="'+id_formulado_tipo+'"' ,[],function(tx,results){
							if(results.rows.length){
								/*   Existe Categoria Pasar A crear Producto  */
								/*3 Casos */
								/*Case 1> IF Timespan of Product Exist (Edit Product)*/
								/*Case 2 > IF TimeSpan is equal to 0 is (New and update Timespan)*/
								/* Case 3  IF TimeSpan is != 0 and Not Exist is a (New put with timespan) (Maybe crete in another device)    */
								if(timespan!='0'){
									tx.executeSql('SELECT * FROM PRODUCTOS WHERE timespan="'+timespan+'"' ,[],function(tx,results){
											if(results.rows.length){
												/*Edit */
												tx.executeSql('UPDATE PRODUCTOS SET formulado="'+formulado+'" , codigo="'+formulado_codigo+'" ,  precio="'+precio+'", categoriaid="'+id_formulado_tipo+'"  ,cargaiva="'+ivacomprareal+'" , productofinal="'+esproductofinal+'" , materiaprima="'+esmateriaprima+'", servicio="'+servicio+'" , estado="'+activo+'" WHERE timespan="'+timespan+'" ' ,[],function(tx,results){
													//INSERT INTO PRODUCTOS(formulado,codigo,precio,tegoriaid) VALUES()
													//alert("Se ha actualiado este producto>>" + formulado );
													console.log("Updated " + formulado);
													$.post(apiURL,{ KeyRequest : "deletesinc" , idbarras : barra_arriba,tabla:'formulados|formulados_precios',formulado: id}).done(function(data){
														productosAbajo(json);
													});
												});
											}else{
												/*  Producto creado desde otro lado insertar con timespan */
												tx.executeSql(' INSERT INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,timespan,materiaprima,servicio,estado) VALUES("'+formulado+'" , "'+formulado_codigo+'" , "'+precio+'" , "'+id_formulado_tipo+'" ,  "'+ivacomprareal+'" , "'+esproductofinal+'" , "'+timespan+'", "'+esmateriaprima+'" , "'+servicio+'", "'+activo+'" )  ' ,[],function(tx,results){
													console.log("Created " + formulado);
													$.post(apiURL,{ KeyRequest : "deletesinc" , idbarras : barra_arriba,tabla:'formulados|formulados_precios',formulado: id}).done(function(data){
														productosAbajo(json);
													});
												});

											}
									});

								}else{

									/*Producto Creado desde arriba sin haber sincronizado en algun lado*/
									timespan=getTimeSpan();
										tx.executeSql(' INSERT INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,timespan,materiaprima,servicio,estado) VALUES("'+formulado+'" , "'+formulado_codigo+'" , "'+precio+'" , "'+id_formulado_tipo+'" ,  "'+ivacomprareal+'" , "'+esproductofinal+'" , "'+timespan+'", "'+esmateriaprima+'","'+servicio+'" , "'+activo+'" )  ' ,[],function(tx,results){
													//alert("Producto con timespan >>" + timespan + " " + formulado + "<< Creada desde otro lado" );
													$.post(apiURL,{ KeyRequest : "putTimeSpanProduct" , timespan : timespan , id_formulado: id , empresa : empresa, barra_arriba : barra_arriba }).done(function(data){
														//alert(data + "<<< Hacer Cambios");
														console.log("Created and updated timespanup " + formulado);
														productosAbajo(json);
													});
													
												});

								}
									


							}else{

								/*Hey Create a new Category*/
								console.log("No existe la categoria" + formulado_tipo);
								productosAbajo(json)
							}

								});
						},errorCB ,successCB);	

		//alert(formulado);
	}




	function categoriasAbajo(json){
		contCategoriasSync++;
		if( contCategoriasSync >=  (json.length) ){
			//alert("End Categorias" + contCategoriasSync + "=="+  (json.length) );
			productosAbajo(recurrenteJsonProductos);
			$("#theProgress").css("width" , "50%");
			/*Terminar Con Productos*/
			return;
		}
		prc=( 50 / json.length ) * (contCategoriasSync + 1) ;
		 $("#theProgress").css("width" , (25 + prc )+ "%");
		$("#txtSincro").html("Sincronizando Categorias("+contCategoriasSync+"/"+json.length+")");
		idreal=json[contCategoriasSync].idreal;
		activo=json[contCategoriasSync].activo;
		formulado_tipo=json[contCategoriasSync].formulado_tipo;
		timespan=json[contCategoriasSync].timespan;

				if(timespan != '0'){
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
					db.transaction(function(tx){
						tx.executeSql('SELECT * FROM CATEGORIAS WHERE timespan="'+idreal+'"' ,[],function(tx,results){

								if(results.rows.length){
									
									console.log('UPDATE CATEGORIAS SET categoria="'+formulado_tipo+'" , activo="'+activo+'" , sincronizar="false"  WHERE timespan="'+idreal+'"');
									tx.executeSql('UPDATE CATEGORIAS SET categoria="'+formulado_tipo+'" , activo="'+activo+'" , sincronizar="false"  WHERE timespan="'+idreal+'"',[],function(tx,results){

										console.log("Edited >" + formulado_tipo);
										categoriasAbajo(json);
									});
								}else{

									/* Categoria creada desde otra Tablet */
									tx.executeSql('INSERT INTO CATEGORIAS(categoria,activo,existe,timespan,sincronizar)  VALUES("'+formulado_tipo+'" , "'+activo+'" , "0" , "'+idreal+'" , "false" )',[],function(tx,results){
									$.post(apiURL,{ KeyRequest : "UpdateTimeSpanCategory" , id_formulado_tipo: idreal , empresa : empresa , id_barra : id_barra , barra_arriba : barra_arriba  }).done(function(data){
											//alert( "Se ha Creado el formulado_tipo" > formulado_tipo +">>"+ data );
											categoriasAbajo(json);
										});
									});


									//categoriasAbajo(json);
								}
								

						});
					},errorCB ,successCB);	

				}else{
						/*Categorias Sin Timespan*/
						//alert("TimeSpan = 0" + formulado_tipo); 
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){
						tx.executeSql('INSERT INTO CATEGORIAS(categoria,activo,existe,timespan,sincronizar)  VALUES("'+formulado_tipo+'" , "'+activo+'" , "0" , "'+idreal+'" , "false" )',[],function(tx,results){
									$.post(apiURL,{ KeyRequest : "UpdateTimeSpanCategory" , id_formulado_tipo: idreal , empresa : empresa , id_barra : id_barra , barra_arriba : barra_arriba  }).done(function(data){
											console.log( "Se ha Creado el formulado_tipo>" + formulado_tipo +">>"+ data );
											categoriasAbajo(json);
										});
									});
						},errorCB ,successCB);	


						
				}
		//alert(idreal + "<>" + formulado_tipo);
		

	}
	function clientesAbajo(json){
		contClientesSync++;
		if( contClientesSync >=  (json.length) ){
			$("#theProgress").css("width" , "25%");
			if(recurrenteJsonCategorias.length){
				/*Si existen Categorias Empezamos el proceso*/
				contCategoriasSync=-1;
				categoriasAbajo(recurrenteJsonCategorias);
			}else{
				/*Si no hay categorias Vamos con los productos*/

			}
		}else{
		prc=( 25 / json.length ) * (contClientesSync + 1) ;
		 $("#theProgress").css("width" , (0 + prc )+ "%");

			$("#txtSincro").html("Sincronizando Clientes("+contClientesSync+"/"+json.length+")");
				idreal=json[contClientesSync].idreal;
				cedula=json[contClientesSync].cedula;
				direccion=json[contClientesSync].direccion;
				nombre=$.trim(json[contClientesSync].nombre);
				email=json[contClientesSync].email;
				telefono=json[contClientesSync].telefono;
				activo=json[contClientesSync].activo;

				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
					db.transaction(function(tx){
						tx.executeSql('SELECT * FROM CLIENTES WHERE cedula=' + cedula,[],function(tx,results){

							

							if(results.rows.length){
								/* Update Cliente */
								tx.executeSql('UPDATE CLIENTES SET nombre=  "'+nombre+'"  , cedula = "'+cedula+'" , email="'+email+'"  , direccion = "'+direccion+'" , sincronizar="false"  WHERE cedula='+cedula  ,[],function(tx,results){ 
									clientesAbajo(json);		
								});


							}else{
									/* New Cliente */
								tx.executeSql('INSERT INTO CLIENTES(nombre,cedula,email,direccion,telefono,sincronizar,existe,timespan) VALUES("'+nombre+'" , "'+cedula+'" , "'+email+'" , "'+direccion+'" ,  "'+telefono+'" ,  "false" , "0" , "0" )'  ,[],function(tx,results){ 
									clientesAbajo(json);		
								});
							}
							
							
						});
					},errorCB ,successCB);


				//alert(idreal);
				
			
		}
		
		
	}
	var recurrenteJsonClientes;
	var recurrenteJsonCategorias;
	var recurrenteJsonProductos;











/* End proceso recurrente */


	//jsonSync.BigJson[1].Clientes
		function obtenerDatosNube2(empresa){
							
			$.post(apiURL,{
								id_emp : empresa ,
								KeyRequest : 'datosIniciales',
								id_barra : id_barra,
								yaConectado : yaConectado,
								idBarraSync : idBarraSync
						}).done(function(response){

							if(yaConectado){
								//sincronizacion recurrente
								console.log(response);
								

								 	jsonSync=$.parseJSON(response);
								 	/* 3.1 Json Clientes */
								 	/* 3.2 Json Categorias */
								 	/* 3.3 Json Productos */
								 	recurrenteJsonClientes=jsonSync.BigJson[1].Clientes;
									recurrenteJsonCategorias=jsonSync.BigJson[2].Categorias;
									recurrenteJsonProductos=jsonSync.BigJson[0].Productos;
									console.log( ">>>>>>" + jsonSync );
									
								 	if(jsonSync.BigJson[1].Clientes.length){
								 		productosJsonActualizar=response;
								 		contClientesSync=-1;
								 		clientesAbajo(jsonSync.BigJson[1].Clientes);
								 	}else{
		 								$("#theProgress").css("width" ,  "25%");
								 		if(recurrenteJsonCategorias.length){
											/*Si existen Categorias Empezamos el proceso*/
											contCategoriasSync=-1;
											categoriasAbajo(recurrenteJsonCategorias);
										}else{
		 									$("#theProgress").css("width" ,"50%");
											/*Si no hay categorias Vamos con los productos*/
											contProductosSync=-1;
											productosAbajo(recurrenteJsonProductos);

										}

								 	}




								 	/*if(jsonSync.Productos.length){
								 		productosJsonActualizar=response;
								 		nuevoProductoAbajo(jsonSync);
								 	}else{
								 		/*No hay Productos*/
								 		//$("#theProgress").css("width" , "25%");
								 	//	sincronizarFacturas();

								 	//}
								 	
								 	

							}else{
								//sincronizacion inicial
								var arraydatos=JSON.parse(response); 
								console.log(">>>>Iniciar >>>"+response);
								JSONproductosNube=arraydatos.productos;
								JSONcategoriasNube=arraydatos.categorias;
								JSONclientesNube=arraydatos.clientes;
								
								$("#JSONclientesNube").html(JSONclientesNube);
								$("#JSONCategoriasNube").html(JSONcategoriasNube);
								$("#JSONproductosNube").html(JSONproductosNube);
								saberIdBarra(JSONproductosNube); //cambiar para mandar aparte no en productos
								$("#JSONproductosLocal").html('');
								JSONproductosLocal='{ "Productos" : [';
								$("#JSONproductosLocal").append(JSONproductosLocal);
								var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
								db.transaction(function(tx){
								tx.executeSql('SELECT p.*,c.categoria as nombrec , p.timespan as timespan ,  c.id as idcat FROM PRODUCTOS p,CATEGORIAS c WHERE p.categoriaid=c.timespan ORDER BY p.formulado ASC',[],function(tx,results){
								for (var i=0; i <= results.rows.length-1; i++){
								var row = results.rows.item(i);
								var formulado = row.formulado;
								var codigo = row.codigo;
								var precio = row.precio;
								var categoriaid = row.idcat;
								var categorianombre = row.nombrec;
								var timespan = row.timespan;
								var cargaiva = row.cargaiva;
								var productofinal = row.productofinal;
								var materiaprima = row.materiaprima;
								JSONproductosLocal='{ "formulado" : "'+formulado+'"  , "codigo" : "'+codigo+'" , "precio" : "'+precio+'" , "categoriaid" : "'+categoriaid+'" , "categorianombre" : "'+categorianombre+'" , "cargaiva" : "'+cargaiva+'" , "productofinal" : "'+productofinal+'" , "materiaprima" : "'+materiaprima+'" , "timespan" : "'+timespan+'"},';
							if(i==results.rows.length-1) JSONproductosLocal=JSONproductosLocal.substring(0,JSONproductosLocal.length-1);
								$("#JSONproductosLocal").append(JSONproductosLocal);
								}
								$("#JSONproductosLocal").append(']}');
								if(!yaConectado){
									 compararJSONproductos(); 
									}else{

									} 


						});
					},errorCB ,successCB);
						
					
			
							}

			});
		}



		function compararJSONproductos(){
			JSONproductosLocal=$("#JSONproductosLocal").html();
			JSONproductosNube=$("#JSONproductosNube").html();
			JLocal=jQuery.parseJSON(JSONproductosLocal);
			JNube=$.parseJSON(JSONproductosNube);
			arrayProductosLocalFaltantes= new Array();
			contTsNube=-1;
			
			for(j=0; j<= (JLocal.Productos.length -1); j++ ){
				hayProductoEnNube=false;
				pLocal=JLocal.Productos[j];		
				tsLocal=$.trim(pLocal.timespan);
				formuladoLocal=pLocal.formulado;
				for(k=0; k<= (JNube.Productos.length -1); k++ ){
						pNube=JNube.Productos[k];		
						tsNube=$.trim(pNube.formulado_timespan);
						if(tsLocal==tsNube) { 
						hayProductoEnNube=true; }
				}

				if(hayProductoEnNube==false){
					arrayProductosLocalFaltantes[arrayProductosLocalFaltantes.length]=tsLocal;
				}
			}
			
			sincronizaFaltanteProductosLocal();
			
		}
		

		
		function sincronizaFaltanteProductosLocal(){
			if( (globalContProductosLocal + 1) > (arrayProductosLocalFaltantes.length-1 ) ){
				console.log("fin bucle");//fin Sincronizacion Local
				$("#theProgress").css("width" , "12.5%");

				sincronizaFaltanteProductosNube();
				return ;
			}else{
				globalContProductosLocal++;
				actualTimeSpan=arrayProductosLocalFaltantes[globalContProductosLocal];
				JSONproductosLocal=$("#JSONproductosLocal").html();
				JLocal=jQuery.parseJSON(JSONproductosLocal);
				var formulado="";
				for(j=0; j<= (JLocal.Productos.length -1); j++ ){
					pLocal=JLocal.Productos[j];		
					if(pLocal.timespan==actualTimeSpan){
						formulado= pLocal.formulado;
						codigo= pLocal.codigo;
						categoriaid= pLocal.categoriaid;
						categorianombre= pLocal.categorianombre;
						precio= pLocal.precio;
						cargaiva= pLocal.cargaiva;
						productofinal= pLocal.productofinal;
						materiaprima= pLocal.materiaprima;
						
					}
				}
				
				if(formulado){

						//$.post('http://practisis.net/practipos2/ajax/apiSincronizador/apiSincronizaNubeposProductosNew.php',{
						$.post(apiURL,{
							KeyRequest : 'insertProductLocal',
							empresa : empresa , 
							formulado : formulado ,
							 codigo : codigo , 
							 precio : precio , 
							 categorianombre : categorianombre , 
							 cargaiva : cargaiva , 
							 productofinal : productofinal , 
							 materiaprima : materiaprima, 
							 timespan : actualTimeSpan
						}).done(function(data){
							
							$("#theProgress").css("width" , "12.5%");
							prc=( 12.5 / arrayProductosLocalFaltantes.length ) * globalContProductosLocal ;
							$("#theProgress").css("width" , prc + "%");
							console.log(data);
						});
				}
				
				sincronizaFaltanteProductosLocal();
			}
			
		}



		var arrayProductosNubeFaltantes;
		
		function sincronizaFaltanteProductosNube(){			
			JSONproductosLocal=$("#JSONproductosLocal").html();
			JSONproductosNube=$("#JSONproductosNube").html();
			JLocal=jQuery.parseJSON(JSONproductosLocal);
			JNube=$.parseJSON(JSONproductosNube);
			arrayProductosNubeFaltantes= new Array();
			contTsNube=-1;
			
			for(j=0; j<= (JNube.Productos.length -1); j++ ){
				hayProductoEnNube=false;
				pNube=JNube.Productos[j];		
				tsNube=$.trim(pNube.formulado_timespan);
				formuladoNube=pNube.formulado_nombre;
				formuladoNubeID=pNube.formulado_id;
				
				for(k=0; k<= (JLocal.Productos.length -1); k++ ){
						pLocal=JLocal.Productos[k];		
						tsLocal=$.trim(pLocal.timespan);
						if(tsLocal==tsNube) { 
							
							hayProductoEnNube=true;
	
						}
				}
				if(hayProductoEnNube==false){
					arrayProductosNubeFaltantes[arrayProductosNubeFaltantes.length]=formuladoNubeID;
				}
			}
			
			sincronizaProductoNube();
			
		}
		

		function sincronizaProductoNube(){
				if(!arrayProductosNubeFaltantes.length) {
					$("#theProgress").css("width" , "25%");
					sincronizacionCategorias();
					return;
				}
			if( (globalContProductosNube + 1) > (arrayProductosNubeFaltantes.length-1 ) ){
				console.log("fin bucle Nube Productos");//fin Sincronizacion Local
				$("#theProgress").css("width" , "25%");
				sincronizacionCategorias();
				
				return ;
			}else{
				globalContProductosNube++;		
				currentFormulado=arrayProductosNubeFaltantes[globalContProductosNube];
				JSONproductosNube=$("#JSONproductosNube").html();
				JNube=jQuery.parseJSON(JSONproductosNube);
				var formulado="";
				timeSpan="";
				for(j=0; j<= (JNube.Productos.length -1); j++ ){
					pNube=JNube.Productos[j];		
					if(pNube.formulado_id==currentFormulado){
						formulado= pNube.formulado_nombre;
						codigo= pNube.formulado_codigo;
						precio= pNube.formulado_precio;
						impuesto = pNube.formulado_impuesto;
						tipo= pNube.formulado_tipo;
						categoriaid= pNube.categoria_id;
						categorianombre= pNube.categoria_nombre;
						cargaiva= pNube.cargaiva;
						productofinal= pNube.formulado_productofinal;
						materiaprima= pNube.formulado_matprima;
						timeSpan=  pNube.formulado_timespan;
						formulado_id=pNube.formulado_id;
						cargaservicio = pNube.carga_servicio;
						
					}
				}
				
				if(formulado){
					actualTimeSpan=timeSpan;
					globalTSNube=timeSpan;
					if(actualTimeSpan=="0"){
						actualTimeSpan=getTimeSpan();
						globalTSNube= actualTimeSpan ;
						}
					
						//$.post('http://practisis.net/practipos2/ajax/apiSincronizador/apiSincronizaNubeposProductosNew.php',{ tipo : "actualizar" ,
						$.post(apiURL,{ 
							KeyRequest : "updateProductTimeSpan"  ,
							tipo : "actualizar" ,
							formulado_id : formulado_id , 
							empresa : empresa , 
							formulado : formulado , 
							codigo : codigo , 
							precio : precio , 
							categorianombre : categorianombre , 
							cargaiva : cargaiva , 
							productofinal : productofinal , 
							materiaprima : materiaprima, 
							timespan : globalTSNube
						}).done(function(data){
						
							prc=( 12.5 / arrayProductosNubeFaltantes.length ) * (globalContProductosNube +1) ;
							$("#theProgress").css("width" , (12.5 + prc )+ "%");
							
							// 1. Validar Si existe  Categoria
							//2. Meter Categoria si no existe
							categoria=categorianombre;
							
							var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
								db.transaction(function(tx){
								timeSpanCat=getTimeSpan();
								tx.executeSql('INSERT INTO CATEGORIAS(categoria,activo,existe , timespan,sincronizar ) SELECT "'+categoria+'",1,0,'+categoriaid+' , "false" WHERE NOT EXISTS(SELECT 1 FROM CATEGORIAS WHERE categoria = "'+categoria+'");',[],function(tx,results){
								
									$('#idcategoria').val(results.insertId);
									console.log("categ:"+results.insertId);
									
									//idcategoria=results.insertId;//$('#idcategoria').val();
									 idcategoria=localCategoriaID(categoriaid);//categoriaid;
									//if(!idcategoria)
									if( !cargaiva )  cargaiva = '0';
									if( !productofinal )  productofinal = '0';
									if( !materiaprima )  materiaprima = '0';

									
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO PRODUCTOS(id,formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio) SELECT 0,"'+formulado+'","'+codigo+'","'+precio+'",'+idcategoria+','+cargaiva+','+productofinal+','+materiaprima+','+globalTSNube+' , "'+cargaservicio+'" WHERE NOT EXISTS(SELECT 1 FROM PRODUCTOS WHERE formulado like "'+formulado+'" or codigo like "'+codigo+'");',[],function(tx,results){
										console.log("prod:"+results.insertId);
											sincronizaProductoNube();
											
										});
									},errorCB,successCB);
								});
								},errorCB,successCB);
							
							
							
							console.log(data);
							
						});
					
				}
				
				
			}
		
		}
		


function localCategoriaID(categoriaid){
			JSONCategoriasLocal=$("#JSONCategoriasLocal").text();
			JLocalCat=$.parseJSON(JSONCategoriasLocal);
			hayMatch=false;
			for(i=0;i<=(JLocalCat.Categorias.length-1); i++){
				id=JLocalCat.Categorias[i].id;
				timespan=JLocalCat.Categorias[i].timespan;
				if(categoriaid == timespan){
					hayMatch=true;
					return id;
					
				}
			}
			if(hayMatch==false){
			return categoriaid;
			}

		}
		
		function sincronizacionCategorias(){
			
			
			
		//	$.post('https://www.practisis.net/nubeposboot/www/ajax/dataserviceNew.php',{
				$.post(apiURL,{
								KeyRequest : "datosIniciales" , 
								id_emp : empresa,
								id_barra : id_barra
						}).done(function(response){
					var arraydatos=JSON.parse(response); 
					JSONproductosNube=arraydatos.productos;
					JSONcategoriasNube=arraydatos.categorias;
					$("#JSONCategoriasNube").html(JSONcategoriasNube);
					$("#JSONproductosNube").html(JSONproductosNube);
					//$("#JSONproductosLocal").html('');
						cargarJSONLocalCategorias();
						
					});
			
		}
		function cargarJSONLocalCategorias(){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
			tx.executeSql('SELECT * FROM CATEGORIAS',[],function(tx,results){
					$("#JSONCategoriasLocal").html(' { "Categorias" :  [ ');
					txt='';
								for (var i=0; i <= results.rows.length-1; i++){
									var row = results.rows.item(i);
									var idCat = row.id;
									var timeSpan = row.timespan;
									var categoria = row.categoria;
									var activo = row.activo;
									var existe = row.existe;
									txt+='{  "id" : "'+idCat+'" ,  "categoria" : "'+categoria+'" ,  "activo" : "'+activo+'" ,  "existe" : "'+existe+'" ,  "timespan" : "'+timeSpan+'"  },';
									//$("#JSONCategoriasLocal").append(txt);
								}
								txt=txt.substring(0,txt.length-1);
								$("#JSONCategoriasLocal").append(txt+" ]}");
								validarJsonCategorias();
			},errorCB ,successCB);
		});
						
			
		}
		var arrayFaltanteCategoryLocal=new Array();
		function validarJsonCategorias(){
			if(yaConectado) return;
			JSONCategoriasNube= $("#JSONCategoriasNube").text();
			JSONCategoriasLocal=  $("#JSONCategoriasLocal").text();
			JCNube=jQuery.parseJSON(JSONCategoriasNube);
			JCLocal=jQuery.parseJSON(JSONCategoriasLocal);
			for(i=0;i<=(JCLocal.Categorias.length-1);i++){
				catLocal=JCLocal.Categorias[i];
				timeSpan=catLocal.timespan;
				idCatLocal=catLocal.id;
				categoriaLocal=$.trim(catLocal.categoria).toLowerCase();
				var hayMatchCat=false;
				var hayMatchNombre=false;
				for(j=0; j<=JCNube.Categorias.length-1; j++){
					catNube=JCNube.Categorias[j];
					idNube=catNube.categoria_id;
					categoriaNube=$.trim(catNube.categoria_nombre).toLowerCase();
					if(timeSpan==idNube){
						hayMatchCat=true;
					}
					
					
					
					if(categoriaNube==categoriaLocal){
						hayMatchNombre=true;
					}
				}
				if(hayMatchCat==false && hayMatchNombre==true){
					arrayFaltanteCategoryLocal[arrayFaltanteCategoryLocal.length]=idCatLocal+"|"+idNube;
					var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){
						
							tx.executeSql("UPDATE PRODUCTOS SET categoriaid=? WHERE categoriaid=?;",[idNube,timeSpan],function(tx,results){
								
							});
							console.log("UPDATE PRODUCTOS SET categoriaid=? WHERE categoriaid=?" + idNube + " <> " + timeSpan);
						},errorCB ,successCB);	
					console.log("actualizar timespan abajo>>" + catLocal.categoria +  ">>" + idNube);
				}
			}

			actualizarCategoriasID();
			
			
			
		}
		
		var arrayCategoriasFaltantesNube = new Array();
		function validarJsonCategoriasNube(){
			
			JSONCategoriasNube= $("#JSONCategoriasNube").text();
			JSONCategoriasLocal=  $("#JSONCategoriasLocal").text();
			JCNube=jQuery.parseJSON(JSONCategoriasNube);
			JCLocal=jQuery.parseJSON(JSONCategoriasLocal);
			var hayMatchCat=false;
			for(i=0;i<=(JCNube.Categorias.length-1);i++){
				catNube=JCNube.Categorias[i];
				idCatNube=catNube.categoria_id;
				nombreCat=catNube.categoria_nombre;
				for(j=0; j<=JCLocal.Categorias.length-1; j++){
					
					catLocal=JCLocal.Categorias[j];
					timespanLocal=catLocal.timespan;
					if(timespanLocal==idCatNube){
						hayMatchCat=true;
					}
				}
				if(hayMatchCat==false){
					arrayCategoriasFaltantesNube[arrayCategoriasFaltantesNube.length] = nombreCat + "|" + idCatNube;
					
				}
			}
			agregarCategoriasFalatantesNube();
			
			
			
		}
		globalContCatFaltantesNube=-1;
		var contFacturas=-1;
		var objFactura;
		var maxFacturas=0;
		function sincronizarFacturas(){
			
			if(!yaConectado)
				{
					
					sincronizarClientes();
					return;
				}
				
			/*if(!objFactura){
				$('#theProgress').width("50%");
				$("#txtSincro").html('<i>(1/2) Sincronizando Facturas</i>');
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					tx.executeSql('SELECT * FROM FACTURAS',[],function(tx,results){
						if(!results.rows.length){
							console.log("Sin facturas Saltar Paso");
							sincronizaPresupuesto();
							
							return;
						}else{

							maxFacturas=results.rows.length;
							objFactura=results;
							sincronizarFacturas();

						}
					});
				},errorCB,successCB);

			}else{
				contFacturas++;
				
				prc=( 75 / maxFacturas  ) * (contFacturas +1) ;
				 $("#theProgress").css("width" , (75 + prc )+ "%");
				$("#txtSincro").html('<i>Sincronizando Facturas( '+contFacturas+'/'+objFactura.rows.length+')</i>');
				
				if(contFacturas >= objFactura.rows.length){
					console.log("Terminadas las facturas" + contFacturas + " Limpiar Datos");
					
					objPresupuesto='';
					sincronizaPresupuesto();

					return;
				}
							i=contFacturas;
							var row = objFactura.rows.item(i);
								id=row.id;		
								clientName=row.clientName;
								fetchJson=row.fetchJson;
								paymentsUsed=row.paymentsUsed;
								cash=row.cash;
								fecha=row.fecha;
								obj=$.parseJSON(fetchJson);
								idCliente=obj.Pagar[0].cliente.id_cliente;
								console.log( ">factura Enviada" +  fetchJson);
								$.post(apiFolder+"sincronizador_nubepos.php" , { id : 'sub' , emp : empresa , local : 2 , caj : barra_arriba , js : fetchJson}).done(function(data){
									console.log(" Mario Response >>" + data);
									sincronizarFacturas();
								});
				
			}*/

			
					
		}
		
		
		function bajaClientes(){
			
			$.post(apiURL, {   KeyRequest : "bajarClientes" , id_barra : id_barra , empresa : empresa, barra_arriba : barra_arriba } ).done(function(data){
				objClient=$.parseJSON(data);
					console.log(data);

				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					tx.executeSql('SELECT * FROM CLIENTES',[],function(tx,results){
						
						for(j=0; j<= (objClient.Clientes.length-1) ; j++){
									rowUP=objClient.Clientes[j];
									idUP=rowUP.id;
									cedulaUP=rowUP.cedula;
									nombreUP=rowUP.nombre + " " + rowUP.apellido ;
									direccionUP=rowUP.direccion;
									emailUP=rowUP.email;
									telefonoUP=rowUP.telefono;

										for (var i=0; i <= results.rows.length-1; i++){
											var row = results.rows.item(i);
											var cedula = $.trim(row.cedula);
											existeClient=false;
											
											if(cedula==$.trim(cedulaUP)){
												existeClient=true;
											}
										}
										if(existeClient){

											tx.executeSql('UPDATE clientes SET nombre = "'+nombreUP+' ",email="'+emailUP+'",direccion = "'+direccionUP+'",telefono = "'+telefonoUP+'",timespan="'+idUP+'"  WHERE cedula="'+cedulaUP+'"  ',[],function(tx,results){

													console.log(cedulaUP + "<<Edited" );
											});

										}else{
											tx.executeSql('INSERT INTO CLIENTES(nombre,cedula,email,direccion,telefono,timespan) VALUES("'+nombreUP+'" , "'+cedulaUP+'" , "'+emailUP+'" , "'+direccionUP+'" , "'+telefonoUP+'" , "'+idUP+'"  )',[],function(tx,results){

													console.log(cedulaUP + "<<New" );

											});

										} 
									
								}

								objPresupuesto='';
								sincronizaPresupuesto();
								$("#theProgress").css("width" , "100%");
								//limpiarSincronizaDatos();




					
				});
				},errorCB,successCB);
			});

		}
		/*Sincronizacion Clientes STEP 3*/
		function sincronizarClientes(){
			$('#theProgress').width("75%");
			$("#txtSincro").html('<i>(1/2)Sincronizando Clientes</i>');
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					tx.executeSql('SELECT * FROM CLIENTES',[],function(tx,results){
					jsonClientesLocal='{ "JsonClientes" : [ ';
						for (var i=0; i <= results.rows.length-1; i++){
								var row = results.rows.item(i);
								var nombre = row.nombre;
								var cedula = row.cedula;
								var email = row.email;
								var telefono = row.telefono;
								var timespan = row.timespan;
								var direccion = row.direccion;
								jsonClientesLocal+=' { "timespan" : "'+timespan+'" , "nombre" : "'+nombre+'" , "cedula" : "'+cedula+'" , "email" : "'+email+'" , "telefono" : "'+telefono+'", "direccion" : "'+direccion+'"  },';
								}
								jsonClientesLocal= jsonClientesLocal.substring(0,jsonClientesLocal.length-1);
								jsonClientesLocal +=']}';
								$("#JSONclientesLocal").html(jsonClientesLocal);
								compararJsonLocalClientes(jsonClientesLocal);
								//$("#JSONclientesLocal").html();
					});
				},errorCB,successCB);
		}
		
		
		var arrayFaltanteClienteLocal= new Array();
		function compararJsonLocalClientes(json){
		 objLocal=$.parseJSON(json);
		 jsonNube=$("#JSONclientesNube").text();
		 objNube=$.parseJSON(jsonNube);
		 
		 for(j=0; j<= (objLocal.JsonClientes.length-1); j++){
			element=objLocal.JsonClientes[j];
			currentClientLocal=element.timespan;
			currentClientLocal.cedula;
			
			/*if(currentClientLocal.cedula == '9999999999999'){
				
				currentClientLocal=-1	;
			}*/

			var matchClient=false;
			var  matchClientCedula=false;
			for( k=0;k<=(objNube.Clientes.length -1); k++){
				currentClientNube = objNube.Clientes[k].timespan;

				if(currentClientLocal == currentClientNube){
					
					matchClient=true;
				}
			}
			
			if(matchClient==false){
				
				arrayFaltanteClienteLocal[arrayFaltanteClienteLocal.length] = currentClientLocal;
				console.log(arrayFaltanteClienteLocal);
				
			}
		 }
		 
		 agregarClientesFaltanteLocal();
		}
		var contFaltanteClienteLocal=-1;
		function agregarClientesFaltanteLocal(){
			contFaltanteClienteLocal++;
			if(contFaltanteClienteLocal > (arrayFaltanteClienteLocal.length-1) ){
			compararJsonNubeClientes();
			
			contFaltanteClienteLocal=-1;
			return;
			}
			if(arrayFaltanteClienteLocal.length!=-1){
				/*Json Detect Element of array*/
				var nombre='';var email=''; var telefono='';var cedula='';
				var currentClientPost=arrayFaltanteClienteLocal[contFaltanteClienteLocal];
				 objLocal=$.parseJSON($("#JSONclientesLocal").text());
				for(j=0; j<= (objLocal.JsonClientes.length-1); j++){
					element=objLocal.JsonClientes[j];
					currentClientLocal=element.timespan;
					if(currentClientLocal == currentClientPost ){
						nombre = element.nombre;
						email = element.email;
						cedula = element.cedula;
						telefono = element.telefono;
						direccion = element.direccion;
						
					}
				}
				
				
				
				
				$.post('https://www.practisis.net/nubeposboot/www/ajax/addNewClient.php', { 
					dbID : empresa ,
					nombre : nombre,
					timespan : currentClientLocal,
					email : email,
					telefono : telefono,
					cedula : cedula,
					direccion : direccion
					}).done(function(data){
					
					agregarClientesFaltanteLocal();
				});
			}
			
		}
		var arrayClientesFaltanteNube=new Array();
		function compararJsonNubeClientes(){
			 objLocal=$.parseJSON($("#JSONclientesLocal").text());
			 objNube=$.parseJSON($("#JSONclientesNube").text());
			 for(i=0; i<= (objNube.Clientes.length-1); i++ ) {
				match=false;
				//matchCedula=false;
				currentClientNube=  objNube.Clientes[i].timespan;
				currentClientNubeCedula=  objNube.Clientes[i].cedula;
				for(j=0; j<= (objLocal.JsonClientes.length-1); j++ ) {
					currentClientLocal=objLocal.JsonClientes[j].timespan;
					currentClientLocalCedula=objLocal.JsonClientes[j].cedula;
					if( currentClientNube == currentClientLocal ) {match=true; }
				//	if( currentClientLocalCedula == currentClientNubeCedula){matchCedula=true;}
					
				}
				
				if(!match){
				
					arrayClientesFaltanteNube[arrayClientesFaltanteNube.length]=i;
					console.log( currentClientNube + ">Falta Cliente nube" );
				}
				
			 }
			 agregarClientesFaltanteNube();
		}
		
	

		var contFaltanteClienteNube=-1;
		var rebelTimeSpan=0;
		var intervalProcesoRepetir;
		var contInterval=0;
		clearInterval(intervalProcesoRepetir);
		function limpiarSincronizaDatos(){
			$.post(apiURL, { idBarraSync : barra_arriba,  id_barra : id_barra , id_emp : empresa , KeyRequest : "limpiarSincronizaDatos"  }).done(function(data){
				console.log("Fin sincronizacion Limpio?");
			 	$("#main").html("<center>  <br> <label id='putimer'></label> <br> <img style='max-width:65%;' src='images/doneSync.png' onclick=\"envia('dashboard')\" style='cursor:pointer;' /> </center>");
			 	/*intervalProcesoRepetir=setInterval(function(){
			 			contInterval++;
			 			if( (30 - contInterval ) <= 0 ){
			 				contInterval=0;
			 				clearInterval(intervalProcesoRepetir);
			 				envia("cloud");
			 				return;
			 			}
			 			$("#putimer").html("Este proceso se repetirá en En " + ( 30 - contInterval ) + " Segundos");
			 	},1000);*/
			 		
				//envia("cloud");
			});
		}
		function agregarClientesFaltanteNube(){
			contFaltanteClienteNube++;
			if(contFaltanteClienteNube > (arrayClientesFaltanteNube.length-1) ){

				
				$("#theProgress").width("100%");
				sincronizaPresupuesto();
			
				
				//envia("cloud");
				return;
			}


			
			
			
			
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				currentIndex= arrayClientesFaltanteNube[contFaltanteClienteNube] ;
				objNube=$.parseJSON($("#JSONclientesNube").text());
				for(i=0; i<= (objNube.Clientes.length-1); i++ ) {
					match=false;
					currentClientNube=  objNube.Clientes[i].timespan;
					if(i==currentIndex){
					
					nombre = objNube.Clientes[i].nombre;
					cedula = objNube.Clientes[i].cedula;
					telefono = objNube.Clientes[i].telefono;
					direccion = objNube.Clientes[i].direccion;
					email = objNube.Clientes[i].email;
					if(currentClientNube != '') {
						timespan = currentClientNube; 
						console.log("con timespan>>" + nombre + "<<" + timespan);
						rebelTimeSpan=timespan;
						}else{
						 timespan = getTimeSpan();
						 rebelTimeSpan = timespan;
						 console.log("Sin timespan>>" + nombre + "<<" + timespan );
					}
					idCliente= objNube.Clientes[i].id;
					}
				}
					
				
								tx.executeSql('INSERT INTO CLIENTES (nombre,cedula,telefono,direccion,email,timespan,existe) VALUES(?,?,?,?,?,?,?) ',[nombre,cedula,telefono,direccion,email,rebelTimeSpan,0],function(tx,results){
								
												$.post('https://www.practisis.net/nubeposboot/www/ajax/updateClient.php', { 
													dbID : empresa ,
													nombre : nombre,
													timespan : rebelTimeSpan,
													idCliente : idCliente
													}).done(function(data){
													
														agregarClientesFaltanteNube();
													});
												
												
										});
									},errorCB,successCB);
									
			
			
		}
		
		/*Fin Sincronizacion Clientes STEP 3*/
		
		/*SINCRONIZAR TABLA PRESUPUESTOS*/
		var contPresupuesto=-1;
		var objPresupuesto;
		function sincronizaPresupuesto(){
			$("#txtSincro").html(" Finalizando Sincronizacion (Presupuestos) ");
				if(!objPresupuesto){
					$.post(apiURL, {KeyRequest : 'apiSincronizaNubeposPresupuesto' , empresa : empresa , barra_arriba : barra_arriba},{
							 empresa : empresa
						}).done(function(data){
							
							json=$.parseJSON(data);
							objPresupuesto=json;
							var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
							db.transaction(function(tx){
							tx.executeSql("DELETE FROM PRESUPUESTO",[],function(tx,results){
								sincronizaPresupuesto();													
							});
						   },errorCB,successCB);

							

					});	
				}else{

					contPresupuesto++;
					//console.log(data);
					console.log("Data Hey toca los presupuestos");
					//alert(contPresupuesto);
							
							if(objPresupuesto.Presupuesto[0].error){
								console.log("no presupuesto");
								
								if(yaConectado){
									contInterval=0;
									limpiarSincronizaDatos();
									//sincronizarFacturas();
								}else{
									sincronizarFalse();
									contInterval=0;
									limpiarSincronizaDatos();	
								}

							}else{

								if(contPresupuesto >= objPresupuesto.Presupuesto.length){
									//alert("Final de Presupuesto " + contPresupuesto);
									contPresupuesto=-1;
									objPresupuesto='';
									console.log(objPresupuesto);
									if(yaConectado){
											//syncLocal();
											
											console.log("Empezar con facturas");
											contInterval=0;
											limpiarSincronizaDatos();
											//sincronizarFacturas();

										}else{
											sincronizarFalse();
											contInterval=0;
											limpiarSincronizaDatos();	
										}
									return;
								}
							}

							var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
							db.transaction(function(tx){
								
								i=contPresupuesto;
								id=objPresupuesto.Presupuesto[i].id ;
								valor=objPresupuesto.Presupuesto[i].valor ;
								transacciones=objPresupuesto.Presupuesto[i].transacciones ;
								fecha=objPresupuesto.Presupuesto[i].fecha ;
								idlocal=objPresupuesto.Presupuesto[i].idlocal ;
								
										tx.executeSql('INSERT INTO PRESUPUESTO(timespan,valor,fecha,transacciones) VALUES("'+id+'",'+valor+','+fecha+','+transacciones+')',[],function(tx,results){
											console.log("Presupuesto Insertado=" + valor);
											sincronizaPresupuesto();
										});
							},errorCB,successCB);

				}/*End Else ObjPresupuesto*/
			
		}/*End function presupuesto*/


		function sincronizarFalse(){

			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				tx.executeSql(' UPDATE PRODUCTOS SET sincronizar="false" ',[],function(tx,results){});
				tx.executeSql(' UPDATE CATEGORIAS SET sincronizar="false" ',[],function(tx,results){});
				tx.executeSql(' UPDATE CLIENTES SET sincronizar="false" ',[],function(tx,results){});
			},errorCB,successCB);

		}

		var globalLocalCategory=0;
		var ContGlobalLocalCategory=0;


		var contLocalCategory=-1;
		var objLocalCategory;


		function syncLocal(){
			$("#theProgress").removeClass();
			$("#theProgress").attr("class" , "progress-bar progress-bar-success progress-bar-striped");
			$("#theProgress").css("width" ,  "0%");
					var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);

				if(!objLocalCategory){


					db.transaction(function(tx){
					tx.executeSql('SELECT * FROM CATEGORIAS WHERE sincronizar="true"',[],function(tx,results){
						
						if(!results.rows.length){
							$("#theProgress").css("width" , "0%");
							console.log("Sin cambios en categoria Local");
							objProductoLocal='';
							sincronizarProductosLocales();
							return;
						}else{
							//alert("exite cambios hacer proceso recurrente");
							console.log( ">>> Que devuelve syncLocal" + results);
							objLocalCategory=results;
							syncLocal();
						}

					},errorCB ,successCB);
					});

				}else{

					contLocalCategory++;
					
					if(contLocalCategory >= objLocalCategory.rows.length){
						/*Termina proceso de sync category*/
						//alert("Final Proceso recurrente pasar!" + contLocalCategory  + "<<<" + objLocalCategory.rows.length  );
						objProductoLocal='';
						sincronizarProductosLocales();


					}else{

						var row = objLocalCategory.rows.item(contLocalCategory);
						var idCat = row.id;
						var timeSpan = row.timespan;
						var categoria = row.categoria;
						var activo = row.activo;
						var existe = row.existe;
						


						json=' { "id" : "'+idCat+'" , "timeSpan" : "'+timeSpan+'" , "categoria" : "'+categoria+'" , "activo" : "'+activo+'"  }';
						//alert(json + "<<<<Envio" );
									$.post(apiURL,{ 
										 KeyRequest : "UpdateOrCreate" , 
										 type : "Category", 
										 empresa : empresa, 
										 id_barra : id_barra , 
										 barra_arriba : barra_arriba , 
										 idBarraSync : barra_arriba,
										 json : json }).done(function(data){
										 	//alert(data + "<<<<recibo" );

										 	if(data){

										 		db.transaction(function(tx){
										 			tx.executeSql('UPDATE CATEGORIAS SET timespan="'+data+'", sincronizar="false" WHERE timespan="'+timeSpan+'" ',[],function(tx,results){

										 				console.log("Change123123 >>" + timeSpan + "<<<" + data);
										 					

										 					console.log('UPDATE PRODUCTOS SET categoriaid="'+data+'" WHERE categoriaid="'+timeSpan+'" ');
										 			
										 			tx.executeSql('UPDATE PRODUCTOS SET categoriaid="'+data+'" WHERE categoriaid="'+timeSpan+'" ',[],function(tx,results){
										 				
										 						syncLocal();

										 				});

										 			
										 			});


										 		},errorCB ,successCB);
										 	}else{

										 			syncLocal();
										 	}
										 	
										});
						
					}
					


				}

				
						
					
		}
		var contGlobalLocalProduct=0;
		var lenGlobalLocalProduct=0;



		var contProductosLocal=-1;
		var objProductoLocal;

		function sincronizarProductosLocales(){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			
			if(!objProductoLocal){
			
				db.transaction(function(tx){
				tx.executeSql('SELECT * FROM PRODUCTOS WHERE sincronizar="true"',[],function(tx,results){
					objProductoLocal=results;
					sincronizarProductosLocales();
				 });
				},errorCB ,successCB);
			}else{
				contProductosLocal++;
				//alert("cont prod" + contProductosLocal);
				if(contProductosLocal >= objProductoLocal.rows.length ){
					$("#theProgress").css("width" , "75%");
					objClientesLocal='';
					sincronizarClientesLocales();
					return;
				}


				if(objProductoLocal.rows.length){
					
					var row = objProductoLocal.rows.item(contProductosLocal);
					formulado=row.formulado;
					timespan=row.timespan;
					codigo=row.codigo;
					precio=row.precio;
					cargaiva=row.cargaiva;
					categoriaid=row.categoriaid;
					productofinal=row.productofinal;
					materiaprima=row.materiaprima;
					servicio=row.servicio;
					estado=row.estado;
					
					if(timespan=='0'){
						timespan=getTimeSpan();
						console.log("New TimeSpan > " + timespan);
					}
					json='{  "id" : "'+row.id+'" , "formulado" : "'+formulado+'" , "timespan" : "'+timespan+'" , "codigo" : "'+codigo+'" , "precio" : "'+precio+'" , "cargaiva" : "'+cargaiva+'" , "categoriaid" : "'+categoriaid+'" , "productofinal" : "'+productofinal+'" , "materiaprima" : "'+materiaprima+'" , "servicio" : "'+servicio+'" , "activo" : "'+estado+'" }';
										//alert(json + "<< Send");
						db.transaction(function(tx){				
						tx.executeSql('UPDATE PRODUCTOS SET sincronizar="false" WHERE timespan='+timespan ,[],function(tx,results){
											$.post(apiURL,{ 
										 KeyRequest : "UpdateOrCreate" , 
										 type : "Productos", 
										 empresa : empresa, 
										 id_barra : id_barra , 
										 barra_arriba : barra_arriba , 
										 idBarraSync : barra_arriba,
										 json : json }).done(function(data){
										 	console.log(data);
										 	//contGlobalLocalProduct++;
										 	prc=( 50 / objProductoLocal.rows.length  ) * (contProductosLocal +1) ;
											$("#theProgress").css("width" , (50 + prc )+ "%");
											$("#txtSincro").html("<i style='color:green'> ("+contProductosLocal+" / "+ objProductoLocal.rows.length +" ) Sincronizando Productos Locales</i>");
											sincronizarProductosLocales();
										
										 });
									});}); /*End udpadte*/


						}else{

							/*Sin Productos nuevos Saltar a clientes*/
								$("#theProgress").css("width" , "75%");
								console.log("Sin productos nuevos");
								objClientesLocal='';
							sincronizarClientesLocales();
						}
			

					} /*End Evaluar si existe objeto*/
		}

		var lenGlobalLocalClient=0;
		var GlobalLocalClient=0;


		var objClientesLocal;
		var contClientesLocal=-1;

		function sincronizarClientesLocales(){
			$("#theProgress").css("width" , "100%");
			
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			if(!objClientesLocal){

				db.transaction(function(tx){
					tx.executeSql('SELECT * FROM CLIENTES WHERE sincronizar="true"',[],function(tx,results){
						objClientesLocal=results;
						sincronizarClientesLocales();
					},errorCB ,successCB);
				});

			}else{
			contClientesLocal++;
			if(contClientesLocal >= objClientesLocal.rows.length){
				//alert("End Clientes");
				console.log("Enviar Presupuestos Facturas y limpiar");
	 			objPresupuesto='';
	 			objFactura='';
	 			sincronizarFacturas();
				return;
			}
		//lenGlobalLocalClient=results.rows.length;
			$("#txtSincro").html("<i style='color:green'> (2/2) Sincronizando Datos Locales</i>");
			if(objClientesLocal.rows.length){

				var row = objClientesLocal.rows.item(contClientesLocal);
				formulado=row.formulado;
				timespan=row.timespan;
				cedula=row.cedula;
				nombre=row.nombre;
				alert("evaluar esteman>>" + nombre);
				json='{  "id" : "'+row.id+'" , "cedula" : "'+cedula+'" , "nombre" : "'+nombre+'"  , "email" : "'+row.email+'" , "direccion" : "'+row.direccion+'" , "telefono" : "'+row.telefono+'" }';

				db.transaction(function(tx2){
				tx2.executeSql('UPDATE CLIENTES SET sincronizar="false" WHERE cedula='+cedula ,[],function(tx2,results){
					$.post(apiURL,{ 
				 KeyRequest : "UpdateOrCreate" , 
				 type : "Clientes", 
				 empresa : empresa, 
				 id_barra : id_barra , 
				 barra_arriba : barra_arriba , 
				 idBarraSync : barra_arriba,
				 json : json }).done(function(data){
				 
				 	obj=$.parseJSON(data);
				 	idSync=obj.response;
				 	cedulaSync=obj.cedula;
				 	
				 	
				 	db.transaction(function(tx2){
				 	tx2.executeSql('UPDATE CLIENTES SET sincronizar="false", timespan="'+idSync+'" WHERE cedula='+cedula ,[],function(tx2,results){
				 			sincronizarClientesLocales();


				 		},errorCB ,successCB);
				 	});
				 });

				 },errorCB ,successCB);
				 	});






										 	/*

										 	GlobalLocalClient++;
										 	prc=( 50 / lenGlobalLocalClient ) * (GlobalLocalClient +1) ;
											$("#theProgress").css("width" , (75 + prc )+ "%");
											*/

											//if(contGlobalLocalProduct==lenGlobalLocalProduct){
											 		
										 	//	$("#theProgress").css("width" , "100%");
										 		
										 		/* Presupeustos facturas y limpiar datos*/
										 		//envia("cloud");
										 	
										 			//sincronizaPresupuesto();
										 		//sincronizarClientesLocales();
										 	//}

										

								
							}else{
									$("#theProgress").css("width" , "100%");
									/* Presupeustos,Facturas y limpiar datos*/
									console.log("Enviar Presupuestos Facturas y limpiar2");
									objFactura='';
									sincronizarFacturas();
									//sincronizaPresupuesto();
							}









			}
			
				

					



		}








		function agregarCategoriasFalatantesNube(){
			globalContCatFaltantesNube++;
			if(globalContCatFaltantesNube > (arrayCategoriasFaltantesNube.length-1) ){
			
			/*Go to section 2*/
			//alert("end of bucle");
			sincronizarFacturas();
			}else{
				
				txt= arrayCategoriasFaltantesNube[globalContCatFaltantesNube] ;
				exp=txt.split("|");
				categoria=exp[0];
				//alert(categoria);
				idReal=exp[1];
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
										tx.executeSql('INSERT INTO CATEGORIAS(categoria,existe,activo,timespan,sincronizar) VALUES("'+categoria+'",1,1,'+idReal+',"false")',[],function(tx,results){
										console.log("prod:"+results.insertId);
											agregarCategoriasFalatantesNube(); //sincronizaProductoNube();
											//  alert("InsertadoProdoucto>>" + formulado );
										});
									},errorCB,successCB);
									
				
			}
		
		}
		
		
		var globalCategoriasUpdate=-1;
		var currentIDCatLocal=-1;
		var currentIDCatNube=-1;
		function actualizarCategoriasID(){
			globalCategoriasUpdate++;
			if(globalCategoriasUpdate > (arrayFaltanteCategoryLocal.length-1) ){
				//alert("fin del bucle" + arrayFaltanteCategoryLocal.length );
				/*Sincronizar de nube a local*/
				validarJsonCategoriasNube();
				
				
			}else{
				currentUpdate=arrayFaltanteCategoryLocal[globalCategoriasUpdate];
				//alert("custom: " + currentUpdate + ">>" + arrayFaltanteCategoryLocal.length);
				exp=currentUpdate.split("|");
				currentIDCatLocal=exp[0];
				currentIDCatNube=exp[1];
				//alert("Cambiar timespan Abajo" + idLocal + " por id Arriba " + idNube);
				
				
					var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){
						tx.executeSql("UPDATE CATEGORIAS SET timespan=? WHERE id=?;",[currentIDCatNube,currentIDCatLocal],function(tx,results){
							/*tx.executeSql("UPDATE PRODUCTOS SET categoriaid=? WHERE categoriaid=?;",[currentIDCatLocal,currentIDCatNube],function(tx,results){
								
							});*/
							actualizarCategoriasID();
							
						});
						

						},errorCB ,successCB);
						
			}
				
		
		}
		
		///x.executeSql("UPDATE FACTURAS SET paymentsUsed=?,cash=?,cards=?,cheques=?,vauleCxC=? WHERE id=?;",[cadenapago,efectivo,tarjetas,cheques,cc,miid],function(tx,results){
	
		
		function muestraJSONLOCALCategorias (){

		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
			tx.executeSql('SELECT * FROM CATEGORIAS',[],function(tx,results){
					$("#JSONCategoriasLocal").html(' { "Categorias" :  [ ');
					txt='';
								for (var i=0; i <= results.rows.length-1; i++){
									var row = results.rows.item(i);
									var idCat = row.id;
									var timeSpan = row.timespan;
									var categoria = row.categoria;
									var activo = row.activo;
									var existe = row.existe;
									txt+='{  "id" : "'+idCat+'" ,  "categoria" : "'+categoria+'" ,  "activo" : "'+activo+'" ,  "existe" : "'+existe+'" ,  "timespan" : "'+timeSpan+'"  },';
									//$("#JSONCategoriasLocal").append(txt);
								}
								txt=txt.substring(0,txt.length-1);
								$("#JSONCategoriasLocal").append(txt+" ]}");
								validarJsonCategorias();
			},errorCB ,successCB);
		});
		
		}
		
		
		
		
		
		
//console.clear();
		
		
/*console.log('\
	\n \
	\n \
███╗   ██╗██╗   ██╗██████╗ ███████╗██████╗  ██████╗ ███████╗\n \
████╗  ██║██║   ██║██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔════╝\n \
██╔██╗ ██║██║   ██║██████╔╝█████╗  ██████╔╝██║   ██║███████╗\n \
██║╚██╗██║██║   ██║██╔══██╗██╔══╝  ██╔═══╝ ██║   ██║╚════██║\n \
██║ ╚████║╚██████╔╝██████╔╝███████╗██║     ╚██████╔╝███████║\n \
╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚══════╝\n \
                                                            \n \
	');

		
console.log('\
	\n \
	\n \
███████╗██╗   ██╗███╗   ██╗ ██████╗██████╗  ██████╗ ███╗   ██╗██╗███████╗ █████╗ ███╗   ██╗██████╗  ██████╗          \n \
██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝██╔══██╗██╔═══██╗████╗  ██║██║╚══███╔╝██╔══██╗████╗  ██║██╔══██╗██╔═══██╗         \n \
███████╗ ╚████╔╝ ██╔██╗ ██║██║     ██████╔╝██║   ██║██╔██╗ ██║██║  ███╔╝ ███████║██╔██╗ ██║██║  ██║██║   ██║         \n \
╚════██║  ╚██╔╝  ██║╚██╗██║██║     ██╔══██╗██║   ██║██║╚██╗██║██║ ███╔╝  ██╔══██║██║╚██╗██║██║  ██║██║   ██║         \n \
███████║   ██║   ██║ ╚████║╚██████╗██║  ██║╚██████╔╝██║ ╚████║██║███████╗██║  ██║██║ ╚████║██████╔╝╚██████╔╝██╗██╗██╗\n \
╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝ ╚═╝╚═╝╚═╝\n \
\n \
');*/                                                                                                      