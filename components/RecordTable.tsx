import React from 'react';
import { DefuncionRecord } from '../types';
import { SearchIcon, DownloadIcon, SparklesIcon, FileExcelIcon } from './Icons';
import * as XLSX from 'xlsx';

interface RecordTableProps {
  records: DefuncionRecord[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAnalyze: (record: DefuncionRecord) => void;
}

const RecordTable: React.FC<RecordTableProps> = ({ records, searchTerm, setSearchTerm, onAnalyze }) => {

  const exportToCSV = () => {
    const headers = ['Nombre', 'Apellidos', 'Fecha de Defunción', 'Cónyuge', 'Matrimonio', 'Nombre de Archivo'];
    const rows = records.map(r => [r.nombre, r.apellidos, r.fechaDefuncion, r.conyuge, r.matrimonio, r.fileName].map(field => `"${field || ''}"`));
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registros_defuncion.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToXLSX = () => {
    const headers = ['Nombre', 'Apellidos', 'Fecha de Defunción', 'Cónyuge', 'Matrimonio', 'Nombre de Archivo'];
    const data = records.map(r => ({
      'Nombre': r.nombre,
      'Apellidos': r.apellidos,
      'Fecha de Defunción': r.fechaDefuncion,
      'Cónyuge': r.conyuge,
      'Matrimonio': r.matrimonio,
      'Nombre de Archivo': r.fileName
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSX.writeFile(workbook, "registros_defuncion.xlsx");
  };


  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-auto flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="w-5 h-5 text-gray-500" />
          </span>
          <input
            type="text"
            placeholder="Buscar registros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700/80 border border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <button
            onClick={exportToXLSX}
            disabled={records.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-glow-blue"
            title="Exportar a Excel"
          >
            <FileExcelIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Exportar a Excel</span>
          </button>
          <button
            onClick={exportToCSV}
            disabled={records.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-glow-blue"
            title="Exportar a CSV"
          >
            <DownloadIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Exportar a CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {records.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre Completo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Defunción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cónyuge</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{record.nombre} {record.apellidos}</div>
                    <div className="text-xs text-gray-400">{record.fileName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{record.fechaDefuncion || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{record.conyuge || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                     <button
                        onClick={() => onAnalyze(record)}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:underline transition-all"
                        title="Análisis Complejo (Modo Pensamiento)"
                      >
                        <SparklesIcon className="w-4 h-4" />
                        Analizar
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No hay registros para mostrar.</p>
            <p className="text-gray-500 text-sm">Sube un documento para comenzar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordTable;