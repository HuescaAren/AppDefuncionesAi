
import React, { useState, useMemo } from 'react';
import { DefuncionRecord } from './types';
import FileUpload from './components/FileUpload';
import RecordTable from './components/RecordTable';
import DashboardStats from './components/DashboardStats';
import { extractDataFromImage, performComplexAnalysis } from './services/geminiService';
import Loader from './components/Loader';
import Modal from './components/Modal';
import { LogoIcon } from './components/Icons';

function App() {
  const [records, setRecords] = useState<DefuncionRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const extractedDataArray = await extractDataFromImage(base64String, file.type);
        
        if (extractedDataArray && extractedDataArray.length > 0) {
          const newRecords: DefuncionRecord[] = extractedDataArray.map((data, index) => ({
            id: `${Date.now()}-${index}`,
            fileName: file.name,
            ...data,
          }));
          setRecords(prevRecords => [...newRecords, ...prevRecords]);
        } else {
            throw new Error("No se pudieron extraer datos. El formato puede no ser compatible o el documento no contiene registros claros.");
        }
      };
      reader.onerror = () => {
        throw new Error("Error al leer el archivo.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplexAnalysis = async (record: DefuncionRecord) => {
    setIsAnalyzing(true);
    setModalContent({ title: 'Realizando Análisis Complejo...', body: 'Por favor, espere mientras la IA procesa el registro con el modo de pensamiento. Esto puede tomar un momento.' });
    setIsModalOpen(true);
    
    const context = `Analiza el siguiente registro de defunción: Nombre: ${record.nombre} ${record.apellidos}, Fecha de Defunción: ${record.fechaDefuncion}, Cónyuge: ${record.conyuge}. Proporciona un resumen detallado y cualquier inferencia posible sobre el contexto social o histórico.`;
    const analysisResult = await performComplexAnalysis(context);

    setModalContent({ title: `Análisis para: ${record.nombre} ${record.apellidos}`, body: analysisResult });
    setIsAnalyzing(false);
  };

  const filteredRecords = useMemo(() => {
    if (!searchTerm) return records;
    return records.filter(record =>
      Object.values(record).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [records, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-10 w-10 text-cyan-400" />
            <h1 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              AppDefunciónAI
            </h1>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Columna Izquierda */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
              <DashboardStats recordCount={records.length} />
              {error && <div className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{error}</div>}
            </div>
            
            {/* Columna Derecha */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg h-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Registros Extraídos</h2>
                {isLoading && records.length === 0 && <Loader message="Analizando documento con IA..." />}
                <RecordTable 
                  records={filteredRecords} 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm}
                  onAnalyze={handleComplexAnalysis}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalContent.title}
      >
        {isAnalyzing ? <Loader message="Pensando..." /> : <p className="text-gray-300 whitespace-pre-wrap">{modalContent.body}</p>}
      </Modal>
    </div>
  );
}

export default App;
