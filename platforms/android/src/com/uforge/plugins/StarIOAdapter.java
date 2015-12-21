package com.uforge.plugins;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.text.SimpleDateFormat;
import java.text.DecimalFormat;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;

import com.starmicronics.stario.StarIOPortException;
import com.starmicronics.stario.StarPrinterStatus;
import com.starmicronics.stario.PortInfo;
import com.starmicronics.stario.StarIOPort;

/**
 * @author Luca Del Bianco
 * This class handles the basic printing functions needed to print using the Star SDK
 */
public class StarIOAdapter extends CordovaPlugin {

    /* (non-Javadoc)
     * @see org.apache.cordova.CordovaPlugin#execute(java.lang.String, org.json.JSONArray, org.apache.cordova.CallbackContext)
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        final StarIOAdapter currentPluginInstance = this;
        final JSONArray Arguments = args;
        final CallbackContext currentCallbackContext = callbackContext;

        if (action.equals("check")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {

                        if(Arguments.length() < 1) {
                            throw new Exception("You must specify a portName search parameter");
                        }

                        currentPluginInstance.check(currentCallbackContext, Arguments.getString(0));
                    } catch (Exception e) {
                        currentCallbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        } else if (action.equals("rawprint")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        String portSettings = "";

                        if(Arguments.length() < 2) {
                            throw new Exception("You must specify a portName search parameter");
                        }

                        if(Arguments.length() == 3) {
                            portSettings = Arguments.getString(2);
                        }
                        currentPluginInstance.rawPrint(currentCallbackContext, Arguments.getString(0), Arguments.getString(1), portSettings);
                    } catch (Exception e) {
                        currentCallbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }
        return false;
    }

    /**
     * This method check the status of the first paired device (we assume it's a printer) and returns "OK" to the phonegap plugin if it's online
     * @param callbackContext the callback context of the action
     */
    private void check(CallbackContext callbackContext, String portNameSearch) {
        String portName = "";
        String portSettings = "";
        Context context = this.cordova.getActivity().getApplicationContext();

        portName = PrinterFunctions.getFirstPrinter(portNameSearch);

        try {
            StarPrinterStatus status = PrinterFunctions.GetStatus(context, portName, portSettings, true);
            if (status == null) {
                callbackContext.error("Cannot get the printer status.");
            } else if (status.offline) {
                callbackContext.error("The printer is offline.");
            } else {
                callbackContext.success();
            }
        } catch (StarIOPortException e) {
            callbackContext.error(e.getMessage());
        }
    }

    /**
     * This method sends a print command to the printer using the first available paired device (we assume it is a printer)
     * @param callbackContext the callback context of the action
     * @param message the string containing all the content to print
     * @param portSettings the port settings for the connection to the printer ("mini" if you are printing on star portable printers)
     */
    private void rawPrint(CallbackContext callbackContext, String message, String portNameSearch, String portSettings) {
        String portName = "";
        Context context = this.cordova.getActivity().getApplicationContext();
        //byte[] data;
        ArrayList<byte[]> list = new ArrayList<byte[]>();
        //Byte[] tempList;
		

        portName = PrinterFunctions.getFirstPrinter(portNameSearch);

       // data = message.getBytes();
        //tempList = new Byte[data.length];
		
		/*sacadatos del json*/
		String cedulaCliente="";
		String nombreCliente="";
		String nombreEmpresa="";
		String direccionEmpresa="";
		JSONArray expprod=new JSONArray();
		String subconiva="0.00";
		String subsiniva="0.00";
		String totalfact="0.00";
		String subtotal="0.00";
		String iva="0.00";
		String nofact="";
		SimpleDateFormat hoyformat=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		String hoy= hoyformat.format(new Date());
		String tipo="";
		String fechaCierre="";
		String fechaImpresion="";
		String numeroFacturas="";
		String anuladas="";
		String subtotalCierre="";
		String totalCierre="";
		String ivaCierre="";
		JSONArray expformas=new JSONArray();
		
		try{
			JSONObject jsonobject = new JSONObject(message);
			JSONArray nombres=jsonobject.names();
			if(nombres.toString().contains("Pagar")){
			JSONArray jsonArray = jsonobject.getJSONArray("Pagar");
			JSONObject expjson=jsonArray.getJSONObject(0);
			JSONObject objcliente=expjson.getJSONObject("cliente");
			JSONObject objfactura=expjson.getJSONObject("factura");
			JSONObject objempresa=expjson.getJSONObject("empresa");
			expprod=expjson.getJSONArray("producto");
			//expprod=objproducto.getJSONArray("0");
			
			cedulaCliente=objcliente.getString("cedula");
			nombreCliente=objcliente.getString("nombre");
			subconiva=DoubleFormat(objfactura.getDouble("subtotal_iva"));
			iva=DoubleFormat(objfactura.getDouble("subtotal_iva")*0.12);
			subsiniva=DoubleFormat(objfactura.getDouble("subtotal_sin_iva"));
			subtotal=DoubleFormat(objfactura.getDouble("subtotal_sin_iva")+objfactura.getDouble("subtotal_iva"));
			totalfact=DoubleFormat(objfactura.getDouble("total"));
			nofact=objfactura.getString("numerofact");
			nombreEmpresa=objempresa.getString("nombre");
			direccionEmpresa=objempresa.getString("direccion");
			tipo="pagar";
			}else if(nombres.toString().contains("Cierre")){
				tipo="cierre";
				JSONArray jsonArrayc = jsonobject.getJSONArray("Cierre");
				JSONObject expjson=jsonArrayc.getJSONObject(0);
				fechaCierre=expjson.getString("fecha_caja");
				fechaImpresion=expjson.getString("fecha_imp");
				numeroFacturas=expjson.getString("num_facts");
				anuladas=expjson.getString("fact_anuladas");
				numeroFacturas=expjson.getString("num_facts");
				subtotalCierre=expjson.getString("subtotal");
				ivaCierre=expjson.getString("iva");
				totalCierre=expjson.getString("total");
				expformas=expjson.getJSONArray("formaspago");
				//{"Cierre": [{"fecha_caja":"2015-12-17","fecha_imp":"2015-12-17","num_facts":"1","fact_anuladas":"0","subtotal":"3.13","iva":"0.38","total":"3.50","formaspago":[{"Efectivo":"3.50","Tarjetas":"0.00","Cheques":"0.00","CxC":"0.00"}]}]}
			}
			
		}catch(JSONException ex){

			ex.printStackTrace();
		}
		
		/*
		JSONObject expjson=jsonArray.getJSONObject(0);
		JSONObject objcliente=expjson.getJSONObject("cliente");*/
		/**/
	
				list.add(new byte[] { 0x1b, 0x1d, 0x74, 0x20 }); // Code Page #1252 (Windows Latin-1)

				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)

				// list.add("[If loaded.. Logo1 goes here]\r\n".getBytes());

				// list.add(new byte[]{0x1b, 0x1c, 0x70, 0x01, 0x00, '\r', '\n'}); //Stored Logo Printing

				// Notice that we use a unicode representation because that is
				// how Java expresses these bytes as double byte unicode

				// Character expansion
				list.add(new byte[] { 0x06, 0x09, 0x1b, 0x69, 0x01, 0x01 });
				
			if(tipo.equals("pagar")){
					
				list.add(createCp1252(nombreEmpresa+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(createCp1252(direccionEmpresa+"\r\n"));
				//list.add(createCp1252("08029 BARCELONA\r\n\r\n"));
				
				list.add(createCp1252(nombreCliente+"-"+cedulaCliente+"\r\n"));

				//list.add(createCp1252("TEL :934199465\r\n"));
				
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment

				list.add(new byte[] { 0x1b, 0x44, 0x02, 0x10, 0x22, 0x00 }); // Set horizontal tab

				list.add(createCp1252("--------------------------------\r\n"));
				
				//list.add(createCp1252("MESA: 100 P: - FECHA: YYYY-MM-DD\r\n"));
				
					list.add(createCp1252("NO:"+nofact+"\r\n"));
					list.add(createCp1252("FECHA:"+hoy+"\r\n"));
					list.add(createCp1252("CAN P/U DESCRIPCION  SUMA\r\n"));
				

				list.add(createCp1252("--------------------------------\r\n"));
				
				
				if(expprod.length()>0){
					for(int i=0;i<expprod.length();i++){
						try{
						JSONObject linea=expprod.getJSONObject(i);
						String cantidad=linea.getString("cant_prod");
						if(cantidad.length()<3){
							int tam=3-cantidad.length();
							for(int n=0;n<tam;n++){
								cantidad=" "+cantidad;
							}
						}
						
						String totc=DoubleFormat(linea.getDouble("precio_orig")*linea.getInt("cant_prod"));
						//String totc=String.valueOf(total);
						if(totc.length()<6){
							int tam=6-totc.length();
							for(int n=0;n<tam;n++){
								totc=" "+totc;
							}
						}
						
						String desc=linea.getString("nombre_producto");
						if(desc.length()>22)
							desc=desc.substring(0,21);
						else if(desc.length()<22){
							int tam=21-desc.length();
							for(int n=0;n<tam;n++){
								desc=desc+" ";
							}
						}
												
						
						list.add(createCp1252(String.valueOf(cantidad)+" "+String.valueOf(desc)+" "+String.valueOf(totc)+"\r\n"));
						//list.add(createCp1252(" 4  3,00  JARRA  CERVESA   12,00\r\n"));
						//list.add(createCp1252(" 1  1,60  COPA DE CERVESA   1,60\r\n"));
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				
				list.add(createCp1252("--------------------------------\r\n"));
				
						if(subconiva.length()<6){
							int tam=6-subconiva.length();
							for(int n=0;n<tam;n++){
								subconiva=" "+subconiva;
							}
						}
				
						if(subsiniva.length()<6){
							int tam=6-subsiniva.length();
							for(int n=0;n<tam;n++){
								subsiniva=" "+subsiniva;
							}
						}
						
						if(subtotal.length()<6){
							int tam=6-subtotal.length();
							for(int n=0;n<tam;n++){
								subtotal=" "+subtotal;
							}
						}
						
						if(iva.length()<6){
							int tam=6-iva.length();
							for(int n=0;n<tam;n++){
								iva=" "+iva;
							}
						}

				list.add(createCp1252("                 SUBTOTAL:"+String.valueOf(subconiva)+"\r\n"));
				list.add(createCp1252("                SUBCONIVA:"+String.valueOf(subconiva)+"\r\n"));
				list.add(createCp1252("                SUBSINIVA:"+String.valueOf(subsiniva)+"\r\n"));
				list.add(createCp1252("                      IVA:"+String.valueOf(iva)+"\r\n"));
				
				list.add(new byte[] { 0x09, 0x1b, 0x69, 0x01, 0x00 });
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x02 });
				list.add(createCp1252("TOTAL:  "+String.valueOf(totalfact)+" US\r\n"));	
			}else if(tipo.equals("cierre")){
				
				if(subtotalCierre.length()<9){
					int tam=9-subtotalCierre.length();
						for(int n=0;n<tam;n++){
							subtotalCierre=" "+subtotalCierre;
						}
				}
						
				if(ivaCierre.length()<9){
					int tam=9-ivaCierre.length();
						for(int n=0;n<tam;n++){
								ivaCierre=" "+ivaCierre;
						}
				}
				
				if(totalCierre.length()<9){
					int tam=9-totalCierre.length();
						for(int n=0;n<tam;n++){
								totalCierre=" "+totalCierre;
						}
				}
						
				list.add(createCp1252("CIERRE DE CAJA\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				list.add(createCp1252("--------------------------------\r\n"));
				list.add(createCp1252("FECHA IMPRESION:"+fechaImpresion+"\r\n"));
				list.add(createCp1252("   FECHA CIERRE:"+fechaCierre+"\r\n"));
				list.add(createCp1252("--------------------------------\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				list.add(createCp1252("--------------------------------\r\n"));
				list.add(createCp1252("FACTURAS\r\n"));
				if(numeroFacturas.length()<9){
								int tam=9-numeroFacturas.length();
									for(int n=0;n<tam;n++){
											numeroFacturas=" "+numeroFacturas;
									}
							}
				
				if(anuladas.length()<9){
					int tam=9-anuladas.length();
					for(int n=0;n<tam;n++){
							anuladas=" "+anuladas;
						}
				}
				
				list.add(createCp1252("No. Facturas    "+numeroFacturas+"\r\n"));
				list.add(createCp1252("No. Anuladas    "+anuladas+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(createCp1252("--------------------------------\r\n"));
				list.add(createCp1252("TOTALES\r\n"));
				list.add(createCp1252("Subtotal        "+subtotalCierre+"\r\n"));
				list.add(createCp1252("Iva             "+ivaCierre+"\r\n"));
				list.add(createCp1252("TOTAL           "+totalCierre+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(createCp1252("--------------------------------\r\n"));
				list.add(createCp1252("FORMAS DE PAGO\r\n"));
				if(expformas.length()>0){
						try{
						JSONObject linea=expformas.getJSONObject(0);
						//String [] names=JSONObject.getNames(linea);
						Iterator key = linea.keys();
						while (key.hasNext()) {
							String nombre = key.next().toString();
							String valor=linea.getString(nombre);
							
							if(valor.length()<9){
								int tam=9-valor.length();
									for(int n=0;n<tam;n++){
											valor=" "+valor;
									}
							}
							
							if(nombre.length()<15){
								int tam=15-nombre.length();
									for(int n=0;n<tam;n++){
											nombre=nombre+" ";
									}
							}
							
							list.add(createCp1252(String.valueOf(nombre)+" "+String.valueOf(valor)+"\r\n"));
						}
						/*for(int m=0;m<names.length();m++)
						{
							String nombre=names[m];
							String valor=linea.getString(names[m]);
							list.add(createCp1252(String.valueOf(nombre)+":"+String.valueOf(valor)+"\r\n"));
						}	*/					
						}catch(JSONException ex){
								ex.printStackTrace();
						}
				}
			}
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });
				list.add(new byte[] { 0x09, 0x1b, 0x69, 0x00, 0x00 });

				//list.add(createCp1252("NO: 000018851     IVA IXNCLUIDO\r\n"));
				list.add(createCp1252("--------------------------------\r\n"));

				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });
				list.add(createCp1252("**** NUBE POS 2.0 ****\r\n"));
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });

				// 1D barcode example
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });
				list.add(new byte[] { 0x1b, 0x62, 0x06, 0x02, 0x02 });

				list.add(createCp1252(" 12ab34cd56\u001e\r\n"));

				list.add(new byte[] { 0x1b, 0x64, 0x02 }); // Cut
				list.add(new byte[] { 0x07 }); // Kick cash drawer				
        try {
            PrinterFunctions.SendCommand(context, portName, portSettings, list);
            callbackContext.success();
        } catch (StarIOPortException e) {
            callbackContext.error(e.getMessage());
        }
    }
	
	private static byte[] createCp1252(String inputText) {
		byte[] byteBuffer = null;
		
		try {
			byteBuffer = inputText.getBytes("Windows-1252");
		} catch (UnsupportedEncodingException e) {
			byteBuffer = inputText.getBytes();
		}
		
		return byteBuffer;
	}
	
	private static byte[] createCpUTF8(String inputText) {
		byte[] byteBuffer = null;
		
		try {
			byteBuffer = inputText.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			byteBuffer = inputText.getBytes();
		}
		
		return byteBuffer;
	}
	
	public static String DoubleFormat(double parDouble)
	{
		DecimalFormat formatter = new DecimalFormat("###,##0.00"); 
		String myNumero = formatter.format(parDouble);
		return myNumero;
	}
}