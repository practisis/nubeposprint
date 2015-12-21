package com.uforge.plugins;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;

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
		/*JSONObject jsonobject = new JSONObject(message);
		JSONArray jsonArray = jsonobject.getJSONArray("Pagar");
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

				list.add(createCp1252("NUBE POS\r\n"));
				
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				
				list.add(createCp1252("Calle NUBEPOS 589\r\n"));
				
				list.add(createCp1252("08029 BARCELONA\r\n\r\n"));
				
				//list.add(createCp1252(objcliente.getString("cedula")+"\r\n"));

				//list.add(createCp1252("TEL :934199465\r\n"));
				
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment

				list.add(new byte[] { 0x1b, 0x44, 0x02, 0x10, 0x22, 0x00 }); // Set horizontal tab

				list.add(createCp1252("--------------------------------\r\n"));
				
				list.add(createCp1252("MESA: 100 P: - FECHA: YYYY-MM-DD\r\n"));
				list.add(createCp1252("CAN P/U DESCRIPCION  SUMA\r\n"));

				list.add(createCp1252("--------------------------------\r\n"));

				list.add(createCp1252(" 4  3,00  JARRA  CERVESA   12,00\r\n"));
				list.add(createCp1252(" 1  1,60  COPA DE CERVESA   1,60\r\n"));
				
				list.add(createCp1252("--------------------------------\r\n"));

				list.add(createCp1252("               SUB TOTAL : 13,60\r\n"));
				
				list.add(new byte[] { 0x09, 0x1b, 0x69, 0x01, 0x00 });
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x02 });
				list.add(createCp1252("TOTAL:     13,60 EUROS\r\n"));
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });
				list.add(new byte[] { 0x09, 0x1b, 0x69, 0x00, 0x00 });

				list.add(createCp1252("NO: 000018851     IVA INCLUIDO\r\n"));
				list.add(createCp1252("--------------------------------\r\n"));

				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });
				list.add(createCp1252("**** GRACIAS POR SU VISITA! ****\r\n"));
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
}