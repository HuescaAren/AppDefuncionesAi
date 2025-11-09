
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recordSchema: any = {
  type: Type.OBJECT,
  properties: {
    nombre: {
      type: Type.STRING,
      description: 'El primer nombre de la persona fallecida.',
    },
    apellidos: {
      type: Type.STRING,
      description: 'Los apellidos de la persona fallecida.',
    },
    fechaDefuncion: {
      type: Type.STRING,
      description: 'Fecha de defunción en formato YYYY-MM-DD. Si no se encuentra, dejar vacío.',
    },
    conyuge: {
      type: Type.STRING,
      description: 'Nombre completo del cónyuge o pareja. Si no se menciona, dejar vacío.',
    },
    matrimonio: {
      type: Type.STRING,
      description: 'Información sobre el matrimonio (fecha, lugar). Si no se menciona, dejar vacío.',
    },
  },
  required: ['nombre', 'apellidos'],
};

const schema = {
    type: Type.ARRAY,
    items: recordSchema,
};


export const extractDataFromImage = async (base64Image: string, mimeType: string): Promise<ExtractedData[] | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { 
                        text: "Analiza la siguiente imagen de un documento (certificado de defunción, registro parroquial, etc.) y extrae la información de TODOS los registros de defunción que encuentres. Los registros suelen estar separados por numeración o firmas. Devuelve un array de objetos JSON, uno por cada registro, según el esquema proporcionado. Si no encuentras registros, devuelve un array vacío."
                    },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Image,
                        },
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);

        return data as ExtractedData[];

    } catch (error) {
        console.error("Error extracting data from image:", error);
        return null;
    }
};

export const performComplexAnalysis = async (context: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: context,
            config: {
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error performing complex analysis:", error);
        return "No se pudo completar el análisis complejo.";
    }
};
